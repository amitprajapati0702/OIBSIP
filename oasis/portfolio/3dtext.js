// 3D Text System
class TextSystem {
    constructor(scene, font) {
        this.scene = scene;
        this.font = font;
        this.textObjects = {};
        this.fontLoader = new THREE.FontLoader();
    }
    
    // Load font and initialize
    init(callback) {
        this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            this.font = font;
            if (callback) callback();
        });
    }
    
    // Create 3D text
    createText(text, position, options = {}) {
        if (!this.font) {
            console.error('Font not loaded yet');
            return null;
        }
        
        // Default options
        const config = {
            size: options.size || 1,
            height: options.height || 0.2,
            curveSegments: options.curveSegments || 12,
            bevelEnabled: options.bevelEnabled !== undefined ? options.bevelEnabled : true,
            bevelThickness: options.bevelThickness || 0.03,
            bevelSize: options.bevelSize || 0.02,
            bevelOffset: options.bevelOffset || 0,
            bevelSegments: options.bevelSegments || 5,
            color: options.color || 0x00f2fe,
            emissive: options.emissive || 0x00f2fe,
            emissiveIntensity: options.emissiveIntensity || 0.5
        };
        
        // Create geometry
        const geometry = new THREE.TextGeometry(text, {
            font: this.font,
            size: config.size,
            height: config.height,
            curveSegments: config.curveSegments,
            bevelEnabled: config.bevelEnabled,
            bevelThickness: config.bevelThickness,
            bevelSize: config.bevelSize,
            bevelOffset: config.bevelOffset,
            bevelSegments: config.bevelSegments
        });
        
        // Center text
        geometry.computeBoundingBox();
        const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: config.color,
            emissive: config.emissive,
            emissiveIntensity: config.emissiveIntensity,
            metalness: 0.8,
            roughness: 0.2
        });
        
        // Create mesh
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.copy(position);
        textMesh.position.x += centerOffset;
        
        // Add to scene
        this.scene.add(textMesh);
        
        // Store reference
        const id = 'text_' + Date.now();
        this.textObjects[id] = {
            mesh: textMesh,
            text: text,
            id: id
        };
        
        return this.textObjects[id];
    }
    
    // Create floating 3D skill icon
    createSkillIcon(skill, position) {
        // Map skill to icon and color
        const iconMap = {
            'PHP': { icon: 'P', color: 0x8993be },
            'Java': { icon: 'J', color: 0xf89820 },
            'C#': { icon: 'C', color: 0x68217a },
            'SQL': { icon: 'S', color: 0xff9900 },
            'MongoDB': { icon: 'M', color: 0x4db33d },
            'JavaScript': { icon: 'JS', color: 0xf7df1e }
        };
        
        const iconInfo = iconMap[skill] || { icon: skill.charAt(0), color: 0x00f2fe };
        
        // Create text
        const textObj = this.createText(iconInfo.icon, position, {
            size: 0.8,
            height: 0.2,
            color: iconInfo.color,
            emissive: iconInfo.color,
            emissiveIntensity: 0.5
        });
        
        if (textObj) {
            // Add floating animation
            const mesh = textObj.mesh;
            const baseY = position.y;
            
            // Store animation properties
            textObj.animation = {
                baseY: baseY,
                speed: 0.5 + Math.random() * 0.5,
                amplitude: 0.2 + Math.random() * 0.3,
                rotation: 0.01 + Math.random() * 0.02,
                offset: Math.random() * Math.PI * 2
            };
        }
        
        return textObj;
    }
    
    // Update animations
    update(time) {
        Object.values(this.textObjects).forEach(textObj => {
            if (textObj.animation) {
                const mesh = textObj.mesh;
                const anim = textObj.animation;
                
                // Floating animation
                mesh.position.y = anim.baseY + Math.sin(time * anim.speed + anim.offset) * anim.amplitude;
                
                // Rotation animation
                mesh.rotation.y += anim.rotation;
            }
        });
    }
}

// Export the TextSystem class
window.TextSystem = TextSystem;
