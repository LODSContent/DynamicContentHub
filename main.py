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
    update_latest_resources,
    get_latest_resources
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

    # Check if data is a single post or a list of posts
    if isinstance(data, dict):  # Single post
        data = [data]
    elif not isinstance(data, list):  # Invalid format
        return jsonify({"error": "Request body must be a single post object or a list of post objects"}), 400

    required_fields = ['title', 'category', 'content']
    new_posts = []
    post_ids = []

    for post in data:
        # Validate required fields for each post
        if not all(field in post for field in required_fields):
            return jsonify({"error": f"Each post must contain the required fields: {required_fields}"}), 400

        new_post = add_post(post)
        new_posts.append(new_post)
        post_ids.append(new_post['id'])

    # Update the latest resources with the new post IDs
    update_latest_resources(post_ids)

    return jsonify({"message": "Posts added successfully", "posts": new_posts}), 201


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


@app.route('/api/posts/latest/unread', methods=['POST'])
@log_request
def mark_latest_posts_as_unread():
    # Get the latest resource IDs
    latest_post_ids = get_latest_resources()

    # Load the resource data
    resource_data = load_resource_data()

    # Mark the posts as unread
    updated_posts = []
    for post in resource_data.get('posts', []):
        if post['id'] in latest_post_ids:
            post['read'] = False
            updated_posts.append(post)

    # Save the updated resource data
    save_resource_data(resource_data)

    return jsonify({
        "message": "Latest posts marked as unread successfully",
        "updated_posts": updated_posts
    }), 200
    
    

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