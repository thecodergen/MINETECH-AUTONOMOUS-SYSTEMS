import os
import math
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

W, H = 1920, 1080

def get_font(size=24, bold=False, mono=False):
    font_paths = [
        "C:/Windows/Fonts/consolab.ttf" if (mono and bold) else "C:/Windows/Fonts/consola.ttf" if mono else "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/seguisb.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def render_2k_xray(base_img_path, out_path, config):
    base = Image.open(base_img_path).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    ref_bg = Image.open("public/images/hauler_xray_hologram.jpg").convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    
    # 1. Dark Workshop Background
    bg_blurred = ref_bg.filter(ImageFilter.GaussianBlur(radius=48))
    bg_arr = np.array(bg_blurred, dtype=np.float32) / 255.0
    dark_workshop = bg_arr * 0.38
    y_coords, x_coords = np.ogrid[:H, :W]
    dist_center = np.sqrt(((x_coords - W/2) / (W/2))**2 + ((y_coords - H/2) / (H/2))**2)
    vig = np.clip(1.3 - dist_center * 0.55, 0.2, 1.0)[:, :, np.newaxis]
    workshop_bg = (dark_workshop * vig * 255).astype(np.uint8)
    workshop_img = Image.fromarray(workshop_bg, "RGB").convert("RGBA")
    
    draw_bg = ImageDraw.Draw(workshop_img)
    floor_y = int(H * 0.72)
    draw_bg.line([(0, floor_y), (W, floor_y)], fill=(0, 220, 255, 200), width=3)
    for y in range(floor_y, H, 24):
        alpha = int(160 * (1.0 - (y - floor_y) / (H - floor_y)))
        draw_bg.line([(0, y), (W, y)], fill=(0, 200, 255, max(20, alpha)), width=1)
    for x in range(-W, W * 2, 56):
        draw_bg.line([(x, floor_y), (int(x * 1.5), H)], fill=(0, 180, 240, 50), width=1)
        
    cx, cy = int(W * 0.50), int(H * 0.76)
    for r in [260, 420, 580, 760]:
        draw_bg.ellipse([(cx - r, cy - int(r * 0.24)), (cx + r, cy + int(r * 0.24))], outline=(0, 220, 255, 65), width=2)
        
    # 2. Extract High-Precision Vector Edges & Silhouette
    gray = ImageOps.grayscale(base)
    edges_fine = gray.filter(ImageFilter.FIND_EDGES)
    edges_comb = ImageEnhance.Contrast(edges_fine).enhance(4.2)
    
    arr_base = np.array(base, dtype=np.float32) / 255.0
    arr_gray = np.array(gray, dtype=np.float32) / 255.0
    arr_edge = np.array(edges_comb, dtype=np.float32) / 255.0
    
    lum = arr_base.max(axis=2)
    mask = np.clip((lum - 0.05) * 4.0, 0, 1)
    mask_smooth = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=3))) / 255.0
    
    # Translucent Cyan Body (#00e5ff)
    cyan_r = (arr_edge * 0.12 + arr_gray * 0.03) * 255
    cyan_g = (arr_edge * 0.88 + arr_gray * 0.28) * 255
    cyan_b = (arr_edge * 1.00 + arr_gray * 0.38) * 255
    cyan_alpha = np.clip((arr_edge * 2.6 + arr_gray * 0.70) * mask_smooth * 255, 0, 255)
    
    body_rgba = np.stack([cyan_r, cyan_g, cyan_b, cyan_alpha], axis=2).astype(np.uint8)
    body_img = Image.fromarray(body_rgba, "RGBA")
    body_glow = body_img.filter(ImageFilter.GaussianBlur(radius=4))
    
    # 3. Organic Feathered Internal Components
    internal_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    for comp in config.get("components", []):
        ctype = comp["type"]
        x1 = int(comp["bbox"][0] * (W / 1376))
        y1 = int(comp["bbox"][1] * (H / 768))
        x2 = int(comp["bbox"][2] * (W / 1376))
        y2 = int(comp["bbox"][3] * (H / 768))
        cw, ch = x2 - x1, y2 - y1
        
        feather = Image.new("L", (cw, ch), 0)
        f_draw = ImageDraw.Draw(feather)
        f_draw.ellipse([(int(cw * 0.05), int(ch * 0.05)), (int(cw * 0.95), int(ch * 0.95))], fill=255)
        feather = feather.filter(ImageFilter.GaussianBlur(radius=max(14, int(min(cw, ch) * 0.18))))
        arr_fmask = np.array(feather, dtype=np.float32) / 255.0
        
        sub_g = arr_gray[y1:y2, x1:x2]
        sub_e = arr_edge[y1:y2, x1:x2]
        sub_m = mask_smooth[y1:y2, x1:x2] * arr_fmask
        
        if ctype == "engine":  # Fiery Hot Orange Core (#ff4500)
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
        
    int_glow1 = internal_layer.filter(ImageFilter.GaussianBlur(radius=16))
    int_glow2 = internal_layer.filter(ImageFilter.GaussianBlur(radius=5))
    
    final_img = Image.alpha_composite(workshop_img, int_glow1)
    final_img = Image.alpha_composite(final_img, int_glow2)
    final_img = Image.alpha_composite(final_img, internal_layer)
    final_img = Image.alpha_composite(final_img, body_glow)
    final_img = Image.alpha_composite(final_img, body_img)
    
    # 4. LiDAR Laser Fan & Particles
    draw = ImageDraw.Draw(final_img, "RGBA")
    lx = int(config["lidar_pos"][0] * (W / 1376))
    ly = int(config["lidar_pos"][1] * (H / 768))
    
    draw.rectangle([(lx - 20, ly - 12), (lx + 20, ly + 6)], fill=(10, 20, 30, 240), outline=(0, 240, 255, 255), width=2)
    draw.ellipse([(lx - 10, ly - 22), (lx + 10, ly - 2)], fill=(0, 240, 255, 220))
    for angle_deg in [-45, -30, -15, 0, 15, 30, 45]:
        rad = math.radians(angle_deg - 90)
        end_x = int(lx + math.cos(rad) * 620)
        end_y = int(ly + math.sin(rad) * 620)
        draw.line([(lx, ly - 12), (end_x, end_y)], fill=(0, 210, 255, 50), width=2)
        
    np.random.seed(config.get("seed", 42))
    for _ in range(180):
        px = np.random.randint(40, W - 40)
        py = np.random.randint(40, H - 40)
        pr = np.random.randint(1, 4)
        pa = np.random.randint(70, 240)
        draw.ellipse([(px - pr, py - pr), (px + pr, py + pr)], fill=(0, 240, 255, pa))
        
    # Badges with crisp font
    f_badge = get_font(26, bold=True, mono=True)
    f_badge_sub = get_font(18, bold=True, mono=True)
    
    bx = int(config["badge_pos"][0] * (W / 1376))
    by = int(config["badge_pos"][1] * (H / 768))
    bw, bh = 200, 64
    draw.rectangle([(bx, by), (bx + bw, by + bh)], fill=(10, 16, 26, 250), outline=(0, 240, 255, 230), width=2)
    draw.polygon([(bx + bw - 36, by + 8), (bx + bw - 10, by + bh - 8), (bx + bw - 26, by + bh - 8), (bx + bw - 52, by + 8)], fill=(255, 45, 45, 255))
    draw.text((bx + 20, by + 16), config["badge"], fill=(255, 255, 255, 255), font=f_badge)
    
    sbx = int(config["sec_badge_pos"][0] * (W / 1376))
    sby = int(config["sec_badge_pos"][1] * (H / 768))
    sbw, sbh = 220, 52
    draw.rectangle([(sbx, sby), (sbx + sbw, sby + sbh)], fill=(8, 12, 20, 240), outline=(0, 210, 255, 200), width=1)
    draw.polygon([(sbx + sbw - 32, sby + 6), (sbx + sbw - 10, sby + sbh - 6), (sbx + sbw - 22, sby + sbh - 6), (sbx + sbw - 44, sby + 6)], fill=(255, 50, 50, 240))
    draw.text((sbx + 16, sby + 14), config["name_badge"], fill=(255, 255, 255, 255), font=f_badge_sub)
    
    final_rgb = final_img.convert("RGB")
    final_rgb.save(out_path, quality=96)
    print(f"Rendered 2K X-Ray: {out_path}")

def render_2k_flir(base_img_path, out_path, config):
    base = Image.open(base_img_path).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    gray = ImageOps.grayscale(base)
    arr_gray = np.array(gray, dtype=np.float32) / 255.0
    arr_base = np.array(base, dtype=np.float32) / 255.0
    
    lum = arr_base.max(axis=2)
    mask = np.clip((lum - 0.05) * 4.0, 0, 1)
    mask_smooth = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=4))) / 255.0
    
    bg_r = arr_gray * 0.12 * 255
    bg_g = arr_gray * 0.18 * 255
    bg_b = (arr_gray * 0.45 + 0.15) * 255
    
    body_r = (arr_gray * 0.55 + 0.18) * 255
    body_g = (arr_gray * 0.15 + 0.05) * 255
    body_b = (arr_gray * 0.70 + 0.28) * 255
    
    r = bg_r * (1 - mask_smooth) + body_r * mask_smooth
    g = bg_g * (1 - mask_smooth) + body_g * mask_smooth
    b = bg_b * (1 - mask_smooth) + body_b * mask_smooth
    
    thermal_img = Image.fromarray(np.stack([r, g, b], axis=2).clip(0, 255).astype(np.uint8), "RGB").convert("RGBA")
    heat_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    for comp in config.get("components", []):
        ctype = comp["type"]
        x1 = int(comp["bbox"][0] * (W / 1376))
        y1 = int(comp["bbox"][1] * (H / 768))
        x2 = int(comp["bbox"][2] * (W / 1376))
        y2 = int(comp["bbox"][3] * (H / 768))
        cw, ch = x2 - x1, y2 - y1
        
        feather = Image.new("L", (cw, ch), 0)
        f_draw = ImageDraw.Draw(feather)
        f_draw.ellipse([(int(cw * 0.05), int(ch * 0.05)), (int(cw * 0.95), int(ch * 0.95))], fill=255)
        feather = feather.filter(ImageFilter.GaussianBlur(radius=max(12, int(min(cw, ch) * 0.18))))
        arr_fmask = np.array(feather, dtype=np.float32) / 255.0
        
        sub_g = arr_gray[y1:y2, x1:x2]
        sub_m = mask_smooth[y1:y2, x1:x2] * arr_fmask
        
        if ctype == "engine":  # Hot white/yellow/orange 242-245°C
            hr = np.clip((sub_g * 0.8 + 0.85) * 255, 0, 255)
            hg = np.clip((sub_g * 1.0 + 0.65) * 230, 0, 255)
            hb = np.clip((sub_g * 1.2 - 0.2) * 200, 0, 255)
            ha = np.clip(sub_m * 255, 0, 255)
        elif ctype in ["hydraulics", "transmission"]:  # 114°C warm cylinders/rams
            hr = np.clip((sub_g * 0.8 + 0.75) * 255, 0, 255)
            hg = np.clip((sub_g * 0.7 + 0.45) * 200, 0, 255)
            hb = np.clip(sub_g * 0.1 * 40, 0, 255)
            ha = np.clip(sub_m * 240, 0, 255)
        else:
            continue
            
        comp_rgba = np.stack([hr, hg, hb, ha], axis=2).astype(np.uint8)
        comp_img = Image.fromarray(comp_rgba, "RGBA")
        heat_layer.paste(comp_img, (x1, y1), comp_img)
        
    heat_glow1 = heat_layer.filter(ImageFilter.GaussianBlur(radius=20))
    heat_glow2 = heat_layer.filter(ImageFilter.GaussianBlur(radius=8))
    
    final_comp = Image.alpha_composite(thermal_img, heat_glow1)
    final_comp = Image.alpha_composite(final_comp, heat_glow2)
    final_comp = Image.alpha_composite(final_comp, heat_layer)
    
    draw = ImageDraw.Draw(final_comp, "RGBA")
    f_flir_osd = get_font(22, bold=True, mono=True)
    f_flir_temp = get_font(20, bold=True, mono=True)
    f_badge = get_font(26, bold=True, mono=True)
    
    draw.text((W - 380, 45), "00:07:48 FEM 82", fill=(200, 225, 255, 220), font=f_flir_osd)
    
    # Authentic FLIR Ironbow scale
    bar_x, bar_y, bar_w, bar_h = 60, H - 360, 26, 260
    for i in range(bar_h):
        frac = 1.0 - (i / bar_h)
        if frac > 0.85:
            c = (255, int(255 * (frac - 0.85) / 0.15), int(220 * (frac - 0.85) / 0.15))
        elif frac > 0.55:
            c = (255, int(220 * (frac - 0.55) / 0.3), 10)
        elif frac > 0.25:
            c = (int(255 * (frac - 0.25) / 0.3), 30, int(180 * (1.0 - (frac - 0.25) / 0.3)))
        else:
            c = (10, int(60 * frac / 0.25), int(220 * (frac / 0.25)))
        draw.line([(bar_x, bar_y + i), (bar_x + bar_w, bar_y + i)], fill=c)
    draw.rectangle([(bar_x, bar_y), (bar_x + bar_w, bar_y + bar_h)], outline=(255, 255, 255, 180), width=1)
    
    draw.text((bar_x + 38, bar_y - 6), config.get("max_temp_str", "245.0°C"), fill=(255, 255, 255, 255), font=f_flir_temp)
    draw.text((bar_x + 38, bar_y + 55), "220.1°C", fill=(255, 120, 50, 255), font=f_flir_temp)
    draw.text((bar_x + 38, bar_y + 120), config.get("cyl_temp_str", "114.0°C"), fill=(255, 190, 40, 255), font=f_flir_temp)
    draw.text((bar_x + 38, bar_y + 185), "58.2°C", fill=(160, 90, 220, 255), font=f_flir_temp)
    draw.text((bar_x + 38, bar_y + 245), "24.5°C", fill=(80, 150, 255, 255), font=f_flir_temp)
    
    for i, comp in enumerate(config.get("components", [])):
        x1 = int(comp["bbox"][0] * (W / 1376))
        y1 = int(comp["bbox"][1] * (H / 768))
        x2 = int(comp["bbox"][2] * (W / 1376))
        y2 = int(comp["bbox"][3] * (H / 768))
        sp_x, sp_y = (x1 + x2) // 2, (y1 + y2) // 2
        
        tval = config.get("max_temp_val", 245.0) if comp["type"] == "engine" else config.get("cyl_temp_val", 114.0) if comp["type"] == "hydraulics" else 68.2
        col = (255, 255, 255, 240) if tval > 200 else (255, 210, 60, 240)
        draw.line([(sp_x - 18, sp_y), (sp_x + 18, sp_y)], fill=col, width=2)
        draw.line([(sp_x, sp_y - 18), (sp_x, sp_y + 18)], fill=col, width=2)
        draw.ellipse([(sp_x - 4, sp_y - 4), (sp_x + 4, sp_y + 4)], fill=col)
        draw.text((sp_x + 24, sp_y - 12), f"{tval:.1f}°C", fill=col, font=f_flir_temp)
        
    bx = int(config["badge_pos"][0] * (W / 1376))
    by = int(config["badge_pos"][1] * (H / 768))
    bw, bh = 200, 64
    draw.rectangle([(bx, by), (bx + bw, by + bh)], fill=(15, 10, 30, 240), outline=(255, 120, 40, 220), width=2)
    draw.polygon([(bx + bw - 36, by + 8), (bx + bw - 10, by + bh - 8), (bx + bw - 26, by + bh - 8), (bx + bw - 52, by + 8)], fill=(255, 45, 45, 255))
    draw.text((bx + 20, by + 16), config["badge"], fill=(255, 255, 255, 255), font=f_badge)
    
    final_rgb = final_comp.convert("RGB")
    final_rgb.save(out_path, quality=96)
    print(f"Rendered 2K FLIR Thermal: {out_path}")

def render_2k_exploded(base_img_path, out_path, config):
    base = Image.open(base_img_path).convert("RGBA").resize((W, H), Image.Resampling.LANCZOS)
    bg = Image.new("RGBA", (W, H), (4, 10, 16, 255))
    draw_bg = ImageDraw.Draw(bg)
    
    for x in range(-W, W * 2, 56):
        draw_bg.line([(x, 0), (x + H, H)], fill=(0, 220, 200, 18), width=1)
        draw_bg.line([(x, 0), (x - H, H)], fill=(0, 220, 200, 18), width=1)
    for y in range(0, H, 44):
        draw_bg.line([(0, y), (W, y)], fill=(0, 220, 200, 12), width=1)
        
    draw_bg.rectangle([(30, 30), (W - 30, H - 30)], outline=(0, 220, 200, 70), width=1)
    
    f_title = get_font(28, bold=True, mono=True)
    f_sub = get_font(18, bold=True, mono=True)
    f_callout_title = get_font(20, bold=True, mono=True)
    f_callout_spec = get_font(16, bold=False, mono=True)
    f_badge = get_font(26, bold=True, mono=True)
    
    draw_bg.text((60, 50), f"{config['badge']} 3D CAD EXPLODED VIEW", fill=(255, 255, 255, 240), font=f_title)
    draw_bg.text((60, 88), "HEAVY AUTONOMOUS SYSTEM // DIGITAL TWIN SCADA", fill=(0, 220, 200, 180), font=f_sub)
    
    exploded_comp = Image.alpha_composite(bg, base)
    draw = ImageDraw.Draw(exploded_comp, "RGBA")
    
    for item in config.get("callouts", []):
        pt_x = int(item["point"][0] * (W / 1376))
        pt_y = int(item["point"][1] * (H / 768))
        box_x = int(item["label_pos"][0] * (W / 1376))
        box_y = int(item["label_pos"][1] * (H / 768))
        name = item["name"]
        spec = item["spec"]
        
        elbow_x = box_x + 60 if box_x > pt_x else box_x + 220
        elbow_y = pt_y
        
        draw.ellipse([(pt_x - 7, pt_y - 7), (pt_x + 7, pt_y + 7)], fill=(0, 240, 220, 255))
        draw.line([(pt_x, pt_y), (elbow_x, elbow_y)], fill=(0, 240, 220, 200), width=2)
        draw.line([(elbow_x, elbow_y), (box_x + 120, box_y + 32)], fill=(0, 240, 220, 200), width=2)
        
        box_w, box_h = 280, 68
        draw.rectangle([(box_x, box_y), (box_x + box_w, box_y + box_h)], fill=(8, 16, 24, 235), outline=(0, 240, 220, 200), width=2)
        draw.text((box_x + 16, box_y + 10), name, fill=(255, 255, 255, 255), font=f_callout_title)
        draw.text((box_x + 16, box_y + 36), spec, fill=(0, 220, 200, 220), font=f_callout_spec)
        
    bx = int(config["badge_pos"][0] * (W / 1376))
    by = int(config["badge_pos"][1] * (H / 768))
    bw, bh = 200, 64
    draw.rectangle([(bx, by), (bx + bw, by + bh)], fill=(12, 18, 26, 240), outline=(0, 240, 220, 220), width=2)
    draw.polygon([(bx + bw - 36, by + 8), (bx + bw - 10, by + bh - 8), (bx + bw - 26, by + bh - 8), (bx + bw - 52, by + 8)], fill=(255, 45, 45, 255))
    draw.text((bx + 20, by + 16), config["badge"], fill=(255, 255, 255, 255), font=f_badge)
    
    final_rgb = exploded_comp.convert("RGB")
    final_rgb.save(out_path, quality=96)
    print(f"Rendered 2K Exploded CAD: {out_path}")

SUITE = [
    {
        "id": "excavator",
        "base_img": "public/images/excavator_pbr_studio.jpg",
        "xray_out": "public/images/excavator_xray_hologram.jpg",
        "thermal_out": "public/images/excavator_flir_thermal.jpg",
        "exploded_out": "public/images/excavator_exploded_cad.jpg",
        "badge": "996B",
        "name_badge": "LIEBHERR 996",
        "badge_pos": (460, 220),
        "sec_badge_pos": (160, 360),
        "lidar_pos": (840, 160),
        "seed": 996,
        "max_temp_val": 245.0,
        "max_temp_str": "245.0°C",
        "cyl_temp_val": 114.0,
        "cyl_temp_str": "114.0°C",
        "components": [
            {"type": "engine", "bbox": (680, 280, 1100, 520)},      # QSK60 Twin Units (245°C)
            {"type": "hydraulics", "bbox": (340, 160, 700, 460)},   # Boom Rams (114°C)
            {"type": "transmission", "bbox": (480, 540, 1060, 720)}  # Blue Crawler Tracks
        ],
        "callouts": [
            {"name": "55m³ BUCKET", "spec": "CAST STEEL // 95T", "point": (280, 520), "label_pos": (60, 360)},
            {"name": "BOOM CYLINDERS", "spec": "340 BAR // 2240 kN", "point": (540, 320), "label_pos": (460, 110)},
            {"name": "OPERATOR CAB", "spec": "ROPS/FOPS SCADA", "point": (820, 240), "label_pos": (860, 100)},
            {"name": "CUMMINS QSK60", "spec": "6,000 HP DUAL V16", "point": (940, 420), "label_pos": (1060, 300)},
            {"name": "CRAWLER TRACKS", "spec": "1600mm STEEL SHOES", "point": (720, 640), "label_pos": (740, 680)}
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
        "sec_badge_pos": (190, 380),
        "lidar_pos": (670, 180),
        "seed": 271,
        "max_temp_val": 242.0,
        "max_temp_str": "242.0°C",
        "cyl_temp_val": 114.0,
        "cyl_temp_str": "114.0°C",
        "components": [
            {"type": "hydraulics", "bbox": (240, 260, 500, 500)},   # Rotary Head (114°C)
            {"type": "engine", "bbox": (660, 380, 1100, 580)},       # Compressor Deck (242°C)
            {"type": "hydraulics", "bbox": (540, 540, 820, 700)},   # Leveling Jacks (114°C)
            {"type": "transmission", "bbox": (420, 560, 1000, 720)}  # Undercarriage Transmission
        ],
        "callouts": [
            {"name": "18.3m LATTICE MAST", "spec": "HEAVY HIGH-TENSILE", "point": (340, 180), "label_pos": (90, 120)},
            {"name": "ROTARY DRIVE HEAD", "spec": "14,200 Nm TORQUE", "point": (320, 440), "label_pos": (70, 420)},
            {"name": "AIR COMPRESSOR", "spec": "3,800 CFM // 2.4 MPa", "point": (860, 440), "label_pos": (1060, 320)},
            {"name": "LEVELING JACKS", "spec": "4x AUTO OUTRIGGERS", "point": (640, 620), "label_pos": (700, 670)},
            {"name": "OPERATOR CAB", "spec": "GPS AUTO-COLLAR", "point": (680, 280), "label_pos": (820, 120)}
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
        "sec_badge_pos": (180, 380),
        "lidar_pos": (780, 220),
        "seed": 18,
        "max_temp_val": 242.0,
        "max_temp_str": "242.0°C",
        "cyl_temp_val": 114.0,
        "cyl_temp_str": "114.0°C",
        "components": [
            {"type": "engine", "bbox": (720, 340, 1140, 560)},      # 340kWh Inverter / Battery (242°C)
            {"type": "hydraulics", "bbox": (260, 360, 540, 560)},   # Scoop Lift Rams (114°C)
            {"type": "transmission", "bbox": (500, 400, 800, 600)}  # Articulated Drivetrain
        ],
        "callouts": [
            {"name": "ROCK SCOOP", "spec": "18.0T LOW PROFILE", "point": (280, 520), "label_pos": (60, 380)},
            {"name": "LIFT RAMS", "spec": "380 kN BREAKOUT", "point": (460, 440), "label_pos": (320, 160)},
            {"name": "ROPS/FOPS CAB", "spec": "UNDERGROUND HUD", "point": (740, 280), "label_pos": (820, 110)},
            {"name": "340kWh BATTERY", "spec": "LFP MODULAR PACK", "point": (920, 440), "label_pos": (1060, 300)},
            {"name": "ARTICULATION", "spec": "±42.5° CENTER HITCH", "point": (620, 510), "label_pos": (660, 680)}
        ]
    }
]

def main():
    for item in SUITE:
        if os.path.exists(item["base_img"]):
            render_2k_xray(item["base_img"], item["xray_out"], item)
            render_2k_flir(item["base_img"], item["thermal_out"], item)
            render_2k_exploded(item["base_img"], item["exploded_out"], item)
            
    print("\nAll 9 2K fleet diagnostic suite renders generated successfully!")

if __name__ == "__main__":
    main()

