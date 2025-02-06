from flask import Flask, render_template, send_from_directory, request, jsonify
import json
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='.')

def load_blog_data():
    with open('data/data.json', 'r') as f:
        return json.load(f)

def save_blog_data(data):
    with open('data/data.json', 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/api/posts', methods=['GET', 'POST'])
def posts():
    if request.method == 'GET':
        blog_data = load_blog_data()
        return jsonify(blog_data['posts'])

    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    data = request.get_json()
    required_fields = ['title', 'category', 'content', 'image']

    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields. Required: {required_fields}"}), 400

    blog_data = load_blog_data()

    # Get the next available ID
    next_id = max([post['id'] for post in blog_data['posts']], default=0) + 1

    # Create new post
    new_post = {
        'id': next_id,
        'title': data['title'],
        'category': data['category'],
        'date': datetime.now().strftime('%Y-%m-%d'),
        'start': data.get('start', 'N/A'),
        'end': data.get('end', 'N/A'),
        'content': data['content'] if isinstance(data['content'], list) else [data['content']],
        'image': data['image']
    }

    # Add to posts
    blog_data['posts'].append(new_post)
    save_blog_data(blog_data)

    return jsonify({"message": "Post added successfully", "post": new_post}), 201

@app.route('/data/<path:path>')
def send_data(path):
    return send_from_directory('data', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5051)