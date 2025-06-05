// Interactive Timeline System
class TimelineSystem {
    constructor() {
        this.timeline = null;
        this.timelineItems = [];
        this.isInitialized = false;
    }
    
    // Initialize timeline
    init(data) {
        // Create timeline container if it doesn't exist
        if (!document.querySelector('.timeline-container')) {
            this.createTimelineContainer();
        }
        
        // Store timeline element
        this.timeline = document.querySelector('.timeline');
        
        // Create timeline items
        this.createTimelineItems(data);
        
        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Set initialized flag
        this.isInitialized = true;
        
        // Initial check for visible items
        setTimeout(() => {
            this.checkVisibleItems();
        }, 500);
    }
    
    // Create timeline container
    createTimelineContainer() {
        const container = document.createElement('div');
        container.className = 'timeline-container';
        
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        
        container.appendChild(timeline);
        document.body.appendChild(container);
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'timeline-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', () => {
            container.classList.remove('visible');
        });
        
        container.appendChild(closeBtn);
    }
    
    // Create timeline items
    createTimelineItems(data) {
        // Clear existing items
        this.timeline.innerHTML = '';
        this.timelineItems = [];
        
        // Create line
        const line = document.createElement('div');
        line.className = 'timeline-line';
        this.timeline.appendChild(line);
        
        // Create items
        data.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.dataset.index = index;
            
            // Alternate sides
            if (index % 2 === 0) {
                timelineItem.classList.add('left');
            } else {
                timelineItem.classList.add('right');
            }
            
            // Create content
            const content = document.createElement('div');
            content.className = 'timeline-content';
            
            // Add date
            const date = document.createElement('div');
            date.className = 'timeline-date';
            date.textContent = item.date;
            content.appendChild(date);
            
            // Add title
            const title = document.createElement('h3');
            title.className = 'timeline-title';
            title.textContent = item.title;
            content.appendChild(title);
            
            // Add description
            const description = document.createElement('p');
            description.className = 'timeline-description';
            description.textContent = item.description;
            content.appendChild(description);
            
            // Add dot
            const dot = document.createElement('div');
            dot.className = 'timeline-dot';
            
            // Add icon if provided
            if (item.icon) {
                const icon = document.createElement('i');
                icon.className = item.icon;
                dot.appendChild(icon);
            }
            
            // Add to timeline item
            timelineItem.appendChild(content);
            timelineItem.appendChild(dot);
            
            // Add to timeline
            this.timeline.appendChild(timelineItem);
            
            // Store reference
            this.timelineItems.push(timelineItem);
        });
    }
    
    // Handle scroll event
    handleScroll() {
        this.checkVisibleItems();
    }
    
    // Check which items are visible
    checkVisibleItems() {
        this.timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (isVisible) {
                item.classList.add('visible');
            }
        });
    }
    
    // Show timeline
    show(data) {
        // Initialize if not already
        if (!this.isInitialized) {
            this.init(data);
        } else if (data) {
            // Update items if data provided
            this.createTimelineItems(data);
        }
        
        // Show container
        const container = document.querySelector('.timeline-container');
        container.classList.add('visible');
        
        // Reset scroll position
        container.scrollTop = 0;
        
        // Check visible items
        setTimeout(() => {
            this.checkVisibleItems();
        }, 500);
    }
    
    // Hide timeline
    hide() {
        const container = document.querySelector('.timeline-container');
        if (container) {
            container.classList.remove('visible');
        }
    }
}

// Export the TimelineSystem class
window.TimelineSystem = TimelineSystem;
