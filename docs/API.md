# Scratch API Documentation

## Overview

The **DesignLab API** provides endpoints to manage posts, including retrieving, creating, and updating posts. Below are the available endpoints:

## Endpoints

### `GET /api/posts`

**Description:**
Retrieve all posts.

**Response:**
- **200 OK**: Returns a JSON array of posts.

**Example Response:**
```json
[
    {
        "id": 1,
        "title": "Sample Post",
        "category": "General",
        "content": "This is a sample post.",
        "read": false
    },
    ...
]
```

---

### `POST /api/posts`

**Description:**
Create a new post.

**Request Body:**
- **title** (string, required): The title of the post.
- **category** (string, required): The category of the post.
- **content** (string, required): The content of the post.

**Responses:**
- **201 Created**: Post added successfully.
    ```json
    {
        "message": "Post added successfully",
        "post": {
            "id": 2,
            "title": "New Post",
            "category": "Tech",
            "content": "Content of the new post.",
            "read": false
        }
    }
    ```
- **400 Bad Request**: Missing required fields or incorrect content type.
    ```json
    {
        "error": "Missing required fields. Required: ['title', 'category', 'content']"
    }
    ```

---

### `POST /api/posts/read`

**Description:**
Mark a post as read.

**Request Body:**
- **post_id** (integer, required): The ID of the post to mark as read.

**Responses:**
- **200 OK**: Post updated successfully.
    ```json
    {
        "message": "Post updated successfully",
        "post": {
            "id": 1,
            "title": "Sample Post",
            "category": "General",
            "content": "This is a sample post.",
            "read": true
        }
    }
    ```
- **400 Bad Request**: Missing required field: `post_id`.
    ```json
    {
        "error": "Missing required field: post_id"
    }
    ```
- **404 Not Found**: Post not found.
    ```json
    {
        "error": "Post not found"
    }
    ```

---

### `GET /api/logs`

**Description:**
Retrieve application logs.

**Response:**
- **200 OK**: Returns an array of log entries.

**Example Response:**
```json
[
    "2023-10-10 10:00:00 DEBUG Handling GET request for http://localhost:5051/api/posts",
    "2023-10-10 10:05:00 WARNING Post with id 3 not found",
    ...
]
```

---

### `GET /data/<path>`

**Description:**
Serve static files from the `data` directory.

**Parameters:**
- **path** (string): The path to the file within the `data` directory.

**Response:**
- **200 OK**: Returns the requested file.
- **404 Not Found**: File not found.

**Example:**
- `GET /data/images/logo.png` returns the `logo.png` file from the `data/images` directory.

---

## Error Handling

The API returns error responses with appropriate HTTP status codes and a JSON body containing an `error` message.

**Example Error Response:**
```json
{
    "error": "Description of the error."
}
```

## Logging

The application logs requests and actions in `app.log`. Logs include details about handling requests, warnings, and debugging information.

**Sample Log Entries:**
```
2023-10-10 10:00:00 DEBUG Handling GET request for http://localhost:5051/api/posts
2023-10-10 10:05:00 WARNING Post with id 3 not found
2023-10-10 10:10:00 DEBUG Marked post 2 as read
```

---

Feel free to reach out if you need further assistance or more detailed explanations for any of the endpoints!