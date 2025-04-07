// sidebar.js
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
