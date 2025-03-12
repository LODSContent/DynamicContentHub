document.addEventListener('DOMContentLoaded', function() {
    let posts = [];  // Initialize empty posts array
    let currentPostId = null;

    // Sidebar toggle functionality
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

    // Track expanded categories
    const expandedCategories = new Set();

    function attachPostLinkHandlers() {
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

    function updateSidebar(newPosts) {
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

            const header = document.createElement('h3');
            header.className = 'category-header';
            header.innerHTML = `
                <i class="fas fa-chevron-down"></i>
                ${category}
            `;

            const itemsList = document.createElement('ul');
            itemsList.className = 'category-items';

            categoryPosts.forEach(post => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#" data-post-id="${post.id}" class="${post.read ? '' : 'unread'}">${post.title} <i class="fas fa-arrow-turn-up"></i></a>`;
                itemsList.appendChild(listItem);
            });

            // Add click handler for category expansion
            header.addEventListener('click', () => {
                const items = header.nextElementSibling;
                const chevron = header.querySelector('.fa-chevron-down');
                const isHidden = items.style.display === 'none';

                items.style.display = isHidden ? 'block' : 'none';
                chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';

                if (isHidden) {
                    expandedCategories.add(category);
                } else {
                    expandedCategories.delete(category);
                }
            });

            categoryDiv.appendChild(header);
            categoryDiv.appendChild(itemsList);
            categoriesContainer.appendChild(categoryDiv);
        });

        // Attach click handlers for all post links
        attachPostLinkHandlers();
    }

    async function markPostAsRead(postId) {
        try {
            const response = await fetch(`./api/posts/${postId}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ read: true })
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

    function displayPost(postId) {
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
    }

    // Function to fetch and update posts
    async function fetchAndUpdatePosts() {
        try {
            const response = await fetch('./api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const newPosts = await response.json();

            // Check if there are any changes
            if (JSON.stringify(newPosts) !== JSON.stringify(posts)) {
                console.log('Posts updated, refreshing display...');
                posts = newPosts;
                updateSidebar(posts);

                // If no post is currently displayed or it's the first load, show the latest post
                if (!currentPostId && posts.length > 0) {
                    displayPost(posts[posts.length - 1].id);
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    // Navigation buttons functionality
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!posts.length) return;

            if (button.textContent === 'Previous Resource') {
                const currentIndex = posts.findIndex(post => post.id === currentPostId);
                const newIndex = currentIndex > 0 ? currentIndex - 1 : posts.length - 1;
                displayPost(posts[newIndex].id);
            } else if (button.textContent === 'Next Resource') {
                const currentIndex = posts.findIndex(post => post.id === currentPostId);
                const newIndex = currentIndex < posts.length - 1 ? currentIndex + 1 : 0;
                displayPost(posts[newIndex].id);
            } else if (button.textContent === 'Show Latest Resource') {
                displayPost(posts[posts.length - 1].id);
            }
        });
    });

    // Initial fetch and periodic updates
    fetchAndUpdatePosts();
    setInterval(fetchAndUpdatePosts, 3000);
});