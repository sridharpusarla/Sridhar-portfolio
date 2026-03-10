// --- System Initialization (Loader) ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        document.body.style.overflowY = 'auto'; // Re-enable scrolling
        
        // Trigger initial animations
        const hero = document.getElementById('hero');
        if (hero) hero.classList.add('show');
    }, 2000); // 2 seconds minimum loading time for effect
});

// Disable scrolling initially
document.body.style.overflowY = 'hidden';

// --- Custom Cursor ---
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Slight delay for follower
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });
}

// --- Navigation & Scroll Progress ---
const navbar = document.querySelector('.navbar');
const scrollProgress = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    // Navbar styling on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll progress bar
    const totalScroll = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (totalScroll / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    
    // Active navigation link update
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navList = document.querySelector('.nav-links');

if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
}

// --- Section Reveal Animation ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Reveal only once
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden').forEach(el => {
    // Avoid re-observing hero if already triggered by loader
    if(el.id !== 'hero') {
        observer.observe(el);
    }
});

// --- 3D Tilt Effect ---
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        if(window.innerWidth <= 768) return; // Disable on mobile
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15; // Max rotation 15deg
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
        
        // Glow effect for cert cards or specific elements if exists inside
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.transform = `translate(${x - centerX}px, ${y - centerY}px)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.transform = 'translate(0px, 0px)';
        }
    });
});


// --- Three.js Background Implementation ---
// Setup scene, camera, renderer
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030712, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent bg
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20; // Spread over 20 units
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Particle Material (Neon Blue)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Floating Geometric Shapes
const shapes = [];
const geometries = [
    new THREE.TorusGeometry(0.5, 0.1, 16, 100),
    new THREE.OctahedronGeometry(0.6),
    new THREE.IcosahedronGeometry(0.7),
    new THREE.BoxGeometry(0.8, 0.8, 0.8)
];

const colors = [0x00f0ff, 0x7000ff, 0x00ff88];

for(let i = 0; i < 25; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = new THREE.MeshBasicMaterial({ 
        color: colors[Math.floor(Math.random() * colors.length)], 
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    
    // Random positioning
    mesh.position.x = (Math.random() - 0.5) * 30;
    mesh.position.y = (Math.random() - 0.5) * 30;
    mesh.position.z = (Math.random() - 0.5) * 15 - 5; // Keep behind UI
    
    // Random rotation speed
    mesh.userData = {
        rotX: (Math.random() - 0.5) * 0.01,
        rotY: (Math.random() - 0.5) * 0.01
    };
    
    shapes.push(mesh);
    scene.add(mesh);
}

camera.position.z = 5;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll Interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Parallax particle movement based on mouse
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    // Camera movement based on scroll
    camera.position.y = -scrollY * 0.002;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    
    // Rotate floating shapes
    shapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotX;
        shape.rotation.y += shape.userData.rotY;
        // Slight bobbing effect
        shape.position.y += Math.sin(elapsedTime * 2 + shape.position.x) * 0.002;
    });
    
    renderer.render(scene, camera);
}

// Start Animation
animate();
