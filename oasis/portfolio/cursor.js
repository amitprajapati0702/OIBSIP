// Custom Cursor System
class CursorSystem {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.cursorCircle = null;
        this.cursorText = null;
        this.isInitialized = false;
        this.isVisible = true;
        this.mouseX = 0;
        this.mouseY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.circleX = 0;
        this.circleY = 0;
        this.scale = 1;
        this.opacity = 1;
        this.text = '';
        this.isOverClickable = false;
        this.isOverHoverable = false;
        this.isClicking = false;
        this.lastMoveTime = Date.now();
        this.idleTimeout = null;
    }
    
    // Initialize cursor system
    init() {
        // Create cursor elements if they don't exist
        if (!document.querySelector('.custom-cursor')) {
            this.createCursorElements();
        }
        
        // Store cursor elements
        this.cursor = document.querySelector('.custom-cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorCircle = document.querySelector('.cursor-circle');
        this.cursorText = document.querySelector('.cursor-text');
        
        // Add event listeners
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // Add hover detection
        this.addHoverDetection();
        
        // Start animation
        this.animate();
        
        // Set initialized flag
        this.isInitialized = true;
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Add idle detection
        this.addIdleDetection();
    }
    
    // Create cursor elements
    createCursorElements() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        
        const cursorCircle = document.createElement('div');
        cursorCircle.className = 'cursor-circle';
        
        const cursorText = document.createElement('div');
        cursorText.className = 'cursor-text';
        
        cursor.appendChild(cursorDot);
        cursor.appendChild(cursorCircle);
        cursor.appendChild(cursorText);
        
        document.body.appendChild(cursor);
    }
    
    // Add hover detection
    addHoverDetection() {
        // Add hover detection for clickable elements
        const clickableElements = document.querySelectorAll('a, button, .card-container, .nav-btn, .project-item, .education-item, .skills-category');
        
        clickableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.isOverClickable = true;
                this.scale = 1.5;
                
                // Add text based on element type
                if (element.tagName === 'A') {
                    this.setText('Link');
                } else if (element.tagName === 'BUTTON') {
                    this.setText('Click');
                } else if (element.classList.contains('card-container')) {
                    this.setText('Flip');
                } else if (element.classList.contains('nav-btn')) {
                    this.setText('Navigate');
                } else if (element.classList.contains('project-item')) {
                    this.setText('Project');
                } else if (element.classList.contains('education-item')) {
                    this.setText('Education');
                } else if (element.classList.contains('skills-category')) {
                    this.setText('Skills');
                }
            });
            
            element.addEventListener('mouseleave', () => {
                this.isOverClickable = false;
                this.scale = 1;
                this.setText('');
            });
        });
        
        // Add hover detection for hoverable elements
        const hoverableElements = document.querySelectorAll('.skills-chart, .timeline-item');
        
        hoverableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.isOverHoverable = true;
                this.scale = 1.2;
                
                // Add text based on element type
                if (element.classList.contains('skills-chart')) {
                    this.setText('Explore');
                } else if (element.classList.contains('timeline-item')) {
                    this.setText('View');
                }
            });
            
            element.addEventListener('mouseleave', () => {
                this.isOverHoverable = false;
                this.scale = 1;
                this.setText('');
            });
        });
    }
    
    // Add idle detection
    addIdleDetection() {
        document.addEventListener('mousemove', () => {
            this.lastMoveTime = Date.now();
            this.opacity = 1;
            
            // Clear existing timeout
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout);
            }
            
            // Set new timeout
            this.idleTimeout = setTimeout(() => {
                this.opacity = 0;
            }, 3000);
        });
    }
    
    // Handle mouse move
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Show cursor if hidden
        if (!this.isVisible) {
            this.isVisible = true;
            this.cursor.style.display = 'block';
        }
    }
    
    // Handle mouse down
    handleMouseDown() {
        this.isClicking = true;
        this.scale = 0.8;
    }
    
    // Handle mouse up
    handleMouseUp() {
        this.isClicking = false;
        this.scale = this.isOverClickable ? 1.5 : (this.isOverHoverable ? 1.2 : 1);
    }
    
    // Handle mouse enter
    handleMouseEnter() {
        this.isVisible = true;
        this.cursor.style.display = 'block';
    }
    
    // Handle mouse leave
    handleMouseLeave() {
        this.isVisible = false;
        this.cursor.style.display = 'none';
    }
    
    // Set text
    setText(text) {
        this.text = text;
        this.cursorText.textContent = text;
        this.cursorText.style.display = text ? 'block' : 'none';
    }
    
    // Animation loop
    animate() {
        // Calculate dot position with smooth follow
        this.dotX += (this.mouseX - this.dotX) * 0.2;
        this.dotY += (this.mouseY - this.dotY) * 0.2;
        
        // Calculate circle position with more lag
        this.circleX += (this.mouseX - this.circleX) * 0.1;
        this.circleY += (this.mouseY - this.circleY) * 0.1;
        
        // Update cursor elements
        this.cursorDot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
        this.cursorCircle.style.transform = `translate(${this.circleX}px, ${this.circleY}px) scale(${this.scale})`;
        this.cursorText.style.transform = `translate(${this.circleX}px, ${this.circleY - 40}px)`;
        
        // Update opacity
        this.cursor.style.opacity = this.opacity;
        
        // Continue animation
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Export the CursorSystem class
window.CursorSystem = CursorSystem;
