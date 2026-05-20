import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function Loader2() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;

    // High-segment sphere we displace per-vertex to make an organic blob
    const geometry = new THREE.SphereGeometry(1.4, 256, 256);
    const basePositions = geometry.attributes.position.array.slice();
    const vertexCount = geometry.attributes.position.count;

    const material = new THREE.MeshPhysicalMaterial({
      color: "#C13Aed",
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85,
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [120, 480],
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      attenuationColor: new THREE.Color("#ff5cc8"),
      attenuationDistance: 2.5,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.8);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);

    const pinkLight = new THREE.DirectionalLight("#ff4fd8", 0.8);
    pinkLight.position.set(-4, -2, 2);
    scene.add(pinkLight);

    scene.add(new THREE.AmbientLight("#e8d8ff", 0.6));

    // Grab-and-throw: drag the blob around, fling it, and watch it bounce off the edges
    const el = renderer.domElement;
    el.style.cursor = "grab";
    const RADIUS = 1.55; // effective blob radius incl. displacement, for edge collisions
    let isDragging = false;
    let grabScale = 1;
    let squish = 0; // transient impact squish
    const velocity = new THREE.Vector3();
    const target = new THREE.Vector3();
    const grabOffset = new THREE.Vector3();

    const getBounds = () => {
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      return { halfW: halfH * camera.aspect, halfH };
    };
    const pointerToWorld = (e, out) => {
      const rect = el.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const { halfW, halfH } = getBounds();
      return out.set(ndcX * halfW, ndcY * halfH, 0);
    };

    const onPointerDown = (e) => {
      isDragging = true;
      velocity.set(0, 0, 0);
      pointerToWorld(e, target);
      grabOffset.copy(blob.position).sub(target); // keep grab point under cursor
      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      pointerToWorld(e, target).add(grabOffset);
    };
    const onPointerUp = (e) => {
      isDragging = false;
      el.style.cursor = "grab";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    const tmp = new THREE.Vector3();
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const pos = geometry.attributes.position.array;

      // Gentle global pulse + layered sine displacement = breathing organic blob
      const pulse = 1 + Math.sin(t * 0.9) * 0.04;
      for (let i = 0; i < vertexCount; i++) {
        const ix = i * 3;
        tmp.set(basePositions[ix], basePositions[ix + 1], basePositions[ix + 2]);
        const len = tmp.length();
        tmp.normalize();

        const wave =
          Math.sin(tmp.x * 3 + t * 1.2) * 0.12 +
          Math.sin(tmp.y * 4 + t * 0.9) * 0.1 +
          Math.sin(tmp.z * 5 + t * 1.5) * 0.08;

        const r = (len + wave) * pulse;
        pos[ix] = tmp.x * r;
        pos[ix + 1] = tmp.y * r;
        pos[ix + 2] = tmp.z * r;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      const { halfW, halfH } = getBounds();
      const limX = halfW - RADIUS;
      const limY = halfH - RADIUS;

      if (isDragging) {
        // Follow the cursor; velocity is derived from how fast we're moving it
        const next = blob.position.clone().lerp(target, 0.4);
        velocity.copy(next).sub(blob.position);
        blob.position.copy(next);
        grabScale += (0.92 - grabScale) * 0.2;
      } else {
        blob.position.add(velocity);
        velocity.multiplyScalar(0.99); // air friction

        // Bounce off the page edges
        if (blob.position.x > limX || blob.position.x < -limX) {
          blob.position.x = THREE.MathUtils.clamp(blob.position.x, -limX, limX);
          velocity.x *= -0.8;
          squish = Math.min(1, Math.abs(velocity.x) * 6);
        }
        if (blob.position.y > limY || blob.position.y < -limY) {
          blob.position.y = THREE.MathUtils.clamp(blob.position.y, -limY, limY);
          velocity.y *= -0.8;
          squish = Math.min(1, Math.abs(velocity.y) * 6);
        }
        grabScale += (1 - grabScale) * 0.1;
      }

      // Spin proportional to travel so it looks like it's rolling
      blob.rotation.y += velocity.x * 0.4 + 0.0015;
      blob.rotation.x += -velocity.y * 0.4;

      squish *= 0.85;
      blob.scale.setScalar(grabScale * (1 - squish * 0.25));

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      geometry.dispose();
      material.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="min-h-screen w-full" style={{ background: "#ffffff" }} />;
}
