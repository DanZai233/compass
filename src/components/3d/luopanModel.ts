import * as THREE from 'three';
import { createDialTexture, createHeavenlyPoolTexture, createWoodTexture } from './luopanTextures';

export interface LuopanComponents {
  rootGroup: THREE.Group;
  woodBaseGroup: THREE.Group;
  innerDialMesh: THREE.Mesh;
  heavenlyPoolGroup: THREE.Group;
  needleGroup: THREE.Group;
  crossThreadMesh: THREE.LineSegments;
  glassDomeMesh: THREE.Mesh;
  levelBubbleXMesh: THREE.Mesh;
  levelBubbleYMesh: THREE.Mesh;
  levelBubbleCircularMesh: THREE.Mesh;
  contactShadow: THREE.Mesh;
  dispose: () => void;
}

/**
 * Creates the complete 3D procedural Feng Shui Luopan model.
 */
export function createLuopanModel(maxAnisotropy: number = 8): LuopanComponents {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'LuopanRoot';

  const woodBaseGroup = new THREE.Group();
  woodBaseGroup.name = 'WoodBaseGroup';
  rootGroup.add(woodBaseGroup);

  // ---------------------------------------------------------------------------
  // 1. PROCEDURAL TEXTURES
  // ---------------------------------------------------------------------------
  const dialTexture = createDialTexture(true);
  dialTexture.anisotropy = maxAnisotropy;

  const poolTexture = createHeavenlyPoolTexture();
  poolTexture.anisotropy = maxAnisotropy;

  const woodTexture = createWoodTexture();
  woodTexture.anisotropy = maxAnisotropy;

  // ---------------------------------------------------------------------------
  // 2. MATERIALS
  // ---------------------------------------------------------------------------
  // Rosewood Square Plate
  const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.42,
    metalness: 0.08,
    color: 0xffffff,
  });

  // Brushed Antique Brass Dial
  const dialMaterial = new THREE.MeshStandardMaterial({
    map: dialTexture,
    roughness: 0.28,
    metalness: 0.82,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  // Polished Antique Brass Accents (corner protectors, pins, rim)
  const polishedBrassMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfb15b,
    roughness: 0.2,
    metalness: 0.9,
  });

  // Heavenly Pool Interior Bottom
  const poolBottomMaterial = new THREE.MeshStandardMaterial({
    map: poolTexture,
    roughness: 0.25,
    metalness: 0.75,
  });

  // Heavenly Pool Interior Walls
  const poolWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a34b,
    roughness: 0.2,
    metalness: 0.88,
  });

  // Magnetic Needle Materials
  const needleSouthMaterial = new THREE.MeshStandardMaterial({
    color: 0xc81b12, // Cinnabar vermilion South pointer
    roughness: 0.15,
    metalness: 0.65,
  });

  const needleNorthMaterial = new THREE.MeshStandardMaterial({
    color: 0x24282c, // Blued steel / black North counterweight
    roughness: 0.2,
    metalness: 0.85,
  });

  const jewelMaterial = new THREE.MeshStandardMaterial({
    color: 0xa81124, // Ruby bearing pivot cap
    roughness: 0.1,
    metalness: 0.2,
  });

  // Optical Glass Dome for Heavenly Pool
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.92,
    ior: 1.52,
    depthWrite: false,
  });

  // Spirit Level Acrylic Glass & Bubble
  const levelLiquidMaterial = new THREE.MeshStandardMaterial({
    color: 0x98e63e, // Fluorescent spirit level yellow-green
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,
  });

  const bubbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.2,
  });

  // Crimson Cross Thread (天心十道)
  const threadMaterial = new THREE.LineBasicMaterial({
    color: 0xcc1810,
    linewidth: 2,
    depthTest: true,
  });

  // ---------------------------------------------------------------------------
  // 3. MESHES & COMPOSITION
  // ---------------------------------------------------------------------------

  // Dimensions
  const plateSize = 4.2; // Square base width
  const plateThickness = 0.26;
  const innerDialRadius = 1.95;
  const innerDialHeight = 0.06;
  const poolRadius = 0.58;
  const poolDepth = 0.12;

  // 3.1 Outer Square Wood Plate (外盘)
  const baseBoxGeom = new THREE.BoxGeometry(plateSize, plateThickness, plateSize);
  const baseMesh = new THREE.Mesh(baseBoxGeom, woodMaterial);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  baseMesh.position.y = -plateThickness / 2;
  woodBaseGroup.add(baseMesh);

  // Recessed circular well in the wooden plate for the inner dial
  const wellRimGeom = new THREE.RingGeometry(innerDialRadius, innerDialRadius + 0.1, 64);
  const wellRimMesh = new THREE.Mesh(wellRimGeom, polishedBrassMaterial);
  wellRimMesh.rotation.x = -Math.PI / 2;
  wellRimMesh.position.y = 0.002;
  woodBaseGroup.add(wellRimMesh);

  // 3.2 Brass Corner Protectors (四角黄铜包角)
  const cornerGeom = new THREE.BoxGeometry(0.55, 0.02, 0.55);
  const cornerRivetsGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.03, 16);

  const cornerPositions = [
    { x: plateSize / 2 - 0.275, z: plateSize / 2 - 0.275 },
    { x: -plateSize / 2 + 0.275, z: plateSize / 2 - 0.275 },
    { x: plateSize / 2 - 0.275, z: -plateSize / 2 + 0.275 },
    { x: -plateSize / 2 + 0.275, z: -plateSize / 2 + 0.275 },
  ];

  cornerPositions.forEach((pos) => {
    const cornerMesh = new THREE.Mesh(cornerGeom, polishedBrassMaterial);
    cornerMesh.position.set(pos.x, 0.005, pos.z);
    woodBaseGroup.add(cornerMesh);

    // Rivet dots on corner
    const rivet = new THREE.Mesh(cornerRivetsGeom, polishedBrassMaterial);
    rivet.position.set(pos.x, 0.02, pos.z);
    woodBaseGroup.add(rivet);
  });

  // 3.3 Dual Spirit Levels (双向水准仪嵌入外盘)
  // Tubular level on top-right edge
  const tubeLevelGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.36, 16);
  const tubeLevelMesh = new THREE.Mesh(tubeLevelGeom, levelLiquidMaterial);
  tubeLevelMesh.rotation.z = Math.PI / 2;
  tubeLevelMesh.position.set(1.6, 0.015, -1.75);
  woodBaseGroup.add(tubeLevelMesh);

  // Bubble inside tubular level
  const bubbleYGeom = new THREE.SphereGeometry(0.03, 16, 16);
  const levelBubbleYMesh = new THREE.Mesh(bubbleYGeom, bubbleMaterial);
  levelBubbleYMesh.position.set(1.6, 0.02, -1.75);
  woodBaseGroup.add(levelBubbleYMesh);

  // Tubular level on bottom-left edge (X axis)
  const tubeLevelMesh2 = new THREE.Mesh(tubeLevelGeom, levelLiquidMaterial);
  tubeLevelMesh2.rotation.y = Math.PI / 2;
  tubeLevelMesh2.rotation.x = Math.PI / 2;
  tubeLevelMesh2.position.set(-1.75, 0.015, 1.6);
  woodBaseGroup.add(tubeLevelMesh2);

  const levelBubbleXMesh = new THREE.Mesh(bubbleYGeom, bubbleMaterial);
  levelBubbleXMesh.position.set(-1.75, 0.02, 1.6);
  woodBaseGroup.add(levelBubbleXMesh);

  // Circular bullseye spirit level on top-left corner
  const circularLevelGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 24);
  const circularLevelMesh = new THREE.Mesh(circularLevelGeom, levelLiquidMaterial);
  circularLevelMesh.position.set(-1.6, 0.015, -1.6);
  woodBaseGroup.add(circularLevelMesh);

  // Bullseye brass bezel
  const circularBezelGeom = new THREE.RingGeometry(0.11, 0.135, 24);
  const circularBezelMesh = new THREE.Mesh(circularBezelGeom, polishedBrassMaterial);
  circularBezelMesh.rotation.x = -Math.PI / 2;
  circularBezelMesh.position.set(-1.6, 0.032, -1.6);
  woodBaseGroup.add(circularBezelMesh);

  // Circular bubble
  const circleBubbleGeom = new THREE.SphereGeometry(0.025, 16, 16);
  const levelBubbleCircularMesh = new THREE.Mesh(circleBubbleGeom, bubbleMaterial);
  levelBubbleCircularMesh.position.set(-1.6, 0.03, -1.6);
  woodBaseGroup.add(levelBubbleCircularMesh);

  // 3.4 Inner Brass Dial (内盘 - 天圆)
  const dialGeom = new THREE.CylinderGeometry(innerDialRadius, innerDialRadius, innerDialHeight, 64);
  // Dial face material on top, brass edge on side
  const dialMaterials = [
    polishedBrassMaterial, // Side edge
    dialMaterial,          // Top face (with 24 mountains & rings)
    polishedBrassMaterial, // Bottom face
  ];
  const innerDialMesh = new THREE.Mesh(dialGeom, dialMaterials);
  innerDialMesh.position.y = innerDialHeight / 2;
  innerDialMesh.castShadow = true;
  innerDialMesh.receiveShadow = true;
  rootGroup.add(innerDialMesh);

  // 3.5 Heavenly Pool Group (天池)
  const heavenlyPoolGroup = new THREE.Group();
  heavenlyPoolGroup.name = 'HeavenlyPoolGroup';
  heavenlyPoolGroup.position.y = innerDialHeight / 2;
  rootGroup.add(heavenlyPoolGroup);

  // Sunken bottom of Heavenly Pool
  const poolBottomGeom = new THREE.CylinderGeometry(poolRadius, poolRadius, 0.01, 48);
  const poolBottomMesh = new THREE.Mesh(poolBottomGeom, poolBottomMaterial);
  poolBottomMesh.position.y = -poolDepth;
  heavenlyPoolGroup.add(poolBottomMesh);

  // Golden brass cylindrical wall of the Heavenly Pool
  const poolWallGeom = new THREE.CylinderGeometry(poolRadius + 0.01, poolRadius, poolDepth, 48, 1, true);
  const poolWallMesh = new THREE.Mesh(poolWallGeom, poolWallMaterial);
  poolWallMesh.position.y = -poolDepth / 2;
  heavenlyPoolGroup.add(poolWallMesh);

  // Stepped brass bezel around the Heavenly Pool rim
  const poolBezelGeom = new THREE.RingGeometry(poolRadius - 0.01, poolRadius + 0.04, 48);
  const poolBezelMesh = new THREE.Mesh(poolBezelGeom, polishedBrassMaterial);
  poolBezelMesh.rotation.x = -Math.PI / 2;
  poolBezelMesh.position.y = 0.005;
  heavenlyPoolGroup.add(poolBezelMesh);

  // Central Agate Pivot Pin (天池中央金顶针)
  const pivotPinGeom = new THREE.CylinderGeometry(0.008, 0.02, poolDepth * 0.85, 16);
  const pivotPinMesh = new THREE.Mesh(pivotPinGeom, polishedBrassMaterial);
  pivotPinMesh.position.y = -poolDepth + (poolDepth * 0.85) / 2;
  heavenlyPoolGroup.add(pivotPinMesh);

  // 3.6 Magnetic Needle (天池磁针)
  const needleGroup = new THREE.Group();
  needleGroup.name = 'NeedleGroup';
  needleGroup.position.y = -poolDepth + poolDepth * 0.82; // Position at pivot tip
  heavenlyPoolGroup.add(needleGroup);

  // Central Ruby jewel bearing boss
  const jewelGeom = new THREE.SphereGeometry(0.038, 16, 16);
  const jewelMesh = new THREE.Mesh(jewelGeom, jewelMaterial);
  needleGroup.add(jewelMesh);

  const jewelCapGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.015, 24);
  const jewelCapMesh = new THREE.Mesh(jewelCapGeom, polishedBrassMaterial);
  needleGroup.add(jewelCapMesh);

  // South Pointer (指南针南端 - 赤红剑头)
  // Points towards South (+Z in Three.js coordinate system where -Z is North)
  const southPointerLength = 0.44;
  const southGeom = new THREE.BufferGeometry();
  // Procedural diamond spearhead vertices
  const southVertices = new Float32Array([
    // Spearhead
    0.0, 0.012, southPointerLength,       // 0: Tip
    0.028, 0.008, southPointerLength * 0.45, // 1: Right wing
    0.0, 0.002, 0.0,                       // 2: Base center
    -0.028, 0.008, southPointerLength * 0.45,// 3: Left wing

    0.0, -0.012, southPointerLength,      // 4: Bottom Tip
    0.028, -0.008, southPointerLength * 0.45,// 5: Bottom Right
    0.0, -0.002, 0.0,                      // 6: Bottom center
    -0.028, -0.008, southPointerLength * 0.45,// 7: Bottom Left
  ]);
  const southIndices = [
    0, 1, 2,  0, 2, 3, // Top faces
    4, 6, 5,  4, 7, 6, // Bottom faces
    0, 4, 1,  4, 5, 1, // Right bevel
    0, 3, 4,  4, 3, 7, // Left bevel
  ];
  southGeom.setAttribute('position', new THREE.BufferAttribute(southVertices, 3));
  southGeom.setIndex(southIndices);
  southGeom.computeVertexNormals();

  const southMesh = new THREE.Mesh(southGeom, needleSouthMaterial);
  needleGroup.add(southMesh);

  // North Tail (北方如意圈 / 尾翼 - 沉重黑钢带如意纹)
  // Points towards North (-Z in Three.js coordinate system)
  const northTailLength = -0.42;
  const northShaftGeom = new THREE.CylinderGeometry(0.012, 0.018, 0.35, 12);
  const northShaftMesh = new THREE.Mesh(northShaftGeom, needleNorthMaterial);
  northShaftMesh.rotation.x = Math.PI / 2;
  northShaftMesh.position.z = northTailLength / 2;
  needleGroup.add(northShaftMesh);

  // Auspicious Ruyi counterweight loop at North end
  const ruyiTorusGeom = new THREE.TorusGeometry(0.052, 0.014, 12, 24);
  const ruyiMesh = new THREE.Mesh(ruyiTorusGeom, needleNorthMaterial);
  ruyiMesh.rotation.x = Math.PI / 2;
  ruyiMesh.position.z = northTailLength;
  needleGroup.add(ruyiMesh);

  // Tiny brass dot on North tail tip
  const northDotGeom = new THREE.SphereGeometry(0.018, 12, 12);
  const northDotMesh = new THREE.Mesh(northDotGeom, polishedBrassMaterial);
  northDotMesh.position.z = northTailLength - 0.052;
  needleGroup.add(northDotMesh);

  // 3.7 Optical Glass Dome covering Heavenly Pool (水晶凸面防尘罩)
  const glassDomeGeom = new THREE.SphereGeometry(poolRadius * 0.98, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.28);
  const glassDomeMesh = new THREE.Mesh(glassDomeGeom, glassMaterial);
  glassDomeMesh.rotation.x = Math.PI;
  glassDomeMesh.position.y = 0.02;
  heavenlyPoolGroup.add(glassDomeMesh);

  // 3.8 Heaven Heart Cross Threads (天心十道)
  // Two red threads stretched across the entire compass face
  // Line 1: North-South (-Z to +Z)
  // Line 2: East-West (-X to +X)
  const threadSpan = plateSize * 0.49;
  const threadY = innerDialHeight + 0.035;
  const threadPositions = new Float32Array([
    0, threadY, -threadSpan,
    0, threadY, threadSpan,
    -threadSpan, threadY, 0,
    threadSpan, threadY, 0,
  ]);
  const threadGeom = new THREE.BufferGeometry();
  threadGeom.setAttribute('position', new THREE.BufferAttribute(threadPositions, 3));
  const crossThreadMesh = new THREE.LineSegments(threadGeom, threadMaterial);
  rootGroup.add(crossThreadMesh);

  // 4 Brass retaining eyelet pins on the outer edge for the threads
  const pinGeom = new THREE.CylinderGeometry(0.03, 0.035, 0.08, 16);
  const pinPositions = [
    { x: 0, z: -threadSpan },
    { x: 0, z: threadSpan },
    { x: -threadSpan, z: 0 },
    { x: threadSpan, z: 0 },
  ];
  pinPositions.forEach((pos) => {
    const pin = new THREE.Mesh(pinGeom, polishedBrassMaterial);
    pin.position.set(pos.x, threadY - 0.02, pos.z);
    woodBaseGroup.add(pin);
  });

  // 3.9 Soft Contact Shadow Ground Plane
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d')!;
  const sGrad = sCtx.createRadialGradient(128, 128, 40, 128, 128, 126);
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  sGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeom = new THREE.PlaneGeometry(plateSize * 1.5, plateSize * 1.5);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeom, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = -plateThickness - 0.005;
  rootGroup.add(contactShadow);

  const dispose = () => {
    dialTexture.dispose();
    poolTexture.dispose();
    woodTexture.dispose();
    shadowTexture.dispose();
    woodMaterial.dispose();
    dialMaterial.dispose();
    polishedBrassMaterial.dispose();
    poolBottomMaterial.dispose();
    poolWallMaterial.dispose();
    needleSouthMaterial.dispose();
    needleNorthMaterial.dispose();
    jewelMaterial.dispose();
    glassMaterial.dispose();
    levelLiquidMaterial.dispose();
    bubbleMaterial.dispose();
    threadMaterial.dispose();
    shadowMat.dispose();
  };

  return {
    rootGroup,
    woodBaseGroup,
    innerDialMesh,
    heavenlyPoolGroup,
    needleGroup,
    crossThreadMesh,
    glassDomeMesh,
    levelBubbleXMesh,
    levelBubbleYMesh,
    levelBubbleCircularMesh,
    contactShadow,
    dispose,
  };
}
