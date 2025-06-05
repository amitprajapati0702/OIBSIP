// Authentication System
class AuthSystem {
    static STORAGE_KEY = 'authSystem';
    static SESSION_KEY = 'authSession';

    // Initialize with demo user
    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const demoUser = {
                id: 'demo-user-1',
                fullName: 'Demo User',
                email: 'demo@example.com',
                password: this.hashPassword('demo123'),
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginCount: 0
            };
            
            const users = { 'demo@example.com': demoUser };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        }
    }

    // Simple password hashing (for demo purposes only)
    static hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Generate session token
    static generateToken() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    // Get all users from storage
    static getUsers() {
        const users = localStorage.getItem(this.STORAGE_KEY);
        return users ? JSON.parse(users) : {};
    }

    // Save users to storage
    static saveUsers(users) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }

    // Register new user
    static register(fullName, email, password) {
        try {
            // Validate input
            if (!fullName || !email || !password) {
                return { success: false, message: 'All fields are required' };
            }

            if (password.length < 6) {
                return { success: false, message: 'Password must be at least 6 characters long' };
            }

            // Check if email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { success: false, message: 'Please enter a valid email address' };
            }

            const users = this.getUsers();

            // Check if user already exists
            if (users[email]) {
                return { success: false, message: 'User with this email already exists' };
            }

            // Create new user
            const newUser = {
                id: 'user-' + Date.now(),
                fullName: fullName.trim(),
                email: email.toLowerCase().trim(),
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginCount: 0
            };

            users[email.toLowerCase().trim()] = newUser;
            this.saveUsers(users);

            return { success: true, message: 'Account created successfully! Please login.' };
        } catch (error) {
            return { success: false, message: 'Registration failed. Please try again.' };
        }
    }

    // Login user
    static login(email, password, rememberMe = false) {
        try {
            // Validate input
            if (!email || !password) {
                return { success: false, message: 'Email and password are required' };
            }

            const users = this.getUsers();
            const user = users[email.toLowerCase().trim()];

            // Check if user exists
            if (!user) {
                return { success: false, message: 'Invalid email or password' };
            }

            // Check password
            if (user.password !== this.hashPassword(password)) {
                return { success: false, message: 'Invalid email or password' };
            }

            // Update user login info
            user.lastLogin = new Date().toISOString();
            user.loginCount = (user.loginCount || 0) + 1;
            users[email.toLowerCase().trim()] = user;
            this.saveUsers(users);

            // Create session
            const session = {
                token: this.generateToken(),
                userId: user.id,
                email: user.email,
                fullName: user.fullName,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            // Store session
            if (rememberMe) {
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            } else {
                sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            }

            return { success: true, message: 'Login successful!' };
        } catch (error) {
            return { success: false, message: 'Login failed. Please try again.' };
        }
    }

    // Check if user is logged in
    static isLoggedIn() {
        const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        if (!session) return false;

        try {
            const sessionData = JSON.parse(session);
            // Check if session is valid (not older than 24 hours for demo)
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    // Get current user data
    static getCurrentUser() {
        if (!this.isLoggedIn()) return null;

        try {
            const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
            const sessionData = JSON.parse(session);
            
            const users = this.getUsers();
            const user = users[sessionData.email];
            
            return user || null;
        } catch (error) {
            return null;
        }
    }

    // Logout user
    static logout() {
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
    }

    // Update user profile
    static updateProfile(fullName, email) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                return { success: false, message: 'User not logged in' };
            }

            const users = this.getUsers();
            
            // If email is changing, check if new email already exists
            if (email.toLowerCase() !== currentUser.email.toLowerCase() && users[email.toLowerCase()]) {
                return { success: false, message: 'Email already in use' };
            }

            // Update user data
            const updatedUser = { ...currentUser, fullName, email: email.toLowerCase() };
            
            // If email changed, remove old entry and add new one
            if (email.toLowerCase() !== currentUser.email.toLowerCase()) {
                delete users[currentUser.email];
            }
            
            users[email.toLowerCase()] = updatedUser;
            this.saveUsers(users);

            // Update session
            const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
            if (session) {
                const sessionData = JSON.parse(session);
                sessionData.email = email.toLowerCase();
                sessionData.fullName = fullName;
                
                if (localStorage.getItem(this.SESSION_KEY)) {
                    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
                }
            }

            return { success: true, message: 'Profile updated successfully!' };
        } catch (error) {
            return { success: false, message: 'Failed to update profile' };
        }
    }

    // Change password
    static changePassword(currentPassword, newPassword) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                return { success: false, message: 'User not logged in' };
            }

            // Verify current password
            if (currentUser.password !== this.hashPassword(currentPassword)) {
                return { success: false, message: 'Current password is incorrect' };
            }

            if (newPassword.length < 6) {
                return { success: false, message: 'New password must be at least 6 characters long' };
            }

            // Update password
            const users = this.getUsers();
            users[currentUser.email].password = this.hashPassword(newPassword);
            this.saveUsers(users);

            return { success: true, message: 'Password changed successfully!' };
        } catch (error) {
            return { success: false, message: 'Failed to change password' };
        }
    }
}

// Initialize the auth system when the script loads
AuthSystem.init();
