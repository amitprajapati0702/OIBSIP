// Accessibility System
class AccessibilitySystem {
    constructor() {
        this.isInitialized = false;
        this.isSimplifiedView = false;
        this.isHighContrastMode = false;
        this.isFontSizeIncreased = false;
        this.isReducedMotion = false;
        this.originalFontSizes = {};
    }
    
    // Initialize accessibility system
    init() {
        // Create accessibility panel if it doesn't exist
        if (!document.querySelector('.accessibility-panel')) {
            this.createAccessibilityPanel();
        }
        
        // Store original font sizes
        this.storeOriginalFontSizes();
        
        // Check for user preferences
        this.checkUserPreferences();
        
        // Add keyboard navigation
        this.addKeyboardNavigation();
        
        // Set initialized flag
        this.isInitialized = true;
    }
    
    // Create accessibility panel
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-toggle" title="Accessibility Options">
                <i class="fas fa-universal-access"></i>
            </button>
            <div class="accessibility-options">
                <h3>Accessibility Options</h3>
                <div class="accessibility-option">
                    <label for="simplified-view">Simplified View</label>
                    <input type="checkbox" id="simplified-view">
                </div>
                <div class="accessibility-option">
                    <label for="high-contrast">High Contrast</label>
                    <input type="checkbox" id="high-contrast">
                </div>
                <div class="accessibility-option">
                    <label for="larger-text">Larger Text</label>
                    <input type="checkbox" id="larger-text">
                </div>
                <div class="accessibility-option">
                    <label for="reduced-motion">Reduced Motion</label>
                    <input type="checkbox" id="reduced-motion">
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        const toggle = panel.querySelector('.accessibility-toggle');
        toggle.addEventListener('click', () => {
            panel.classList.toggle('open');
        });
        
        // Add option event listeners
        const simplifiedViewCheckbox = panel.querySelector('#simplified-view');
        simplifiedViewCheckbox.addEventListener('change', () => {
            this.toggleSimplifiedView(simplifiedViewCheckbox.checked);
        });
        
        const highContrastCheckbox = panel.querySelector('#high-contrast');
        highContrastCheckbox.addEventListener('change', () => {
            this.toggleHighContrast(highContrastCheckbox.checked);
        });
        
        const largerTextCheckbox = panel.querySelector('#larger-text');
        largerTextCheckbox.addEventListener('change', () => {
            this.toggleLargerText(largerTextCheckbox.checked);
        });
        
        const reducedMotionCheckbox = panel.querySelector('#reduced-motion');
        reducedMotionCheckbox.addEventListener('change', () => {
            this.toggleReducedMotion(reducedMotionCheckbox.checked);
        });
    }
    
    // Store original font sizes
    storeOriginalFontSizes() {
        const elements = document.querySelectorAll('h1, h2, h3, p, a, button, span, div');
        
        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const fontSize = computedStyle.getPropertyValue('font-size');
            
            // Store original font size
            element.dataset.originalFontSize = fontSize;
        });
    }
    
    // Check user preferences
    checkUserPreferences() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            this.toggleReducedMotion(true);
            document.querySelector('#reduced-motion').checked = true;
        }
        
        // Check for high contrast preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
        if (prefersHighContrast) {
            this.toggleHighContrast(true);
            document.querySelector('#high-contrast').checked = true;
        }
        
        // Check for saved preferences
        const savedSimplifiedView = localStorage.getItem('simplifiedView') === 'true';
        const savedHighContrast = localStorage.getItem('highContrast') === 'true';
        const savedLargerText = localStorage.getItem('largerText') === 'true';
        const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
        
        if (savedSimplifiedView) {
            this.toggleSimplifiedView(true);
            document.querySelector('#simplified-view').checked = true;
        }
        
        if (savedHighContrast && !prefersHighContrast) {
            this.toggleHighContrast(true);
            document.querySelector('#high-contrast').checked = true;
        }
        
        if (savedLargerText) {
            this.toggleLargerText(true);
            document.querySelector('#larger-text').checked = true;
        }
        
        if (savedReducedMotion && !prefersReducedMotion) {
            this.toggleReducedMotion(true);
            document.querySelector('#reduced-motion').checked = true;
        }
    }
    
    // Add keyboard navigation
    addKeyboardNavigation() {
        // Add tabindex to navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach((btn, index) => {
            btn.setAttribute('tabindex', index + 1);
        });
        
        // Add keyboard event listener
        document.addEventListener('keydown', (e) => {
            // Toggle accessibility panel with Alt+A
            if (e.altKey && e.key === 'a') {
                const panel = document.querySelector('.accessibility-panel');
                panel.classList.toggle('open');
                e.preventDefault();
            }
            
            // Navigate sections with arrow keys
            if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
                const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
                const activeIndex = navButtons.findIndex(btn => btn.classList.contains('active'));
                
                let newIndex;
                if (e.key === 'ArrowRight') {
                    newIndex = (activeIndex + 1) % navButtons.length;
                } else {
                    newIndex = (activeIndex - 1 + navButtons.length) % navButtons.length;
                }
                
                navButtons[newIndex].click();
                e.preventDefault();
            }
        });
    }
    
    // Toggle simplified view
    toggleSimplifiedView(enabled) {
        this.isSimplifiedView = enabled;
        
        // Toggle class on body
        document.body.classList.toggle('simplified-view', enabled);
        
        // Hide 3D elements and show simplified content
        const canvas = document.querySelector('.webgl');
        if (canvas) {
            canvas.style.display = enabled ? 'none' : 'block';
        }
        
        // Save preference
        localStorage.setItem('simplifiedView', enabled);
    }
    
    // Toggle high contrast
    toggleHighContrast(enabled) {
        this.isHighContrastMode = enabled;
        
        // Toggle class on body
        document.body.classList.toggle('high-contrast', enabled);
        
        // Save preference
        localStorage.setItem('highContrast', enabled);
    }
    
    // Toggle larger text
    toggleLargerText(enabled) {
        this.isFontSizeIncreased = enabled;
        
        // Toggle class on body
        document.body.classList.toggle('larger-text', enabled);
        
        // Increase font size
        const elements = document.querySelectorAll('h1, h2, h3, p, a, button, span, div');
        
        elements.forEach(element => {
            if (enabled) {
                const originalSize = parseFloat(element.dataset.originalFontSize);
                if (!isNaN(originalSize)) {
                    element.style.fontSize = (originalSize * 1.25) + 'px';
                }
            } else {
                element.style.fontSize = element.dataset.originalFontSize || '';
            }
        });
        
        // Save preference
        localStorage.setItem('largerText', enabled);
    }
    
    // Toggle reduced motion
    toggleReducedMotion(enabled) {
        this.isReducedMotion = enabled;
        
        // Toggle class on body
        document.body.classList.toggle('reduced-motion', enabled);
        
        // Save preference
        localStorage.setItem('reducedMotion', enabled);
    }
}

// Export the AccessibilitySystem class
window.AccessibilitySystem = AccessibilitySystem;
