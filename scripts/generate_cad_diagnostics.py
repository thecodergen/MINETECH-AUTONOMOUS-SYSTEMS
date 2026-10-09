import os
import math
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

# Input base photos
VEHICLES = [
    {
        "id": "excavator",
        "base_img": "public/images/excavator_pbr_studio.jpg",
        "name": "996B HYDRAULIC MINING SHOVEL",
        "specs": ["55m³ CAST BUCKET", "TWIN BOOM CYLINDERS", "CUMMINS QSK60 POWER", "HEAVY CRAWLER UNDERCARRIAGE"],
        "parts": [
            ("55m³ BUCKET ASSEMBLY", (220, 480), "P/N: 996B-BKT-55M3"),
            ("HIGH-PRESSURE BOOM RAMS", (480, 220), "P/N: 996B-HYD-34MPA"),
            ("MAIN POWER GENERATOR", (820, 310), "P/N: 996B-PWR-6000HP"),
            ("CAST STEEL TRACK FRAME", (560, 580), "P/N: 996B-TRK-1600MM")
        ]
    },
    {
        "id": "drill",
        "base_img": "public/images/drill_pbr_studio.jpg",
        "name": "PV-271 ROTARY BLASTHOLE RIG",
        "specs": ["18.3m LATTICE MAST", "HIGH-TORQUE ROTARY HEAD", "LEVELING JACKS", "COMPRESSOR PACK"],
        "parts": [
            ("18.3m DRILLING LATTICE MAST", (350, 160), "P/N: PV271-MST-18M"),
            ("ROTARY DRIVE HEAD", (330, 360), "P/N: PV271-ROT-14KNM"),
            ("HYDRAULIC LEVELING JACKS", (640, 560), "P/N: PV271-JCK-22MPA"),
            ("MAIN AIR COMPRESSOR", (780, 420), "P/N: PV271-CMP-3800CFM")
        ]
    },
    {
        "id": "lhd",
        "base_img": "public/images/lhd_pbr_studio.jpg",
        "name": "SUBTERRANEAN LHD LOW-PROFILE LOADER",
        "specs": ["18.0T LOW PROFILE SCOOP", "340kWh LFP BATTERY BANK", "CENTER ARTICULATION JOINT", "42000LM LED MATRIX"],
        "parts": [
            ("18.0T UNDERGROUND ROCK SCOOP", (240, 460), "P/N: LHD-SCP-18T"),
            ("LFP SWAPPABLE BATTERY BANK", (840, 360), "P/N: LHD-BAT-340KWH"),
            ("VOLUMETRIC LED SEARCHLAMPS", (600, 240), "P/N: LHD-LED-42KLM"),
            ("HEAVY ARTICULATION JOINT", (520, 400), "P/N: LHD-ART-42DEG")
        ]
    }
]

def create_xray(base_path, out_path, veh):
    img = Image.open(base_path).convert("RGB")
    w, h = img.size
    
    # Grayscale + Edges + High Contrast
    gray = ImageOps.grayscale(img)
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges = ImageEnhance.Contrast(edges).enhance(3.5)
    
    # Invert to dark background
    inv = ImageOps.invert(gray)
    inv = ImageEnhance.Contrast(inv).enhance(1.8)
    
    # Colorize to cyan/electric blue hologram
    arr_inv = np.array(inv, dtype=np.float32) / 255.0
    arr_edges = np.array(edges, dtype=np.float32) / 255.0
    
    # Cyan wireframe tint
    r = (arr_inv * 0.05 + arr_edges * 0.15) * 255
    g = (arr_inv * 0.65 + arr_edges * 0.85) * 255
    b = (arr_inv * 0.95 + arr_edges * 1.00) * 255
    
    out_arr = np.stack([r, g, b], axis=2).clip(0, 255).astype(np.uint8)
    xray_img = Image.fromarray(out_arr)
    
    # Add Hologram HUD overlays & scanlines
    draw = ImageDraw.Draw(xray_img, "RGBA")
    
    # Scanlines
    for y in range(0, h, 6):
        draw.line([(0, y), (w, y)], fill=(0, 220, 255, 25), width=1)
        
    # Grid & Telemetry Header
    draw.rectangle([(20, 20), (w - 20, h - 20)], outline=(0, 240, 255, 120), width=2)
    draw.rectangle([(40, 40), (420, 110)], fill=(0, 20, 40, 200), outline=(0, 240, 255, 180), width=1)
    draw.text((55, 50), f"X-RAY HOLOGRAPHIC MESH // {veh['name']}", fill=(0, 255, 255, 255))
    draw.text((55, 75), "INTERNAL STRUCTURAL DENSITY: 98.4% NOMINAL", fill=(100, 230, 255, 220))
    draw.text((55, 90), "MODE: FULL CAD PENETRATIVE TOMOGRAPHY", fill=(0, 200, 255, 180))
    
    # Reticles over key components
    for name, (px, py), pn in veh["parts"]:
        draw.ellipse([(px-20, py-20), (px+20, py+20)], outline=(0, 255, 255, 220), width=2)
        draw.ellipse([(px-5, py-5), (px+5, py+5)], fill=(0, 255, 255, 255))
        draw.line([(px+25, py), (px+90, py)], fill=(0, 255, 255, 180), width=2)
        draw.text((px+95, py-10), name, fill=(0, 255, 255, 255))
        draw.text((px+95, py+5), pn, fill=(120, 220, 255, 200))
        
    xray_img.save(out_path, quality=95)
    print(f"Created X-Ray: {out_path}")

def create_thermal(base_path, out_path, veh):
    img = Image.open(base_path).convert("RGB")
    w, h = img.size
    
    gray = ImageOps.grayscale(img)
    arr = np.array(gray, dtype=np.float32) / 255.0
    
    # FLIR Ironbow gradient mapping:
    # 0.0 -> Black/Deep Purple, 0.35 -> Red/Magenta, 0.7 -> Yellow/Orange, 1.0 -> White
    r = np.zeros_like(arr)
    g = np.zeros_like(arr)
    b = np.zeros_like(arr)
    
    # Thermal gradient math
    r = np.clip(arr * 2.8 - 0.2, 0, 1)
    g = np.clip(arr * 2.2 - 0.9, 0, 1) + np.clip(arr * 1.5 - 0.3, 0, 0.4)
    b = np.clip(1.2 - arr * 2.4, 0, 0.9) * (arr < 0.5) + np.clip(arr * 3.0 - 2.2, 0, 1)
    
    out_arr = (np.stack([r, g, b], axis=2) * 255).clip(0, 255).astype(np.uint8)
    thermal_img = Image.fromarray(out_arr)
    
    draw = ImageDraw.Draw(thermal_img, "RGBA")
    
    # FLIR Telemetry Box
    draw.rectangle([(30, 30), (380, 120)], fill=(10, 0, 20, 220), outline=(255, 140, 0, 200), width=2)
    draw.text((45, 40), f"FLIR THERMAL RADIOMETRY // {veh['id'].upper()}", fill=(255, 200, 50, 255))
    draw.text((45, 65), "CALIBRATION: IR-LWIR 8-14um // IRONBOW-HD", fill=(255, 255, 255, 230))
    draw.text((45, 82), "MAX TEMP: 114.2°C (EXHAUST / HYD CORE)", fill=(255, 80, 80, 255))
    draw.text((45, 98), "MIN TEMP: 24.8°C (AMBIENT BENCH ROCK)", fill=(100, 180, 255, 255))
    
    # Hotspot temperature spot meters
    for i, (name, (px, py), _) in enumerate(veh["parts"]):
        temp_val = 88.4 - (i * 12.3)
        color = (255, 255, 255, 255) if temp_val > 70 else (255, 180, 50, 255)
        draw.line([(px-15, py), (px+15, py)], fill=color, width=2)
        draw.line([(px, py-15), (px, py+15)], fill=color, width=2)
        draw.ellipse([(px-8, py-8), (px+8, py+8)], outline=color, width=1)
        draw.text((px+18, py-10), f"SP0{i+1}: {temp_val:.1f}°C", fill=color)
        draw.text((px+18, py+5), name.split(" ")[0], fill=(255, 220, 150, 200))
        
    # Vertical Thermal Color Palette Bar on Right
    bar_x = w - 45
    bar_y_start = 80
    bar_h = h - 160
    for step in range(bar_h):
        frac = 1.0 - (step / bar_h)
        # Gradient color
        cr = int(np.clip(frac * 2.8 - 0.2, 0, 1) * 255)
        cg = int((np.clip(frac * 2.2 - 0.9, 0, 1) + np.clip(frac * 1.5 - 0.3, 0, 0.4)) * 255)
        cb = int((np.clip(1.2 - frac * 2.4, 0, 0.9) * (frac < 0.5) + np.clip(frac * 3.0 - 2.2, 0, 1)) * 255)
        draw.line([(bar_x, bar_y_start + step), (bar_x + 18, bar_y_start + step)], fill=(cr, cg, cb))
        
    draw.rectangle([(bar_x, bar_y_start), (bar_x + 18, bar_y_start + bar_h)], outline=(255, 255, 255, 180), width=1)
    draw.text((bar_x - 45, bar_y_start - 15), "120°C", fill=(255, 255, 255, 255))
    draw.text((bar_x - 40, bar_y_start + bar_h + 5), "20°C", fill=(150, 200, 255, 255))
    
    thermal_img.save(out_path, quality=95)
    print(f"Created Thermal: {out_path}")

def create_exploded_cad(base_path, out_path, veh):
    img = Image.open(base_path).convert("RGB")
    w, h = img.size
    
    # Blueprint Dark Blue Background with Grid
    gray = ImageOps.grayscale(img)
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges = ImageEnhance.Contrast(edges).enhance(4.0)
    
    arr_gray = np.array(gray, dtype=np.float32) / 255.0
    arr_edges = np.array(edges, dtype=np.float32) / 255.0
    
    # Dark Emerald/Navy Blueprint Theme
    r = (arr_edges * 0.2 + arr_gray * 0.05) * 255
    g = (arr_edges * 0.95 + arr_gray * 0.25) * 255
    b = (arr_edges * 0.75 + arr_gray * 0.45) * 255
    
    out_arr = np.stack([r, g, b], axis=2).clip(0, 255).astype(np.uint8)
    cad_img = Image.fromarray(out_arr)
    
    draw = ImageDraw.Draw(cad_img, "RGBA")
    
    # Isometric / Coordinate Engineering Grid
    for x in range(0, w, 40):
        draw.line([(x, 0), (x, h)], fill=(0, 255, 180, 20), width=1)
    for y in range(0, h, 40):
        draw.line([(0, y), (w, y)], fill=(0, 255, 180, 20), width=1)
        
    # Outer Tech Frame
    draw.rectangle([(25, 25), (w - 25, h - 25)], outline=(0, 255, 180, 160), width=2)
    
    # Engineering Title Block in Bottom Right
    tb_w, tb_h = 380, 130
    tb_x, tb_y = w - tb_w - 40, h - tb_h - 40
    draw.rectangle([(tb_x, tb_y), (tb_x + tb_w, tb_y + tb_h)], fill=(2, 20, 30, 230), outline=(0, 255, 180, 200), width=2)
    draw.text((tb_x + 15, tb_y + 15), "AUTODESK MINING CAD // EXPLODED ASSEMBLY", fill=(0, 255, 180, 255))
    draw.text((tb_x + 15, tb_y + 40), f"MODEL: {veh['name']}", fill=(255, 255, 255, 240))
    draw.text((tb_x + 15, tb_y + 65), "SCALE: 1:50 METRIC // TOLERANCE: ±0.05mm", fill=(100, 220, 200, 200))
    draw.text((tb_x + 15, tb_y + 88), "STATUS: APPROVED FOR HEAVY FABRICATION", fill=(0, 255, 150, 255))
    
    # Exploded Part Leader Lines with Callout Bubbles
    for i, (name, (px, py), pn) in enumerate(veh["parts"]):
        # Leader line with elbow
        elbow_x = px + 60
        elbow_y = py - 40
        end_x = elbow_x + 160
        
        draw.ellipse([(px-6, py-6), (px+6, py+6)], fill=(0, 255, 180, 255))
        draw.line([(px, py), (elbow_x, elbow_y)], fill=(0, 255, 180, 220), width=2)
        draw.line([(elbow_x, elbow_y), (end_x, elbow_y)], fill=(0, 255, 180, 220), width=2)
        
        # Number Callout Circle
        draw.ellipse([(elbow_x - 12, elbow_y - 12), (elbow_x + 12, elbow_y + 12)], fill=(2, 30, 40, 255), outline=(0, 255, 180, 255), width=2)
        draw.text((elbow_x - 4, elbow_y - 7), str(i+1), fill=(0, 255, 180, 255))
        
        draw.text((elbow_x + 18, elbow_y - 16), name, fill=(255, 255, 255, 255))
        draw.text((elbow_x + 18, elbow_y + 2), pn, fill=(0, 255, 180, 200))
        
    cad_img.save(out_path, quality=95)
    print(f"Created Exploded CAD: {out_path}")

def main():
    for veh in VEHICLES:
        vid = veh["id"]
        base = veh["base_img"]
        if not os.path.exists(base):
            print(f"Skipping {vid}, missing base {base}")
            continue
            
        xray_out = f"public/images/{vid}_xray_hologram.jpg"
        thermal_out = f"public/images/{vid}_flir_thermal.jpg"
        exploded_out = f"public/images/{vid}_exploded_cad.jpg"
        
        create_xray(base, xray_out, veh)
        create_thermal(base, thermal_out, veh)
        create_exploded_cad(base, exploded_out, veh)
        
    print("\nAll 9 vehicle diagnostic CAD assets generated successfully!")

if __name__ == "__main__":
    main()
