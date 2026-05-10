import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { overlay, canvas } from './EasterEgg.css';

interface ParticleGalaxyProps {
  onClose: () => void;
}

const PARTICLE_COUNT = 12000;
const TRAIL_COUNT = 500;
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
    const logoWidth = aspect > 1.5 ? 16 : 12;
    const logoHeight = logoWidth * 0.6;

    const targetPositions = generateLogoPoints(logoWidth, logoHeight);

    const initialPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const flowOffsets = new Float32Array(PARTICLE_COUNT);

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
      flowOffsets[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(initialPositions.slice(), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      varying vec2 vUv;
      void main() {
        vColor = color;
        vUv = position.xy;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (120.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
        float glow = exp(-dist * 4.0) * 0.5;
        
        float colorShift = sin(uTime * 1.5 + vUv.x * 0.5) * 0.15;
        vec3 shiftedColor = vColor;
        shiftedColor.r = min(1.0, vColor.r + colorShift);
        shiftedColor.g = min(1.0, vColor.g + colorShift * 0.3);
        
        gl_FragColor = vec4(shiftedColor + glow, alpha * 0.85);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const trailPositions = new Float32Array(TRAIL_COUNT * 3);
    const trailColors = new Float32Array(TRAIL_COUNT * 3);
    const trailSizes = new Float32Array(TRAIL_COUNT);
    const trailAlphas = new Float32Array(TRAIL_COUNT);
    let trailIndex = 0;

    for (let i = 0; i < TRAIL_COUNT; i++) {
      trailPositions[i * 3] = 0;
      trailPositions[i * 3 + 1] = 0;
      trailPositions[i * 3 + 2] = -100;
      trailColors[i * 3] = 1;
      trailColors[i * 3 + 1] = 0.2;
      trailColors[i * 3 + 2] = 0.1;
      trailSizes[i] = 0;
      trailAlphas[i] = 0;
    }

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

    const trailVertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (80.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const trailFragmentShader = `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha * 0.6);
      }
    `;

    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const trailParticles = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trailParticles);

    const mouse = new THREE.Vector2(9999, 9999);
    const mouseWorld = new THREE.Vector3();
    const prevMouseWorld = new THREE.Vector3();
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

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const positions = geometry.attributes.position.array as Float32Array;
      const settled = elapsed > SETTLE_DELAY + SETTLE_DURATION;

      material.uniforms.uTime.value = elapsed;

      const mouseDelta = mouseWorld.distanceTo(prevMouseWorld);
      if (mouseDelta > 0.01 && settled) {
        const ti = trailIndex % TRAIL_COUNT;
        trailPositions[ti * 3] = mouseWorld.x + (Math.random() - 0.5) * 0.1;
        trailPositions[ti * 3 + 1] = mouseWorld.y + (Math.random() - 0.5) * 0.1;
        trailPositions[ti * 3 + 2] = (Math.random() - 0.5) * 0.2;
        trailSizes[ti] = 0.3 + Math.random() * 0.3;
        trailAlphas[ti] = 1;
        trailIndex++;
      }
      prevMouseWorld.copy(mouseWorld);

      for (let i = 0; i < TRAIL_COUNT; i++) {
        trailAlphas[i] *= 0.96;
        trailSizes[i] *= 0.98;
        if (trailAlphas[i] < 0.01) {
          trailPositions[i * 3 + 2] = -100;
        }
      }
      trailGeometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.size.needsUpdate = true;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        const tx = targetPositions[i3];
        const ty = targetPositions[i3 + 1];
        const tz = targetPositions[i3 + 2];

        const distToMouse = Math.sqrt(
          (positions[i3] - mouseWorld.x) ** 2 +
            (positions[i3 + 1] - mouseWorld.y) ** 2
        );

        const repelRadius = 0.8;
        const repelStrength = 0.08;

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
          const eased = progress * progress * (3 - 2 * progress);
          const lerpFactor = 0.02 + eased * 0.06;

          positions[i3] += (tx - positions[i3]) * lerpFactor;
          positions[i3 + 1] += (ty - positions[i3 + 1]) * lerpFactor;
          positions[i3 + 2] += (tz - positions[i3 + 2]) * lerpFactor;
        }

        const damping = settled ? 0.92 : 0.97;
        velocities[i3] *= damping;
        velocities[i3 + 1] *= damping;
        velocities[i3 + 2] *= damping;

        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        if (settled) {
          const flowX = Math.sin(elapsed * 1.5 + flowOffsets[i]) * 0.002;
          const flowY = Math.cos(elapsed * 0.8 + flowOffsets[i] * 0.5) * 0.001;
          positions[i3] += flowX;
          positions[i3 + 1] += flowY;

          const wave = Math.sin(elapsed * 2 + positions[i3] * 1.5 + positions[i3 + 1] * 1.5) * 0.03;
          positions[i3 + 2] = targetPositions[i3 + 2] + wave;
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
      trailGeometry.dispose();
      trailMaterial.dispose();
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
