from functools import wraps
from flask import Flask, render_template, send_from_directory, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from datetime import datetime
import logging
from utils import (
    load_resource_data,
    save_resource_data,
    add_post,
    get_hidden_categories,
    toggle_hidden_category,
    validate_hidden_category_request
)


def respond_with_error(message, status_code):
    return jsonify({"error": message}), status_code


def log_request(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        app.logger.debug(f"Handling {request.method} request for {request.url}")
        return func(*args, **kwargs)
    return wrapper


app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a',
                    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')


@app.route('/')
@log_request
def root():
    return render_template('index.html')


@app.route('/api/posts', methods=['GET'])
@log_request
def get_posts():
    resource_data = load_resource_data()
    return jsonify(resource_data['posts'])


@app.route('/api/posts', methods=['POST'])
@log_request
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
@log_request
def mark_post_as_read():
    data = request.get_json()
    if not data:
        return respond_with_error("Content-Type must be application/json", 400)

    post_id = data.get('post_id')
    if not post_id:
        app.logger.warning("post_id not provided in the request body")
        return respond_with_error("Missing required field: post_id", 400)
    
    app.logger.debug(f"Post ID to mark as read: {post_id}")
    
    resource_data = load_resource_data()
    app.logger.debug("Loaded resource data")
    
    post = next((post for post in resource_data.get('posts', []) if post['id'] == post_id), None)
    if not post:
        app.logger.warning(f"Post with id {post_id} not found")
        return respond_with_error("Post not found", 404)
    
    post['read'] = True
    app.logger.debug(f"Marked post {post_id} as read")
    
    save_resource_data(resource_data)
    app.logger.debug("Saved updated resource data")
    
    return jsonify({"message": "Post updated successfully", "post": post}), 200


# GET endpoint for /api/hidden-categories
@app.route('/api/categories/hidden', methods=['GET'])
@log_request
def get_hidden_categories_endpoint():
    resource_data = load_resource_data()
    hidden_categories = get_hidden_categories(resource_data)
    return jsonify({"hidden_categories": hidden_categories}), 200



@app.route('/api/categories/hide', methods=['POST'])
@log_request
def toggle_hidden_category_endpoint():
    resource_data = load_resource_data()

    # Check JSON content type
    if not request.is_json:
        return respond_with_error("Content-Type must be application/json", 400)

    data = request.get_json()

    # Validate the request data
    category = data.get('category')
    if not category or not isinstance(category, str):
        return respond_with_error("Invalid or missing 'category' field. It must be a string.", 400)

    # Toggle the hidden category
    hidden_categories = toggle_hidden_category(resource_data, category)
    save_resource_data(resource_data)

    return jsonify({
        "message": f"Category '{category}' toggled successfully",
        "hidden_categories": hidden_categories
    }), 200


@app.route('/api/logs', methods=['GET'])
def get_logs():
    with open('app.log', 'r') as file:
        logs = file.readlines()
    return jsonify(logs)


@app.route('/data/<path:path>')
@log_request
def send_data(path):
    return send_from_directory('data', path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5051, debug=True)