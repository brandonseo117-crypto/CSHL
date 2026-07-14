from pathlib import Path
from PIL import Image, ImageStat
from dotenv import load_dotenv
import os
import colorsys

load_dotenv()
folder_path = os.getenv('IMAGE_FOLDER_PATH')
image_list = []


def color_score(r, g, b, target_hue_deg):
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    hue_deg = h * 360
    hue_dist = min(abs(hue_deg - target_hue_deg),
                   360 - abs(hue_deg - target_hue_deg))
    hue_match = 1 - (hue_dist / 180)
    return hue_match * s * v


def color_stats(image):
    with Image.open(image).convert('RGB') as img:
        stats = ImageStat.Stat(img)
        r, g, b = [x / 255.0 for x in stats.mean]

    red = color_score(r, g, b, 0)
    green = color_score(r, g, b, 120)
    blue = color_score(r, g, b, 240)

    return red, green, blue


class StimulusImage:
    def __init__(self, image_name, red, green, blue):
        self.image_name = image_name
        self.red = red
        self.green = green
        self.blue = blue


iterable_folder = Path(folder_path).iterdir()

for image in iterable_folder:
    avg_colors = color_stats(image=image)
    r, g, b = avg_colors
    image_list.append(StimulusImage(
        image_name=image.name, red=r, green=g, blue=b)
    )

most_red = sorted(image_list, key=lambda x: x.red, reverse=True)
most_green = sorted(image_list, key=lambda x: x.green, reverse=True)
most_blue = sorted(image_list, key=lambda x: x.blue, reverse=True)

print('Red images:')
for image in most_red[:10]:
    if image == most_red[9]:
        print(f'{image.image_name}\n')
    else:
        print(image.image_name)

print('Green images:')
for image in most_green[:10]:
    if image == most_green[9]:
        print(f'{image.image_name}\n')
    else:
        print(image.image_name)

print('Blue images:')
for image in most_blue[:10]:
    if image == most_blue[9]:
        print(f'{image.image_name}\n')
    else:
        print(image.image_name)
