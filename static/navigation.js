// navigation.js
import { displayPost } from './postDisplay.js';

export function initializeNavigation() {
    console.log("Initializing Navigation")
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!window.posts || !window.posts.length) return;

              if (button.textContent === 'Previous Resource') {
                const currentIndex = window.posts.findIndex(post => post.id === window.currentPostId);
                const newIndex = currentIndex > 0 ? currentIndex - 1 : window.posts.length - 1;
                displayPost(window.posts[newIndex].id);
            } else if (button.textContent === 'Next Resource') {
                const currentIndex = window.posts.findIndex(post => post.id === window.currentPostId);
                const newIndex = currentIndex < window.posts.length - 1 ? currentIndex + 1 : 0;
                displayPost(window.posts[newIndex].id);
            } else if (button.textContent === 'Show Latest Resource') {
                displayPost(window.posts[window.posts.length - 1].id);
            }
        });
    });
}
