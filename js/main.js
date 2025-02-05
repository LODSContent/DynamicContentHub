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

    // Category expansion
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        const items = header.nextElementSibling;
        const chevron = header.querySelector('.fa-chevron-down');

        header.addEventListener('click', () => {
            const isHidden = items.style.display === 'none';
            items.style.display = isHidden ? 'block' : 'none';
            chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        });
    });

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

    // Setup sidebar links
    document.querySelectorAll('.category-items a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = parseInt(link.dataset.postId);
            if (postId) {
                displayPost(postId);
                // Update active state
                document.querySelectorAll('.category-items a').forEach(a => {
                    a.classList.remove('active');
                });
                link.classList.add('active');
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
            const linkPostId = parseInt(link.dataset.postId);
            if (linkPostId === postId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
});