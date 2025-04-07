// main.js
import { initializeSidebar } from './sidebar.js';
import { initializePostDisplay } from './postDisplay.js';
import { initializeAPI } from './api.js';
import { initializeNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSidebar();
    initializePostDisplay();
    initializeAPI();
});
