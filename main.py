from flask import Flask, render_template, send_from_directory, request, jsonify
from datetime import datetime
from utils import (
    load_resource_data,
    add_post
)

app = Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/api/posts', methods=['GET'])
def get_posts():
    resource_data = load_resource_data()
    return jsonify(resource_data['posts'])

@app.route('/api/posts', methods=['POST'])
def create_post():
    # Check JSON content type
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    data = request.get_json()
    required_fields = ['title', 'category', 'content']
    
    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields. Required: {required_fields}"}), 400
    
    new_post = add_post(data)

    return jsonify({"message": "Post added successfully", "post": new_post}), 201

@app.route('/data/<path:path>')
def send_data(path):
    return send_from_directory('data', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5051)