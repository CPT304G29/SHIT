import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { overlay, canvas } from './EasterEgg.css';

interface ParticleGalaxyProps {
  onClose: () => void;
}

const PARTICLE_COUNT = 12000;
const SETTLE_DURATION = 3;
const SETTLE_DELAY = 1.2;

function generateLogoPoints(width: number, height: number): Float32Array {
  const points: number[] = [];
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d')!;

  tempCanvas.width = 2048;
  tempCanvas.height = 1536;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 420px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('SHIT', tempCanvas.width / 2, tempCanvas.height * 0.3);

  ctx.font = '600 100px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Smart Handling Inventory Tracker', tempCanvas.width / 2, tempCanvas.height * 0.58);

  const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;

  for (let y = 0; y < tempCanvas.height; y += 4) {
    for (let x = 0; x < tempCanvas.width; x += 4) {
      const idx = (y * tempCanvas.width + x) * 4;
      if (data[idx] > 128) {
        points.push(
          (x / tempCanvas.width - 0.5) * width,
          -(y / tempCanvas.height - 0.5) * height,
          (Math.random() - 0.5) * 0.1
        );
      }
    }
  }

  while (points.length < PARTICLE_COUNT * 3) {
    const idx = Math.floor(Math.random() * (points.length / 3)) * 3;
    points.push(
      points[idx] + (Math.random() - 0.5) * 0.06,
      points[idx + 1] + (Math.random() - 0.5) * 0.06,
      (Math.random() - 0.5) * 0.1
    );
  }

  return new Float32Array(points.slice(0, PARTICLE_COUNT * 3));
}

export function ParticleGalaxy({ onClose }: ParticleGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;

    const aspect = width / height;
    const logoWidth = aspect > 1.5 ? 12 : 9;
    const logoHeight = logoWidth * 0.65;

    const targetPositions = generateLogoPoints(logoWidth, logoHeight);

    const initialPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = 6 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      initialPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      initialPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      initialPositions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      const isRed = Math.random() > 0.2;
      if (isRed) {
        const r = 0.85 + Math.random() * 0.15;
        colors[i3] = r;
        colors[i3 + 1] = Math.random() * 0.08;
        colors[i3 + 2] = Math.random() * 0.05;
      } else {
        const w = 0.9 + Math.random() * 0.1;
        colors[i3] = w;
        colors[i3 + 1] = w;
        colors[i3 + 2] = w;
      }

      sizes[i] = 0.3 + Math.random() * 0.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(initialPositions.slice(), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (120.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
        float glow = exp(-dist * 4.0) * 0.5;
        gl_FragColor = vec4(vColor + glow, alpha * 0.85);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const mouse = new THREE.Vector2(9999, 9999);
    const mouseWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.ray.intersectPlane(planeZ, mouseWorld);
    };

    window.addEventListener('mousemove', onMouseMove);

    const startTime = performance.now();
    let breathPhase = 0;

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const positions = geometry.attributes.position.array as Float32Array;

      breathPhase += 0.015;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        const tx = targetPositions[i3];
        const ty = targetPositions[i3 + 1];
        const tz = targetPositions[i3 + 2];

        const dx = tx - positions[i3];
        const dy = ty - positions[i3 + 1];
        const dz = tz - positions[i3 + 2];

        const distToMouse = Math.sqrt(
          (positions[i3] - mouseWorld.x) ** 2 +
            (positions[i3 + 1] - mouseWorld.y) ** 2
        );

        const repelRadius = 0.8;
        const repelStrength = 0.08;
        const settled = elapsed > SETTLE_DELAY + SETTLE_DURATION;

        if (distToMouse < repelRadius && settled) {
          const repelForce = (1 - distToMouse / repelRadius) * repelStrength;
          const nx = positions[i3] - mouseWorld.x;
          const ny = positions[i3 + 1] - mouseWorld.y;
          const len = Math.sqrt(nx * nx + ny * ny) || 1;
          velocities[i3] += (nx / len) * repelForce * 0.02;
          velocities[i3 + 1] += (ny / len) * repelForce * 0.02;
        }

        if (elapsed < SETTLE_DELAY) {
          const drift = 0.0003;
          velocities[i3] += (Math.random() - 0.5) * drift;
          velocities[i3 + 1] += (Math.random() - 0.5) * drift;
          velocities[i3 + 2] += (Math.random() - 0.5) * drift;
        } else {
          const progress = Math.min((elapsed - SETTLE_DELAY) / SETTLE_DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const springStrength = 0.012 * eased;

          velocities[i3] += dx * springStrength;
          velocities[i3 + 1] += dy * springStrength;
          velocities[i3 + 2] += dz * springStrength;
        }

        const damping = settled ? 0.92 : 0.97;
        velocities[i3] *= damping;
        velocities[i3 + 1] *= damping;
        velocities[i3 + 2] *= damping;

        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        if (settled) {
          const breathe = Math.sin(breathPhase + i * 0.003) * 0.001;
          positions[i3] += breathe;
          positions[i3 + 1] += breathe * 0.5;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      const time = performance.now() * 0.001;
      particles.rotation.y = Math.sin(time * 0.2) * 0.02;

      renderer.render(scene, camera);
      sceneRef.current = { animationId: requestAnimationFrame(animate) };
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(sceneRef.current?.animationId || 0);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  return (
    <div className={overlay} onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div ref={containerRef} className={canvas} />
    </div>
  );
}
