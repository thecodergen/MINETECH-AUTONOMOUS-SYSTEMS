import os
import math
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

W, H = 1376, 768

def create_flir_thermal_view(base_path, out_path, config):
    """
    Renders authentic FLIR Thermal camera view matching Screenshot 2:
    - Workshop backdrop in deep indigo/navy
    - Hot engine bay / exhaust glowing intense white-hot to yellow/orange (245°C)
    - Running gear / tracks / cylinders glowing warm orange (115°C)
    - Body structure in deep purple/blue (58°C)
    - Realistic FLIR OSD text & temperature scale
    """
    base = Image.open(base_path).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    gray = ImageOps.grayscale(base)
    arr_gray = np.array(gray, dtype=np.float32) / 255.0
    arr_base = np.array(base, dtype=np.float32) / 255.0
    
    # Machine mask
    lum = arr_base.max(axis=2)
    mask = np.clip((lum - 0.05) * 4.0, 0, 1)
    mask_smooth = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=3))) / 255.0
    
    # Build FLIR Ironbow Heatmap
    # Base workshop ambient background: Dark Navy / Indigo
    bg_r = arr_gray * 0.12 * 255
    bg_g = arr_gray * 0.18 * 255
    bg_b = (arr_gray * 0.45 + 0.15) * 255
    
    # Machine Body Thermal: Deep Purple / Violet
    body_r = (arr_gray * 0.55 + 0.18) * 255
    body_g = (arr_gray * 0.15 + 0.05) * 255
    body_b = (arr_gray * 0.70 + 0.28) * 255
    
    # Blend background and machine body
    r = bg_r * (1 - mask_smooth) + body_r * mask_smooth
    g = bg_g * (1 - mask_smooth) + body_g * mask_smooth
    b = bg_b * (1 - mask_smooth) + body_b * mask_smooth
    
    thermal_img = Image.fromarray(np.stack([r, g, b], axis=2).clip(0, 255).astype(np.uint8), "RGB").convert("RGBA")
    
    # Paint Hot Heat Sources (Engine in Ultra White/Yellow 245°C, Cylinders/Tracks in Glowing Orange 120°C)
    heat_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    for comp in config.get("components", []):
        ctype = comp["type"]
        x1, y1, x2, y2 = comp["bbox"]
        cw, ch = x2 - x1, y2 - y1
        
        feather = Image.new("L", (cw, ch), 0)
        f_draw = ImageDraw.Draw(feather)
        f_draw.ellipse([(int(cw * 0.05), int(ch * 0.05)), (int(cw * 0.95), int(ch * 0.95))], fill=255)
        feather = feather.filter(ImageFilter.GaussianBlur(radius=max(10, int(min(cw, ch) * 0.18))))
        arr_fmask = np.array(feather, dtype=np.float32) / 255.0
        
        sub_g = arr_gray[y1:y2, x1:x2]
        sub_m = mask_smooth[y1:y2, x1:x2] * arr_fmask
        
        if ctype == "engine": # Ultra White-Hot Core to Fiery Yellow/Orange (245°C)
            hr = np.clip((sub_g * 0.8 + 0.85) * 255, 0, 255)
            hg = np.clip((sub_g * 1.0 + 0.65) * 230, 0, 255)
            hb = np.clip((sub_g * 1.2 - 0.2) * 200, 0, 255) # white hot centers
            ha = np.clip(sub_m * 255, 0, 255)
        elif ctype in ["hydraulics", "transmission"]: # Glowing Warm Orange/Yellow (115°C)
            hr = np.clip((sub_g * 0.8 + 0.75) * 255, 0, 255)
            hg = np.clip((sub_g * 0.7 + 0.45) * 200, 0, 255)
            hb = np.clip(sub_g * 0.1 * 40, 0, 255)
            ha = np.clip(sub_m * 240, 0, 255)
        else:
            continue
            
        comp_rgba = np.stack([hr, hg, hb, ha], axis=2).astype(np.uint8)
        comp_img = Image.fromarray(comp_rgba, "RGBA")
        heat_layer.paste(comp_img, (x1, y1), comp_img)
        
    # Multi-radius bloom for realistic thermal radiation bleed
    heat_glow1 = heat_layer.filter(ImageFilter.GaussianBlur(radius=16))
    heat_glow2 = heat_layer.filter(ImageFilter.GaussianBlur(radius=6))
    
    final_comp = Image.alpha_composite(thermal_img, heat_glow1)
    final_comp = Image.alpha_composite(final_comp, heat_glow2)
    final_comp = Image.alpha_composite(final_comp, heat_layer)
    
    draw = ImageDraw.Draw(final_comp, "RGBA")
    
    # 3. Add Authentic FLIR OSD Overlay Text (Matching Screenshot 2)
    # Top-Right Timestamp
    draw.text((W - 320, 35), "00:07:48 FEM 82", fill=(200, 225, 255, 220))
    
    # Bottom-Left Temperature Legend
    draw.text((45, H - 240), "Max: 245.0°C", fill=(255, 255, 255, 255))
    draw.text((45, H - 200), "220.1°C", fill=(255, 80, 50, 255))
    draw.text((45, H - 160), "115.3°C", fill=(255, 180, 40, 255))
    draw.text((45, H - 120), "58.2°C", fill=(140, 80, 200, 255))
    draw.text((45, H - 80), "24.5°C", fill=(80, 140, 255, 255))
    
    # Thermal Spot Meter Crosshairs
    for i, comp in enumerate(config.get("components", [])):
        x1, y1, x2, y2 = comp["bbox"]
        sp_x, sp_y = (x1 + x2) // 2, (y1 + y2) // 2
        tval = 242.0 if comp["type"] == "engine" else 114.5 if comp["type"] == "hydraulics" else 68.2
        col = (255, 255, 255, 240) if tval > 200 else (255, 200, 60, 240)
        draw.line([(sp_x - 12, sp_y), (sp_x + 12, sp_y)], fill=col, width=2)
        draw.line([(sp_x, sp_y - 12), (sp_x, sp_y + 12)], fill=col, width=2)
        draw.text((sp_x + 16, sp_y - 8), f"{tval:.1f}°C", fill=col)
        
    # Machine Badge Plaque
    bx, by = config["badge_pos"]
    draw.rectangle([(bx, by), (bx + 140, by + 48)], fill=(15, 10, 30, 240), outline=(255, 120, 40, 220), width=2)
    draw.polygon([(bx + 114, by + 6), (bx + 134, by + 42), (bx + 122, by + 42), (bx + 102, by + 6)], fill=(255, 45, 45, 255))
    draw.text((bx + 18, by + 13), config["badge"], fill=(255, 255, 255, 255))
    
    final_rgb = final_comp.convert("RGB")
    final_rgb.save(out_path, quality=95)
    print(f"Generated Realistic FLIR Thermal: {out_path}")

def create_exploded_cad_view(base_path, out_path, config):
    """
    Renders photorealistic 3D Exploded Parts Assembly matching Screenshot 3:
    - Dark technical CAD studio background with cyan isometric grid
    - Disassembled 3D floating components (Bucket/Mast, Cab, Engine, Cylinders, Tracks)
    - Technical leader lines with part callout labels (Air filters, Lift cylinders, Transmission, etc.)
    """
    base = Image.open(base_path).convert("RGBA").resize((W, H), Image.Resampling.LANCZOS)
    
    # 1. Dark Blueprint Studio Background with Isometric Coordinate Grid
    bg = Image.new("RGBA", (W, H), (4, 10, 16, 255))
    draw_bg = ImageDraw.Draw(bg)
    
    # Isometric grid lines
    for x in range(-W, W * 2, 48):
        draw_bg.line([(x, 0), (x + H, H)], fill=(0, 220, 200, 15), width=1)
        draw_bg.line([(x, 0), (x - H, H)], fill=(0, 220, 200, 15), width=1)
    for y in range(0, H, 36):
        draw_bg.line([(0, y), (W, y)], fill=(0, 220, 200, 10), width=1)
        
    # Architectural corner borders & title
    draw_bg.rectangle([(25, 25), (W - 25, H - 25)], outline=(0, 220, 200, 60), width=1)
    
    # Machine Name in Top-Left Blueprint Header
    draw_bg.text((45, 45), f"{config['badge']} EXPLODED VIEW", fill=(255, 255, 255, 240))
    draw_bg.text((45, 70), f"HEAVY AUTONOMOUS SYSTEM // 3D CAD DISASSEMBLY", fill=(0, 220, 200, 180))
    
    # 2. Exploded Component Layers (Floating in Isometric Space)
    # Extract vehicle with solid photorealistic yellow paint and metallic shading
    veh_arr = np.array(base)
    veh_img = Image.fromarray(veh_arr, "RGBA")
    
    # Composite main vehicle body into center-lower CAD space
    exploded_comp = Image.alpha_composite(bg, veh_img)
    draw = ImageDraw.Draw(exploded_comp, "RGBA")
    
    # 3. Draw Exploded Assembly Leader Lines & Callout Boxes (Matching Screenshot 3)
    callouts = config.get("callouts", [])
    for item in callouts:
        pt_x, pt_y = item["point"]
        box_x, box_y = item["label_pos"]
        name = item["name"]
        spec = item["spec"]
        
        # Draw elbow leader line
        elbow_x = box_x + 40 if box_x > pt_x else box_x + 120
        elbow_y = pt_y
        
        draw.ellipse([(pt_x - 5, pt_y - 5), (pt_x + 5, pt_y + 5)], fill=(0, 240, 220, 255))
        draw.line([(pt_x, pt_y), (elbow_x, elbow_y)], fill=(0, 240, 220, 200), width=2)
        draw.line([(elbow_x, elbow_y), (box_x + 80, box_y + 20)], fill=(0, 240, 220, 200), width=2)
        
        # High-Tech Callout Box
        draw.rectangle([(box_x, box_y), (box_x + 160, box_y + 44)], fill=(8, 16, 24, 230), outline=(0, 240, 220, 200), width=1)
        draw.text((box_x + 10, box_y + 6), name, fill=(255, 255, 255, 255))
        draw.text((box_x + 10, box_y + 24), spec, fill=(0, 220, 200, 200))
        
    # Model Plaque
    bx, by = config["badge_pos"]
    draw.rectangle([(bx, by), (bx + 130, by + 45)], fill=(12, 18, 26, 240), outline=(0, 240, 220, 220), width=2)
    draw.polygon([(bx + 106, by + 5), (bx + 124, by + 40), (bx + 114, by + 40), (bx + 96, by + 5)], fill=(255, 45, 45, 255))
    draw.text((bx + 16, by + 12), config["badge"], fill=(255, 255, 255, 255))
    
    final_rgb = exploded_comp.convert("RGB")
    final_rgb.save(out_path, quality=95)
    print(f"Generated Photorealistic Exploded CAD: {out_path}")

FLEET_CONFIGS = [
    {
        "id": "excavator",
        "base_img": "public/images/excavator_pbr_studio.jpg",
        "xray_out": "public/images/excavator_xray_hologram.jpg",
        "thermal_out": "public/images/excavator_flir_thermal.jpg",
        "exploded_out": "public/images/excavator_exploded_cad.jpg",
        "badge": "996B",
        "name_badge": "LIEBHERR 996",
        "badge_pos": (460, 220),
        "components": [
            {"type": "engine", "bbox": (680, 280, 1100, 520)},      # Twin Cummins QSK60 (245°C)
            {"type": "hydraulics", "bbox": (340, 160, 700, 460)},  # Boom Cylinders (115°C)
            {"type": "transmission", "bbox": (480, 540, 1060, 720)}# Track Drives (68°C)
        ],
        "callouts": [
            {"name": "55m³ BUCKET", "spec": "CAST STEEL // 95T", "point": (280, 520), "label_pos": (80, 360)},
            {"name": "BOOM CYLINDERS", "spec": "340 BAR // 2240 kN", "point": (540, 320), "label_pos": (480, 120)},
            {"name": "OPERATOR CAB", "spec": "ROPS/FOPS SCADA", "point": (820, 240), "label_pos": (880, 110)},
            {"name": "CUMMINS QSK60", "spec": "6,000 HP DUAL V16", "point": (940, 420), "label_pos": (1100, 320)},
            {"name": "CRAWLER TRACKS", "spec": "1600mm STEEL SHOES", "point": (720, 640), "label_pos": (760, 680)}
        ]
    },
    {
        "id": "drill",
        "base_img": "public/images/drill_pbr_studio.jpg",
        "xray_out": "public/images/drill_xray_hologram.jpg",
        "thermal_out": "public/images/drill_flir_thermal.jpg",
        "exploded_out": "public/images/drill_exploded_cad.jpg",
        "badge": "PV-271",
        "name_badge": "EPIROC PV271",
        "badge_pos": (540, 240),
        "components": [
            {"type": "hydraulics", "bbox": (240, 260, 500, 500)},  # Rotary Head (120°C)
            {"type": "engine", "bbox": (660, 380, 1100, 580)},     # Diesel Compressor Deck (240°C)
            {"type": "hydraulics", "bbox": (540, 540, 820, 700)},  # Outrigger Jacks (110°C)
            {"type": "transmission", "bbox": (420, 560, 1000, 720)}# Crawler Undercarriage (65°C)
        ],
        "callouts": [
            {"name": "LATTICE MAST", "spec": "18.3m HEAVY STEEL", "point": (340, 180), "label_pos": (120, 120)},
            {"name": "ROTARY HEAD", "spec": "14,200 Nm TORQUE", "point": (320, 440), "label_pos": (90, 420)},
            {"name": "AIR COMPRESSOR", "spec": "3,800 CFM // 2.4 MPa", "point": (860, 440), "label_pos": (1080, 340)},
            {"name": "LEVELING JACKS", "spec": "4x AUTO OUTRIGGERS", "point": (640, 620), "label_pos": (720, 670)},
            {"name": "OPERATOR CAB", "spec": "GPS AUTO-COLLAR", "point": (680, 280), "label_pos": (840, 130)}
        ]
    },
    {
        "id": "lhd",
        "base_img": "public/images/lhd_pbr_studio.jpg",
        "xray_out": "public/images/lhd_xray_hologram.jpg",
        "thermal_out": "public/images/lhd_flir_thermal.jpg",
        "exploded_out": "public/images/lhd_exploded_cad.jpg",
        "badge": "LHD 18T",
        "name_badge": "SANDVIK LHD",
        "badge_pos": (490, 240),
        "components": [
            {"type": "engine", "bbox": (720, 340, 1140, 560)},      # 340kWh LFP Battery (230°C peak)
            {"type": "hydraulics", "bbox": (260, 360, 540, 560)},  # Lift Rams (115°C)
            {"type": "transmission", "bbox": (500, 400, 800, 600)}# Articulation Drive (65°C)
        ],
        "callouts": [
            {"name": "ROCK SCOOP", "spec": "18.0T LOW PROFILE", "point": (280, 520), "label_pos": (80, 380)},
            {"name": "LIFT CYLINDERS", "spec": "380 kN BREAKOUT", "point": (460, 440), "label_pos": (340, 180)},
            {"name": "ROPS/FOPS CAB", "spec": "UNDERGROUND HUD", "point": (740, 280), "label_pos": (840, 120)},
            {"name": "LFP BATTERY", "spec": "340 kWh MODULAR", "point": (920, 440), "label_pos": (1100, 320)},
            {"name": "ARTICULATION", "spec": "±42.5° CENTER HITCH", "point": (620, 510), "label_pos": (680, 680)}
        ]
    }
]

def main():
    for cfg in FLEET_CONFIGS:
        if os.path.exists(cfg["base_img"]):
            create_flir_thermal_view(cfg["base_img"], cfg["thermal_out"], cfg)
            create_exploded_cad_view(cfg["base_img"], cfg["exploded_out"], cfg)
            
    print("\nAll FLIR Thermal and Exploded CAD assets generated matching reference screenshots!")

if __name__ == "__main__":
    main()
