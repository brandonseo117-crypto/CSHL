from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

load_dotenv(override=True)

app = Flask(__name__)
CORS(app)
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(os.getenv("MONGO_URI"))

db = client["my_app_database"]
incoming_data_collection = db["user_submissions"]


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/api/retrive-data", methods=['POST'])
def receive_json_data():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        result = incoming_data_collection.insert_one(data)

        return jsonify({
            "message": "Data saved securely!",
            "inserted_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        # Look for this in your terminal logs!
        print("Actual Database Error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
