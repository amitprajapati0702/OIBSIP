// Interactive 3D Models System
class ModelSystem {
    constructor(scene) {
        this.scene = scene;
        this.models = {};
        this.loader = new THREE.GLTFLoader();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Add event listeners
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
    }
    
    // Load model from URL
    loadModel(name, url, position, scale = 1, rotation = { x: 0, y: 0, z: 0 }) {
        return new Promise((resolve, reject) => {
            this.loader.load(url, (gltf) => {
                const model = gltf.scene;
                
                // Set position, scale and rotation
                model.position.copy(position);
                model.scale.set(scale, scale, scale);
                model.rotation.set(rotation.x, rotation.y, rotation.z);
                
                // Add to scene
                this.scene.add(model);
                
                // Store reference
                this.models[name] = {
                    object: model,
                    originalScale: scale,
                    originalPosition: position.clone(),
                    hovered: false,
                    info: {
                        title: name,
                        description: ''
                    }
                };
                
                // Make model interactive
                this.makeInteractive(model);
                
                resolve(this.models[name]);
            }, undefined, (error) => {
                console.error('Error loading model:', error);
                reject(error);
            });
        });
    }
    
    // Create simple geometric model for projects
    createProjectModel(name, type, position, color = 0x00f2fe) {
        let geometry;
        
        // Create geometry based on type
        switch(type) {
            case 'cube':
                geometry = new THREE.BoxGeometry(2, 2, 2);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(1.2, 32, 32);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(1, 2, 32);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                break;
            default:
                geometry = new THREE.BoxGeometry(2, 2, 2);
        }
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.7,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.2
        });
        
        // Create mesh
        const model = new THREE.Mesh(geometry, material);
        model.position.copy(position);
        
        // Add to scene
        this.scene.add(model);
        
        // Store reference
        this.models[name] = {
            object: model,
            originalScale: 1,
            originalPosition: position.clone(),
            hovered: false,
            info: {
                title: name,
                description: ''
            }
        };
        
        // Add floating animation
        this.addFloatingAnimation(name);
        
        // Make model interactive
        this.makeInteractive(model);
        
        return this.models[name];
    }
    
    // Add floating animation to model
    addFloatingAnimation(name) {
        const model = this.models[name];
        if (!model) return;
        
        model.animation = {
            floating: {
                speed: 0.5 + Math.random() * 0.5,
                amplitude: 0.2 + Math.random() * 0.3,
                offset: Math.random() * Math.PI * 2
            },
            rotation: {
                speed: 0.005 + Math.random() * 0.01
            }
        };
    }
    
    // Make model interactive
    makeInteractive(model) {
        // Add hover effect
        model.userData.interactive = true;
        
        // Add glow effect
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'c': { type: 'f', value: 0.1 },
                'p': { type: 'f', value: 1.2 },
                glowColor: { type: 'c', value: new THREE.Color(0x00f2fe) },
                viewVector: { type: 'v3', value: new THREE.Vector3(0, 0, 0) }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normal);
                    vec3 vNormel = normalize(viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0
        });
        
        // Create glow mesh
        const glowGeometry = model.geometry.clone();
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.2);
        glowMesh.position.copy(model.position);
        glowMesh.visible = false;
        
        // Add glow mesh to scene
        this.scene.add(glowMesh);
        
        // Store reference to glow mesh
        model.userData.glowMesh = glowMesh;
    }
    
    // Set model info
    setModelInfo(name, title, description) {
        if (!this.models[name]) return;
        
        this.models[name].info = {
            title: title,
            description: description
        };
    }
    
    // Handle mouse move
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, camera);
        
        // Get intersected objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        // Reset all models
        Object.values(this.models).forEach(model => {
            if (model.hovered) {
                // Reset scale
                gsap.to(model.object.scale, {
                    x: model.originalScale,
                    y: model.originalScale,
                    z: model.originalScale,
                    duration: 0.3
                });
                
                // Hide glow
                if (model.object.userData.glowMesh) {
                    model.object.userData.glowMesh.visible = false;
                }
                
                model.hovered = false;
            }
        });
        
        // Check for intersections
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            
            // Find parent model
            let model = null;
            Object.values(this.models).forEach(m => {
                if (m.object === object || m.object.children.includes(object)) {
                    model = m;
                }
            });
            
            if (model && !model.hovered) {
                // Scale up
                gsap.to(model.object.scale, {
                    x: model.originalScale * 1.2,
                    y: model.originalScale * 1.2,
                    z: model.originalScale * 1.2,
                    duration: 0.3
                });
                
                // Show glow
                if (model.object.userData.glowMesh) {
                    model.object.userData.glowMesh.visible = true;
                    model.object.userData.glowMesh.scale.set(
                        model.originalScale * 1.4,
                        model.originalScale * 1.4,
                        model.originalScale * 1.4
                    );
                    
                    // Update view vector
                    const viewVector = new THREE.Vector3().subVectors(
                        camera.position,
                        model.object.position
                    ).normalize();
                    
                    model.object.userData.glowMesh.material.uniforms.viewVector.value = viewVector;
                }
                
                model.hovered = true;
                
                // Show info tooltip
                this.showTooltip(model.info.title, model.info.description, event.clientX, event.clientY);
                
                break;
            }
        }
    }
    
    // Handle click
    onClick(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, camera);
        
        // Get intersected objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        // Check for intersections
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;
            
            // Find parent model
            let model = null;
            Object.values(this.models).forEach(m => {
                if (m.object === object || m.object.children.includes(object)) {
                    model = m;
                }
            });
            
            if (model) {
                // Trigger click animation
                gsap.to(model.object.scale, {
                    x: model.originalScale * 1.5,
                    y: model.originalScale * 1.5,
                    z: model.originalScale * 1.5,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
                
                // Play sound effect
                if (window.audioSystem) {
                    window.audioSystem.playSound('click');
                }
                
                // Show detailed info
                this.showDetailedInfo(model.info.title, model.info.description);
                
                break;
            }
        }
    }
    
    // Show tooltip
    showTooltip(title, description, x, y) {
        // Remove existing tooltip
        const existingTooltip = document.querySelector('.model-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'model-tooltip';
        tooltip.innerHTML = `<h3>${title}</h3>`;
        
        // Set position
        tooltip.style.left = `${x + 20}px`;
        tooltip.style.top = `${y + 20}px`;
        
        // Add to document
        document.body.appendChild(tooltip);
        
        // Play sound effect
        if (window.audioSystem) {
            window.audioSystem.playSound('hover');
        }
    }
    
    // Show detailed info
    showDetailedInfo(title, description) {
        // Create or update info panel
        let infoPanel = document.querySelector('.model-info-panel');
        
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.className = 'model-info-panel';
            document.body.appendChild(infoPanel);
        }
        
        // Set content
        infoPanel.innerHTML = `
            <div class="info-header">
                <h2>${title}</h2>
                <span class="close-info">&times;</span>
            </div>
            <div class="info-content">
                <p>${description}</p>
            </div>
        `;
        
        // Show panel
        infoPanel.classList.add('visible');
        
        // Add close event
        const closeBtn = infoPanel.querySelector('.close-info');
        closeBtn.addEventListener('click', () => {
            infoPanel.classList.remove('visible');
        });
    }
    
    // Update models
    update(time) {
        // Update animations
        Object.values(this.models).forEach(model => {
            if (model.animation) {
                // Floating animation
                if (model.animation.floating) {
                    const anim = model.animation.floating;
                    model.object.position.y = model.originalPosition.y + 
                        Math.sin(time * anim.speed + anim.offset) * anim.amplitude;
                }
                
                // Rotation animation
                if (model.animation.rotation) {
                    model.object.rotation.y += model.animation.rotation.speed;
                }
                
                // Update glow mesh position
                if (model.object.userData.glowMesh) {
                    model.object.userData.glowMesh.position.copy(model.object.position);
                    model.object.userData.glowMesh.rotation.copy(model.object.rotation);
                }
            }
        });
    }
}

// Export the ModelSystem class
window.ModelSystem = ModelSystem;
