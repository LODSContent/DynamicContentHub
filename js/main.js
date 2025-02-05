document.addEventListener('DOMContentLoaded', function() {
    // posts is already defined in the template
    let currentPostId = posts[posts.length - 1].id; // Start with the latest post

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
        const titleElement = categoriesContainer.querySelector('h2');
        categoriesContainer.innerHTML = ''; // Clear current content
        categoriesContainer.appendChild(titleElement); // Restore the title

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

            // Set initial display based on previous state
            itemsList.style.display = expandedCategories.has(category) ? 'block' : 'none';
            if (itemsList.style.display === 'none') {
                header.querySelector('i').style.transform = 'rotate(-90deg)';
            }

            categoryPosts.forEach(post => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#" data-post-id="${post.id}">${post.title} <i class="fas fa-arrow-right"></i></a>`;
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

    // Attach initial handlers
    attachPostLinkHandlers();

    // Function to check for updates
    async function checkForUpdates() {
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newPosts = await response.json();

            // Check if number of posts has changed
            if (newPosts.length !== posts.length) {
                console.log('New posts detected, updating sidebar...');
                posts = newPosts; // Update the global posts variable
                updateSidebar(newPosts);
                return;
            }

            // Check if any post content has changed
            const hasChanges = newPosts.some((newPost, index) => {
                return JSON.stringify(newPost) !== JSON.stringify(posts[index]);
            });

            if (hasChanges) {
                console.log('Post changes detected, updating sidebar...');
                posts = newPosts;
                updateSidebar(newPosts);
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    // Start periodic updates
    setInterval(checkForUpdates, 5000); // Check every 5 seconds

    // Navigation buttons functionality
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'Previous Blog') {
                navigatePost('prev');
            } else if (button.textContent === 'Next Blog') {
                navigatePost('next');
            } else if (button.textContent === 'Show Latest Blog') {
                displayPost(posts[posts.length - 1].id);
            }
        });
    });

    function navigatePost(direction) {
        const currentIndex = posts.findIndex(post => post.id === currentPostId);
        let newIndex;

        if (direction === 'next') {
            newIndex = currentIndex + 1 >= posts.length ? 0 : currentIndex + 1;
        } else {
            newIndex = currentIndex - 1 < 0 ? posts.length - 1 : currentIndex - 1;
        }

        displayPost(posts[newIndex].id);
    }

    function displayPost(postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        currentPostId = postId;

        // Update blog content
        document.querySelector('.blog-post h2').textContent = post.title;
        document.querySelector('.post-meta').innerHTML = `
            <p><strong>Date:</strong> ${post.date}</p>
            <p><strong>Start:</strong> ${post.start}</p>
            <p><strong>End:</strong> ${post.end}</p>
        `;

        // Update post content
        const contentHtml = post.content.map(paragraph => `<p>${paragraph}</p>`).join('');
        const imageHtml = `<img src="${post.image}" alt="Image for ${post.title}" />`;
        document.querySelector('.post-content').innerHTML = contentHtml + imageHtml;

        // Update active state in sidebar
        document.querySelectorAll('.category-items a').forEach(link => {
            if (parseInt(link.dataset.postId) === postId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
});