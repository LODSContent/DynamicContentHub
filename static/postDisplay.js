// postDisplay.js
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
            listItem.innerHTML = `<a href="#" data-post-id="${post.id}" class="${post.read ? '' : 'unread'}">${post.title} <i class="fas fa-arrow-turn-up" style="${post.read ? '' : 'display: none;'}"></i></a>`;
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

    blogPost.innerHTML = `
        <h2>${post.title}</h2>
        <div class="post-content">
            ${post.content}
        </div>
    `;

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
