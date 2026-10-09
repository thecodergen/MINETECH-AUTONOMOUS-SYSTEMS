import os
import math
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

def enhance_cutaway_hologram(base_path, out_path, config):
    base = Image.open(base_path).convert("RGBA")
    w, h = base.size
    
    # 1. Dark Industrial Workshop Backdrop with Floor Hologram Grid
    bg = Image.new("RGBA", (w, h), (6, 10, 16, 255))
    bg_draw = ImageDraw.Draw(bg)
    
    # Columns & Overhead Crane
    for x in range(0, w, 160):
        bg_draw.line([(x, 0), (x, int(h * 0.72))], fill=(12, 18, 26, 255), width=16)
        bg_draw.line([(x + 80, 0), (x + 80, int(h * 0.72))], fill=(10, 14, 22, 255), width=4)
        
    bg_draw.rectangle([(0, 30), (w, 75)], fill=(12, 18, 26, 255))
    bg_draw.line([(0, 75), (w, 75)], fill=(20, 32, 46, 255), width=2)
    
    # Floor Grid Projection
    floor_y = int(h * 0.70)
    bg_draw.line([(0, floor_y), (w, floor_y)], fill=(0, 220, 255, 180), width=2)
    for y in range(floor_y, h, 20):
        alpha = int(140 * (1.0 - (y - floor_y) / (h - floor_y)))
        bg_draw.line([(0, y), (w, y)], fill=(0, 190, 255, max(15, alpha)), width=1)
    for x in range(-w, w * 2, 50):
        bg_draw.line([(x, floor_y), (int(x * 1.5), h)], fill=(0, 190, 255, 45), width=1)
        
    # Concentric Circular Floor Rings
    cx, cy = int(w * 0.52), int(h * 0.76)
    for r in [220, 340, 460, 580]:
        bg_draw.ellipse([(cx - r, cy - int(r*0.28)), (cx + r, cy + int(r*0.28))], outline=(0, 220, 255, 60), width=1)
        
    # 2. Extract Base Machine Silhouette & Electric Cyan Glow
    gray = ImageOps.grayscale(base)
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges_strong = ImageEnhance.Contrast(edges).enhance(4.2)
    
    arr_edges = np.array(edges_strong, dtype=np.float32) / 255.0
    arr_gray = np.array(gray, dtype=np.float32) / 255.0
    
    # Translucent Body Wireframe (#00e5ff)
    body_r = (arr_edges * 0.12 + arr_gray * 0.05) * 255
    body_g = (arr_edges * 0.88 + arr_gray * 0.28) * 255
    body_b = (arr_edges * 1.00 + arr_gray * 0.38) * 255
    body_alpha = np.clip((arr_edges * 2.2 + arr_gray * 0.75) * 255, 0, 255)
    
    body_rgba = np.stack([body_r, body_g, body_b, body_alpha], axis=2).astype(np.uint8)
    body_img = Image.fromarray(body_rgba, "RGBA")
    
    # 3. Create Internal Glowing Colored Mechanical Subsystems
    internal_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    for comp in config.get("components", []):
        ctype = comp["type"]
        x1, y1, x2, y2 = comp["bbox"]
        
        # Sub-region
        sub_g = arr_gray[y1:y2, x1:x2]
        sub_e = arr_edges[y1:y2, x1:x2]
        
        if ctype == "engine":  # Glowing Fiery Hot Orange / Red (#ff4500)
            cr = np.clip((sub_e * 1.6 + sub_g * 1.1) * 255, 0, 255)
            cg = np.clip((sub_e * 0.55 + sub_g * 0.42) * 170, 0, 255)
            cb = np.clip((sub_e * 0.15 + sub_g * 0.08) * 50, 0, 255)
            ca = np.clip((sub_e * 2.2 + sub_g * 1.1) * 255, 0, 255)
        elif ctype == "hydraulics":  # Glowing Amber Gold / Bright Yellow (#ffb700)
            cr = np.clip((sub_e * 1.4 + sub_g * 1.1) * 255, 0, 255)
            cg = np.clip((sub_e * 1.0 + sub_g * 0.85) * 220, 0, 255)
            cb = np.clip((sub_e * 0.2 + sub_g * 0.12) * 60, 0, 255)
            ca = np.clip((sub_e * 2.4 + sub_g * 1.2) * 255, 0, 255)
        elif ctype == "transmission":  # Electric Cobalt Blue (#0088ff)
            cr = np.clip((sub_e * 0.15 + sub_g * 0.08) * 50, 0, 255)
            cg = np.clip((sub_e * 0.6 + sub_g * 0.5) * 160, 0, 255)
            cb = np.clip((sub_e * 1.6 + sub_g * 1.1) * 255, 0, 255)
            ca = np.clip((sub_e * 2.2 + sub_g * 1.1) * 255, 0, 255)
        else:
            continue
            
        comp_rgba = np.stack([cr, cg, cb, ca], axis=2).astype(np.uint8)
        comp_img = Image.fromarray(comp_rgba, "RGBA")
        internal_layer.paste(comp_img, (x1, y1), comp_img)
        
    # High-intensity Gaussian Glow Bloom
    glow1 = internal_layer.filter(ImageFilter.GaussianBlur(radius=8))
    glow2 = internal_layer.filter(ImageFilter.GaussianBlur(radius=3))
    
    # Composite all layers
    final_comp = Image.alpha_composite(bg, glow1)
    final_comp = Image.alpha_composite(final_comp, glow2)
    final_comp = Image.alpha_composite(final_comp, internal_layer)
    final_comp = Image.alpha_composite(final_comp, body_img)
    
    # 4. Draw Badges & Floating Cyan Particle Sparks
    draw = ImageDraw.Draw(final_comp, "RGBA")
    
    # Particle Sparks
    np.random.seed(config.get("seed", 42))
    for _ in range(160):
        px = np.random.randint(20, w - 20)
        py = np.random.randint(20, h - 20)
        pr = np.random.randint(1, 3)
        pa = np.random.randint(70, 240)
        draw.ellipse([(px - pr, py - pr), (px + pr, py + pr)], fill=(0, 230, 255, pa))
        
    # Primary Plaque Badge
    bx, by = config["badge_pos"]
    bw, bh = 140, 48
    draw.rectangle([(bx, by), (bx + bw, by + bh)], fill=(8, 14, 22, 245), outline=(0, 220, 255, 230), width=2)
    draw.polygon([(bx + bw - 26, by + 6), (bx + bw - 6, by + bh - 6), (bx + bw - 18, by + bh - 6), (bx + bw - 38, by + 6)], fill=(255, 45, 45, 255))
    draw.text((bx + 18, by + 13), config["badge"], fill=(255, 255, 255, 255))
    
    # Secondary Badge
    sbx, sby = config["sec_badge_pos"]
    draw.rectangle([(sbx, sby), (sbx + 115, sby + 36)], fill=(6, 10, 16, 240), outline=(0, 200, 255, 200), width=1)
    draw.polygon([(sbx + 94, sby + 4), (sbx + 106, sby + 32), (sbx + 98, sby + 32), (sbx + 86, sby + 4)], fill=(255, 55, 55, 250))
    draw.text((sbx + 10, sby + 10), config["name_badge"], fill=(255, 255, 255, 255))
    
    final_rgb = final_comp.convert("RGB")
    final_rgb.save(out_path, quality=95)
    print(f"Generated High-Precision Cutaway Hologram: {out_path}")

CONFIGS = [
    {
        "id": "excavator",
        "base_img": "public/images/excavator_pbr_studio.jpg",
        "out_path": "public/images/excavator_xray_hologram.jpg",
        "badge": "996B",
        "name_badge": "LIEBHERR 996",
        "badge_pos": (380, 240),
        "sec_badge_pos": (140, 360),
        "seed": 996,
        "components": [
            # Cummins QSK60 Twin Power Pack (Fiery Orange)
            {"type": "engine", "bbox": (620, 260, 890, 480)},
            # Hydraulic Boom Pistons & Cylinders (Amber Gold)
            {"type": "hydraulics", "bbox": (310, 160, 580, 440)},
            # Heavy Crawler Undercarriage (Cobalt Blue)
            {"type": "transmission", "bbox": (390, 520, 830, 680)}
        ]
    },
    {
        "id": "drill",
        "base_img": "public/images/drill_pbr_studio.jpg",
        "out_path": "public/images/drill_xray_hologram.jpg",
        "badge": "PV-271",
        "name_badge": "EPIROC PV271",
        "badge_pos": (440, 220),
        "sec_badge_pos": (180, 340),
        "seed": 271,
        "components": [
            # High-Torque Rotary Drill Head (Amber Gold)
            {"type": "hydraulics", "bbox": (220, 260, 420, 450)},
            # Main Diesel Power Module (Fiery Orange)
            {"type": "engine", "bbox": (520, 340, 840, 520)},
            # Leveling Jack Rams (Amber Gold)
            {"type": "hydraulics", "bbox": (460, 500, 660, 640)},
            # Crawler Track Frame (Cobalt Blue)
            {"type": "transmission", "bbox": (360, 520, 780, 660)}
        ]
    },
    {
        "id": "lhd",
        "base_img": "public/images/lhd_pbr_studio.jpg",
        "out_path": "public/images/lhd_xray_hologram.jpg",
        "badge": "LHD 18T",
        "name_badge": "SANDVIK LHD",
        "badge_pos": (420, 240),
        "sec_badge_pos": (180, 360),
        "seed": 18,
        "components": [
            # 340kWh LFP Battery Bank & Inverter (Fiery Orange)
            {"type": "engine", "bbox": (620, 310, 880, 490)},
            # Hydraulic Scoop Lift Rams (Amber Gold)
            {"type": "hydraulics", "bbox": (220, 330, 450, 510)},
            # Articulation Joint & Axle Drive (Cobalt Blue)
            {"type": "transmission", "bbox": (420, 370, 630, 530)}
        ]
    }
]

if __name__ == "__main__":
    for cfg in CONFIGS:
        if os.path.exists(cfg["base_img"]):
            enhance_cutaway_hologram(cfg["base_img"], cfg["out_path"], cfg)
    print("\nAll cutaway holograms regenerated successfully!")
