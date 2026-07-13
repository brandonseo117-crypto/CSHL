from pathlib import Path
from PIL import Image, ImageStat
from dotenv import load_dotenv
import os

load_dotenv()
folder_path = os.getenv('IMAGE_FOLDER_PATH')
image_list = []


def color_stats(image):
    with Image.open(image).convert('RGB') as img:
        stats = ImageStat.Stat(img)

        avg_r = stats.mean[0]
        avg_g = stats.mean[1]
        avg_b = stats.mean[2]

        return avg_r, avg_g, avg_b


class StimulusImage:
    def __init__(self, image_name, red, green, blue):
        self.image_path = image_name
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
