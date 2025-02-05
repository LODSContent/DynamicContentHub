# API Documentation

## Endpoints

### Blog Posts

#### GET /api/posts

Retrieves all blog posts from the system.

**Response Format:**
```json
[
  {
    "id": 1,
    "title": "Post Title",
    "category": "Category Name",
    "date": "YYYY-MM-DD",
    "start": "Start Time",
    "end": "End Time",
    "content": [
      "Paragraph 1",
      "Paragraph 2"
    ],
    "image": "https://image-url.com"
  }
]
```

#### POST /api/posts

Creates a new blog post.

**Request Body:**
```json
{
  "title": "Post Title",
  "category": "Category Name",
  "content": ["Paragraph 1", "Paragraph 2"],
  "image": "https://image-url.com",
  "start": "Start Time", // Optional
  "end": "End Time"      // Optional
}
```

**Response:**
```json
{
  "message": "Post added successfully",
  "post": {
    "id": 1,
    "title": "Post Title",
    "category": "Category Name",
    "date": "YYYY-MM-DD",
    "start": "Start Time",
    "end": "End Time",
    "content": ["Paragraph 1", "Paragraph 2"],
    "image": "https://image-url.com"
  }
}
```

### Error Responses

#### 400 Bad Request
When required fields are missing or invalid:
```json
{
  "error": "Missing required fields. Required: ['title', 'category', 'content', 'image']"
}
```

#### 500 Internal Server Error
When server encounters an error:
```json
{
  "error": "Internal server error message"
}
```

## Real-time Updates
The frontend polls the `/api/posts` endpoint every 5 seconds to check for updates. When changes are detected, the UI automatically updates to reflect the new content.

## Data Format Requirements

- `title`: String, required
- `category`: String, required
- `content`: Array of strings, required
- `image`: URL string, required
- `start`: String, optional
- `end`: String, optional
