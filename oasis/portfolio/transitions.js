// Particle Transition Effects
class TransitionSystem {
    constructor(scene) {
        this.scene = scene;
        this.transitions = {};
        this.isTransitioning = false;
    }
    
    // Create particle explosion
    createExplosion(position, color = 0x00f2fe, particleCount = 200, duration = 2) {
        // Create particles
        const particles = new THREE.Group();
        this.scene.add(particles);
        
        // Create geometry and material
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        // Create particle meshes
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(geometry, material.clone());
            particle.position.copy(position);
            
            // Random scale
            const scale = 0.1 + Math.random() * 0.3;
            particle.scale.set(scale, scale, scale);
            
            // Add to group
            particles.add(particle);
            
            // Animate particle
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 20;
            const height = Math.random() * 10 - 5;
            
            const targetX = position.x + Math.cos(angle) * radius;
            const targetY = position.y + height;
            const targetZ = position.z + Math.sin(angle) * radius;
            
            gsap.to(particle.position, {
                x: targetX,
                y: targetY,
                z: targetZ,
                duration: duration * (0.5 + Math.random() * 0.5),
                ease: 'power2.out'
            });
            
            gsap.to(particle.material, {
                opacity: 0,
                duration: duration * (0.5 + Math.random() * 0.5),
                ease: 'power2.out',
                onComplete: () => {
                    // Remove particle when animation completes
                    particles.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            });
        }
        
        // Remove group after all particles are gone
        setTimeout(() => {
            this.scene.remove(particles);
        }, duration * 1000 + 100);
        
        return particles;
    }
    
    // Create particle stream between two points
    createParticleStream(startPosition, endPosition, color = 0x00f2fe, particleCount = 100, duration = 2) {
        // Create particles
        const particles = new THREE.Group();
        this.scene.add(particles);
        
        // Create geometry and material
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        // Calculate direction
        const direction = new THREE.Vector3().subVectors(endPosition, startPosition).normalize();
        const distance = startPosition.distanceTo(endPosition);
        
        // Create particle meshes
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(geometry, material.clone());
            
            // Random position along path with offset
            const progress = Math.random();
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            
            particle.position.copy(startPosition).add(
                new THREE.Vector3().copy(direction).multiplyScalar(distance * progress)
            ).add(offset);
            
            // Random scale
            const scale = 0.05 + Math.random() * 0.15;
            particle.scale.set(scale, scale, scale);
            
            // Add to group
            particles.add(particle);
            
            // Animate particle
            gsap.to(particle.position, {
                x: endPosition.x + (Math.random() - 0.5) * 2,
                y: endPosition.y + (Math.random() - 0.5) * 2,
                z: endPosition.z + (Math.random() - 0.5) * 2,
                duration: duration * (0.5 + Math.random() * 0.5),
                ease: 'power1.inOut',
                delay: Math.random() * duration * 0.5
            });
            
            gsap.to(particle.material, {
                opacity: 0,
                duration: duration * 0.3,
                ease: 'power1.in',
                delay: duration * (0.7 + Math.random() * 0.3),
                onComplete: () => {
                    // Remove particle when animation completes
                    particles.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            });
        }
        
        // Remove group after all particles are gone
        setTimeout(() => {
            this.scene.remove(particles);
        }, duration * 1000 + 100);
        
        return particles;
    }
    
    // Create section transition effect
    createSectionTransition(fromPosition, toPosition, color = 0x00f2fe, callback) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Create explosion at start position
        this.createExplosion(fromPosition, color, 100, 1.5);
        
        // Create particle stream
        setTimeout(() => {
            this.createParticleStream(fromPosition, toPosition, color, 150, 2);
            
            // Create explosion at end position
            setTimeout(() => {
                this.createExplosion(toPosition, color, 200, 2);
                
                // Call callback
                if (callback) {
                    setTimeout(callback, 500);
                }
                
                this.isTransitioning = false;
            }, 1000);
        }, 500);
    }
    
    // Create portal effect
    createPortalEffect(position, color = 0x00f2fe, radius = 5, duration = 3, callback) {
        // Create portal group
        const portal = new THREE.Group();
        this.scene.add(portal);
        
        // Create portal ring
        const ringGeometry = new THREE.TorusGeometry(radius, 0.5, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(position);
        ring.rotation.x = Math.PI / 2;
        portal.add(ring);
        
        // Create portal particles
        const particleCount = 200;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radiusOffset = (Math.random() - 0.5) * 0.5;
            
            const particleGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                position.x + Math.cos(angle) * (radius + radiusOffset),
                position.y,
                position.z + Math.sin(angle) * (radius + radiusOffset)
            );
            
            portal.add(particle);
            particles.push({
                mesh: particle,
                angle: angle,
                speed: 0.01 + Math.random() * 0.02,
                radius: radius + radiusOffset
            });
        }
        
        // Animate portal opening
        gsap.to(ring.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0,
            onComplete: () => {
                // Fade in ring
                gsap.to(ringMaterial, {
                    opacity: 1,
                    duration: 1
                });
                
                // Scale up ring
                gsap.to(ring.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 1,
                    ease: 'back.out(1.7)'
                });
                
                // Fade in particles
                particles.forEach(particle => {
                    gsap.to(particle.mesh.material, {
                        opacity: 0.7,
                        duration: 1,
                        delay: Math.random() * 0.5
                    });
                });
            }
        });
        
        // Animate portal for duration
        let time = 0;
        const portalInterval = setInterval(() => {
            time += 0.016; // Approximately 60fps
            
            // Rotate ring
            ring.rotation.z += 0.01;
            
            // Animate particles
            particles.forEach(particle => {
                particle.angle += particle.speed;
                particle.mesh.position.x = position.x + Math.cos(particle.angle) * particle.radius;
                particle.mesh.position.z = position.z + Math.sin(particle.angle) * particle.radius;
                
                // Add vertical movement
                particle.mesh.position.y = position.y + Math.sin(time * 2 + particle.angle * 3) * 0.2;
            });
        }, 16);
        
        // Close portal after duration
        setTimeout(() => {
            // Fade out ring
            gsap.to(ringMaterial, {
                opacity: 0,
                duration: 1
            });
            
            // Scale down ring
            gsap.to(ring.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: 'back.in(1.7)'
            });
            
            // Fade out particles
            particles.forEach(particle => {
                gsap.to(particle.mesh.material, {
                    opacity: 0,
                    duration: 1,
                    delay: Math.random() * 0.5
                });
            });
            
            // Clean up
            setTimeout(() => {
                clearInterval(portalInterval);
                this.scene.remove(portal);
                
                // Dispose geometries and materials
                ringGeometry.dispose();
                ringMaterial.dispose();
                
                particles.forEach(particle => {
                    particle.mesh.geometry.dispose();
                    particle.mesh.material.dispose();
                });
                
                // Call callback
                if (callback) callback();
            }, 1500);
        }, duration * 1000);
        
        return portal;
    }
}

// Export the TransitionSystem class
window.TransitionSystem = TransitionSystem;
