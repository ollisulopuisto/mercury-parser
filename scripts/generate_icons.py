#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_icon(size=1024):
    # High-res canvas for supersampling
    scale = size / 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background Squircle (Rounded rectangle)
    margin = 32 * scale
    radius = 108 * scale
    bbox = [margin, margin, size - margin, size - margin]

    # Create gradient background
    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    
    # Draw vertical/diagonal gradient
    for y in range(int(margin), int(size - margin)):
        t = (y - margin) / (size - 2 * margin)
        # Deep Nordic Indigo (#1e293b -> #0f172a / #1e3a8a)
        r = int(24 * (1 - t) + 10 * t)
        g = int(58 * (1 - t) + 25 * t)
        b = int(120 * (1 - t) + 47 * t)
        g_draw.line([(margin, y), (size - margin, y)], fill=(r, g, b, 255))

    # Mask for squircle
    mask = Image.new("L", (size, size), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle(bbox, radius=radius, fill=255)

    # Apply mask
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg.paste(grad, (0, 0), mask=mask)

    # Subtle inner border for glassy depth
    border_mask = Image.new("L", (size, size), 0)
    b_draw = ImageDraw.Draw(border_mask)
    b_draw.rounded_rectangle(bbox, radius=radius, outline=255, width=int(3 * scale))
    border_layer = Image.new("RGBA", (size, size), (255, 255, 255, 45))
    bg.paste(border_layer, (0, 0), mask=border_mask)

    # 2. Central Reading Sheet / Card
    card_margin_x = 110 * scale
    card_top = 110 * scale
    card_bottom = size - 110 * scale
    card_radius = 28 * scale
    card_bbox = [card_margin_x, card_top, size - card_margin_x, card_bottom]

    # Drop shadow for card
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle(
        [card_margin_x, card_top + 12 * scale, size - card_margin_x, card_bottom + 12 * scale],
        radius=card_radius,
        fill=(0, 0, 0, 110)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(16 * scale))
    bg.paste(shadow, (0, 0), mask=shadow)

    # Card background (warm crisp ivory/white)
    card_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(card_layer)
    c_draw.rounded_rectangle(card_bbox, radius=card_radius, fill=(250, 252, 255, 255))
    
    # Bookmark ribbon (vibrant azure/cyan #0284c7)
    ribbon_w = 42 * scale
    ribbon_h = 60 * scale
    ribbon_x = size - card_margin_x - 72 * scale
    c_draw.rectangle([ribbon_x, card_top, ribbon_x + ribbon_w, card_top + ribbon_h], fill=(2, 132, 199, 255))
    # Ribbon notch
    c_draw.polygon([
        (ribbon_x, card_top + ribbon_h),
        (ribbon_x + ribbon_w / 2, card_top + ribbon_h - 16 * scale),
        (ribbon_x + ribbon_w, card_top + ribbon_h)
    ], fill=(250, 252, 255, 255))

    # 3. Typography: The "S" of Selkokieli
    font_size = int(185 * scale)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    # Draw the serif "S"
    s_text = "S"
    # Measure text bounding box
    t_bbox = c_draw.textbbox((0, 0), s_text, font=font)
    t_w = t_bbox[2] - t_bbox[0]
    t_h = t_bbox[3] - t_bbox[1]
    
    # Position S on the left side of the card
    s_x = card_margin_x + 48 * scale
    s_y = (size - t_h) / 2 - 20 * scale
    c_draw.text((s_x, s_y), s_text, fill=(15, 23, 42, 255), font=font)

    # 4. Clean Reading Lines (representing distilled, plain text)
    line_x = s_x + t_w + 36 * scale
    line_end = size - card_margin_x - 48 * scale
    line_h = 10 * scale
    line_radius = 5 * scale
    
    # 3 clean horizontal lines next to the S
    lines_y = [
        s_y + 45 * scale,
        s_y + 85 * scale,
        s_y + 125 * scale,
        s_y + 165 * scale
    ]
    widths = [0.85, 1.0, 0.7, 0.9]
    
    for i, y_pos in enumerate(lines_y):
        w_factor = widths[i]
        curr_end = line_x + (line_end - line_x) * w_factor
        c_draw.rounded_rectangle([line_x, y_pos, curr_end, y_pos + line_h], radius=line_radius, fill=(148, 163, 184, 255))

    # Bottom decorative reading line across the card
    bot_y = card_bottom - 54 * scale
    c_draw.rounded_rectangle([card_margin_x + 48 * scale, bot_y, size - card_margin_x - 48 * scale, bot_y + 8 * scale],
                             radius=4 * scale, fill=(226, 232, 240, 255))

    bg.paste(card_layer, (0, 0), mask=card_layer)
    return bg

def main():
    icons_dir = "/Users/dst/Documents/koodi/selkokieli/extension/icons"
    os.makedirs(icons_dir, exist_ok=True)

    master = create_icon(1024)
    master.save(os.path.join(icons_dir, "icon512.png"))

    sizes = [16, 32, 48, 128]
    for sz in sizes:
        # Resize with Lanczos for highest quality downsampling
        resized = master.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(os.path.join(icons_dir, f"icon{sz}.png"))
        print(f"Generated icon{sz}.png")

if __name__ == "__main__":
    main()
