document.addEventListener('DOMContentLoaded', function() {
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

    // Category expansion
    const categoryHeaders = document.querySelectorAll('.category-header');

    categoryHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const items = header.nextElementSibling;
            const chevron = header.querySelector('.fa-chevron-down');

            // Toggle visibility
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
    const navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // In a real application, this would navigate to different posts
            console.log('Navigation clicked:', button.textContent);
        });
    });
});