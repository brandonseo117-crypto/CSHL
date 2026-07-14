from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from base import save_user_data

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/api/retrive-data", methods=['POST'])
def receive_data():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400

    save_user_data(data)
    return jsonify({'status': 'ok'})


if __name__ == "__main__":
    app.run(debug=True)
