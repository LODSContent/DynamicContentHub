from flask import Flask, render_template, send_from_directory
import json

app = Flask(__name__, static_url_path='', static_folder='.')

def load_blog_data():
    with open('data/data.json', 'r') as f:
        return json.load(f)

@app.route('/')
def root():
    blog_data = load_blog_data()
    return render_template('index.html', posts=blog_data['posts'])

@app.route('/data/<path:path>')
def send_data(path):
    return send_from_directory('data', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)