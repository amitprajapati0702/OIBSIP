// Task Management System
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentEditId = null;
        this.initializeEventListeners();
        this.renderTasks();
        this.updateStatistics();
    }

    // Load tasks from localStorage
    loadTasks() {
        const savedTasks = localStorage.getItem('dailyTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('dailyTasks', JSON.stringify(this.tasks));
    }

    // Generate unique ID for tasks
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Format date and time
    formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Add new task
    addTask(text) {
        if (!text.trim()) {
            alert('Please enter a task description');
            return;
        }

        const newTask = {
            id: this.generateId(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now(),
            completedAt: null
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateStatistics();
        
        // Clear input
        document.getElementById('taskInput').value = '';
    }

    // Toggle task completion
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? Date.now() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStatistics();
        }
    }

    // Delete task
    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStatistics();
        }
    }

    // Start editing task
    startEdit(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.currentEditId = id;
            document.getElementById('editTaskInput').value = task.text;
            document.getElementById('editModal').classList.remove('hidden');
            document.getElementById('editModal').classList.add('flex');
            document.getElementById('editTaskInput').focus();
        }
    }

    // Save edited task
    saveEdit() {
        const newText = document.getElementById('editTaskInput').value.trim();
        if (!newText) {
            alert('Task description cannot be empty');
            return;
        }

        const task = this.tasks.find(t => t.id === this.currentEditId);
        if (task) {
            task.text = newText;
            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
        }
    }

    // Cancel edit
    closeEditModal() {
        document.getElementById('editModal').classList.add('hidden');
        document.getElementById('editModal').classList.remove('flex');
        this.currentEditId = null;
    }

    // Create task HTML element
    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item p-4 border border-gray-200 rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'} hover:shadow-md transition-shadow duration-200`;
        
        taskDiv.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <button 
                            onclick="taskManager.toggleTask('${task.id}')" 
                            class="mr-3 text-xl ${task.completed ? 'text-green-600' : 'text-gray-400'} hover:text-green-700 transition-colors duration-200"
                            title="${task.completed ? 'Mark as pending' : 'Mark as complete'}"
                        >
                            <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </button>
                        <span class="text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">${task.text}</span>
                    </div>
                    <div class="ml-8 text-sm text-gray-500">
                        <div class="flex items-center mb-1">
                            <i class="fas fa-plus-circle mr-2"></i>
                            Created: ${this.formatDateTime(task.createdAt)}
                        </div>
                        ${task.completedAt ? `
                            <div class="flex items-center">
                                <i class="fas fa-check-circle mr-2 text-green-600"></i>
                                Completed: ${this.formatDateTime(task.completedAt)}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="flex gap-2 ml-4">
                    <button 
                        onclick="taskManager.startEdit('${task.id}')" 
                        class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200"
                        title="Edit task"
                    >
                        <i class="fas fa-edit"></i>
                    </button>
                    <button 
                        onclick="taskManager.deleteTask('${task.id}')" 
                        class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200"
                        title="Delete task"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        return taskDiv;
    }

    // Render all tasks
    renderTasks() {
        const pendingTasksList = document.getElementById('pendingTasksList');
        const completedTasksList = document.getElementById('completedTasksList');
        
        // Clear existing tasks
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';
        
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);
        
        // Render pending tasks
        if (pendingTasks.length === 0) {
            document.getElementById('noPendingTasks').classList.remove('hidden');
            pendingTasksList.appendChild(document.getElementById('noPendingTasks'));
        } else {
            pendingTasks.forEach(task => {
                pendingTasksList.appendChild(this.createTaskElement(task));
            });
        }
        
        // Render completed tasks
        if (completedTasks.length === 0) {
            document.getElementById('noCompletedTasks').classList.remove('hidden');
            completedTasksList.appendChild(document.getElementById('noCompletedTasks'));
        } else {
            completedTasks.forEach(task => {
                completedTasksList.appendChild(this.createTaskElement(task));
            });
        }
    }

    // Update statistics
    updateStatistics() {
        const totalTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(task => !task.completed).length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingCount').textContent = pendingTasks;
        document.getElementById('completedCount').textContent = completedTasks;
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add task button
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            const taskText = document.getElementById('taskInput').value;
            this.addTask(taskText);
        });

        // Enter key in task input
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const taskText = document.getElementById('taskInput').value;
                this.addTask(taskText);
            }
        });

        // Edit modal buttons
        document.getElementById('saveEditBtn').addEventListener('click', () => {
            this.saveEdit();
        });

        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            this.closeEditModal();
        });

        // Enter key in edit input
        document.getElementById('editTaskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveEdit();
            }
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('editModal')) {
                this.closeEditModal();
            }
        });
    }
}

// Initialize the task manager when the page loads
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});
