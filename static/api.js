// api.js
import { updatePosts } from './postDisplay.js';

export async function fetchAndUpdatePosts() {
    try {
        const response = await fetch('./api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const newPosts = await response.json();
        updatePosts(newPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

export async function markPostAsRead(postId) {
    try {
        const response = await fetch(`./api/posts/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post_id: postId })
        });
        if (!response.ok) {
            throw new Error('Failed to mark post as read');
        }

        const result = await response.json();
        console.log('Post marked as read:', result);
    } catch (error) {
        console.error('Error marking post as read:', error);
    }
}

export function initializeAPI() {
    // Initial fetch and periodic updates
    fetchAndUpdatePosts();
    setInterval(fetchAndUpdatePosts, 1000);
}
