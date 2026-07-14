from pathlib import Path
from PIL import Image
from dotenv import load_dotenv
import os
import colorsys

load_dotenv()
folder_path = os.getenv('IMAGE_FOLDER_PATH')
image_list = []


def score_hue(image_path, target_hue_deg, hue_window=45, saturation_boost=1.4):
    with Image.open(image_path).convert('RGB') as img:
        sample = img.resize((128, 128))
        pixels = list(sample.get_flattened_data())

    total_weight = 0.0
    weighted_score = 0.0

    for r, g, b in pixels:
        r, g, b = [channel / 255.0 for channel in (r, g, b)]
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        hue_deg = h * 360
        hue_dist = min(abs(hue_deg - target_hue_deg),
                       360 - abs(hue_deg - target_hue_deg))
        hue_match = max(0.0, 1.0 - (hue_dist / hue_window))
        pixel_weight = (s * saturation_boost) * v

        if pixel_weight <= 0:
            continue

        weighted_score += hue_match * pixel_weight
        total_weight += pixel_weight

    if total_weight == 0:
        return 0.0

    return weighted_score / total_weight


def score_red(image_path):
    return score_hue(image_path, 0, hue_window=35)


def score_green(image_path):
    return score_hue(image_path, 120, hue_window=45)


def score_blue(image_path):
    return score_hue(image_path, 240, hue_window=35)


def color_stats(image):
    red = score_red(image)
    green = score_green(image)
    blue = score_blue(image)

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
