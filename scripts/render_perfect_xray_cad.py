import os
import math
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

def render_organic_cutaway(base_img_path, out_path, config):
    W, H = 1376, 768
    
    # 1. Base Machine Image
    base = Image.open(base_img_path).convert("RGB")
    base = base.resize((W, H), Image.Resampling.LANCZOS)
    
    # Reference background plate from hauler
    ref_bg = Image.open("public/images/hauler_xray_hologram.jpg").convert("RGB")
    ref_bg = ref_bg.resize((W, H), Image.Resampling.LANCZOS)
    
    bg_blurred = ref_bg.filter(ImageFilter.GaussianBlur(radius=40))
    bg_arr = np.array(bg_blurred, dtype=np.float32) / 255.0
    
    dark_workshop = bg_arr * 0.38
    y_coords, x_coords = np.ogrid[:H, :W]
    dist_center = np.sqrt(((x_coords - W/2) / (W/2))**2 + ((y_coords - H/2) / (H/2))**2)
    vig = np.clip(1.3 - dist_center * 0.55, 0.2, 1.0)[:, :, np.newaxis]
    workshop_bg = (dark_workshop * vig * 255).astype(np.uint8)
    workshop_img = Image.fromarray(workshop_bg, "RGB").convert("RGBA")
    
    draw_bg = ImageDraw.Draw(workshop_img)
    floor_y = int(H * 0.72)
    draw_bg.line([(0, floor_y), (W, floor_y)], fill=(0, 220, 255, 180), width=2)
    for y in range(floor_y, H, 18):
        alpha = int(140 * (1.0 - (y - floor_y) / (H - floor_y)))
        draw_bg.line([(0, y), (W, y)], fill=(0, 200, 255, max(15, alpha)), width=1)
    for x in range(-W, W * 2, 44):
        draw_bg.line([(x, floor_y), (int(x * 1.5), H)], fill=(0, 180, 240, 45), width=1)
        
    cx, cy = int(W * 0.50), int(H * 0.76)
    for r in [200, 320, 440, 580]:
        draw_bg.ellipse([(cx - r, cy - int(r * 0.24)), (cx + r, cy + int(r * 0.24))], outline=(0, 220, 255, 60), width=1)
        
    # 2. Extract Machine Silhouette & High-Frequency Wireframe
    gray = ImageOps.grayscale(base)
    edges_fine = gray.filter(ImageFilter.FIND_EDGES)
    edges_comb = ImageEnhance.Contrast(edges_fine).enhance(4.0)
    
    arr_base = np.array(base, dtype=np.float32) / 255.0
    arr_gray = np.array(gray, dtype=np.float32) / 255.0
    arr_edge = np.array(edges_comb, dtype=np.float32) / 255.0
    
    lum = arr_base.max(axis=2)
    mask = np.clip((lum - 0.05) * 4.0, 0, 1)
    mask_smooth = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2))) / 255.0
    
    # Translucent Cyan Outer Body
    cyan_r = (arr_edge * 0.12 + arr_gray * 0.03) * 255
    cyan_g = (arr_edge * 0.88 + arr_gray * 0.28) * 255
    cyan_b = (arr_edge * 1.00 + arr_gray * 0.38) * 255
    cyan_alpha = np.clip((arr_edge * 2.5 + arr_gray * 0.70) * mask_smooth * 255, 0, 255)
    
    body_rgba = np.stack([cyan_r, cyan_g, cyan_b, cyan_alpha], axis=2).astype(np.uint8)
    body_img = Image.fromarray(body_rgba, "RGBA")
    body_glow = body_img.filter(ImageFilter.GaussianBlur(radius=3))
    
    # 3. Create Feathered Organic Internal Glowing Components
    internal_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    for comp in config.get("components", []):
        ctype = comp["type"]
        x1, y1, x2, y2 = comp["bbox"]
        cw, ch = x2 - x1, y2 - y1
        
        # Create elliptical feathered mask inside the bounding box
        feather_mask = Image.new("L", (cw, ch), 0)
        f_draw = ImageDraw.Draw(feather_mask)
        f_draw.ellipse([(int(cw * 0.05), int(ch * 0.05)), (int(cw * 0.95), int(ch * 0.95))], fill=255)
        feather_mask = feather_mask.filter(ImageFilter.GaussianBlur(radius=max(12, int(min(cw, ch) * 0.18))))
        arr_fmask = np.array(feather_mask, dtype=np.float32) / 255.0
        
        sub_g = arr_gray[y1:y2, x1:x2]
        sub_e = arr_edge[y1:y2, x1:x2]
        sub_m = mask_smooth[y1:y2, x1:x2] * arr_fmask
        
        if ctype == "engine":  # Fiery Hot Orange V16 Engine (#ff4500)
            cr = np.clip((sub_e * 1.4 + sub_g * 1.0 + 0.5) * 255, 0, 255)
            cg = np.clip((sub_e * 0.6 + sub_g * 0.45 + 0.2) * 190, 0, 255)
            cb = np.clip((sub_e * 0.1 + sub_g * 0.05) * 40, 0, 255)
            ca = np.clip(sub_m * 255, 0, 255)
        elif ctype == "hydraulics":  # Glowing Solid Metallic Gold Rams (#ffb800)
            cr = np.clip((sub_e * 1.2 + sub_g * 0.9 + 0.6) * 255, 0, 255)
            cg = np.clip((sub_e * 0.9 + sub_g * 0.75 + 0.45) * 225, 0, 255)
            cb = np.clip((sub_e * 0.15 + sub_g * 0.1) * 60, 0, 255)
            ca = np.clip(sub_m * 255, 0, 255)
        elif ctype == "transmission":  # Electric Cobalt Blue Drivetrain (#0088ff)
            cr = np.clip((sub_e * 0.1 + sub_g * 0.05) * 40, 0, 255)
            cg = np.clip((sub_e * 0.5 + sub_g * 0.4 + 0.3) * 160, 0, 255)
            cb = np.clip((sub_e * 1.4 + sub_g * 1.0 + 0.65) * 255, 0, 255)
            ca = np.clip(sub_m * 255, 0, 255)
        else:
            continue
            
        comp_rgba = np.stack([cr, cg, cb, ca], axis=2).astype(np.uint8)
        comp_img = Image.fromarray(comp_rgba, "RGBA")
        internal_layer.paste(comp_img, (x1, y1), comp_img)
        
    int_glow1 = internal_layer.filter(ImageFilter.GaussianBlur(radius=12))
    int_glow2 = internal_layer.filter(ImageFilter.GaussianBlur(radius=4))
    
    # 4. Composite All Layers
    final_img = Image.alpha_composite(workshop_img, int_glow1)
    final_img = Image.alpha_composite(final_img, int_glow2)
    final_img = Image.alpha_composite(final_img, internal_layer)
    final_img = Image.alpha_composite(final_img, body_glow)
    final_img = Image.alpha_composite(final_img, body_img)
    
    # 5. Laser Beams & Autonomous LiDAR Fan from Roof Sensor
    draw = ImageDraw.Draw(final_img, "RGBA")
    lx, ly = config.get("lidar_pos", (int(W * 0.25), int(H * 0.15)))
    
    draw.rectangle([(lx - 16, ly - 10), (lx + 16, ly + 4)], fill=(10, 20, 30, 240), outline=(0, 240, 255, 255), width=2)
    draw.ellipse([(lx - 8, ly - 18), (lx + 8, ly - 2)], fill=(0, 240, 255, 220))
    for angle_deg in [-45, -30, -15, 0, 15, 30, 45]:
        rad = math.radians(angle_deg - 90)
        end_x = int(lx + math.cos(rad) * 480)
        end_y = int(ly + math.sin(rad) * 480)
        draw.line([(lx, ly - 10), (end_x, end_y)], fill=(0, 210, 255, 45), width=2)
        
    # Floating Particle Matrix
    np.random.seed(config.get("seed", 42))
    for _ in range(160):
        px = np.random.randint(30, W - 30)
        py = np.random.randint(30, H - 30)
        pr = np.random.randint(1, 3)
        pa = np.random.randint(70, 240)
        draw.ellipse([(px - pr, py - pr), (px + pr, py + pr)], fill=(0, 240, 255, pa))
        
    # 6. Exact High-Tech Badges with Red Chevron
    bx, by = config["badge_pos"]
    bw, bh = 150, 52
    draw.rectangle([(bx, by), (bx + bw, by + bh)], fill=(10, 16, 26, 250), outline=(0, 240, 255, 230), width=2)
    draw.polygon([(bx + bw - 28, by + 6), (bx + bw - 6, by + bh - 6), (bx + bw - 18, by + bh - 6), (bx + bw - 40, by + 6)], fill=(255, 45, 45, 255))
    draw.text((bx + 20, by + 15), config["badge"], fill=(255, 255, 255, 255))
    
    sbx, sby = config["sec_badge_pos"]
    sbw, sbh = 135, 42
    draw.rectangle([(sbx, sby), (sbx + sbw, sby + sbh)], fill=(8, 12, 20, 240), outline=(0, 210, 255, 200), width=1)
    draw.polygon([(sbx + sbw - 24, sby + 4), (sbx + sbw - 6, sby + sbh - 4), (sbx + sbw - 16, sby + sbh - 4), (sbx + sbw - 34, sby + 4)], fill=(255, 50, 50, 240))
    draw.text((sbx + 14, sby + 12), config["name_badge"], fill=(255, 255, 255, 255))
    
    final_rgb = final_img.convert("RGB")
    final_rgb.save(out_path, quality=95)
    print(f"Generated Organic Feathered Cutaway Hologram: {out_path}")

CONFIGS = [
    {
        "id": "excavator",
        "base_img_path": "public/images/excavator_pbr_studio.jpg",
        "out_path": "public/images/excavator_xray_hologram.jpg",
        "badge": "996B",
        "name_badge": "LIEBHERR 996",
        "badge_pos": (460, 220),
        "sec_badge_pos": (160, 360),
        "lidar_pos": (840, 160),
        "seed": 996,
        "components": [
            {"type": "engine", "bbox": (680, 280, 1100, 520)},
            {"type": "hydraulics", "bbox": (340, 160, 700, 460)},
            {"type": "transmission", "bbox": (480, 540, 1060, 720)}
        ]
    },
    {
        "id": "drill",
        "base_img_path": "public/images/drill_pbr_studio.jpg",
        "out_path": "public/images/drill_xray_hologram.jpg",
        "badge": "PV-271",
        "name_badge": "EPIROC PV271",
        "badge_pos": (540, 240),
        "sec_badge_pos": (190, 380),
        "lidar_pos": (670, 180),
        "seed": 271,
        "components": [
            {"type": "hydraulics", "bbox": (240, 260, 500, 500)},
            {"type": "engine", "bbox": (660, 380, 1100, 580)},
            {"type": "hydraulics", "bbox": (540, 540, 820, 700)},
            {"type": "transmission", "bbox": (420, 560, 1000, 720)}
        ]
    },
    {
        "id": "lhd",
        "base_img_path": "public/images/lhd_pbr_studio.jpg",
        "out_path": "public/images/lhd_xray_hologram.jpg",
        "badge": "LHD 18T",
        "name_badge": "SANDVIK LHD",
        "badge_pos": (490, 240),
        "sec_badge_pos": (180, 380),
        "lidar_pos": (780, 220),
        "seed": 18,
        "components": [
            {"type": "engine", "bbox": (720, 340, 1140, 560)},
            {"type": "hydraulics", "bbox": (260, 360, 540, 560)},
            {"type": "transmission", "bbox": (500, 400, 800, 600)}
        ]
    }
]

if __name__ == "__main__":
    for cfg in CONFIGS:
        if os.path.exists(cfg["base_img_path"]):
            render_organic_cutaway(cfg["base_img_path"], cfg["out_path"], cfg)
    print("\nAll 3 cutaway holograms rendered organically!")
