import argparse
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser(description='Extract a real frame from a device video.')
parser.add_argument('video', type=Path, help='Original recording to extract from')
parser.add_argument('poster', type=Path, help='JPEG output path; update deviceDemo after replacing it')
parser.add_argument('--ffmpeg', default='ffmpeg', help='FFmpeg executable path')
parser.add_argument('--seconds', type=float, default=2, help='Frame time in seconds')
args = parser.parse_args()
subprocess.run([
    args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
    '-ss', str(args.seconds), '-i', str(args.video),
    '-frames:v', '1', '-q:v', '2', str(args.poster),
], check=True)
print('NomiFun device poster extracted:', args.poster.resolve())
