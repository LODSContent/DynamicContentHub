from bs4 import BeautifulSoup
import json

def extract_body(filename: str) -> str:
    '''Function to extract body content of an HTML file using BeautifulSoup.'''
    with open(filename, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Remove the first paragraph tag from the body.
    soup.body.p.extract()
    # Combine all body content into a single string.
    body_content = ''.join(str(item) for item in soup.body.contents)

    return body_content


def load_resource_data() -> dict:
    '''Function to load JSON data from a file.'''
    try:
        with open('data/data.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        # Return an empty dictionary if the file does not exist.
        return {'posts': []}


def save_resource_data(data: dict) -> None:
    '''Function to save JSON data to a file.'''
    with open('data/data.json', 'w') as file:
        json.dump(data, file, indent=2)


def replace_img_src(content: str) -> str:
    '''Function to replace the src attribute of img tags in the content.'''
    soup = BeautifulSoup(content, 'html.parser')
    for img_tag in soup.find_all('img'):
        # Extract the filename from the src attribute.
        filename = img_tag['src']
        # Replace the src attribute with the new path.
        img_tag['src'] = f'./data/resources/media/{filename}'
    return str(soup)


def handle_content(filename: str, title: str) -> str:
    '''Function to handle different type of content based on the file extension.'''
    if filename.endswith('.html'):
        # Extract the body content if it's an HTML file.
        body_content = extract_body(f'data/resources/{filename}')
        # Replace img src attributes in the body content.
        return replace_img_src(body_content)
    elif filename.endswith('.png'):
        # Return an img tag if it's an image file.
        return f'<img src="./data/resources/{filename}" alt="Image for {title}" />'
    else:
        raise ValueError('Unsupported file format.')


def add_post(data: dict) -> dict:
    '''Function to add a new post to the existing JSON data.'''
    resource_data = load_resource_data()

    # Get the next available ID.
    max_id = max((post['id'] for post in resource_data['posts']), default=0)
    next_id = max_id + 1

    # Create new post.
    new_post = {
        'id': next_id,
        'read': False,
        'title': data['title'],
        'category': data['category'],
        'content': handle_content(data['content'], data['title']),
    }

    # Add new post to the list and save data to file.
    resource_data['posts'].append(new_post)
    save_resource_data(resource_data)

    return new_post


def get_hidden_categories(resource_data):
    """Retrieve the list of hidden categories."""
    return resource_data.get('hidden_categories', [])


def toggle_hidden_category(resource_data, category):
    """Toggle a category in the hidden categories list."""
    hidden_categories = get_hidden_categories(resource_data)

    if category in hidden_categories:
        hidden_categories.remove(category)
    else:
        hidden_categories.append(category)

    resource_data['hidden_categories'] = hidden_categories
    return hidden_categories


def validate_hidden_category_request(data):
    """Validate the request data for hidden categories."""
    category = data.get('category')
    action = data.get('action')

    if not category or not isinstance(category, str):
        return "Invalid or missing 'category' field. It must be a string."
    if action not in ['add', 'remove']:
        return "Invalid or missing 'action' field. It must be 'add' or 'remove'."

    return None