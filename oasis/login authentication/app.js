// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the authentication system
    AuthSystem.init();
    
    // Update navigation based on login status
    updateNavigation();
    
    // Set up global event listeners
    setupGlobalEventListeners();
});

// Update navigation based on authentication status
function updateNavigation() {
    const navLinks = document.getElementById('nav-links');
    const userMenu = document.getElementById('user-menu');
    const welcomeMessage = document.getElementById('welcome-message');
    
    if (!navLinks || !userMenu) return; // Not on a page with navigation
    
    if (AuthSystem.isLoggedIn()) {
        const currentUser = AuthSystem.getCurrentUser();
        if (currentUser) {
            navLinks.classList.add('hidden');
            userMenu.classList.remove('hidden');
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${currentUser.fullName}`;
            }
        }
    } else {
        navLinks.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

// Set up global event listeners
function setupGlobalEventListeners() {
    // Global logout button handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                AuthSystem.logout();
                window.location.href = 'index.html';
            }
        });
    }
    
    // Auto-redirect if accessing protected pages without authentication
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !AuthSystem.isLoggedIn()) {
        alert('Please login to access this page.');
        window.location.href = 'login.html';
    }
    
    // Auto-redirect if accessing login/register pages while authenticated
    const authPages = ['login.html', 'register.html'];
    if (authPages.includes(currentPage) && AuthSystem.isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${message}</span>
            <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Form validation utilities
const FormValidator = {
    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate password strength
    validatePassword(password) {
        const result = {
            isValid: password.length >= 6,
            strength: 0,
            feedback: []
        };
        
        if (password.length < 6) {
            result.feedback.push('Password must be at least 6 characters long');
        } else {
            result.strength += 25;
        }
        
        if (password.match(/[a-z]/)) {
            result.strength += 25;
        } else {
            result.feedback.push('Add lowercase letters');
        }
        
        if (password.match(/[A-Z]/)) {
            result.strength += 25;
        } else {
            result.feedback.push('Add uppercase letters');
        }
        
        if (password.match(/[0-9]/)) {
            result.strength += 25;
        } else {
            result.feedback.push('Add numbers');
        }
        
        return result;
    },
    
    // Validate required fields
    validateRequired(fields) {
        const errors = [];
        
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                errors.push(field.message || `${field.name} is required`);
            }
        });
        
        return errors;
    }
};

// Session management
const SessionManager = {
    // Check session validity periodically
    startSessionCheck() {
        setInterval(() => {
            if (!AuthSystem.isLoggedIn() && window.location.pathname.includes('dashboard')) {
                alert('Your session has expired. Please login again.');
                window.location.href = 'login.html';
            }
        }, 60000); // Check every minute
    },
    
    // Extend session on user activity
    extendSession() {
        if (AuthSystem.isLoggedIn()) {
            const session = localStorage.getItem(AuthSystem.SESSION_KEY) || sessionStorage.getItem(AuthSystem.SESSION_KEY);
            if (session) {
                const sessionData = JSON.parse(session);
                sessionData.lastActivity = new Date().toISOString();
                
                if (localStorage.getItem(AuthSystem.SESSION_KEY)) {
                    localStorage.setItem(AuthSystem.SESSION_KEY, JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem(AuthSystem.SESSION_KEY, JSON.stringify(sessionData));
                }
            }
        }
    }
};

// Start session management
SessionManager.startSessionCheck();

// Extend session on user activity
['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, SessionManager.extendSession, { passive: true });
});

// Export utilities for use in other scripts
window.AppUtils = {
    showNotification,
    FormValidator,
    SessionManager
};
