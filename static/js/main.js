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


    // Function to post /api/posts/latest/unread/ to be called by show latest resource button this updates the data.json on the backend the return is success or fail
    async function showLatestResource() {
        try {
            const response = await fetch('./api/posts/latest/unread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch latest resource');
            }
            const result = await response.json();
            console.log('Latest resource:', result);
        } catch (error) {
            console.error('Error fetching latest resource:', error);
        }
    }
    

    // Function to mark a category as hidden using toggle-hidden-category-endpoint
    async function toggleHiddenCategory(category) {
        try {
            const response = await fetch(`./api/categories/hide`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category })
            });
            if (!response.ok) {
                throw new Error('Failed to hide category');
            }

            const result = await response.json();
            console.log('Category hidden:', result);
        } catch (error) {
            console.error('Error hiding category:', error);
        }
    }


    function updateSidebar(newPosts, hiddenCategories) {
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

            // Hide specific categories if they are in the hiddenCategories array
            if (hiddenCategories.includes(category)) {
                itemsList.style.display = 'none'; // Hide specific categories
                header.querySelector('.fa-chevron-down').style.transform = 'rotate(-90deg)';
            }

            categoryPosts.forEach(post => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#" data-post-id="${post.id}" class="${post.read ? '' : 'unread'}">${post.title} <i class="fas fa-arrow-turn-up" style="${post.read ? '' : 'display: none;'}"></i></a>`;
                itemsList.appendChild(listItem);
            });

            // Add click handler for category expansion
            header.addEventListener('click', () => {
                const items = header.nextElementSibling;
                const chevron = header.querySelector('.fa-chevron-down');
                const isHidden = items.style.display === 'none';
        
 
                items.style.display = isHidden ? 'block' : 'none';
                chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
                console.log(`Category ${category} is now ${isHidden ? 'visible' : 'hidden'}`);
                toggleHiddenCategory(category); 
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
    
    // Function to mark a post as read 
    async function markPostAsRead(postId) {
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
        // Highlight code blocks in the dynamically loaded content
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(blogPost);
        } else {
            console.error('Prism.js is not loaded or initialized.');
        }
    }

    // function to fetch hidden categories
    async function fetchHiddenCategories() {
        try {
            const response = await fetch('./api/categories/hidden');
            if (!response.ok) {
                throw new Error('Failed to fetch hidden categories');
            }
            const hiddenCategories = await response.json();
            return hiddenCategories['hidden_categories'];
        } catch (error) {
            console.error('Error fetching hidden categories:', error);
            return []; // Return an empty array on error
        }
    }

    // Function to fetch and update posts
    async function fetchAndUpdatePosts() {
        try {
            const response = await fetch('./api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const newPosts = await response.json();
            const hiddenCategories = await fetchHiddenCategories(); 

            // Check if there are any changes
            if (JSON.stringify(newPosts) !== JSON.stringify(posts)) {
                console.log('Posts updated, refreshing display...');
                posts = newPosts;
                updateSidebar(posts, hiddenCategories);

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
                showLatestResource();
            }
        });
    });

    // Initial fetch and periodic updates
    fetchAndUpdatePosts();
    setInterval(fetchAndUpdatePosts, 1000);
});