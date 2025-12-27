// API Configuration
const PROXY_API_URL = 'http://localhost:3000/api/tasks';

// Global state - store all fetched tasks
let allTasks = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const loadBtn = document.getElementById('loadBtn');
const themeToggle = document.getElementById('themeToggle');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const resultsContainer = document.getElementById('resultsContainer');

// Initialize theme from localStorage or default to light
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Initialize theme on page load
initTheme();

// Initialize event listeners
loadBtn.addEventListener('click', handleLoadTasks);
themeToggle.addEventListener('click', toggleTheme);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLoadTasks();
    }
});

// Add input event listener for real-time search (title only)
searchInput.addEventListener('input', () => {
    applyFilters();
});

// Add change event listener for status filter
statusFilter.addEventListener('change', () => {
    applyFilters();
});

/**
 * Main handler for loading tasks
 */
async function handleLoadTasks() {
    // Clear previous results and errors
    clearResults();
    hideError();
    
    // Show loading state
    showLoading();
    setButtonDisabled(true);
    
    try {
        const tasks = await fetchTasks();
        // Store all tasks in global state
        allTasks = tasks;
        // Apply current search and filter
        applyFilters();
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
        setButtonDisabled(false);
    }
}

/**
 * Fetches tasks from proxy API
 * @returns {Promise<Array>} Array of task objects
 */
async function fetchTasks() {
    try {
        const response = await fetch(PROXY_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Handle authentication errors
        if (response.status === 401) {
            throw new Error('Authentication failed. Please check your API token.');
        }
        
        if (response.status === 403) {
            throw new Error('Access forbidden. Please verify your token has the correct permissions.');
        }
        
        // Handle other errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return all tasks (no filtering on API side)
        return data.results || [];
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please make sure the server is running on http://localhost:3000');
        }
        throw error;
    }
}

/**
 * Extracts task name from Notion page object
 * @param {Object} task - Notion page object
 * @returns {string} Task name
 */
function getTaskName(task) {
    const properties = task.properties || {};
    return properties.Name?.title?.[0]?.plain_text || "Untitled Task";
}

/**
 * Extracts task status from Notion page object
 * @param {Object} task - Notion page object
 * @returns {string} Task status
 */
function getTaskStatus(task) {
    const properties = task.properties || {};
    let status = "No Status";
    
    if (properties.Status && properties.Status.select) {
        status = properties.Status.select.name;
    }
    
    return status;
}

/**
 * Applies both search (title) and filter (status) to tasks
 */
function applyFilters() {
    const searchQuery = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    let filtered = allTasks;

    // Filter by title (search)
    if (searchQuery) {
        filtered = filtered.filter(task => {
            const title =
                task.properties.Name?.title?.[0]?.plain_text?.toLowerCase() || "";
            return title.includes(searchQuery);
        });
    }

    // Filter by status
    if (selectedStatus) {
        filtered = filtered.filter(task => {
            const status =
                task.properties.Status?.status?.name || "";
            return status === selectedStatus;
        });
    }

    renderTasks(filtered);
}

/**
 * Renders tasks in the results container
 * @param {Array} tasks - Array of task objects
 */
function renderTasks(tasks) {
    clearResults();
    
    if (tasks.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <p>No matching tasks found</p>
            </div>
        `;
        return;
    }
    
    tasks.forEach(task => {
        console.log("Notion Task:", task);

        const properties = task.properties || {};

        const title =
            properties.Name?.title?.[0]?.plain_text || "Untitled Task";

        let status = "No Status";

        if (
            properties.Status &&
            properties.Status.type === "status" &&
            properties.Status.status
        ) {
            status = properties.Status.status.name;
        }

        const taskCard = document.createElement("div");
        taskCard.className = "task-card";

        taskCard.innerHTML = `
            <h3>${escapeHtml(title)}</h3>
            <span class="status ${status.replace(/\s+/g, "-")}">${escapeHtml(status)}</span>
        `;

        resultsContainer.appendChild(taskCard);
    });
}

/**
 * Escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Shows loading indicator
 */
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

/**
 * Hides loading indicator
 */
function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

/**
 * Hides error message
 */
function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

/**
 * Clears results container
 */
function clearResults() {
    resultsContainer.innerHTML = '';
}

/**
 * Sets button disabled state
 * @param {boolean} disabled - Whether button should be disabled
 */
function setButtonDisabled(disabled) {
    loadBtn.disabled = disabled;
}

