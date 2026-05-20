import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function Loader3() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

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

    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const group = new THREE.Group();
    scene.add(group);

    // Solid mesh fades in as you scroll
    const solidMat = new THREE.MeshPhysicalMaterial({
      color: "#C13Aed",
      metalness: 0.2,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      iridescence: 0.8,
      iridescenceIOR: 1.3,
      transparent: true,
      opacity: 0,
      envMapIntensity: 1.2,
    });
    const solid = new THREE.Mesh(geometry, solidMat);
    group.add(solid);

    // Wireframe overlay fades out
    const wireMat = new THREE.LineBasicMaterial({
      color: "#ff4fd8",
      transparent: true,
      opacity: 1,
    });
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireMat);
    group.add(wire);

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.8);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);

    const pinkLight = new THREE.DirectionalLight("#ff4fd8", 0.7);
    pinkLight.position.set(-4, -2, 2);
    scene.add(pinkLight);

    scene.add(new THREE.AmbientLight("#e8d8ff", 0.6));

    const smoothstep = (x) => x * x * (3 - 2 * x);
    const getScrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    };

    let displayed = getScrollProgress();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Ease the displayed progress toward the real scroll for an intentional feel
      displayed += (getScrollProgress() - displayed) * 0.08;
      const p = smoothstep(displayed);

      group.rotation.y = displayed * Math.PI * 2.5;
      group.rotation.x = displayed * Math.PI * 0.6;
      const scale = THREE.MathUtils.lerp(0.7, 1.7, p);
      group.scale.setScalar(scale);

      solidMat.opacity = smoothstep(THREE.MathUtils.clamp((p - 0.15) / 0.6, 0, 1));
      wireMat.opacity = 1 - smoothstep(THREE.MathUtils.clamp((p - 0.1) / 0.5, 0, 1));

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      solidMat.dispose();
      wire.geometry.dispose();
      wireMat.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  const sections = [
    { title: "Scroll to reveal", sub: "Anastasia is having fun - scroll now" },
    { title: "It turns", sub: "Rotating as you move down the page." },
    { title: "It grows", sub: "Scaling up into focus." },
    { title: "It solidifies", sub: "Wireframe dissolves into a solid form." },
    { title: "The reveal", sub: "A finished, tangible object." },
  ];

  return (
    <div className="w-full bg-white">
      <div ref={mountRef} className="fixed inset-0" style={{ zIndex: 0 }} />
      <div className="relative" style={{ zIndex: 1 }}>
        {sections.map((s, i) => (
          <section
            key={i}
            className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center pointer-events-none"
          >
            <h2
              className="font-bold text-4xl md:text-6xl"
              style={{
                background: "linear-gradient(90deg, #8338EC, #ff4fd8)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {s.title}
            </h2>
            <p className="mt-4 text-lg md:text-xl text-[#8338EC]/70">{s.sub}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
