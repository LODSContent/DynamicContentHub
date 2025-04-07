import os

# Define the directory where the JS files will be created
# You can change this to your desired path
output_dir = "modules"

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Define the content for each JavaScript module
files = {
    "main.js": """// main.js
import { initializeSidebar } from './sidebar.js';
import { initializePostDisplay } from './postDisplay.js';
import { initializeAPI } from './api.js';
import { initializeNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeAPI();
    initializeSidebar();
    initializePostDisplay();
    initializeNavigation();
});
""",
    "sidebar.js": """// sidebar.js
import { attachPostLinkHandlers, updateSidebarCategories } from './postDisplay.js';

export function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const blogNav = document.querySelector('.blog-navigation');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            content.classList.toggle('active');
            sidebarToggle.classList.toggle('active');
            blogNav.classList.toggle('active');
        });
    }
}
""",
    "postDisplay.js": """// postDisplay.js
import { markPostAsRead, fetchAndUpdatePosts } from './api.js';

let posts = [];  // Shared state
let currentPostId = null;

export function initializePostDisplay() {
    fetchAndUpdatePosts().then(() => {
        if (posts.length > 0) {
            displayPost(posts[posts.length - 1].id);
        }
    });
}

export function attachPostLinkHandlers() {
    document.querySelectorAll('.category-items a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = parseInt(link.dataset.postId);
            if (postId) {
                displayPost(postId);
                document.querySelectorAll('.category-items a').forEach(a => {
                    a.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });
}

export function updateSidebarCategories(newPosts) {
    const categoriesContainer = document.querySelector('.sidebar');
    const titleElement = document.createElement('h2');
    titleElement.textContent = 'Resources';
    categoriesContainer.innerHTML = ''; // Clear current content
    categoriesContainer.appendChild(titleElement);

    // Group posts by category
    const categories = {};
    newPosts.forEach(post => {
        if (!categories[post.category]) {
            categories[post.category] = [];
        }
        categories[post.category].push(post);
    });

    // Create category elements
    Object.entries(categories).forEach(([category, categoryPosts]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const unreadCount = categoryPosts.filter(post => !post.read).length;

        const header = document.createElement('h3');
        header.className = 'category-header';
        header.innerHTML = `
            <i class="fas fa-chevron-down"></i>
            ${category} <span class="badge" data-badge="${unreadCount}" style="${unreadCount > 0 ? '' : 'display: none;'}"></span>
        `;

        const itemsList = document.createElement('ul');
        itemsList.className = 'category-items';

        categoryPosts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.innerHTML = \`<a href="#" data-post-id="\${post.id}" class="\${post.read ? '' : 'unread'}">\${post.title} <i class="fas fa-arrow-turn-up" style="\${post.read ? '' : 'display: none;'}"></i></a>\`;
            itemsList.appendChild(listItem);
        });

        // Add click handler for category expansion
        header.addEventListener('click', () => {
            const items = header.nextElementSibling;
            const chevron = header.querySelector('.fa-chevron-down');
            const isHidden = items.style.display === 'none' || !items.style.display;

            items.style.display = isHidden ? 'block' : 'none';
            chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        });

        categoryDiv.appendChild(header);
        categoryDiv.appendChild(itemsList);
        categoriesContainer.appendChild(categoryDiv);
    });

    // Attach click handlers for all post links
    attachPostLinkHandlers();

    // Maintain active class for the current post
    if (currentPostId) {
        document.querySelectorAll('.category-items a').forEach(link => {
            if (parseInt(link.dataset.postId) === currentPostId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

export function displayPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    currentPostId = postId;
    const blogPost = document.querySelector('.blog-post');

    blogPost.innerHTML = \`
        <h2>\${post.title}</h2>
        <div class="post-content">
            \${post.content}
        </div>
    \`;

    // Update active state in sidebar
    document.querySelectorAll('.category-items a').forEach(link => {
        if (parseInt(link.dataset.postId) === postId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mark the post as read
    markPostAsRead(postId);

    // Highlight code blocks in the dynamically loaded content
    if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(blogPost);
    } else {
        console.error('Prism.js is not loaded or initialized.');
    }
}

export function updatePosts(newPosts) {
    if (JSON.stringify(newPosts) !== JSON.stringify(posts)) {
        console.log('Posts updated, refreshing display...');
        posts = newPosts;
        updateSidebarCategories(posts);

        // If no post is currently displayed, show the latest post
        if (!currentPostId && posts.length > 0) {
            displayPost(posts[posts.length - 1].id);
        }
    }
}
""",
    "api.js": """// api.js
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
""",
    "navigation.js": """// navigation.js
import { displayPost } from './postDisplay.js';

export function initializeNavigation() {
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
""",
    "utils.js": """// utils.js

export function createElement(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    for (let key in attributes) {
        if (key.startsWith('on') && typeof attributes[key] === 'function') {
            element.addEventListener(key.substring(2), attributes[key]);
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}

// Add more utility functions as needed
"""
}

# Create each file with its respective content
for filename, content in files.items():
    file_path = os.path.join(output_dir, filename)
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Created: {file_path}")

print("\nAll JavaScript modules have been successfully created!")