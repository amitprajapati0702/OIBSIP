// Skills Radar Chart System
class SkillsChartSystem {
    constructor() {
        this.chart = null;
        this.canvas = null;
        this.ctx = null;
        this.skills = [];
        this.isInitialized = false;
        this.animationFrame = null;
        this.hoverIndex = -1;
        this.tooltipElement = null;
    }
    
    // Initialize skills chart
    init(skills) {
        // Store skills data
        this.skills = skills || [];
        
        // Create chart container if it doesn't exist
        if (!document.querySelector('.skills-chart-container')) {
            this.createChartContainer();
        }
        
        // Get canvas and context
        this.canvas = document.querySelector('.skills-chart');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Add event listeners
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
        
        // Create tooltip
        this.createTooltip();
        
        // Start animation
        this.animate();
        
        // Set initialized flag
        this.isInitialized = true;
    }
    
    // Create chart container
    createChartContainer() {
        const container = document.createElement('div');
        container.className = 'skills-chart-container';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'skills-chart';
        
        container.appendChild(canvas);
        
        // Find skills section content
        const skillsContent = document.querySelector('.section-content');
        if (skillsContent) {
            skillsContent.appendChild(container);
        } else {
            document.body.appendChild(container);
        }
    }
    
    // Create tooltip
    createTooltip() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'skills-tooltip';
        document.body.appendChild(this.tooltipElement);
    }
    
    // Resize canvas
    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        const width = container.clientWidth;
        const height = Math.min(width, 400); // Max height of 400px
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Redraw chart
        this.drawChart();
    }
    
    // Draw chart
    drawChart() {
        if (!this.ctx || !this.canvas) return;
        
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        this.drawBackground(centerX, centerY, radius);
        
        // Draw axes
        this.drawAxes(centerX, centerY, radius);
        
        // Draw data
        this.drawData(centerX, centerY, radius);
        
        // Draw labels
        this.drawLabels(centerX, centerY, radius);
    }
    
    // Draw background
    drawBackground(centerX, centerY, radius) {
        const ctx = this.ctx;
        const levels = 5;
        
        // Draw concentric circles
        for (let i = 1; i <= levels; i++) {
            const levelRadius = (radius / levels) * i;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel-border');
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Add level indicator
            if (i < levels) {
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText((i * 20).toString(), centerX, centerY - levelRadius - 5);
            }
        }
    }
    
    // Draw axes
    drawAxes(centerX, centerY, radius) {
        const ctx = this.ctx;
        const skillsCount = this.skills.length;
        
        if (skillsCount < 3) return;
        
        // Draw axes
        for (let i = 0; i < skillsCount; i++) {
            const angle = (Math.PI * 2 * i) / skillsCount - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel-border');
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    
    // Draw data
    drawData(centerX, centerY, radius) {
        const ctx = this.ctx;
        const skillsCount = this.skills.length;
        
        if (skillsCount < 3) return;
        
        // Draw data polygon
        ctx.beginPath();
        
        for (let i = 0; i < skillsCount; i++) {
            const skill = this.skills[i];
            const value = skill.value / 100; // Normalize to 0-1
            const angle = (Math.PI * 2 * i) / skillsCount - Math.PI / 2;
            const x = centerX + radius * value * Math.cos(angle);
            const y = centerY + radius * value * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw point
            ctx.fillStyle = i === this.hoverIndex 
                ? getComputedStyle(document.documentElement).getPropertyValue('--accent-color')
                : getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
            ctx.beginPath();
            ctx.arc(x, y, i === this.hoverIndex ? 8 : 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Close the path
        ctx.closePath();
        
        // Fill with gradient
        const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
        gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--accent-color') + '40'); // 25% opacity
        gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--accent-color') + '80'); // 50% opacity
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Stroke
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Draw labels
    drawLabels(centerX, centerY, radius) {
        const ctx = this.ctx;
        const skillsCount = this.skills.length;
        
        if (skillsCount < 3) return;
        
        // Draw labels
        for (let i = 0; i < skillsCount; i++) {
            const skill = this.skills[i];
            const angle = (Math.PI * 2 * i) / skillsCount - Math.PI / 2;
            const labelRadius = radius + 20;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            
            ctx.fillStyle = i === this.hoverIndex 
                ? getComputedStyle(document.documentElement).getPropertyValue('--accent-color')
                : getComputedStyle(document.documentElement).getPropertyValue('--text-color');
            ctx.font = i === this.hoverIndex ? 'bold 14px Arial' : '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(skill.name, x, y);
        }
    }
    
    // Handle mouse move
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 2 - 40;
        
        // Check if mouse is over a skill point
        let hoveredIndex = -1;
        
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            const value = skill.value / 100; // Normalize to 0-1
            const angle = (Math.PI * 2 * i) / this.skills.length - Math.PI / 2;
            const pointX = centerX + radius * value * Math.cos(angle);
            const pointY = centerY + radius * value * Math.sin(angle);
            
            const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
            
            if (distance < 15) { // Increased hit area
                hoveredIndex = i;
                break;
            }
        }
        
        // Update hover index
        if (hoveredIndex !== this.hoverIndex) {
            this.hoverIndex = hoveredIndex;
            this.drawChart();
            
            // Show/hide tooltip
            if (this.hoverIndex !== -1) {
                const skill = this.skills[this.hoverIndex];
                this.tooltipElement.innerHTML = `
                    <div class="tooltip-title">${skill.name}</div>
                    <div class="tooltip-value">${skill.value}%</div>
                    <div class="tooltip-description">${skill.description || ''}</div>
                `;
                this.tooltipElement.style.display = 'block';
                this.tooltipElement.style.left = e.pageX + 10 + 'px';
                this.tooltipElement.style.top = e.pageY + 10 + 'px';
            } else {
                this.tooltipElement.style.display = 'none';
            }
        } else if (this.hoverIndex !== -1) {
            // Update tooltip position
            this.tooltipElement.style.left = e.pageX + 10 + 'px';
            this.tooltipElement.style.top = e.pageY + 10 + 'px';
        }
    }
    
    // Handle mouse out
    handleMouseOut() {
        this.hoverIndex = -1;
        this.drawChart();
        this.tooltipElement.style.display = 'none';
    }
    
    // Animation loop
    animate() {
        this.drawChart();
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
    
    // Stop animation
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Export the SkillsChartSystem class
window.SkillsChartSystem = SkillsChartSystem;
