
from PIL import Image
import glob

frames = []

files = sorted(glob.glob("./output_images/frame-*.png"))

for f in files:
    img = Image.open(f).convert("RGBA")
    frames.append(img)

frames[0].save(
    "spinning_oval.gif",
    save_all=True,
    append_images=frames[1:],
    duration=int(1000/48),  # fps=48
    loop=0,
    disposal=2,
)