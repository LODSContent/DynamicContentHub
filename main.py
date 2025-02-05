from flask import Flask, render_template, send_from_directory, request, flash, redirect, url_for
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField
from wtforms.validators import DataRequired
import json
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='.')
app.secret_key = 'your-secret-key-here'  # Required for flash messages and CSRF

class BlogPostForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    category = StringField('Category', validators=[DataRequired()])
    content = TextAreaField('Content', validators=[DataRequired()])
    image_url = StringField('Image URL', validators=[DataRequired()])
    start_time = StringField('Start Time')
    end_time = StringField('End Time')

def load_blog_data():
    with open('data/data.json', 'r') as f:
        return json.load(f)

def save_blog_data(data):
    with open('data/data.json', 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def root():
    blog_data = load_blog_data()
    return render_template('index.html', posts=blog_data['posts'])

@app.route('/add_post', methods=['GET', 'POST'])
def add_post():
    form = BlogPostForm()
    if form.validate_on_submit():
        blog_data = load_blog_data()

        # Get the next available ID
        next_id = max([post['id'] for post in blog_data['posts']], default=0) + 1

        # Create new post
        new_post = {
            'id': next_id,
            'title': form.title.data,
            'category': form.category.data,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'start': form.start_time.data or 'N/A',
            'end': form.end_time.data or 'N/A',
            'content': [p.strip() for p in form.content.data.split('\n') if p.strip()],
            'image': form.image_url.data
        }

        # Add to posts
        blog_data['posts'].append(new_post)
        save_blog_data(blog_data)

        flash('Blog post added successfully!', 'success')
        return redirect(url_for('root'))

    return render_template('add_post.html', form=form)

@app.route('/data/<path:path>')
def send_data(path):
    return send_from_directory('data', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)