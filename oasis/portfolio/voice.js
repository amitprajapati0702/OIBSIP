// Voice Command System
class VoiceSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = {};
        this.feedback = null;
        this.synthesis = window.speechSynthesis;

        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // Create recognition object
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            // Add event listeners
            this.recognition.onresult = this.handleResult.bind(this);
            this.recognition.onend = this.handleEnd.bind(this);
            this.recognition.onerror = this.handleError.bind(this);

            // Create voice control button
            this.createVoiceButton();
        } else {
            console.warn('Speech recognition not supported in this browser');
        }
    }

    // Create voice control button
    createVoiceButton() {
        // Check if button already exists
        if (document.querySelector('.voice-btn')) {
            return;
        }

        // Create button
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.title = 'Voice Commands (Click to Activate)';

        // Add to document
        document.body.appendChild(voiceBtn);

        // Add event listener
        voiceBtn.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.title = 'Voice Commands (Click to Activate)';
            } else {
                this.startListening();
                voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                voiceBtn.title = 'Voice Commands (Active - Click to Stop)';

                // Show available commands
                this.showCommandList();
            }
        });

        // Create feedback element if it doesn't exist
        if (!this.feedback) {
            this.feedback = document.createElement('div');
            this.feedback.className = 'voice-feedback';
            document.body.appendChild(this.feedback);
        }

        // Show initial help message after a short delay
        setTimeout(() => {
            this.showFeedback('Click the microphone to use voice commands', 'info');
            setTimeout(() => {
                this.hideFeedback();
            }, 5000);
        }, 3000);
    }

    // Show available commands
    showCommandList() {
        // Remove existing command list if present
        const existingList = document.querySelector('.command-list');
        if (existingList) {
            document.body.removeChild(existingList);
        }

        // Create command list
        const commandList = document.createElement('div');
        commandList.className = 'command-list';
        commandList.innerHTML = '<h3>Available Voice Commands</h3><ul></ul>';

        // Add commands to list with categories
        const ul = commandList.querySelector('ul');

        // Group commands by category
        const categories = {
            'Navigation': ['about me', 'education', 'projects', 'skills', 'contact'],
            'Effects': ['toggle rain', 'play music', 'stop music'],
            'Camera': ['orbit view', 'top view']
        };

        // Add commands by category
        Object.entries(categories).forEach(([category, cmds]) => {
            // Add category header
            const categoryHeader = document.createElement('li');
            categoryHeader.innerHTML = `<strong>${category}:</strong>`;
            categoryHeader.style.backgroundColor = 'rgba(255, 64, 129, 0.2)';
            categoryHeader.style.fontWeight = 'bold';
            ul.appendChild(categoryHeader);

            // Add commands in this category
            cmds.forEach(cmd => {
                if (this.commands[cmd]) {
                    const li = document.createElement('li');
                    li.textContent = `"${cmd}"`;
                    ul.appendChild(li);
                }
            });
        });

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-commands';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            if (document.body.contains(commandList)) {
                document.body.removeChild(commandList);
            }
        });
        commandList.appendChild(closeBtn);

        // Add to document
        document.body.appendChild(commandList);

        // Remove after 15 seconds
        setTimeout(() => {
            if (document.body.contains(commandList)) {
                document.body.removeChild(commandList);
            }
        }, 15000);
    }

    // Start listening for commands
    startListening() {
        if (!this.recognition) {
            this.showFeedback('Speech recognition not supported in this browser', 'error');
            setTimeout(() => this.hideFeedback(), 3000);
            return;
        }

        try {
            this.isListening = true;
            this.recognition.start();

            // Show feedback
            this.showFeedback('Listening for commands...', 'listening');

            // Speak feedback
            this.speak('Listening for commands');

            // Add visual indicator to the body
            document.body.classList.add('voice-active');
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showFeedback('Error starting speech recognition', 'error');
            setTimeout(() => this.hideFeedback(), 3000);
        }
    }

    // Stop listening for commands
    stopListening() {
        if (!this.recognition) return;

        try {
            this.isListening = false;
            this.recognition.stop();

            // Hide feedback
            this.hideFeedback();

            // Remove visual indicator from the body
            document.body.classList.remove('voice-active');
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
        }
    }

    // Handle recognition result
    handleResult(event) {
        try {
            if (!event.results || !event.results[0]) {
                return;
            }

            const result = event.results[0][0].transcript.toLowerCase();
            console.log('Voice command detected:', result);

            // Show feedback
            this.showFeedback(`Command: "${result}"`, 'command');

            // Check for commands
            let commandFound = false;

            Object.keys(this.commands).forEach(command => {
                if (result.includes(command.toLowerCase())) {
                    // Execute command
                    this.commands[command]();
                    commandFound = true;

                    // Speak feedback
                    this.speak(`Executing command: ${command}`);

                    // Show visual feedback
                    this.showFeedback(`Executing: "${command}"`, 'command');

                    // Add animation to the section if it's a navigation command
                    if (['about me', 'education', 'projects', 'skills', 'contact'].includes(command)) {
                        const section = command === 'about me' ? 'about' : command;
                        const navBtn = document.querySelector(`.nav-btn[data-section="${section}"]`);
                        if (navBtn) {
                            navBtn.classList.add('voice-activated');
                            setTimeout(() => {
                                navBtn.classList.remove('voice-activated');
                            }, 1000);
                        }
                    }
                }
            });

            if (!commandFound) {
                // No command found
                this.showFeedback(`Command not recognized: "${result}"`, 'error');

                // Speak feedback
                this.speak('Command not recognized. Please try again.');

                // Show command list again to help the user
                setTimeout(() => {
                    this.showCommandList();
                }, 1000);
            }
        } catch (error) {
            console.error('Error handling speech recognition result:', error);
            this.showFeedback('Error processing voice command', 'error');
        }
    }

    // Handle recognition end
    handleEnd() {
        this.isListening = false;

        // Update button
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }

        // Hide feedback after delay
        setTimeout(() => {
            this.hideFeedback();
        }, 2000);
    }

    // Handle recognition error
    handleError(event) {
        console.error('Speech recognition error:', event.error);

        // Show error feedback
        this.showFeedback(`Error: ${event.error}`, 'error');

        // Reset state
        this.isListening = false;

        // Update button
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    }

    // Show feedback
    showFeedback(message, type = 'info') {
        if (!this.feedback) return;

        this.feedback.textContent = message;
        this.feedback.className = `voice-feedback ${type}`;
        this.feedback.style.display = 'block';
    }

    // Hide feedback
    hideFeedback() {
        if (!this.feedback) return;

        this.feedback.style.display = 'none';
    }

    // Speak text
    speak(text) {
        if (!this.synthesis) return;

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        // Speak
        this.synthesis.speak(utterance);
    }

    // Add command
    addCommand(command, callback) {
        this.commands[command] = callback;
    }

    // Remove command
    removeCommand(command) {
        delete this.commands[command];
    }
}

// Export the VoiceSystem class
window.VoiceSystem = VoiceSystem;
