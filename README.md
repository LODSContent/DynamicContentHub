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
# TODO document how the data folder works

## Installation

## Installation

1. Clone the repository:

```bash
git clone https://github.com/LODSContent/DynamicContentHub.git
cd DynamicContentHib
```

2. Set up a Python virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the application using Gunicorn:
```bash
gunicorn -b 0.0.0.0:5050 main:app
```

6. Access the app at `http://localhost:5050`

## Development
- **Frontend**: Located in the `static/` directory (CSS, JS).
- **Backend**: Flask application in `main.py` and utility functions in `utils.py`.
- **Templates**: HTML files in the `templates/` directory.

## Customizing the Footer and Logo

To personalize the footer and logo in the `index.html` file, follow these steps:

1. **Update the Footer Text**:
   - Open the `index.html` file located in the `templates` folder.
   - Locate the `<footer>` section near the bottom of the file:
     ```html
     <footer>
         <p>INSERT FOOTER HERE</p>
     </footer>
     ```
   - Replace the placeholder text (`Replace with your footer`) with your desired footer content.

2. **Replace the Logo**:
   - Place your custom logo image in the `static` folder.
   - Ensure the image is named `logo.png` or update the `src` attribute in the `<img>` tag inside the `<header>` section:
     ```html
     <img src=".{{ url_for('static', filename='logo.png') }}" alt="logo">
     ```
   - If you use a different file name, update the `filename` value accordingly.

3. **Save Your Changes**:
   - Save the updated `index.html` file.
   - Refresh your browser to see the changes.

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.