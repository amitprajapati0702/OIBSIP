// Advanced Lighting System
class LightingSystem {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
        this.currentTheme = 'default';
        this.themes = {
            default: {
                ambient: { color: 0xe0f7fa, intensity: 0.6 },
                directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
                point: [
                    { color: 0x80deea, intensity: 0.8, position: { x: 10, y: 5, z: 0 }, distance: 50 },
                    { color: 0x4dd0e1, intensity: 0.8, position: { x: -10, y: 5, z: 0 }, distance: 50 },
                    { color: 0x26c6da, intensity: 0.8, position: { x: 0, y: 5, z: 10 }, distance: 50 }
                ]
            },
            dark: {
                ambient: { color: 0x121212, intensity: 0.4 },
                directional: { color: 0x444444, intensity: 0.5, position: { x: 5, y: 10, z: 5 } },
                point: [
                    { color: 0x00f2fe, intensity: 1.2, position: { x: 10, y: 5, z: 0 }, distance: 50 },
                    { color: 0x00f2fe, intensity: 1.2, position: { x: -10, y: 5, z: 0 }, distance: 50 },
                    { color: 0x00f2fe, intensity: 1.2, position: { x: 0, y: 5, z: 10 }, distance: 50 }
                ]
            },
            about: {
                ambient: { color: 0xe0f7fa, intensity: 0.6 },
                directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
                point: [
                    { color: 0x80deea, intensity: 1.0, position: { x: 10, y: 5, z: 0 }, distance: 50 },
                    { color: 0x4dd0e1, intensity: 1.0, position: { x: -10, y: 5, z: 0 }, distance: 50 }
                ]
            },
            education: {
                ambient: { color: 0xe0f7fa, intensity: 0.6 },
                directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
                point: [
                    { color: 0xa5d6a7, intensity: 1.0, position: { x: 10, y: 5, z: 0 }, distance: 50 },
                    { color: 0x81c784, intensity: 1.0, position: { x: -10, y: 5, z: 0 }, distance: 50 }
                ]
            },
            projects: {
                ambient: { color: 0xe0f7fa, intensity: 0.6 },
                directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
                point: [
                    { color: 0xef9a9a, intensity: 1.0, position: { x: 10, y: 5, z: 0 }, distance: 50 },
                    { color: 0xe57373, intensity: 1.0, position: { x: -10, y: 5, z: 0 }, distance: 50 }
                ]
            },
            skills: {
                ambient: { color: 0xe0f7fa, intensity: 0.6 },
                directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
                point: [
                    { color: 0xffe082, intensity: 1.0, position: { x: 10, y: 5, z: 0 }, distance: 50 },
                    { color: 0xffd54f, intensity: 1.0, position: { x: -10, y: 5, z: 0 }, distance: 50 }
                ]
            },
            contact: {
                ambient: { color: 0xe0f7fa, intensity: 0.6 },
                directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
                point: [
                    { color: 0xce93d8, intensity: 1.0, position: { x: 10, y: 5, z: 0 }, distance: 50 },
                    { color: 0xba68c8, intensity: 1.0, position: { x: -10, y: 5, z: 0 }, distance: 50 }
                ]
            }
        };

        // Initialize lighting
        this.init();
    }

    // Initialize lighting
    init() {
        // Create ambient light
        const ambientLight = new THREE.AmbientLight(
            this.themes.default.ambient.color,
            this.themes.default.ambient.intensity
        );
        this.scene.add(ambientLight);
        this.lights.ambient = ambientLight;

        // Create directional light
        const directionalLight = new THREE.DirectionalLight(
            this.themes.default.directional.color,
            this.themes.default.directional.intensity
        );
        directionalLight.position.set(
            this.themes.default.directional.position.x,
            this.themes.default.directional.position.y,
            this.themes.default.directional.position.z
        );
        directionalLight.castShadow = true;

        // Configure shadow
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;

        this.scene.add(directionalLight);
        this.lights.directional = directionalLight;

        // Create point lights
        this.lights.point = [];
        this.themes.default.point.forEach(pointConfig => {
            const pointLight = new THREE.PointLight(
                pointConfig.color,
                pointConfig.intensity,
                pointConfig.distance
            );
            pointLight.position.set(
                pointConfig.position.x,
                pointConfig.position.y,
                pointConfig.position.z
            );

            // Add light helper (visible in development)
            // const helper = new THREE.PointLightHelper(pointLight, 1);
            // this.scene.add(helper);

            this.scene.add(pointLight);
            this.lights.point.push(pointLight);
        });

        // Add volumetric light rays
        this.addVolumetricLightRays();
    }

    // Add volumetric light rays
    addVolumetricLightRays() {
        // Create light ray material
        const rayMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0x80deea) },
                power: { value: 0.8 },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec2 vUv;

                void main() {
                    vPosition = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float power;
                uniform float time;

                varying vec3 vPosition;
                varying vec2 vUv;

                void main() {
                    // Calculate distance from center
                    float dist = length(vUv - vec2(0.5, 0.5));

                    // Create ray effect
                    float ray = pow(1.0 - dist, power);

                    // Add time-based animation
                    ray *= 0.5 + 0.5 * sin(time * 0.5 + dist * 10.0);

                    // Set color with alpha based on ray
                    gl_FragColor = vec4(color, ray * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        // Create rays for each point light
        this.lights.rays = [];
        this.lights.point.forEach(light => {
            // Create ray plane
            const rayGeometry = new THREE.PlaneGeometry(20, 20);
            const rayMesh = new THREE.Mesh(rayGeometry, rayMaterial.clone());

            // Position ray at light
            rayMesh.position.copy(light.position);

            // Rotate to face down
            rayMesh.rotation.x = -Math.PI / 2;

            // Set color to match light
            rayMesh.material.uniforms.color.value = light.color;

            // Add to scene
            this.scene.add(rayMesh);
            this.lights.rays.push(rayMesh);
        });
    }

    // Change lighting theme
    changeTheme(theme, duration = 2) {
        if (!this.themes[theme]) return;

        this.currentTheme = theme;
        const themeConfig = this.themes[theme];

        // Animate ambient light
        gsap.to(this.lights.ambient.color, {
            r: new THREE.Color(themeConfig.ambient.color).r,
            g: new THREE.Color(themeConfig.ambient.color).g,
            b: new THREE.Color(themeConfig.ambient.color).b,
            duration: duration
        });

        gsap.to(this.lights.ambient, {
            intensity: themeConfig.ambient.intensity,
            duration: duration
        });

        // Animate directional light
        gsap.to(this.lights.directional.color, {
            r: new THREE.Color(themeConfig.directional.color).r,
            g: new THREE.Color(themeConfig.directional.color).g,
            b: new THREE.Color(themeConfig.directional.color).b,
            duration: duration
        });

        gsap.to(this.lights.directional, {
            intensity: themeConfig.directional.intensity,
            duration: duration
        });

        gsap.to(this.lights.directional.position, {
            x: themeConfig.directional.position.x,
            y: themeConfig.directional.position.y,
            z: themeConfig.directional.position.z,
            duration: duration
        });

        // Animate point lights
        const pointCount = Math.min(this.lights.point.length, themeConfig.point.length);

        for (let i = 0; i < pointCount; i++) {
            const light = this.lights.point[i];
            const config = themeConfig.point[i];

            // Animate color
            gsap.to(light.color, {
                r: new THREE.Color(config.color).r,
                g: new THREE.Color(config.color).g,
                b: new THREE.Color(config.color).b,
                duration: duration
            });

            // Animate intensity
            gsap.to(light, {
                intensity: config.intensity,
                distance: config.distance,
                duration: duration
            });

            // Animate position
            gsap.to(light.position, {
                x: config.position.x,
                y: config.position.y,
                z: config.position.z,
                duration: duration
            });

            // Update ray color
            if (this.lights.rays && this.lights.rays[i]) {
                const ray = this.lights.rays[i];

                // Update ray position
                gsap.to(ray.position, {
                    x: config.position.x,
                    y: config.position.y,
                    z: config.position.z,
                    duration: duration
                });

                // Update ray color
                gsap.to(ray.material.uniforms.color.value, {
                    r: new THREE.Color(config.color).r,
                    g: new THREE.Color(config.color).g,
                    b: new THREE.Color(config.color).b,
                    duration: duration
                });
            }
        }
    }

    // Update theme based on dark/light mode
    updateTheme(theme) {
        if (theme === 'dark' || theme === 'default') {
            this.changeTheme(theme);
        }
    }

    // Update lighting
    update(time) {
        // Update light ray shaders
        if (this.lights.rays) {
            this.lights.rays.forEach(ray => {
                ray.material.uniforms.time.value = time;
            });
        }

        // Animate point lights
        if (this.lights.point) {
            this.lights.point.forEach((light, index) => {
                // Add subtle movement
                light.position.y += Math.sin(time * 0.5 + index) * 0.01;

                // Update ray position if exists
                if (this.lights.rays && this.lights.rays[index]) {
                    this.lights.rays[index].position.copy(light.position);
                }
            });
        }
    }
}

// Export the LightingSystem class
window.LightingSystem = LightingSystem;
