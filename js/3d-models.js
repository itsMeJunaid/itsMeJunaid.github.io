// // 3D Models and Animations using Three.js
// let scene, camera, renderer, brainModel;
// let particles = [];

// function init3DModel() {
//     // Check if the brain model container exists
//     const brainContainer = document.getElementById('brain-model');
//     if (!brainContainer) return;

//     // Scene setup
//     scene = new THREE.Scene();
    
//     // Camera setup
//     camera = new THREE.PerspectiveCamera(75, brainContainer.clientWidth / brainContainer.clientHeight, 0.1, 1000);
//     camera.position.z = 5;
    
//     // Renderer setup
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(brainContainer.clientWidth, brainContainer.clientHeight);
//     renderer.setClearColor(0x000000, 0);
//     brainContainer.appendChild(renderer.domElement);
    
//     // Light setup
//     const ambientLight = new THREE.AmbientLight(0x404040);
//     scene.add(ambientLight);
    
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(0, 1, 1);
//     scene.add(directionalLight);
    
//     const pointLight = new THREE.PointLight(0x6e44ff, 2, 10);
//     pointLight.position.set(2, 2, 2);
//     scene.add(pointLight);
    
//     const pointLight2 = new THREE.PointLight(0xff5555, 1, 10);
//     pointLight2.position.set(-2, -2, 2);
//     scene.add(pointLight2);
    
//     // Create Neural Network Brain Model
//     createBrainModel();
    
//     // Animation loop
//     animate();
    
//     // Handle window resize
//     window.addEventListener('resize', onWindowResize, false);
// }

// function createBrainModel() {
//     // Create a group for our brain model
//     brainModel = new THREE.Group();
//     scene.add(brainModel);
    
//     // Brain structure - using a sphere as the base
//     const brainGeometry = new THREE.SphereGeometry(1.5, 32, 32);
//     const brainMaterial = new THREE.MeshPhongMaterial({
//         color: 0x222222,
//         emissive: 0x444444,
//         specular: 0x6e44ff,
//         shininess: 100,
//         transparent: true,
//         opacity: 0.8,
//         wireframe: false
//     });
    
//     const brain = new THREE.Mesh(brainGeometry, brainMaterial);
//     brainModel.add(brain);
    
//     // Add neurons (particles) inside the brain
//     createNeurons();
    
//     // Add connections between neurons
//     createNeuralConnections();
// }

// function createNeurons() {
//     const neuronsCount = 100;
//     const neuronGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    
//     for (let i = 0; i < neuronsCount; i++) {
//         // Random position within the brain
//         const theta = Math.random() * Math.PI * 2;
//         const phi = Math.acos((Math.random() * 2) - 1);
//         const radius = 1.2 * Math.random();
        
//         const x = radius * Math.sin(phi) * Math.cos(theta);
//         const y = radius * Math.sin(phi) * Math.sin(theta);
//         const z = radius * Math.cos(phi);
        
//         // Alternate colors for neurons
//         const neuronMaterial = new THREE.MeshPhongMaterial({
//             color: i % 2 === 0 ? 0x6e44ff : 0xff5555,
//             emissive: i % 2 === 0 ? 0x6e44ff : 0xff5555,
//             emissiveIntensity: 0.5
//         });
        
//         const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
//         neuron.position.set(x, y, z);
        
//         // Store original position for animation
//         neuron.userData.originalPosition = { x, y, z };
//         neuron.userData.pulseFactor = Math.random();
        
//         brainModel.add(neuron);
//         particles.push(neuron);
//     }
// }

// function createNeuralConnections() {
//     // Connect some neurons with lines
//     const lineMaterial = new THREE.LineBasicMaterial({
//         color: 0x6e44ff,
//         transparent: true,
//         opacity: 0.3
//     });
    
//     for (let i = 0; i < particles.length; i++) {
//         // Connect to 2-3 nearby neurons
//         const connectionsCount = Math.floor(Math.random() * 2) + 2;
        
//         for (let j = 0; j < connectionsCount; j++) {
//             const targetIndex = (i + j + 1) % particles.length;
            
//             // Calculate distance to avoid long connections
//             const distance = particles[i].position.distanceTo(particles[targetIndex].position);
            
//             if (distance < 1) {
//                 const lineGeometry = new THREE.BufferGeometry().setFromPoints([
//                     particles[i].position,
//                     particles[targetIndex].position
//                 ]);
                
//                 const line = new THREE.Line(lineGeometry, lineMaterial);
//                 brainModel.add(line);
                
//                 // Store connected points for animation updates
//                 line.userData = {
//                     startIndex: i,
//                     endIndex: targetIndex
//                 };
//             }
//         }
//     }
// }

// function animate() {
//     requestAnimationFrame(animate);
    
//     // Rotate the brain model
//     if (brainModel) {
//         brainModel.rotation.y += 0.003;
//         brainModel.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
        
//         // Animate neurons
//         for (let i = 0; i < particles.length; i++) {
//             const particle = particles[i];
//             const original = particle.userData.originalPosition;
            
//             // Pulse animation
//             const time = Date.now() * 0.001;
//             const pulseFactor = particle.userData.pulseFactor;
//             const pulseScale = 1 + 0.1 * Math.sin(time * pulseFactor + i);
            
//             particle.position.x = original.x * pulseScale;
//             particle.position.y = original.y * pulseScale;
//             particle.position.z = original.z * pulseScale;
            
//             // Random "firing" effect for neurons
//             if (Math.random() < 0.001) {
//                 gsap.to(particle.material, {
//                     emissiveIntensity: 2,
//                     duration: 0.3,
//                     yoyo: true,
//                     repeat: 1,
//                     onComplete: () => {
//                         particle.material.emissiveIntensity = 0.5;
//                     }
//                 });
//             }
//         }
        
//         // Update neural connections
//         brainModel.children.forEach(child => {
//             if (child instanceof THREE.Line && child.userData.startIndex !== undefined) {
//                 const startParticle = particles[child.userData.startIndex];
//                 const endParticle = particles[child.userData.endIndex];
                
//                 const lineGeometry = new THREE.BufferGeometry().setFromPoints([
//                     startParticle.position,
//                     endParticle.position
//                 ]);
                
//                 child.geometry.dispose();
//                 child.geometry = lineGeometry;
//             }
//         });
//     }
    
//     renderer.render(scene, camera);
// }

// function onWindowResize() {
//     const brainContainer = document.getElementById('brain-model');
//     if (!brainContainer) return;
    
//     camera.aspect = brainContainer.clientWidth / brainContainer.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(brainContainer.clientWidth, brainContainer.clientHeight);
// }

// // Initialize the 3D model when the DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     init3DModel();
// });