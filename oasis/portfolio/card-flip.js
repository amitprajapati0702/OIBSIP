// 3D Card Flip System
class CardFlipSystem {
    constructor() {
        this.cards = [];
        this.isInitialized = false;
    }
    
    // Initialize card system
    init() {
        // Find all project items
        const projectItems = document.querySelectorAll('.project-item');
        
        // Convert each project item to a card
        projectItems.forEach((item, index) => {
            this.convertToCard(item, index);
        });
        
        // Set initialized flag
        this.isInitialized = true;
    }
    
    // Convert a project item to a 3D card
    convertToCard(item, index) {
        // Get content
        const content = item.innerHTML;
        
        // Extract title, description, and link
        const titleMatch = content.match(/<h3[^>]*>(.*?)<\/h3>/);
        const title = titleMatch ? titleMatch[1] : 'Project';
        
        const descriptionMatch = content.match(/<p>((?!<a).*?)<\/p>/);
        const description = descriptionMatch ? descriptionMatch[1] : '';
        
        const linkMatch = content.match(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/);
        const link = linkMatch ? linkMatch[1] : '';
        const linkText = linkMatch ? linkMatch[2] : '';
        
        // Create card container
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.dataset.index = index;
        
        // Create card
        const card = document.createElement('div');
        card.className = 'card';
        
        // Create front
        const front = document.createElement('div');
        front.className = 'card-face card-front';
        front.innerHTML = `
            <div class="card-content">
                ${title}
                <div class="card-icon">
                    <i class="fas fa-sync-alt"></i>
                </div>
            </div>
        `;
        
        // Create back
        const back = document.createElement('div');
        back.className = 'card-face card-back';
        back.innerHTML = `
            <div class="card-content">
                <h3>${title.replace(/<i[^>]*><\/i>/g, '')}</h3>
                <p>${description}</p>
                ${link ? `<a href="${link}" target="_blank">${linkText}</a>` : ''}
                <div class="card-icon">
                    <i class="fas fa-undo"></i>
                </div>
            </div>
        `;
        
        // Add front and back to card
        card.appendChild(front);
        card.appendChild(back);
        
        // Add card to container
        cardContainer.appendChild(card);
        
        // Replace original content
        item.innerHTML = '';
        item.appendChild(cardContainer);
        
        // Add click event
        cardContainer.addEventListener('click', (e) => {
            // Don't flip if clicking on a link
            if (e.target.tagName === 'A') return;
            
            this.flipCard(cardContainer);
        });
        
        // Store reference
        this.cards.push({
            container: cardContainer,
            card: card,
            isFlipped: false
        });
    }
    
    // Flip a card
    flipCard(container) {
        const index = parseInt(container.dataset.index);
        const card = this.cards[index];
        
        if (!card) return;
        
        // Toggle flipped state
        card.isFlipped = !card.isFlipped;
        
        // Update class
        card.card.classList.toggle('flipped', card.isFlipped);
        
        // Play sound effect
        if (window.audioSystem) {
            window.audioSystem.playSound('flip');
        }
    }
}

// Export the CardFlipSystem class
window.CardFlipSystem = CardFlipSystem;
