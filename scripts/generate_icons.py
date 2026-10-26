#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_bold_icon(size=1024):
    scale = size / 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # 1. Background Squircle - fills almost full frame for maximum presence
    margin = 16 * scale
    radius = 112 * scale
    bbox = [margin, margin, size - margin, size - margin]

    # Vibrant Nordic Ultramarine Gradient (#2563eb -> #1d4ed8 -> #0f172a)
    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    for y in range(int(margin), int(size - margin)):
        t = (y - margin) / (size - 2 * margin)
        # Smooth interpolation from bright sapphire blue to deep midnight blue
        r = int(37 * (1 - t) + 15 * t)
        g = int(99 * (1 - t) + 23 * t)
        b = int(235 * (1 - t) + 60 * t)
        g_draw.line([(margin, y), (size - margin, y)], fill=(r, g, b, 255))

    # Mask for squircle
    mask = Image.new("L", (size, size), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle(bbox, radius=radius, fill=255)

    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg.paste(grad, (0, 0), mask=mask)

    # Subtle premium glassy rim
    border_mask = Image.new("L", (size, size), 0)
    b_draw = ImageDraw.Draw(border_mask)
    b_draw.rounded_rectangle(bbox, radius=radius, outline=255, width=int(3 * scale))
    border_layer = Image.new("RGBA", (size, size), (255, 255, 255, 55))
    bg.paste(border_layer, (0, 0), mask=border_mask)

    # 2. Giant, Bold, Crystal-Clear "S"
    font_size = int(370 * scale)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    s_text = "S"
    temp_draw = ImageDraw.Draw(bg)
    t_bbox = temp_draw.textbbox((0, 0), s_text, font=font)
    t_w = t_bbox[2] - t_bbox[0]
    t_h = t_bbox[3] - t_bbox[1]

    # Perfect optical centering
    s_x = (size - t_w) / 2 - t_bbox[0]
    # In Georgia, cap baseline needs slight upward adjustment for visual balance
    s_y = (size - t_h) / 2 - t_bbox[1] - 8 * scale

    # Subtle drop shadow behind the 'S' for depth
    shadow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)
    s_draw.text((s_x, s_y + 8 * scale), s_text, fill=(10, 20, 50, 160), font=font)
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(8 * scale))
    bg.paste(shadow_layer, (0, 0), mask=shadow_layer)

    # Crisp pure white 'S'
    text_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(text_layer)
    t_draw.text((s_x, s_y), s_text, fill=(255, 255, 255, 255), font=font)

    # Small accent dot: a luminous cyan/electric blue clarity dot in upper right corner
    dot_radius = 24 * scale
    dot_cx = size - margin - 72 * scale
    dot_cy = margin + 72 * scale
    t_draw.ellipse(
        [dot_cx - dot_radius, dot_cy - dot_radius, dot_cx + dot_radius, dot_cy + dot_radius],
        fill=(56, 189, 248, 255) # #38bdf8
    )

    bg.paste(text_layer, (0, 0), mask=text_layer)
    return bg

def main():
    icons_dir = "/Users/dst/Documents/koodi/selkokieli/extension/icons"
    os.makedirs(icons_dir, exist_ok=True)

    master = create_bold_icon(1024)
    master.save(os.path.join(icons_dir, "icon512.png"))

    sizes = [16, 32, 48, 128]
    for sz in sizes:
        resized = master.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(os.path.join(icons_dir, f"icon{sz}.png"))
        print(f"Generated bold icon{sz}.png")

if __name__ == "__main__":
    main()
