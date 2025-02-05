document.addEventListener('DOMContentLoaded', function() {
    let currentPostId = 3; // Start with the Foothills trail
    let posts = [];

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const blogNav = document.querySelector('.blog-navigation');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        content.classList.toggle('active');
        sidebarToggle.classList.toggle('active');
        blogNav.classList.toggle('active');
    });

    // Load blog data
    fetch('/data/data.json')
        .then(response => response.json())
        .then(data => {
            posts = data.posts;
            setupSidebar(posts);
            displayPost(currentPostId);
        })
        .catch(error => console.error('Error loading blog data:', error));

    // Category expansion
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const items = header.nextElementSibling;
            const chevron = header.querySelector('.fa-chevron-down');
            if (items.style.display === 'none') {
                items.style.display = 'block';
                chevron.style.transform = 'rotate(0deg)';
            } else {
                items.style.display = 'none';
                chevron.style.transform = 'rotate(-90deg)';
            }
        });
    });

    // Navigation buttons functionality
    document.querySelectorAll('.nav-button').forEach(button => {
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

    function setupSidebar(posts) {
        const categories = {};
        posts.forEach(post => {
            if (!categories[post.category]) {
                categories[post.category] = [];
            }
            categories[post.category].push(post);
        });

        // Update sidebar links with click handlers
        document.querySelectorAll('.category-items a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postTitle = link.textContent.trim().replace(' →', '').replace(/\s*[→➜]\s*$/, '').replace(/\s+$/, '');
                const post = posts.find(p => p.title.toLowerCase() === postTitle.toLowerCase());
                if (post) {
                    displayPost(post.id);
                    document.querySelectorAll('.category-items a').forEach(a => {
                        a.classList.remove('active');
                    });
                    link.classList.add('active');
                }
            });
        });
    }

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
            const linkText = link.textContent.trim().replace(/\s*[→➜]\s*$/, '').replace(/\s+$/, '');
            if (linkText.toLowerCase() === post.title.toLowerCase()) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
});