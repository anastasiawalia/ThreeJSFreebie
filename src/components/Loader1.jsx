import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export default function Loader1() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();

    // Soft radial gradient background for depth instead of a flat fill
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 512;
    bgCanvas.height = 512;
    const bgCtx = bgCanvas.getContext("2d");
    const bgGrad = bgCtx.createRadialGradient(256, 220, 60, 256, 256, 400);
    bgGrad.addColorStop(0, "#1a1228");
    bgGrad.addColorStop(1, "#0a0710");
    bgCtx.fillStyle = bgGrad;
    bgCtx.fillRect(0, 0, 512, 512);
    const bgTexture = new THREE.CanvasTexture(bgCanvas);
    scene.background = bgTexture;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // Environment map for real reflections on the metallic surface
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 128, 128),
      new THREE.MeshPhysicalMaterial({
        color: "#8338EC",
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.2,
      })
    );
    scene.add(sphere);

    // Subtle floating particles for atmosphere
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Procedural circular sprite so points render as soft round dots
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(spriteCanvas);

    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: "#C9A9FF",
        size: 0.03,
        map: particleTexture,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(particles);

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.6);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);

    const tintLight = new THREE.DirectionalLight("#B923FF", 0.5);
    tintLight.position.set(-3, -2, 2);
    scene.add(tintLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 9;

    // Gentle bloom for a soft premium glow
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.45, // strength
      0.7, // radius
      0.9 // threshold
    );
    composer.addPass(bloomPass);
    composer.setSize(width, height);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.003;
      particles.rotation.y -= 0.0005;
      controls.update();
      composer.render();
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      sphere.geometry.dispose();
      sphere.material.dispose();
      particleGeo.dispose();
      particles.material.dispose();
      particleTexture.dispose();
      bgTexture.dispose();
      envMap.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="min-h-screen w-full" style={{ background: "#0a0710" }} />;
}
