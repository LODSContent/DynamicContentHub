# Dynamic Blog Application

A Flask-based blog application with real-time content updates and dynamic category management.

## Architecture Overview

The application follows a client-server architecture with the following components:

```
[Client Browser] <----> [Flask Server] <----> [JSON Data Store]
     |                       |
     |                      |
[Dynamic UI] <-----> [RESTful API]
```

## Key Components

1. **Frontend Layer**
   - Dynamic sidebar with category management
   - Real-time content updates (5-second polling)
   - Responsive design with mobile support
   - Client-side routing and state management

2. **Backend Layer**
   - Flask web server
   - RESTful API endpoints
   - JSON-based data persistence
   - Static file serving

3. **Data Layer**
   - JSON file storage
   - Category-based content organization
   - Post metadata management

## Features

- 📱 Responsive design that works on desktop and mobile
- 🔄 Real-time content updates without page refresh
- 📂 Category-based post organization
- 📝 Rich content support with images
- ⚡ Fast and lightweight
- 🎨 Clean and modern UI

## File Structure

```
├── assets/
│   └── logo.svg              # Application logo
├── css/
│   └── style.css            # Application styles
├── data/
│   └── data.json            # Blog post data storage
├── js/
│   └── main.js              # Frontend JavaScript
├── templates/
│   ├── add_post.html        # Post creation template
│   └── index.html           # Main application template
├── main.py                  # Flask application server
└── gunicorn_config.py       # Production server configuration
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install flask flask-sqlalchemy gunicorn flask-wtf
   ```
3. Start the development server:
   ```bash
   python main.py
   ```
4. For production, use Gunicorn:
   ```bash
   gunicorn main:app -c gunicorn_config.py
   ```

## API Documentation

### Endpoints

#### GET /api/posts
Retrieves all blog posts

Response:
```json
[
  {
    "id": 1,
    "title": "Post Title",
    "category": "Category",
    "date": "YYYY-MM-DD",
    "start": "start time",
    "end": "end time",
    "content": ["paragraph1", "paragraph2"],
    "image": "image_url"
  }
]
```

#### POST /api/posts
Creates a new blog post

Request Body:
```json
{
  "title": "Post Title",
  "category": "Category",
  "content": ["paragraph1", "paragraph2"],
  "image": "image_url",
  "start": "optional start time",
  "end": "optional end time"
}
```

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Flask (Python)
- **Server**: Gunicorn
- **Data Storage**: JSON file system
- **UI Framework**: Custom CSS with Flexbox

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
