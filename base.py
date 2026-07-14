import json
import os

FILE_PATH = "data.json"


def save_user_data(new_data):
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, "r") as file:
            try:
                current_data = json.load(file)
            except json.JSONDecodeError:
                current_data = []  # Fallback if file is empty/corrupted
    else:
        current_data = []

    current_data.append(new_data)

    with open(FILE_PATH, "w") as file:
        json.dump(current_data, file, indent=4)
