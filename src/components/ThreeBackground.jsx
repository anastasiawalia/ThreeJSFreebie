import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';

const ThreeBackground = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const stateRef = useRef('globe'); // 'globe', 'exploding', 'reconnecting'
  const mouseVelocityRef = useRef(0);
  const lastMouseTimeRef = useRef(Date.now());
  const positionsRef = useRef(null);
  const globePositionsRef = useRef(null);
  const explodedPositionsRef = useRef(null);

  // Expose method to trigger explosion
  useImperativeHandle(ref, () => ({
    triggerExplosion: () => {
      stateRef.current = 'exploding';
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountRef.current.appendChild(renderer.domElement);

    // Particle system setup
    const particleCount = 2500;
    const radius = 2; // Globe radius

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Store positions for globe and exploded states
    const globePositions = new Float32Array(particleCount * 3);
    const explodedPositions = new Float32Array(particleCount * 3);

    // Particle color
    const particleColor = new THREE.Color(0xEDE7F6);

    // Generate globe positions using spherical coordinates
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spherical coordinates for globe
      const theta = Math.random() * Math.PI * 2; // Azimuth angle
      const phi = Math.acos(2 * Math.random() - 1); // Polar angle
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      globePositions[i3] = x;
      globePositions[i3 + 1] = y;
      globePositions[i3 + 2] = z;
      
      // Initial positions (start as globe)
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Random exploded positions (scattered outward)
      const explosionRadius = 4;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const distance = 1 + Math.random() * explosionRadius;
      
      const ex = distance * Math.cos(elevation) * Math.cos(angle);
      const ey = distance * Math.cos(elevation) * Math.sin(angle);
      const ez = distance * Math.sin(elevation);
      
      explodedPositions[i3] = ex;
      explodedPositions[i3 + 1] = ey;
      explodedPositions[i3 + 2] = ez;
      
      // Use beige color for all particles
      colors[i3] = particleColor.r;
      colors[i3 + 1] = particleColor.g;
      colors[i3 + 2] = particleColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create round particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.1,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
      alphaTest: 0.001
    });

    // Create points
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    positionsRef.current = positions;
    globePositionsRef.current = globePositions;
    explodedPositionsRef.current = explodedPositions;

    // Mouse tracking
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTime = Date.now();
    let mouseMoveTimeout = null;

    const handleMouseMove = (event) => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Normalized device coordinates (-1 to 1)
      mouseRef.current.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate velocity
      const dx = event.clientX - lastMouseX;
      const dy = event.clientY - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      mouseVelocityRef.current = distance / (deltaTime || 1);
      
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;

      // Change state based on mouse movement
      if (mouseVelocityRef.current > 0.05) {
        if (stateRef.current === 'globe' || stateRef.current === 'reconnecting') {
          stateRef.current = 'exploding';
        }
      }

      // Clear existing timeout
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }

      // Set timeout to detect when mouse stops
      mouseMoveTimeout = setTimeout(() => {
        if (stateRef.current === 'exploding') {
          stateRef.current = 'reconnecting';
        }
      }, 150); // Wait 150ms after last movement
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Parallax scroll effect
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const positions = positionsRef.current;
      const globePositions = globePositionsRef.current;
      const explodedPositions = explodedPositionsRef.current;
      
      if (!positions || !globePositions || !explodedPositions) return;

      // Smooth mouse position
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // Update particle positions based on state
      const mouseInfluence = 2.5; // How much mouse affects particles
      
      // Different lerp factors for different states
      const normalLerpFactor = 0.06; // Medium speed for globe and exploding
      const reconnectLerpFactor = 0.02; // Slower speed for reconnecting
      const lerpFactor = stateRef.current === 'reconnecting' ? reconnectLerpFactor : normalLerpFactor;

      // Convert mouse position to 3D space
      const mouseX = mouseRef.current.x * mouseInfluence;
      const mouseY = mouseRef.current.y * mouseInfluence;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let targetX, targetY, targetZ;

        if (stateRef.current === 'globe') {
          // Target is globe position
          targetX = globePositions[i3];
          targetY = globePositions[i3 + 1];
          targetZ = globePositions[i3 + 2];
        } else if (stateRef.current === 'exploding') {
          // Particles follow cursor - blend between exploded position and mouse
          const baseX = explodedPositions[i3];
          const baseY = explodedPositions[i3 + 1];
          const baseZ = explodedPositions[i3 + 2];
          
          // Calculate direction from particle to mouse
          const dx = mouseX - baseX;
          const dy = mouseY - baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Stronger attraction when closer to mouse
          const attractionStrength = Math.min(0.6, 1 / (distance + 0.5));
          
          // Blend base exploded position with mouse position
          targetX = baseX + (mouseX - baseX) * attractionStrength;
          targetY = baseY + (mouseY - baseY) * attractionStrength;
          targetZ = baseZ * 0.8; // Slightly flatten in Z when following cursor
        } else { // reconnecting
          // Smoothly return to globe
          targetX = globePositions[i3];
          targetY = globePositions[i3 + 1];
          targetZ = globePositions[i3 + 2];
        }

        // Lerp to target position
        positions[i3] += (targetX - positions[i3]) * lerpFactor;
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpFactor;
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpFactor;
      }

      // Update geometry
      geometry.attributes.position.needsUpdate = true;

      // Parallax effect - move particles based on scroll
      const parallaxSpeed = 0.3;
      particles.position.y = scrollY * parallaxSpeed * 0.1;

      // Rotate globe slowly when in globe state
      if (stateRef.current === 'globe' || stateRef.current === 'reconnecting') {
        particles.rotation.y += 0.002;
      }

      // Check if reconnecting is complete
      if (stateRef.current === 'reconnecting') {
        let allClose = true;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const dx = positions[i3] - globePositions[i3];
          const dy = positions[i3 + 1] - globePositions[i3 + 1];
          const dz = positions[i3 + 2] - globePositions[i3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (distance > 0.15) {
            allClose = false;
            break;
          }
        }
        if (allClose) {
          stateRef.current = 'globe';
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 0,
        width: '100%',
        height: '100%'
      }}
    />
  );
});

ThreeBackground.displayName = 'ThreeBackground';

export default ThreeBackground;
