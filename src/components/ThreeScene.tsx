import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  progress: number; // 0 to 100
  activeSection: 1 | 2 | 3;
  isSubmitted: boolean;
  className?: string;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  progress,
  activeSection,
  isSubmitted,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    progress,
    activeSection,
    isSubmitted,
    targetRotationY: 0,
    targetRotationX: 0,
    currentRotationY: 0,
    currentRotationX: 0,
    mouseNormX: 0,
    mouseNormY: 0,
    alignmentProgress: 0,
  });

  // Keep stateRef updated with props
  useEffect(() => {
    stateRef.current.progress = progress;
    stateRef.current.activeSection = activeSection;
    stateRef.current.isSubmitted = isSubmitted;

    // React to section changes with a sharp geometric rotation increment
    stateRef.current.targetRotationY = (activeSection - 1) * (Math.PI / 2) + (progress / 100) * (Math.PI / 4);
  }, [progress, activeSection, isSubmitted]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08080a); // Deep Carbon

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    // ROOT HIERARCHY
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. TOPOGRAPHIC WIREFRAME MONOLITH (Icosahedron / Geodesic Architectural Core)
    const monolithGeom = new THREE.IcosahedronGeometry(2.4, 2);
    
    // Wireframe edges strictly in #3A3F4B (Muted technical steel)
    const wireframeGeom = new THREE.WireframeGeometry(monolithGeom);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x3a3f4b,
      transparent: true,
      opacity: 0.85,
      linewidth: 1,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeom, wireframeMat);
    rootGroup.add(wireframeMesh);

    // 2. PRECISION VERTEX POINT CLOUD strictly in #F4F4F6 (Stark White) + #FF3B00 highlights
    const posAttr = monolithGeom.attributes.position;
    const vertexCount = posAttr.count;
    const colors = new Float32Array(vertexCount * 3);
    const starkWhite = new THREE.Color(0xf4f4f6);
    const aerospaceOrange = new THREE.Color(0xff3b00);

    for (let i = 0; i < vertexCount; i++) {
      // Highlight ~8% of key vertices with Aerospace Orange
      const isAccent = (i % 12 === 0);
      const c = isAccent ? aerospaceOrange : starkWhite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    monolithGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Sharp square vertex points (canvas pixel texture for crisp edges)
    const pointsCanvas = document.createElement('canvas');
    pointsCanvas.width = 16;
    pointsCanvas.height = 16;
    const ctx = pointsCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 16, 16);
    }
    const pointsTexture = new THREE.CanvasTexture(pointsCanvas);
    pointsTexture.magFilter = THREE.NearestFilter;
    pointsTexture.minFilter = THREE.NearestFilter;

    const pointsMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      map: pointsTexture,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
    });
    const pointsMesh = new THREE.Points(monolithGeom, pointsMat);
    rootGroup.add(pointsMesh);

    // 3. INNER GEOMETRIC OCTAHEDRON NUCLEUS
    const innerGeom = new THREE.OctahedronGeometry(1.2, 0);
    const innerWire = new THREE.WireframeGeometry(innerGeom);
    const innerMat = new THREE.LineBasicMaterial({
      color: 0x7a7f8a,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.LineSegments(innerWire, innerMat);
    rootGroup.add(innerMesh);

    // 4. ARCHITECTURAL COORDINATE RINGS (Exposed Gyro Hairlines)
    const ringRadius1 = 3.2;
    const ringRadius2 = 3.7;
    const ringGeom1 = new THREE.BufferGeometry();
    const ringGeom2 = new THREE.BufferGeometry();
    const segments = 64;
    const ringPoints1: number[] = [];
    const ringPoints2: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      ringPoints1.push(Math.cos(theta) * ringRadius1, 0, Math.sin(theta) * ringRadius1);
      ringPoints2.push(0, Math.cos(theta) * ringRadius2, Math.sin(theta) * ringRadius2);
    }
    ringGeom1.setAttribute('position', new THREE.Float32BufferAttribute(ringPoints1, 3));
    ringGeom2.setAttribute('position', new THREE.Float32BufferAttribute(ringPoints2, 3));

    const ringMat = new THREE.LineBasicMaterial({
      color: 0x22242a,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh1 = new THREE.Line(ringGeom1, ringMat);
    const ringMesh2 = new THREE.Line(ringGeom2, ringMat);
    rootGroup.add(ringMesh1);
    rootGroup.add(ringMesh2);

    // 5. VECTOR TRAJECTORY RAY (Locked career vector for alignment state)
    const vectorGeom = new THREE.BufferGeometry();
    const vectorPoints = [
      0, -4.5, 0,
      0, 4.5, 0,
    ];
    vectorGeom.setAttribute('position', new THREE.Float32BufferAttribute(vectorPoints, 3));
    const vectorMat = new THREE.LineBasicMaterial({
      color: 0xff3b00,
      transparent: true,
      opacity: 0.0,
      linewidth: 2,
    });
    const vectorRay = new THREE.Line(vectorGeom, vectorMat);
    rootGroup.add(vectorRay);

    // 6. SUBTLE BACKGROUND PRECISION DEPTH GRID
    const gridHelper = new THREE.GridHelper(18, 18, 0x22242a, 0x14151a);
    gridHelper.position.y = -3.8;
    scene.add(gridHelper);

    // MOUSE PARALLAX TRACKER
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseNormX = x;
      stateRef.current.mouseNormY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 60FPS ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      const { mouseNormX, mouseNormY, targetRotationY, isSubmitted } = stateRef.current;

      // Damped camera parallax tracking
      const targetCamX = mouseNormX * 0.7;
      const targetCamY = 2.5 + mouseNormY * 0.4;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      if (!isSubmitted) {
        // IDLE & ACTIVE PROGRESS STATE
        // Continuous subtle kinetic rotation + form progress offset
        const baseSpeed = 0.15;
        wireframeMesh.rotation.y += baseSpeed * delta;
        pointsMesh.rotation.y = wireframeMesh.rotation.y;
        
        // Counter-rotation for inner nucleus
        innerMesh.rotation.y -= baseSpeed * 1.5 * delta;
        innerMesh.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;

        // Form progress reactive morphing
        const targetRotY = targetRotationY + (mouseNormX * 0.3);
        rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.04;
        rootGroup.rotation.x += (-mouseNormY * 0.2 - rootGroup.rotation.x) * 0.04;

        // Rotating coordinate rings
        ringMesh1.rotation.y += 0.08 * delta;
        ringMesh2.rotation.z += 0.05 * delta;

        // Vector ray is dimmed before submission
        vectorMat.opacity = Math.max(0, vectorMat.opacity - delta * 2);
      } else {
        // LOCKED SUBMISSION STATE: RAPID ALIGNMENT INTO GEOMETRIC VECTOR
        stateRef.current.alignmentProgress = Math.min(1, stateRef.current.alignmentProgress + delta * 3.5);
        const t = stateRef.current.alignmentProgress;

        // Smoothly snap rotation to vertical alignment
        rootGroup.rotation.x += (0 - rootGroup.rotation.x) * (0.15 + t * 0.2);
        rootGroup.rotation.y += (0 - rootGroup.rotation.y) * (0.15 + t * 0.2);
        rootGroup.rotation.z += (0 - rootGroup.rotation.z) * (0.15 + t * 0.2);
        
        wireframeMesh.rotation.x += (0 - wireframeMesh.rotation.x) * 0.2;
        wireframeMesh.rotation.z += (0 - wireframeMesh.rotation.z) * 0.2;
        wireframeMesh.rotation.y += delta * 0.8; // Controlled spin along locked axis
        pointsMesh.rotation.y = wireframeMesh.rotation.y;

        // Reveal glowing trajectory vector beam
        vectorMat.opacity = Math.min(1.0, vectorMat.opacity + delta * 2.5);

        // Ring lock: align rings horizontally and vertically
        ringMesh1.rotation.x += (Math.PI / 2 - ringMesh1.rotation.x) * 0.1;
        ringMesh2.rotation.y += (0 - ringMesh2.rotation.y) * 0.1;

        // Wireframe line color shifts to brighter aerospace anodized state
        wireframeMat.color.setHex(0x7a7f8a);
      }

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      monolithGeom.dispose();
      wireframeGeom.dispose();
      wireframeMat.dispose();
      pointsTexture.dispose();
      pointsMat.dispose();
      innerGeom.dispose();
      innerWire.dispose();
      innerMat.dispose();
      ringGeom1.dispose();
      ringGeom2.dispose();
      ringMat.dispose();
      vectorGeom.dispose();
      vectorMat.dispose();
      gridHelper.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[220px] ${className}`}>
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
      
      {/* 3D Telemetry Corner Markers */}
      <div className="absolute top-3 left-3 font-mono text-[9px] tracking-technical text-stark-steel pointer-events-none uppercase">
        GEOM.LATTICE // 60FPS
      </div>
      <div className="absolute top-3 right-3 font-mono text-[9px] tracking-technical text-stark-steel pointer-events-none uppercase">
        {isSubmitted ? 'VECTOR: LOCKED' : `PROG: ${Math.round(progress)}%`}
      </div>
      <div className="absolute bottom-3 left-3 font-mono text-[9px] tracking-technical text-stark-dim pointer-events-none">
        +3D_TOPOGRAPHIC_MONOLITH
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[9px] tracking-technical text-signal-orange pointer-events-none">
        {isSubmitted ? 'TRAJECTORY: ALIGNED' : 'SYS.REACTIVE'}
      </div>
    </div>
  );
};
