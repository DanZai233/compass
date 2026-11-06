import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createLuopanModel, LuopanComponents } from './luopanModel';
import { CameraPreset, LightingPreset } from '../../types/compass';

interface LuopanCanvasProps {
  heading: number; // 0 - 360 physical compass heading
  pitch: number; // -180 to 180 device tilt
  roll: number; // -90 to 90 device roll
  isGyroActive: boolean;
  cameraPreset: CameraPreset;
  lightingPreset: LightingPreset;
  isExploded: boolean;
  onManualRotate?: (deltaDegree: number) => void;
}

export const LuopanCanvas: React.FC<LuopanCanvasProps> = ({
  heading,
  pitch,
  roll,
  isGyroActive,
  cameraPreset,
  lightingPreset,
  isExploded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const luopanRef = useRef<LuopanComponents | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Mutable state refs to avoid restarting the render loop
  const targetHeadingRef = useRef<number>(heading);
  const currentDialAngleRef = useRef<number>(0);
  const needleAngleRef = useRef<number>(0);
  const needleVelocityRef = useRef<number>(0);

  const pitchRef = useRef<number>(pitch);
  const rollRef = useRef<number>(roll);
  const cameraPresetRef = useRef<CameraPreset>(cameraPreset);
  const lightingPresetRef = useRef<LightingPreset>(lightingPreset);
  const isExplodedRef = useRef<boolean>(isExploded);
  const explodedLerpRef = useRef<number>(0);

  // Synchronize props to refs
  useEffect(() => {
    targetHeadingRef.current = heading;
  }, [heading]);

  useEffect(() => {
    pitchRef.current = pitch;
    rollRef.current = roll;
  }, [pitch, roll]);

  useEffect(() => {
    cameraPresetRef.current = cameraPreset;
  }, [cameraPreset]);

  useEffect(() => {
    lightingPresetRef.current = lightingPreset;
  }, [lightingPreset]);

  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x12100d); // Deep lacquer aesthetic

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Initial camera position for refined Chinese craftsmanship inspection
    camera.position.set(0, 5.8, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map via PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig
    // 1. Warm directional key light catching brass highlights
    const keyLight = new THREE.DirectionalLight(0xfff0d8, 2.8);
    keyLight.position.set(3.5, 6.0, 4.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    const d = 3.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // 2. Fill cool light
    const fillLight = new THREE.DirectionalLight(0xd4e2ff, 1.2);
    fillLight.position.set(-4.0, 3.5, -3.0);
    scene.add(fillLight);

    // 3. Ambient & Hemisphere
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x1f1710, 0.9);
    scene.add(hemiLight);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't clip under table
    controls.minDistance = 1.6;
    controls.maxDistance = 12;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Create 3D Luopan Model
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const luopan = createLuopanModel(maxAnisotropy);
    scene.add(luopan.rootGroup);
    luopanRef.current = luopan;

    // Camera preset targets
    const cameraTargets: Record<CameraPreset, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
      top: { pos: new THREE.Vector3(0, 6.5, 0.001), look: new THREE.Vector3(0, 0, 0) },
      perspective: { pos: new THREE.Vector3(0, 5.0, 3.5), look: new THREE.Vector3(0, 0, 0) },
      pool: { pos: new THREE.Vector3(0, 2.2, 1.4), look: new THREE.Vector3(0, 0.05, 0) },
      exploded: { pos: new THREE.Vector3(2.5, 4.5, 4.0), look: new THREE.Vector3(0, 0.5, 0) },
    };

    // Track user drag on OrbitControls
    let isUserInteracting = false;
    controls.addEventListener('start', () => {
      isUserInteracting = true;
    });
    controls.addEventListener('end', () => {
      isUserInteracting = false;
    });

    // Animation & Kinematics loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);

      // 1. CAMERA TRANSITIONS
      const targetCam = cameraTargets[cameraPresetRef.current] || cameraTargets.perspective;
      if (!isUserInteracting) {
        // Only smoothly track preset if user isn't actively dragging camera
        camera.position.lerp(targetCam.pos, delta * 3.5);
        controls.target.lerp(targetCam.look, delta * 3.5);
      }
      controls.update();

      // 2. LIGHTING PRESETS
      if (lightingPresetRef.current === 'candle') {
        keyLight.color.setHex(0xffaa44);
        keyLight.intensity = 2.0 + Math.sin(clock.getElapsedTime() * 7) * 0.15;
        scene.background = new THREE.Color(0x0a0604);
      } else if (lightingPresetRef.current === 'temple') {
        keyLight.color.setHex(0xffd8a8);
        keyLight.intensity = 2.6;
        scene.background = new THREE.Color(0x170f0a);
      } else {
        keyLight.color.setHex(0xfff0d8);
        keyLight.intensity = 3.0;
        scene.background = new THREE.Color(0x12100d);
      }

      // 3. EXPLODED VIEW LAYER ANIMATION
      const targetExploded = isExplodedRef.current ? 1.0 : 0.0;
      explodedLerpRef.current = THREE.MathUtils.damp(explodedLerpRef.current, targetExploded, 4.0, delta);
      const ex = explodedLerpRef.current;

      if (luopan) {
        // Elevate components hierarchically
        luopan.glassDomeMesh.position.y = 0.02 + ex * 1.5;
        luopan.crossThreadMesh.position.y = ex * 1.1;
        luopan.needleGroup.position.y = -0.12 * 0.18 + ex * 0.85;
        luopan.innerDialMesh.position.y = 0.03 + ex * 0.45;
        luopan.heavenlyPoolGroup.position.y = 0.03 + ex * 0.45;

        // 4. LUOPAN ROTATION & NEEDLE DYNAMICS
        // In physical compass operation:
        // Heading is in degrees (0 = North, 90 = East, 180 = South, 270 = West).
        // In 3D space: Outer frame points towards the user's facing direction.
        // The magnetic needle always seeks Magnetic North (-Z in our scene).
        const targetRad = (targetHeadingRef.current * Math.PI) / 180;

        // Smooth dial orientation
        let dialDiff = targetRad - currentDialAngleRef.current;
        while (dialDiff > Math.PI) dialDiff -= Math.PI * 2;
        while (dialDiff < -Math.PI) dialDiff += Math.PI * 2;
        currentDialAngleRef.current += dialDiff * delta * 5.0;

        // Rotate the inner dial (天盘)
        luopan.innerDialMesh.rotation.y = -currentDialAngleRef.current;

        // Magnetic needle physics:
        // Needle points to North. It has slight spring wobble and magnetic inertia.
        const targetNeedleAngle = 0; // Relative to world North
        // Calculate difference with inner dial
        const needleSpringK = 45.0;
        const needleDamping = 6.5;

        let needleDisplacement = targetNeedleAngle - needleAngleRef.current;
        while (needleDisplacement > Math.PI) needleDisplacement -= Math.PI * 2;
        while (needleDisplacement < -Math.PI) needleDisplacement += Math.PI * 2;

        const springForce = needleDisplacement * needleSpringK;
        const dampingForce = -needleVelocityRef.current * needleDamping;
        const acceleration = springForce + dampingForce;

        needleVelocityRef.current += acceleration * delta;
        needleAngleRef.current += needleVelocityRef.current * delta;

        // Apply needle rotation in Heavenly Pool
        luopan.needleGroup.rotation.y = needleAngleRef.current;

        // 5. SPIRIT LEVEL BUBBLES MOVEMENT BASED ON PITCH & ROLL
        // Pitch (tilt front/back) -> moves along Z axis
        // Roll (tilt left/right) -> moves along X axis
        const clampedRoll = Math.max(-15, Math.min(15, rollRef.current));
        const clampedPitch = Math.max(-15, Math.min(15, pitchRef.current));

        // Tubular level 1 (Z axis)
        const bubbleZOffset = (clampedPitch / 15) * 0.12;
        luopan.levelBubbleYMesh.position.z = -1.75 + bubbleZOffset;

        // Tubular level 2 (X axis)
        const bubbleXOffset = (clampedRoll / 15) * 0.12;
        luopan.levelBubbleXMesh.position.x = -1.75 + bubbleXOffset;

        // Circular Bullseye level
        const circleR = 0.08;
        const cX = Math.max(-circleR, Math.min(circleR, (clampedRoll / 15) * circleR));
        const cZ = Math.max(-circleR, Math.min(circleR, (clampedPitch / 15) * circleR));
        luopan.levelBubbleCircularMesh.position.x = -1.6 + cX;
        luopan.levelBubbleCircularMesh.position.z = -1.6 + cZ;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (luopanRef.current) {
        luopanRef.current.dispose();
      }
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
    />
  );
};
