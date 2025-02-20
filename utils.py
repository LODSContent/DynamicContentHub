from bs4 import BeautifulSoup
import json

def extract_body(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        data = file.read()

    soup = BeautifulSoup(data, 'html.parser')
    soup.body.p.extract()
    body_content = ''.join(str(item) for item in soup.body.contents)

    return body_content


def load_resource_data():
    with open('data/data.json', 'r') as f:
        return json.load(f)


def save_resource_data(data):
    with open('data/data.json', 'w') as f:
        json.dump(data, f, indent=2)


def handle_content(file, title):
    filename = file
    content = ''
    
    if filename.endswith('.html'):
        content = extract_body(f'data/resources/{filename}')
    elif filename.endswith('.png'):
        content = f'<img src="./data/resources/{filename}" alt="Image for {title}" />'
       
    return content


def add_post(data):
    resource_data = load_resource_data()

    # Get the next available ID
    next_id = max([post['id'] for post in resource_data['posts']], default=0) + 1
    
    # Create new post
    new_post = {
        'id': next_id,
        'title': data['title'],
        'category': data['category'],
        'content': handle_content(data['content'], data['title']),
    }

    # Add to posts and save data
    resource_data['posts'].append(new_post)
    save_resource_data(resource_data)
    
    return new_post
