// Portfolio Data
const portfolioData = {
    about: {
        title: "About Me",
        content: `
            <p>Detail-oriented MCA student with a strong foundation in software development and a proven ability to deliver results in academic and internship projects. Skilled in programming languages like PHP, Java, C#, and expertise in database systems such as SQL and MongoDB.</p>
            <p>Certified in AI, Machine Learning, and business tools, with hands-on experience in .NET architecture and web development. Seeking a role to apply technical skills, enhance software solutions, and contribute to organizational success.</p>
            <div class="social-links">
                <p><a href="https://www.linkedin.com/in/amit-prajapati-b1b69032a" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a></p>
                <p><a href="https://github.com/amitprajapati0702" target="_blank"><i class="fab fa-github"></i> GitHub</a></p>
                <p><a href="https://www.credly.com/earner/dashboard" target="_blank"><i class="fas fa-certificate"></i> Credly</a></p>
                <p><a href="https://www.cloudskillsboost.google/my_account/profile" target="_blank"><i class="fab fa-google"></i> Google Cloud Skills</a></p>
            </div>
        `
    },
    education: {
        title: "Education",
        content: `
            <div class="education-item">
                <h3><i class="fas fa-graduation-cap"></i> Master of Computer Applications</h3>
                <p>Charotar University Science and Technology</p>
                <p><i class="far fa-calendar-alt"></i> Jun 2024 - May 2026</p>
            </div>
            <div class="education-item">
                <h3><i class="fas fa-graduation-cap"></i> Bachelor of Computer Applications</h3>
                <p>Sardar Patel University</p>
                <p><i class="far fa-calendar-alt"></i> Jul 2020 - Jun 2023</p>
            </div>
            <button id="viewTimelineBtn" class="view-timeline-btn">
                <i class="fas fa-stream"></i> View Interactive Timeline
            </button>
        `
    },
    projects: {
        title: "Projects",
        content: `
            <div class="project-item">
                <h3><i class="fas fa-industry"></i> ERP Manufacturing System (PHP)</h3>
                <p>Developed a comprehensive system to manage manufacturing workflows, including inventory, production schedules, and reporting. Enhanced operational efficiency and streamlined processes.</p>
                <p><a href="https://github.com/amitprajapati0702/ERM-Manufaturing-system" target="_blank"><i class="fab fa-github"></i> View on GitHub</a></p>
            </div>
            <div class="project-item">
                <h3><i class="far fa-clock"></i> Digital Clock (JavaScript)</h3>
                <p>Designed an interactive and responsive digital clock using JavaScript, showcasing real-time updates with dynamic styling.</p>
            </div>
            <div class="project-item">
                <h3><i class="fas fa-calendar-check"></i> Campus Event Management System (PHP)</h3>
                <p>Built a platform to manage campus events, enabling event creation, registration, and tracking. Simplified event coordination for organizers and participants.</p>
            </div>
            <div class="project-item">
                <h3><i class="fas fa-link"></i> Academic Record Management System with Blockchain</h3>
                <p>Implemented a secure system for managing academic records using blockchain technology.</p>
                <p><a href="https://github.com/amitprajapati0702/Academic-Record-management-system-with-blockchain" target="_blank"><i class="fab fa-github"></i> View on GitHub</a></p>
            </div>
        `
    },
    skills: {
        title: "Skills & Expertise",
        content: `
            <div class="skills-category">
                <h3><i class="fas fa-code"></i> Programming Languages</h3>
                <p>PHP, Java, MongoDB, SQL, JavaScript, HTML, CSS, C#, Bootstrap</p>
            </div>
            <div class="skills-category">
                <h3><i class="fas fa-tools"></i> Essentials</h3>
                <p>MS Word, MS Excel, MS PowerPoint, Google Workspace</p>
            </div>
            <div class="skills-category">
                <h3><i class="fas fa-language"></i> Languages</h3>
                <p>English, Hindi, Gujarati</p>
            </div>
            <div class="skills-category">
                <h3><i class="fas fa-certificate"></i> Certifications</h3>
                <p><i class="fas fa-check-circle"></i> PowerPoint Business and Presentation</p>
                <p><i class="fas fa-check-circle"></i> Chat GPT Generative AI</p>
                <p><i class="fas fa-check-circle"></i> ESG Job Simulation</p>
                <p><i class="fas fa-check-circle"></i> 21-Day Coding Challenge (Coding Ninja)</p>
                <p><i class="fas fa-check-circle"></i> Machine Learning and Artificial Intelligence (AWS)</p>
                <p><i class="fas fa-check-circle"></i> ESG Job Simulation Internship - TCS</p>
            </div>
        `
    },
    contact: {
        title: "Contact",
        content: `
            <p><i class="fas fa-envelope"></i> Email: <a href="mailto:amitsprajapati123@gmail.com">amitsprajapati123@gmail.com</a></p>
            <p><i class="fas fa-phone"></i> Phone: 9727591417</p>
            <div class="social-links">
                <p><a href="https://www.linkedin.com/in/amit-prajapati-b1b69032a" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a></p>
                <p><a href="https://github.com/amitprajapati0702" target="_blank"><i class="fab fa-github"></i> GitHub</a></p>
            </div>
        `
    }
};

// Three.js Scene Setup
let scene, camera, renderer, controls;
let cloudParticles = [];
let cloudObjects = [];
let birds = [];
let planes = [];
let raindrops = [];
let isRaining = false;
let currentSection = 'about';
let isLoaded = false;
let raycaster, mouse;
let clock = new THREE.Clock();

// Advanced systems
let particleSystem;
let modelSystem;
let lightingSystem;
let transitionSystem;
let voiceSystem;
let audioSystem;
let timelineSystem;
let cardFlipSystem;
let skillsChartSystem;
let accessibilitySystem;

// DOM Elements
const canvas = document.querySelector('.webgl');
const loadingScreen = document.querySelector('.loading-screen');
const loadingBar = document.querySelector('.loading-bar');
const infoPanel = document.querySelector('.info-panel');
const sectionTitle = document.querySelector('.section-title');
const sectionContent = document.querySelector('.section-content');
const navButtons = document.querySelectorAll('.nav-btn');
const themeToggle = document.getElementById('themeToggle');

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x3949ab, 0.002); // Deep indigo fog to match our theme

    // Create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    camera.position.y = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x3949ab, 1); // Match the fog color

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 1.5;

    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add hemisphere light for sky colors
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0xffffff, 0.6);
    scene.add(hemisphereLight);

    // Create cloud particles
    createCloudParticles();

    // Create cloud objects for each section
    createCloudObjects();

    // Create birds flying in the sky
    createBirds();

    // Create airplanes
    createPlanes();

    // Add weather toggle button
    createWeatherControls();

    // Initialize advanced systems
    initAdvancedSystems();

    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => navigateToSection(btn.dataset.section));
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', toggleTheme);

    // Add timeline button event listener
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'viewTimelineBtn' || e.target.closest('#viewTimelineBtn'))) {
            showEducationTimeline();
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolioTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
        if (scene && scene.fog) {
            scene.fog.color.set(0x121212);
        }
        if (renderer) {
            renderer.setClearColor(0x121212, 1);
        }
    }

    // Start animation loop
    animate();

    // Simulate loading progress
    simulateLoading();
}

// Initialize advanced systems
function initAdvancedSystems() {
    // Initialize particle system
    if (window.ParticleSystem) {
        particleSystem = new ParticleSystem(scene);
    }

    // Initialize model system
    if (window.ModelSystem) {
        modelSystem = new ModelSystem(scene);

        // Create project models
        setTimeout(() => {
            if (modelSystem) {
                // Create models for projects
                const projectTypes = ['cube', 'sphere', 'cylinder', 'cone', 'torus'];
                const projectColors = [0x3498db, 0xe74c3c, 0x2ecc71, 0xf1c40f, 0x9b59b6];

                // ERP Manufacturing System
                const erpModel = modelSystem.createProjectModel(
                    'ERP Manufacturing System',
                    'cube',
                    new THREE.Vector3(15, 0, 15),
                    projectColors[0]
                );
                modelSystem.setModelInfo(
                    'ERP Manufacturing System',
                    'ERP Manufacturing System',
                    'Developed a comprehensive system to manage manufacturing workflows, including inventory, production schedules, and reporting. Enhanced operational efficiency and streamlined processes.'
                );

                // Digital Clock
                const clockModel = modelSystem.createProjectModel(
                    'Digital Clock',
                    'cylinder',
                    new THREE.Vector3(-15, 0, 15),
                    projectColors[1]
                );
                modelSystem.setModelInfo(
                    'Digital Clock',
                    'Digital Clock',
                    'Designed an interactive and responsive digital clock using JavaScript, showcasing real-time updates with dynamic styling.'
                );

                // Campus Event Management System
                const eventModel = modelSystem.createProjectModel(
                    'Campus Event Management',
                    'sphere',
                    new THREE.Vector3(15, 0, -15),
                    projectColors[2]
                );
                modelSystem.setModelInfo(
                    'Campus Event Management',
                    'Campus Event Management System',
                    'Built a platform to manage campus events, enabling event creation, registration, and tracking. Simplified event coordination for organizers and participants.'
                );

                // Academic Record Management System
                const recordModel = modelSystem.createProjectModel(
                    'Academic Record Management',
                    'torus',
                    new THREE.Vector3(-15, 0, -15),
                    projectColors[3]
                );
                modelSystem.setModelInfo(
                    'Academic Record Management',
                    'Academic Record Management System with Blockchain',
                    'Implemented a secure system for managing academic records using blockchain technology.'
                );
            }
        }, 2000);
    }

    // Initialize lighting system
    if (window.LightingSystem) {
        lightingSystem = new LightingSystem(scene);
    }

    // Initialize transition system
    if (window.TransitionSystem) {
        transitionSystem = new TransitionSystem(scene);
    }

    // Initialize audio system
    if (window.AudioSystem) {
        audioSystem = new AudioSystem(scene);
        window.audioSystem = audioSystem; // Make globally available
    }

    // Initialize timeline system
    if (window.TimelineSystem) {
        timelineSystem = new TimelineSystem();
    }

    // Initialize card flip system
    if (window.CardFlipSystem) {
        cardFlipSystem = new CardFlipSystem();
    }

    // Initialize skills chart system
    if (window.SkillsChartSystem) {
        skillsChartSystem = new SkillsChartSystem();
    }

    // Initialize accessibility system
    if (window.AccessibilitySystem) {
        accessibilitySystem = new AccessibilitySystem();
        // Initialize immediately for better user experience
        setTimeout(() => {
            accessibilitySystem.init();
        }, 2000); // Delay to allow other systems to initialize first
    }

    // Initialize voice system
    if (window.VoiceSystem) {
        // Create voice system
        voiceSystem = new VoiceSystem();

        // Add voice commands
        if (voiceSystem) {
            console.log('Voice system initialized');

            // Navigation commands
            voiceSystem.addCommand('about me', () => navigateToSection('about'));
            voiceSystem.addCommand('education', () => navigateToSection('education'));
            voiceSystem.addCommand('projects', () => navigateToSection('projects'));
            voiceSystem.addCommand('skills', () => navigateToSection('skills'));
            voiceSystem.addCommand('contact', () => navigateToSection('contact'));

            // Effect commands
            voiceSystem.addCommand('toggle rain', toggleRain);
            voiceSystem.addCommand('play music', () => {
                if (audioSystem) audioSystem.startAudio();
            });
            voiceSystem.addCommand('stop music', () => {
                if (audioSystem) audioSystem.stopAudio();
            });

            // Camera commands
            voiceSystem.addCommand('orbit view', () => {
                camera.position.set(0, 20, 30);
                controls.target.set(0, 0, 0);
            });
            voiceSystem.addCommand('top view', () => {
                camera.position.set(0, 50, 0);
                controls.target.set(0, 0, 0);
            });

            // Show a notification about voice commands after the page loads
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.className = 'voice-notification';
                notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas fa-microphone"></i>
                        <p>Voice commands are available! Click the microphone icon to start.</p>
                        <button class="notification-close">&times;</button>
                    </div>
                `;
                document.body.appendChild(notification);

                // Add close button functionality
                const closeBtn = notification.querySelector('.notification-close');
                closeBtn.addEventListener('click', () => {
                    notification.classList.add('closing');
                    setTimeout(() => {
                        if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                        }
                    }, 300);
                });

                // Auto-remove after 8 seconds
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.classList.add('closing');
                        setTimeout(() => {
                            if (document.body.contains(notification)) {
                                document.body.removeChild(notification);
                            }
                        }, 300);
                    }
                }, 8000);
            }, 5000);
        }
    }
}

// Create weather control buttons
function createWeatherControls() {
    const weatherControls = document.createElement('div');
    weatherControls.className = 'weather-controls';

    const rainButton = document.createElement('button');
    rainButton.innerHTML = '<i class="fas fa-cloud-rain"></i>';
    rainButton.title = 'Toggle Rain';
    rainButton.addEventListener('click', toggleRain);

    weatherControls.appendChild(rainButton);
    document.body.appendChild(weatherControls);
}

// Create cloud particles for atmosphere
function createCloudParticles() {
    // Create cloud texture
    const loader = new THREE.TextureLoader();
    const cloudTexture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/cloud10.png');

    const cloudGeometry = new THREE.PlaneGeometry(500, 500);
    const cloudMaterial = new THREE.MeshLambertMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.4
    });

    // Create multiple cloud planes
    for (let i = 0; i < 50; i++) {
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
            Math.random() * 800 - 400,
            Math.random() * 50,
            Math.random() * 500 - 450
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 2 * Math.PI;
        cloud.material.opacity = 0.3;
        cloudParticles.push(cloud);
        scene.add(cloud);
    }

    // Create particle cloud
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Create a sphere of particles
        const radius = 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i+1] = radius * Math.sin(phi) * Math.sin(theta) + 20;
        posArray[i+2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleCloud = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleCloud);
}

// Create cloud objects for each section
function createCloudObjects() {
    const sections = Object.keys(portfolioData);
    const radius = 15;

    sections.forEach((section, index) => {
        // Calculate position in a circle
        const angle = (index / sections.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Create cloud group
        const cloudGroup = new THREE.Group();
        cloudGroup.position.set(x, 0, z);

        // Create main cloud
        const cloudGeometry = new THREE.SphereGeometry(2, 32, 32);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            roughness: 0.2,
            metalness: 0.1
        });

        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudGroup.add(cloud);

        // Add smaller clouds around the main cloud
        for (let i = 0; i < 5; i++) {
            const smallCloudGeometry = new THREE.SphereGeometry(0.8 + Math.random() * 0.5, 16, 16);
            const smallCloudMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7,
                roughness: 0.3
            });

            const smallCloud = new THREE.Mesh(smallCloudGeometry, smallCloudMaterial);

            // Position small clouds around the main cloud
            const smallAngle = (i / 5) * Math.PI * 2;
            const distance = 1.8;
            smallCloud.position.x = Math.cos(smallAngle) * distance;
            smallCloud.position.y = Math.random() * 1 - 0.5;
            smallCloud.position.z = Math.sin(smallAngle) * distance;

            cloudGroup.add(smallCloud);
        }

        // Add label to represent the section
        const loader = new THREE.TextureLoader();

        // Create canvas for the label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;

        // Set background to transparent
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        context.font = 'Bold 60px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Create gradient for text - more professional colors
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#1a2a6c');  // Deep Blue
        gradient.addColorStop(0.5, '#FFFFFF'); // White
        gradient.addColorStop(1, '#fdbb2d');   // Gold

        context.fillStyle = gradient;
        context.fillText(section.toUpperCase(), canvas.width / 2, canvas.height / 2);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);

        // Create label plane
        const labelGeometry = new THREE.PlaneGeometry(4, 2);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.y = 3.5;
        label.rotation.x = -Math.PI / 2;

        cloudGroup.add(label);

        // Add icon to represent the section
        const iconGeometry = new THREE.PlaneGeometry(1.5, 1.5);
        const iconMaterial = new THREE.MeshBasicMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        const icon = new THREE.Mesh(iconGeometry, iconMaterial);
        icon.position.y = 2.5;
        icon.rotation.x = -Math.PI / 2;

        cloudGroup.add(icon);

        // Add to scene and store reference
        scene.add(cloudGroup);
        cloudObjects[section] = {
            group: cloudGroup,
            position: new THREE.Vector3(x, 0, z),
            originalY: 0
        };

        // Add floating animation
        gsap.to(cloudGroup.position, {
            y: '+=1',
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });
}

// Create birds flying in the sky
function createBirds() {
    // Create a simple bird shape
    for (let i = 0; i < 40; i++) {
        const birdGroup = new THREE.Group();

        // Choose professional yet visible colors for birds
        const birdColors = [
            0x3498db, // Blue
            0xe74c3c, // Red
            0x2ecc71, // Green
            0xf1c40f, // Yellow
            0x9b59b6, // Purple
            0x1abc9c, // Turquoise
            0xd35400, // Orange
            0x34495e, // Dark Blue
            0x16a085, // Green Sea
            0xf39c12, // Orange
            0x8e44ad, // Wisteria
            0x2c3e50  // Midnight Blue
        ];

        const birdColor = birdColors[Math.floor(Math.random() * birdColors.length)];

        // Bird body
        const bodyGeometry = new THREE.ConeGeometry(0.2, 0.8, 4);
        bodyGeometry.rotateX(Math.PI / 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: birdColor,
            emissive: birdColor,
            emissiveIntensity: 0.2,
            roughness: 0.3,
            metalness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        birdGroup.add(body);

        // Bird wings
        const wingGeometry = new THREE.PlaneGeometry(1, 0.3);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: birdColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            emissive: birdColor,
            emissiveIntensity: 0.1
        });

        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-0.3, 0, 0);
        leftWing.rotation.z = Math.PI / 6;
        birdGroup.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0.3, 0, 0);
        rightWing.rotation.z = -Math.PI / 6;
        birdGroup.add(rightWing);

        // Position bird randomly in the sky
        const radius = 50 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI / 4 + Math.PI / 4; // Keep birds in upper hemisphere

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi) + 20; // Keep birds high in the sky
        const z = radius * Math.sin(phi) * Math.sin(theta);

        birdGroup.position.set(x, y, z);

        // Random rotation for flight direction
        birdGroup.rotation.y = Math.random() * Math.PI * 2;

        // Add to scene and store reference
        scene.add(birdGroup);
        birds.push({
            group: birdGroup,
            speed: 0.05 + Math.random() * 0.1,
            wingSpeed: 0.2 + Math.random() * 0.3,
            wingDirection: 1,
            wingAngle: 0
        });
    }
}

// Create airplanes flying in the sky
function createPlanes() {
    for (let i = 0; i < 12; i++) {
        const planeGroup = new THREE.Group();

        // Choose professional colors for planes
        const planeColors = [
            0x3498db, // Blue
            0xe74c3c, // Red
            0x2ecc71, // Green
            0xf1c40f, // Yellow
            0x9b59b6, // Purple
            0x1abc9c, // Turquoise
            0x34495e, // Dark Blue
            0x16a085, // Green Sea
            0x2c3e50  // Midnight Blue
        ];

        const accentColors = [
            0xecf0f1, // White
            0xbdc3c7, // Silver
            0x95a5a6, // Concrete
            0x7f8c8d, // Asbestos
            0xf39c12, // Orange
            0xd35400, // Pumpkin
            0xc0392b  // Pomegranate
        ];

        const mainColor = planeColors[Math.floor(Math.random() * planeColors.length)];
        const accentColor = accentColors[Math.floor(Math.random() * accentColors.length)];

        // Make planes larger (1.5x size) and more visible
        const planeScale = 1.5;

        // Plane body
        const bodyGeometry = new THREE.CylinderGeometry(0.3 * planeScale, 0.3 * planeScale, 4.5 * planeScale, 8);
        bodyGeometry.rotateZ(Math.PI / 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: mainColor,
            metalness: 0.7,
            roughness: 0.1,
            emissive: mainColor,
            emissiveIntensity: 0.4 // Increased emissive intensity
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        planeGroup.add(body);

        // Plane wings
        const wingGeometry = new THREE.BoxGeometry(6 * planeScale, 0.15 * planeScale, 1.2 * planeScale);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: accentColor,
            metalness: 0.5,
            roughness: 0.2,
            emissive: accentColor,
            emissiveIntensity: 0.3 // Increased emissive intensity
        });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        planeGroup.add(wings);

        // Plane tail
        const tailGeometry = new THREE.BoxGeometry(1.2 * planeScale, 0.15 * planeScale, 1.2 * planeScale);
        const tail = new THREE.Mesh(tailGeometry, wingMaterial);
        tail.position.set(-2.25 * planeScale, 0, 0);
        planeGroup.add(tail);

        // Plane vertical stabilizer
        const stabilizerGeometry = new THREE.BoxGeometry(1.2 * planeScale, 1.2 * planeScale, 0.15 * planeScale);
        const stabilizer = new THREE.Mesh(stabilizerGeometry, wingMaterial);
        stabilizer.position.set(-2.25 * planeScale, 0.6 * planeScale, 0);
        planeGroup.add(stabilizer);

        // Add brighter lights to the plane
        const lightGeometry = new THREE.SphereGeometry(0.2 * planeScale, 8, 8);

        // Red navigation light (left wing)
        const leftLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 1
        });
        const leftLight = new THREE.Mesh(lightGeometry, leftLightMaterial);
        leftLight.position.set(0, 0, -3 * planeScale);
        planeGroup.add(leftLight);

        // Green navigation light (right wing)
        const rightLightMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 1
        });
        const rightLight = new THREE.Mesh(lightGeometry, rightLightMaterial);
        rightLight.position.set(0, 0, 3 * planeScale);
        planeGroup.add(rightLight);

        // White strobe light (top)
        const strobeLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1
        });
        const strobeLight = new THREE.Mesh(lightGeometry, strobeLightMaterial);
        strobeLight.position.set(0, 0.5 * planeScale, 0);
        planeGroup.add(strobeLight);

        // Position plane randomly in the sky
        const radius = 80 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const y = 30 + Math.random() * 20; // Keep planes high in the sky

        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);

        planeGroup.position.set(x, y, z);

        // Random rotation for flight direction
        planeGroup.rotation.y = Math.random() * Math.PI * 2;

        // Add to scene and store reference
        scene.add(planeGroup);
        planes.push({
            group: planeGroup,
            speed: 0.2 + Math.random() * 0.1,
            trailTimer: 0,
            trailInterval: 5 + Math.random() * 5
        });
    }
}

// Create rain effect
function createRain() {
    const rainGeometry = new THREE.BufferGeometry();
    const rainCount = 15000;
    const positionArray = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
        // Random positions in a large cylinder around the camera
        const radius = 50 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const y = Math.random() * 100;

        positionArray[i] = Math.cos(theta) * radius;     // x
        positionArray[i+1] = y;                           // y
        positionArray[i+2] = Math.sin(theta) * radius;    // z
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaff,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    return {
        points: rain,
        positions: rain.geometry.attributes.position.array,
        velocities: Array(rainCount).fill().map(() => 0.1 + Math.random() * 0.3)
    };
}

// Toggle rain effect
function toggleRain() {
    isRaining = !isRaining;

    const rainButton = document.querySelector('.weather-controls button');
    if (rainButton) {
        rainButton.classList.toggle('active', isRaining);
    }

    if (isRaining && raindrops.length === 0) {
        raindrops.push(createRain());
    } else if (!isRaining && raindrops.length > 0) {
        // Remove rain
        raindrops.forEach(rain => {
            scene.remove(rain.points);
        });
        raindrops = [];
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    const themeIcon = themeToggle.querySelector('i');

    // Update icon
    if (isDarkTheme) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');

        // Update scene colors for dark theme
        if (scene && scene.fog) {
            scene.fog.color.set(0x121212);
        }
        if (renderer) {
            renderer.setClearColor(0x121212, 1);
        }

        // Save preference
        localStorage.setItem('portfolioTheme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');

        // Update scene colors for light theme
        if (scene && scene.fog) {
            scene.fog.color.set(0x3949ab);
        }
        if (renderer) {
            renderer.setClearColor(0x3949ab, 1);
        }

        // Save preference
        localStorage.setItem('portfolioTheme', 'light');
    }

    // Update lighting if lighting system exists
    if (lightingSystem) {
        lightingSystem.updateTheme(isDarkTheme ? 'dark' : 'default');
    }
}

// Show education timeline
function showEducationTimeline() {
    if (!timelineSystem) return;

    // Education timeline data
    const timelineData = [
        {
            date: "2024 - 2026",
            title: "Master of Computer Applications",
            description: "Pursuing MCA at Charotar University Science and Technology, focusing on advanced software development and emerging technologies.",
            icon: "fas fa-graduation-cap"
        },
        {
            date: "2023",
            title: "Internship - Software Developer",
            description: "Worked on real-world projects implementing web applications and database systems.",
            icon: "fas fa-laptop-code"
        },
        {
            date: "2020 - 2023",
            title: "Bachelor of Computer Applications",
            description: "Completed BCA at Sardar Patel University with focus on programming fundamentals, database management, and web development.",
            icon: "fas fa-graduation-cap"
        },
        {
            date: "2020",
            title: "First Coding Project",
            description: "Developed my first significant application - a simple inventory management system using PHP and MySQL.",
            icon: "fas fa-code"
        },
        {
            date: "2019",
            title: "Introduction to Programming",
            description: "Started learning programming with C and HTML/CSS, building a foundation in computer science concepts.",
            icon: "fas fa-laptop"
        }
    ];

    // Show timeline
    timelineSystem.show(timelineData);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse move for interaction
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Handle click for interaction
function onClick() {
    if (!isLoaded) return;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with cloud objects
    const intersects = [];
    Object.keys(cloudObjects).forEach(section => {
        const cloudGroup = cloudObjects[section].group;
        cloudGroup.children.forEach(child => {
            const childIntersects = raycaster.intersectObject(child);
            if (childIntersects.length > 0) {
                intersects.push({ section, distance: childIntersects[0].distance });
            }
        });
    });

    // Navigate to the closest intersected section
    if (intersects.length > 0) {
        intersects.sort((a, b) => a.distance - b.distance);
        navigateToSection(intersects[0].section);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Rotate cloud particles
    cloudParticles.forEach(cloud => {
        cloud.rotation.z += 0.0005;
    });

    // Animate birds
    birds.forEach(bird => {
        // Move bird forward in its facing direction
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(bird.group.quaternion);
        direction.multiplyScalar(bird.speed);
        bird.group.position.add(direction);

        // Add some vertical bobbing motion
        bird.group.position.y += Math.sin(elapsedTime * 2 + bird.group.position.x) * 0.02;

        // Add slight rotation for more natural flight
        bird.group.rotation.z = Math.sin(elapsedTime * 1.5 + bird.group.position.z * 0.5) * 0.1;

        // Flap wings with more dynamic motion
        bird.wingAngle += bird.wingSpeed * bird.wingDirection;
        if (bird.wingAngle > 0.7) {
            bird.wingDirection = -1;
        } else if (bird.wingAngle < -0.3) {
            bird.wingDirection = 1;
        }

        // Apply wing flapping with more natural motion
        const leftWing = bird.group.children[1];
        const rightWing = bird.group.children[2];
        if (leftWing && rightWing) {
            leftWing.rotation.z = Math.PI / 6 + bird.wingAngle;
            rightWing.rotation.z = -Math.PI / 6 - bird.wingAngle;

            // Add slight twist to wings for more natural motion
            leftWing.rotation.x = Math.sin(elapsedTime * 3 + bird.group.position.x) * 0.1;
            rightWing.rotation.x = Math.sin(elapsedTime * 3 + bird.group.position.x) * 0.1;
        }

        // Check if bird is too far and reset position
        if (bird.group.position.length() > 200) {
            // Reset to a new random position
            const radius = 50 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI / 4 + Math.PI / 4;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi) + 20;
            const z = radius * Math.sin(phi) * Math.sin(theta);

            bird.group.position.set(x, y, z);
            bird.group.rotation.y = Math.random() * Math.PI * 2;
        }
    });

    // Animate planes
    planes.forEach(plane => {
        // Move plane forward in its facing direction with slight variations
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(plane.group.quaternion);
        direction.multiplyScalar(plane.speed);
        plane.group.position.add(direction);

        // Add gentle banking and altitude changes for more realistic flight
        plane.group.rotation.z = Math.sin(elapsedTime * 0.5 + plane.group.position.x * 0.1) * 0.1;
        plane.group.position.y += Math.sin(elapsedTime * 0.3 + plane.group.position.z * 0.05) * 0.05;

        // Make the plane slightly pitch up and down
        plane.group.rotation.x = Math.sin(elapsedTime * 0.4 + plane.group.position.z * 0.1) * 0.03;

        // Add contrail/cloud trail more frequently for better effect
        plane.trailTimer += deltaTime;
        if (plane.trailTimer > 0.05) { // Even more frequent trails
            plane.trailTimer = 0;

            // Create larger, more visible contrail particles
            const trailGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 8, 8);
            const trailMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            });

            // Create two trails from each wing tip
            const leftTrail = new THREE.Mesh(trailGeometry, trailMaterial.clone());
            leftTrail.position.copy(plane.group.position);
            leftTrail.position.x += (Math.random() - 0.5) * 0.1;
            leftTrail.position.y += (Math.random() - 0.5) * 0.1;
            leftTrail.position.z -= 2; // Left wing tip
            scene.add(leftTrail);

            const rightTrail = new THREE.Mesh(trailGeometry, trailMaterial.clone());
            rightTrail.position.copy(plane.group.position);
            rightTrail.position.x += (Math.random() - 0.5) * 0.1;
            rightTrail.position.y += (Math.random() - 0.5) * 0.1;
            rightTrail.position.z += 2; // Right wing tip
            scene.add(rightTrail);

            // Animate trails to fade and expand with slight variations
            const duration = 2 + Math.random() * 2;
            const scale = 2 + Math.random() * 2;

            // Left trail animation
            gsap.to(leftTrail.scale, {
                x: scale,
                y: scale,
                z: scale,
                duration: duration,
                ease: 'power1.out'
            });

            gsap.to(leftTrail.material, {
                opacity: 0,
                duration: duration,
                ease: 'power1.out',
                onComplete: () => {
                    scene.remove(leftTrail);
                    leftTrail.geometry.dispose();
                    leftTrail.material.dispose();
                }
            });

            // Right trail animation
            gsap.to(rightTrail.scale, {
                x: scale,
                y: scale,
                z: scale,
                duration: duration,
                ease: 'power1.out'
            });

            gsap.to(rightTrail.material, {
                opacity: 0,
                duration: duration,
                ease: 'power1.out',
                onComplete: () => {
                    scene.remove(rightTrail);
                    rightTrail.geometry.dispose();
                    rightTrail.material.dispose();
                }
            });

            // Occasionally add engine sound effect (visual representation)
            if (Math.random() < 0.05) {
                const soundWave = new THREE.Mesh(
                    new THREE.RingGeometry(0.1, 0.2, 16),
                    new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.5,
                        side: THREE.DoubleSide
                    })
                );

                soundWave.position.copy(plane.group.position);
                soundWave.position.x -= 1.5; // Position at the back of the plane
                soundWave.rotation.y = plane.group.rotation.y;
                scene.add(soundWave);

                // Animate sound wave expanding and fading
                gsap.to(soundWave.scale, {
                    x: 5,
                    y: 5,
                    z: 5,
                    duration: 1,
                    ease: 'power1.out'
                });

                gsap.to(soundWave.material, {
                    opacity: 0,
                    duration: 1,
                    ease: 'power1.out',
                    onComplete: () => {
                        scene.remove(soundWave);
                        soundWave.geometry.dispose();
                        soundWave.material.dispose();
                    }
                });
            }
        }

        // Make the plane lights blink with realistic aviation patterns
        const leftLight = plane.group.children[5]; // Left wing light (red)
        const rightLight = plane.group.children[6]; // Right wing light (green)
        const strobeLight = plane.group.children[7]; // Top strobe light (white)

        if (leftLight && rightLight && strobeLight) {
            // Navigation lights (red/green) stay on constantly
            leftLight.visible = true;
            rightLight.visible = true;

            // Strobe light blinks rapidly
            const strobeRate = Math.sin(elapsedTime * 10) > 0.9;
            strobeLight.visible = strobeRate;

            // Add a pulsing effect to the navigation lights
            const pulseIntensity = (Math.sin(elapsedTime * 2) * 0.2) + 0.8; // Pulse between 0.8 and 1.0
            leftLight.material.emissiveIntensity = pulseIntensity;
            rightLight.material.emissiveIntensity = pulseIntensity;
        }

        // Check if plane is too far and reset position
        if (plane.group.position.length() > 300) {
            // Reset to a new random position
            const radius = 80 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const y = 30 + Math.random() * 20;

            const x = radius * Math.cos(theta);
            const z = radius * Math.sin(theta);

            plane.group.position.set(x, y, z);
            plane.group.rotation.y = Math.random() * Math.PI * 2;
        }
    });

    // Animate rain if active
    if (isRaining && raindrops.length > 0) {
        raindrops.forEach(rain => {
            const positions = rain.positions;
            const velocities = rain.velocities;

            for (let i = 0; i < positions.length; i += 3) {
                // Move raindrop down
                positions[i+1] -= velocities[i/3];

                // Reset raindrop if it goes below ground
                if (positions[i+1] < -20) {
                    positions[i+1] = 100;
                }
            }

            rain.points.geometry.attributes.position.needsUpdate = true;
        });
    }

    // Update advanced systems
    if (particleSystem) particleSystem.update(elapsedTime);
    if (modelSystem) modelSystem.update(elapsedTime);
    if (lightingSystem) lightingSystem.update(elapsedTime);
    if (audioSystem) audioSystem.update();

    // Update controls
    controls.update();

    // Render scene
    renderer.render(scene, camera);
}

// Simulate loading progress
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Hide loading screen
            setTimeout(() => {
                loadingScreen.style.opacity = 0;
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    isLoaded = true;

                    // Show popup after loading
                    showIntroPopup();

                    // Show first section
                    navigateToSection('about');
                }, 1000);
            }, 500);
        }
        loadingBar.style.width = `${progress}%`;
    }, 200);
}

// Show intro popup with enhanced animation
function showIntroPopup() {
    const popup = document.getElementById('introPopup');
    const closeBtn = document.getElementById('closePopup');
    const exploreBtn = document.getElementById('exploreBtn');
    const popupContent = popup.querySelector('.popup-content');
    const typingText = document.querySelector('.typing-text');
    const glitchText = document.querySelector('.glitch-text');

    // Text to type
    const textToType = "Detail-oriented MCA student with expertise in software development";
    let charIndex = 0;

    // Show popup with animation
    setTimeout(() => {
        popup.classList.add('show');

        // Add a futuristic entrance effect
        gsap.from(popupContent, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Animate skill tags
        const skillTags = document.querySelectorAll('.skill-tag');
        gsap.from(skillTags, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 0.5
        });

        // Animate social icons
        const socialIcons = document.querySelectorAll('.social-icon');
        gsap.from(socialIcons, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 1
        });

        // Animate explore button
        gsap.from(exploreBtn, {
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
            delay: 1.2
        });

        // Start typing effect
        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    typingText.textContent += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    // Add blinking cursor effect after typing is complete
                    typingText.style.animation = 'blink-caret 0.75s step-end infinite';
                }
            }, 50);
        }, 1000);

        // Add glitch effect to name
        setTimeout(() => {
            glitchText.classList.add('active');
        }, 800);

    }, 500);

    // Close popup when close button is clicked - using direct onclick handler
    closeBtn.onclick = function() {
        console.log('Close button clicked');
        gsap.to(popupContent, {
            y: 100,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                popup.classList.remove('show');
            }
        });
    };

    // Close popup when explore button is clicked with rocket effect - using direct onclick handler
    exploreBtn.onclick = function() {
        console.log('Explore button clicked');
        // First animate the button
        gsap.to(exploreBtn, {
            scale: 1.2,
            duration: 0.3,
            ease: 'power2.in'
        });

        // Then animate the popup content
        setTimeout(() => {
            gsap.to(popupContent, {
                y: -100,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.in',
                onComplete: () => {
                    popup.classList.remove('show');
                }
            });
        }, 300);
    };

    // Add keyframe animation for blinking cursor
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blink-caret {
            from, to { border-right-color: transparent }
            50% { border-right-color: #00f2fe }
        }
    `;
    document.head.appendChild(style);
}

// Navigate to a section
function navigateToSection(section) {
    if (!isLoaded || !cloudObjects[section]) return;

    // Get previous section for transition
    const previousSection = currentSection;

    // Update current section
    currentSection = section;

    // Update navigation buttons
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Update info panel
    sectionTitle.textContent = portfolioData[section].title;
    sectionContent.innerHTML = portfolioData[section].content;
    infoPanel.classList.add('visible');

    // Initialize card flip system for projects section
    if (section === 'projects' && cardFlipSystem && !cardFlipSystem.isInitialized) {
        // Wait for DOM to update
        setTimeout(() => {
            cardFlipSystem.init();
        }, 100);
    }

    // Initialize skills chart for skills section
    if (section === 'skills' && skillsChartSystem && !skillsChartSystem.isInitialized) {
        // Wait for DOM to update
        setTimeout(() => {
            // Skills data
            const skillsData = [
                { name: 'PHP', value: 85, description: 'Experienced in building web applications and APIs with PHP.' },
                { name: 'Java', value: 80, description: 'Strong knowledge of Java for desktop and enterprise applications.' },
                { name: 'JavaScript', value: 75, description: 'Proficient in modern JavaScript, including ES6+ features.' },
                { name: 'SQL', value: 90, description: 'Expert in database design, optimization, and complex queries.' },
                { name: 'MongoDB', value: 70, description: 'Experience with NoSQL database design and operations.' },
                { name: 'C#', value: 65, description: 'Familiar with C# for .NET development.' },
                { name: 'HTML/CSS', value: 85, description: 'Strong front-end development skills.' },
                { name: 'Problem Solving', value: 90, description: 'Excellent analytical and problem-solving abilities.' }
            ];

            skillsChartSystem.init(skillsData);
        }, 100);
    }

    // Get target positions
    const targetPosition = cloudObjects[section].position.clone();
    const cameraPosition = new THREE.Vector3(
        targetPosition.x * 0.7,
        targetPosition.y + 3,
        targetPosition.z * 0.7
    );

    // Create transition effect
    if (transitionSystem && previousSection !== section) {
        // Get section colors
        const sectionColors = {
            about: 0x80deea,
            education: 0xa5d6a7,
            projects: 0xef9a9a,
            skills: 0xffe082,
            contact: 0xce93d8
        };

        // Create transition effect
        const fromPosition = cloudObjects[previousSection].position.clone();
        const toPosition = targetPosition.clone();

        transitionSystem.createSectionTransition(
            fromPosition,
            toPosition,
            sectionColors[section] || 0x00f2fe
        );

        // Play sound effect
        if (audioSystem) {
            audioSystem.playSound('launch');
        }

        // Change lighting theme
        if (lightingSystem) {
            lightingSystem.changeTheme(section);
        }
    }

    // Animate camera to cloud position
    gsap.to(camera.position, {
        duration: 2,
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z,
        ease: "power2.inOut",
        onUpdate: () => {
            // Make camera look at the cloud
            camera.lookAt(targetPosition);
        }
    });

    // Highlight current cloud
    Object.keys(cloudObjects).forEach(key => {
        const cloudGroup = cloudObjects[key].group;
        const targetScale = key === section ? 1.2 : 1;
        const targetY = cloudObjects[key].originalY + (key === section ? 1 : 0);

        gsap.to(cloudGroup.scale, {
            duration: 1,
            x: targetScale,
            y: targetScale,
            z: targetScale
        });

        gsap.to(cloudGroup.position, {
            duration: 1,
            y: targetY
        });

        // Update material for main cloud (first child)
        const mainCloud = cloudGroup.children[0];
        if (mainCloud && mainCloud.material) {
            gsap.to(mainCloud.material, {
                duration: 1,
                opacity: key === section ? 0.9 : 0.7,
                emissive: key === section ? new THREE.Color(0x3498db) : new THREE.Color(0x000000),
                emissiveIntensity: key === section ? 0.3 : 0
            });
        }
    });

    // Create portal effect at destination
    if (transitionSystem) {
        setTimeout(() => {
            transitionSystem.createPortalEffect(
                targetPosition,
                0x80deea,
                3,
                2
            );
        }, 1000);
    }
}

// Initialize the scene
init();
