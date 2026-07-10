from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/api/retrive-data")
def receive_data():
    data = request.get_json()


if __name__ == "__main__":
    app.run(debug=True)
