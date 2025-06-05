// Interactive Particle System
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.particleCount = 1000;
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
        this.mousePosition = new THREE.Vector3(0, 0, 0);
        this.isActive = false;
        
        // Initialize particles
        this.init();
        
        // Add mouse move listener
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
    
    init() {
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.createParticle();
            this.particles.push(particle);
            this.particleGroup.add(particle.mesh);
        }
    }
    
    createParticle() {
        // Random position within a sphere
        const radius = 50 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Create particle geometry and material
        const size = 0.1 + Math.random() * 0.2;
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        
        // Choose color based on position (creates a gradient effect)
        const hue = (Math.atan2(z, x) + Math.PI) / (Math.PI * 2);
        const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
        
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        
        // Add properties for animation
        return {
            mesh: mesh,
            basePosition: new THREE.Vector3(x, y, z),
            speed: 0.01 + Math.random() * 0.02,
            offset: Math.random() * Math.PI * 2,
            amplitude: 0.5 + Math.random() * 0.5,
            influenceRadius: 10 + Math.random() * 10
        };
    }
    
    onMouseMove(event) {
        // Convert mouse position to 3D coordinates
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Create a ray from the camera
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
        
        // Get point at a certain distance
        this.mousePosition = raycaster.ray.at(30);
        
        // Activate particle system
        this.isActive = true;
        
        // Deactivate after 2 seconds of no movement
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.isActive = false;
        }, 2000);
    }
    
    update(time) {
        this.particles.forEach(particle => {
            // Base movement - gentle floating
            const x = particle.basePosition.x + Math.sin(time * particle.speed + particle.offset) * particle.amplitude;
            const y = particle.basePosition.y + Math.cos(time * particle.speed + particle.offset) * particle.amplitude;
            const z = particle.basePosition.z + Math.sin(time * particle.speed * 0.5 + particle.offset) * particle.amplitude;
            
            particle.mesh.position.set(x, y, z);
            
            // Mouse influence if active
            if (this.isActive) {
                const distance = particle.mesh.position.distanceTo(this.mousePosition);
                
                if (distance < particle.influenceRadius) {
                    // Calculate direction from particle to mouse
                    const direction = new THREE.Vector3().subVectors(this.mousePosition, particle.mesh.position).normalize();
                    
                    // Move particle towards mouse based on distance (closer = stronger effect)
                    const strength = 1 - distance / particle.influenceRadius;
                    particle.mesh.position.add(direction.multiplyScalar(strength * 0.5));
                    
                    // Increase brightness based on interaction
                    particle.mesh.material.opacity = Math.min(1, 0.7 + strength * 0.5);
                    particle.mesh.scale.set(1 + strength, 1 + strength, 1 + strength);
                } else {
                    // Reset opacity and scale when not influenced
                    particle.mesh.material.opacity = 0.7;
                    particle.mesh.scale.set(1, 1, 1);
                }
            }
        });
    }
}

// Export the ParticleSystem class
window.ParticleSystem = ParticleSystem;
