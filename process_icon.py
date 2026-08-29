import sys
import urllib.request
from PIL import Image

try:
    from rembg import remove
except ImportError:
    print("Error: rembg is not installed.")
    sys.exit(1)

def extract_camera():
    input_path = r"C:\Users\porel\.gemini\antigravity\brain\85763114-495d-4bfe-8f40-e80e210ac593\media__1788028973216.png"
    output_path = r"d:\Code\Mood Website\src\app\icon.png"
    
    img = Image.open(input_path).convert('RGB')
    w, h = img.size

    # The user wants ONLY the camera logo. Looking at the image, the text "TOYVEIL" and "DEIFIO" is at the sides. 
    # The wreaths are around. The camera itself is in the middle.
    # To drop the ribbons, we crop tightly around the camera area
    # Box: (left, top, right, bottom)
    # The camera lens sticks out to ~0.26x. The reel is at top ~0.2x. The base is around 0.75y.
    crop_box = (
        int(w * 0.25), 
        int(h * 0.20), 
        int(w * 0.73), 
        int(h * 0.76)
    )
    cropped = img.crop(crop_box)
    
    output_img = remove(cropped)
    output_img.save(output_path)
    print("Camera successfully isolated and saved to", output_path)

if __name__ == "__main__":
    extract_camera()
