// Cinematic Camera System
class CameraSystem {
    constructor(camera, controls) {
        this.camera = camera;
        this.controls = controls;
        this.isTransitioning = false;
        this.targetPosition = new THREE.Vector3();
        this.targetLookAt = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();
        
        // Store original control settings
        this.originalControlsEnabled = controls.enabled;
        
        // Add automatic camera movement
        this.setupAutomaticMovement();
    }
    
    // Set up automatic camera movement when idle
    setupAutomaticMovement() {
        this.idleTimer = null;
        this.isIdle = false;
        this.idleMovement = {
            radius: 25,
            height: 10,
            speed: 0.05,
            angle: 0
        };
        
        // Reset idle timer on user interaction
        window.addEventListener('mousemove', () => this.resetIdleTimer());
        window.addEventListener('click', () => this.resetIdleTimer());
        window.addEventListener('keydown', () => this.resetIdleTimer());
        
        // Initial idle timer
        this.resetIdleTimer();
    }
    
    // Reset idle timer
    resetIdleTimer() {
        clearTimeout(this.idleTimer);
        this.isIdle = false;
        
        // Set idle after 30 seconds of inactivity
        this.idleTimer = setTimeout(() => {
            this.isIdle = true;
            this.startIdleMovement();
        }, 30000);
    }
    
    // Start idle camera movement
    startIdleMovement() {
        if (!this.isIdle) return;
        
        // Store current camera position as center
        this.idleMovement.centerX = this.camera.position.x;
        this.idleMovement.centerZ = this.camera.position.z;
        this.idleMovement.angle = Math.atan2(
            this.camera.position.z, 
            this.camera.position.x
        );
    }
    
    // Move camera to position with animation
    moveTo(position, lookAt, duration = 2) {
        // Don't interrupt ongoing transitions
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Disable controls during transition
        this.controls.enabled = false;
        
        // Store target position and lookAt
        this.targetPosition.copy(position);
        this.targetLookAt.copy(lookAt);
        
        // Get current lookAt point
        this.currentLookAt.copy(
            this.controls.target || new THREE.Vector3(0, 0, 0)
        );
        
        // Animate camera movement
        gsap.to(this.camera.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: duration,
            ease: 'power2.inOut'
        });
        
        // Animate lookAt point
        gsap.to(this.currentLookAt, {
            x: lookAt.x,
            y: lookAt.y,
            z: lookAt.z,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                // Update controls target
                if (this.controls.target) {
                    this.controls.target.copy(this.currentLookAt);
                }
                
                // Make camera look at current point
                this.camera.lookAt(this.currentLookAt);
            },
            onComplete: () => {
                // Re-enable controls
                this.controls.enabled = this.originalControlsEnabled;
                this.isTransitioning = false;
                
                // Update controls
                this.controls.update();
            }
        });
    }
    
    // Create a cinematic path around a point
    createCinematicPath(center, radius, height, duration = 10) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Disable controls during cinematic path
        this.controls.enabled = false;
        
        // Store original position
        const originalPosition = this.camera.position.clone();
        
        // Create timeline
        const timeline = gsap.timeline({
            onComplete: () => {
                // Return to original position
                this.moveTo(originalPosition, center, 2);
            }
        });
        
        // Add points to timeline
        const points = 5;
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = center.x + Math.cos(angle) * radius;
            const z = center.z + Math.sin(angle) * radius;
            const y = center.y + height + Math.sin(angle * 2) * (height * 0.5);
            
            timeline.to(this.camera.position, {
                x: x,
                y: y,
                z: z,
                duration: duration / points,
                ease: 'power1.inOut',
                onUpdate: () => {
                    // Look at center
                    this.camera.lookAt(center);
                    
                    // Update controls target
                    if (this.controls.target) {
                        this.controls.target.copy(center);
                    }
                }
            });
        }
        
        return timeline;
    }
    
    // Update camera system
    update() {
        // Handle idle camera movement
        if (this.isIdle && !this.isTransitioning) {
            // Calculate new position on a circle
            this.idleMovement.angle += this.idleMovement.speed * 0.01;
            
            const x = this.idleMovement.centerX + Math.cos(this.idleMovement.angle) * this.idleMovement.radius;
            const z = this.idleMovement.centerZ + Math.sin(this.idleMovement.angle) * this.idleMovement.radius;
            
            // Smoothly move camera
            this.camera.position.x += (x - this.camera.position.x) * 0.01;
            this.camera.position.z += (z - this.camera.position.z) * 0.01;
            
            // Look at center
            if (this.controls.target) {
                this.camera.lookAt(this.controls.target);
            }
        }
    }
}

// Export the CameraSystem class
window.CameraSystem = CameraSystem;
