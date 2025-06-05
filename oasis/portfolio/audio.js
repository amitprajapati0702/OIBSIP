// Audio Visualization System
class AudioSystem {
    constructor(scene) {
        this.scene = scene;
        this.isPlaying = false;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.visualizer = null;
        this.audio = null;
        
        // Create audio button
        this.createAudioButton();
    }
    
    createAudioButton() {
        // Create audio control button
        const audioBtn = document.createElement('button');
        audioBtn.className = 'audio-btn';
        audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        audioBtn.title = 'Toggle Background Music';
        
        // Add to document
        document.body.appendChild(audioBtn);
        
        // Add event listener
        audioBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stopAudio();
                audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                this.startAudio();
                audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });
    }
    
    startAudio() {
        if (this.isPlaying) return;
        
        // Create audio context if it doesn't exist
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            // Create audio element
            this.audio = new Audio('https://assets.codepen.io/3685267/ambient-music.mp3');
            this.audio.loop = true;
            
            // Connect audio to analyser
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Create visualizer
            this.createVisualizer();
        }
        
        // Play audio
        this.audio.play();
        this.isPlaying = true;
    }
    
    stopAudio() {
        if (!this.isPlaying || !this.audio) return;
        
        // Pause audio
        this.audio.pause();
        this.isPlaying = false;
    }
    
    createVisualizer() {
        // Create a circular audio visualizer
        const visualizerGroup = new THREE.Group();
        this.scene.add(visualizerGroup);
        
        // Create bars
        const barCount = 32;
        const bars = [];
        
        for (let i = 0; i < barCount; i++) {
            const angle = (i / barCount) * Math.PI * 2;
            const radius = 40;
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Create bar
            const barGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
            const barMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / barCount, 0.7, 0.5),
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            });
            
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.set(x, -20, z);
            bar.lookAt(0, -20, 0);
            
            visualizerGroup.add(bar);
            bars.push(bar);
        }
        
        this.visualizer = {
            group: visualizerGroup,
            bars: bars
        };
    }
    
    update() {
        if (!this.isPlaying || !this.analyser || !this.visualizer) return;
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Update visualizer bars
        const bars = this.visualizer.bars;
        const barCount = bars.length;
        
        for (let i = 0; i < barCount; i++) {
            const index = Math.floor(i / barCount * this.dataArray.length);
            const value = this.dataArray[index] / 255;
            
            const bar = bars[i];
            const height = value * 10 + 1;
            
            // Update bar height
            bar.scale.y = height;
            bar.position.y = -20 + height / 2;
            
            // Update bar color
            bar.material.color.setHSL(i / barCount, 0.7, 0.5 + value * 0.5);
            bar.material.opacity = 0.5 + value * 0.5;
        }
        
        // Rotate visualizer
        this.visualizer.group.rotation.y += 0.005;
    }
    
    // Play sound effect
    playSound(type) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create oscillator
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Set sound type
        switch(type) {
            case 'click':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
                
            case 'hover':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
                
            case 'launch':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);
                break;
        }
    }
}

// Export the AudioSystem class
window.AudioSystem = AudioSystem;
