
from pathlib import Path
from PIL import Image
import glob


INPUT_PATTERN = "./output_images/frame-*.png"  # your frames: frame-0001.png, etc.
OUTPUT_GIF = "spinning_oval_optimized.gif"
OUTPUT_WEBP = "spinning_oval_optimized.webp"

TRIM_HEIGHT = 150      # 600 - 150 * 2 = 300
MAX_WIDTH = 600       # downscale from 1200 -> 600 (keeps aspect ratio)
FRAME_STEP = 2        # 1 = use all frames, 2 = every other frame, 3 = every third...
FPS = 36              # playback fps
LOOP_FOREVER = True   # loop = 0 for infinite


files = sorted(glob.glob(INPUT_PATTERN))

if not files:
    raise SystemExit(f"No files matching pattern: {INPUT_PATTERN}")

# Drop frames to reduce FPS / size
files = files[::FRAME_STEP]

print(f"Using {len(files)} frames (step={FRAME_STEP})")

frames = []

for f in files:
    img = Image.open(f).convert("RGBA")
    w, h = img.size
    img = img.crop((0, TRIM_HEIGHT, w, h-TRIM_HEIGHT))

    # Downscale
    if img.width > MAX_WIDTH:
        scale = MAX_WIDTH / img.width
        new_size = (MAX_WIDTH, int(img.height * scale))
        img = Image.alpha_composite(Image.new("RGBA", img.size, (0,0,0,0)), img)
        img = img.resize(new_size)

    frames.append(img)

duration_ms = int(1000 / FPS)
loop_value = 0 if LOOP_FOREVER else 1

print(f"Saving GIF to {OUTPUT_GIF} ({duration_ms} ms/frame, loop={loop_value})")

frames[0].save(
    OUTPUT_GIF,
    save_all=True,
    append_images=frames[1:],
    duration=duration_ms,
    loop=loop_value,
    optimize=True,
    disposal=2,  # clear frame before drawing the next
)
print("GIF saved.")


# Takes some time 
print(f"Saving WebP to {OUTPUT_WEBP}")
frames[0].save(
    OUTPUT_WEBP,
    save_all=True,
    append_images=frames[1:],
    duration=duration_ms,
    loop=0,
    format="WEBP",
    quality=80,     # lower for smaller file
    method=6,       # better compression
)
print("WebP saved.")