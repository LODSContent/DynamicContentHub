# DynamicContentHub
DynamicContentHub is a Flask-based web application that dynamically displays categorized resources and posts. It allows users to browse, view, and interact with content in real-time.
## Features

- **Dynamic Content Management**: Fetch and display categorized resources and blog posts dynamically.
- **Real-Time Updates**: Automatically updates the UI when new content is added.
- **Interactive Sidebar**: Expandable categories for easy navigation.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **RESTful API**: Provides endpoints for retrieving and creating posts.

## Project Structure

```
DesignLab/
├── main.py               # Main Flask application
├── utils.py              # Utility functions for handling content and data
├── templates/            # HTML templates for rendering views
├── static/               # Static assets (CSS, JS, images)
├── data/                 # Data storage for posts and resources
├── docs/                 # Documentation files
├── requirements.txt      # Python dependencies
├── Dockerfile            # Docker configuration
├── .gitignore            # Git ignore rules
└── .dockerignore         # Docker ignore rules
```

## API Endpoints

### GET `/api/posts`
Retrieves all blog posts.
- **Response**: JSON array of posts.
### POST `/api/posts`
Creates a new blog post.
- **Request Body**:
  ```json
  {
    "title": "Post Title",
    "category": "Category Name",
    "content": "Content or file path"
  }
  ```

- **Response**: JSON object with the created post.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/DesignLab.git
cd DesignLab
```


2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python main.py
```

4. Access the app at `http://localhost:5050`

## Development
- **Frontend**: Located in the `static/` directory (CSS, JS).
- **Backend**: Flask application in `main.py` and utility functions in `utils.py`.
- **Templates**: HTML files in the `templates/` directory.
## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request.
## License

This project is licensed under the MIT License. See the `LICENSE` file for details.