from flask import Flask, render_template, send_from_directory, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from datetime import datetime
import logging
from utils import (
    load_resource_data,
    save_resource_data,
    add_post
)


app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a',
                    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

# app.wsgi_app = ProxyFix(app.wsgi_app, x_for=2, x_proto=2, x_host=2, x_port=2, x_prefix=2)


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


@app.route('/api/posts/read', methods=['POST'])
def mark_post_as_read():
    app.logger.debug("Received request to mark a post as read")

    # Check JSON content type
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    data = request.get_json()
    if 'post_id' not in data:
        app.logger.warning("post_id not provided in the request body")
        return jsonify({"error": "Missing required field: post_id"}), 400

    post_id = data['post_id']
    app.logger.debug(f"Post ID to mark as read: {post_id}")

    resource_data = load_resource_data()
    app.logger.debug("Loaded resource data")

    post = next((post for post in resource_data['posts'] if post['id'] == post_id), None)
    if post is None:
        app.logger.warning(f"Post with id {post_id} not found")
        return jsonify({"error": "Post not found"}), 404

    post['read'] = True
    app.logger.debug(f"Marked post {post_id} as read")

    # Save the updated resource data back to the storage
    save_resource_data(resource_data)
    app.logger.debug("Saved updated resource data")

    return jsonify({"message": "Post updated successfully", "post": post}), 200


@app.route('/api/logs', methods=['GET'])
def get_logs():
    with open('app.log', 'r') as file:
        logs = file.readlines()
    return jsonify(logs)


@app.route('/data/<path:path>')
def send_data(path):
    return send_from_directory('data', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5051, debug=True)