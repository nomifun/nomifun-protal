from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
qa = root / 'docs' / 'qa'
# Extract the visible video frame from the browser screenshot. The public
# demo is unchanged; only the player's letterboxing and controls are cropped.
raw = Image.open(qa / 'source-robot-fullscreen.png').convert('RGB')
raw.crop((0, 34, 1080, 624)).save(root / 'public' / 'images' / 'product' / 'xiaozhi-yuntai-poster.png')

print('NomiFun device poster written; media capture:', raw.size)
