import * as THREE from "three";

type Point3 = [number, number, number];

function box(group: THREE.Group, dimensions: [number, number, number], position: Point3, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function cylinderBetween(group: THREE.Group, start: Point3, end: Point3, radius: number, material: THREE.Material, segments = 16) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), segments), material);
  mesh.position.copy(from.add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function annulus(innerRadius: number, outerRadius: number, depth: number) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, outerRadius, outerRadius, 0, Math.PI * 2, false, 0);
  const opening = new THREE.Path();
  opening.absellipse(0, 0, innerRadius, innerRadius, 0, Math.PI * 2, true, 0);
  shape.holes.push(opening);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    curveSegments: 64,
    depth,
    steps: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function ovalLoop(innerX: number, innerY: number, outerX: number, outerY: number, depth: number) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, outerX, outerY, 0, Math.PI * 2, false, 0);
  const opening = new THREE.Path();
  opening.absellipse(0, 0, innerX, innerY, 0, Math.PI * 2, true, 0);
  shape.holes.push(opening);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    curveSegments: 64,
    depth,
    steps: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

export function createClothingRack() {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: "#242827", metalness: 0.78, roughness: 0.3 });
  const steelEdge = new THREE.MeshStandardMaterial({ color: "#454947", metalness: 0.82, roughness: 0.25 });
  const wood = new THREE.MeshStandardMaterial({ color: "#8b6442", roughness: 0.72, metalness: 0.02 });
  const led = new THREE.MeshStandardMaterial({
    color: "#ffcf87",
    emissive: "#ff9a39",
    emissiveIntensity: 0.75,
    roughness: 0.4,
  });
  const postX = [-0.56, 0.56];
  const postZ = [-0.31, 0.31];

  for (const x of postX) for (const z of postZ) {
    box(group, [0.055, 1.85, 0.055], [x, 0.925, z], steel);
    box(group, [0.1, 0.022, 0.1], [x, 0.011, z], steelEdge);
    box(group, [0.06, 0.012, 0.06], [x, 1.82, z], steelEdge);
  }

  for (const y of [0.15, 0.47, 0.79, 1.78]) {
    box(group, [1.22, 0.055, 0.72], [0, y, 0], wood);
    const supportY = y - 0.042;
    for (const z of [-0.29, 0.29]) box(group, [1.1, 0.026, 0.032], [0, supportY, z], steel);
    for (const x of [-0.545, 0.545]) box(group, [0.032, 0.026, 0.56], [x, supportY, 0], steel);
    for (const x of [-0.56, 0.56]) for (const z of [-0.31, 0.31]) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.004, 12), steelEdge);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(x, supportY, z + (z > 0 ? 0.028 : -0.028));
      group.add(bolt);
    }
  }

  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 1.08, 24), steelEdge);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, 1.55, -0.02);
  rail.castShadow = true;
  group.add(rail);
  for (const x of [-0.54, 0.54]) {
    cylinderBetween(group, [x, 1.55, -0.02], [x, 1.55, 0.26], 0.014, steel);
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.035, 20), steelEdge);
    socket.rotation.z = Math.PI / 2;
    socket.position.set(x, 1.55, -0.02);
    group.add(socket);
  }

  box(group, [1.04, 0.012, 0.009], [0, 1.744, 0.22], led);
  box(group, [1.04, 0.012, 0.009], [0, 0.754, 0.22], led);
  return group;
}

export function createSideTable() {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: "#292d2c", metalness: 0.8, roughness: 0.27 });
  const steelEdge = new THREE.MeshStandardMaterial({ color: "#484d4a", metalness: 0.84, roughness: 0.23 });
  const foot = new THREE.MeshStandardMaterial({ color: "#171a19", metalness: 0.12, roughness: 0.76 });
  const topMaterial = new THREE.MeshStandardMaterial({ color: "#343937", metalness: 0.68, roughness: 0.32 });

  const top = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.56, 0),
    new THREE.Vector2(0.575, 0.004),
    new THREE.Vector2(0.586, 0.013),
    new THREE.Vector2(0.59, 0.023),
    new THREE.Vector2(0.59, 0.046),
    new THREE.Vector2(0.586, 0.056),
    new THREE.Vector2(0.575, 0.063),
    new THREE.Vector2(0.56, 0.065),
    new THREE.Vector2(0, 0.065),
  ], 64), topMaterial);
  top.position.y = 1.2075;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const base = new THREE.Mesh(annulus(0.45, 0.512, 0.035), steel);
  base.rotation.x = Math.PI / 2;
  base.position.y = 0.055;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);
  for (const angle of [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2]) {
    const x = Math.cos(angle) * 0.45;
    const z = Math.sin(angle) * 0.45;
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.043, 0.018, 20), foot);
    pad.position.set(x, 0.029, z);
    pad.castShadow = true;
    group.add(pad);
  }

  const lower = new THREE.Mesh(ovalLoop(0.342, 0.342, 0.402, 0.402, 0.035), steelEdge);
  lower.position.set(0, 0.42, 0);
  lower.rotation.set(0.22, 0, -0.48);
  lower.castShadow = true;
  lower.receiveShadow = true;
  group.add(lower);

  const upper = new THREE.Mesh(ovalLoop(0.342, 0.342, 0.402, 0.402, 0.035), steelEdge);
  upper.position.set(0, 0.9, 0);
  upper.rotation.set(-0.22, 0, 0.48);
  upper.castShadow = true;
  upper.receiveShadow = true;
  group.add(upper);

  cylinderBetween(group, [0, 0.58, 0], [0, 0.73, 0], 0.035, steel);
  const topMount = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.018, 48), steel);
  topMount.position.y = 1.195;
  topMount.castShadow = true;
  group.add(topMount);
  return group;
}

export function createCanopy(): THREE.Group {
  const canopy = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({ color: "#252b2b", metalness: 0.72, roughness: 0.38 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: "#7c8583", metalness: 0.42, roughness: 0.6, side: THREE.DoubleSide });
  const fastener = new THREE.MeshStandardMaterial({ color: "#a0a7a4", metalness: 0.8, roughness: 0.3 });
  const slope = 0.08;
  const roof = new THREE.Group();
  roof.position.y = 2.05;
  roof.rotation.x = slope;
  canopy.add(roof);

  for (const x of [-1.25, 1.25]) {
    for (const z of [-0.78, 0.78]) {
      const height = 2.05 - Math.sin(slope) * z;
      box(canopy, [0.09, height, 0.09], [x, height / 2, z], frame);
      box(canopy, [0.18, 0.03, 0.18], [x, 0.015, z], frame);
    }
  }
  for (const z of [-0.9, 0, 0.9]) box(roof, [2.75, 0.085, 0.085], [0, -0.05, z], frame);
  for (const x of [-1.3, -0.65, 0, 0.65, 1.3]) box(roof, [0.07, 0.07, 1.9], [x, -0.06, 0], frame);
  box(roof, [2.8, 0.045, 1.92], [0, 0.035, 0], roofMaterial);
  for (let i = -6; i <= 6; i++) box(roof, [0.025, 0.025, 1.92], [i * 0.21, 0.07, 0], roofMaterial);
  for (const x of [-1.22, 1.22]) for (const z of [-0.78, 0.78]) {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.018, 12), fastener);
    bolt.position.set(x, 0.04, z);
    canopy.add(bolt);
  }
  return canopy;
}
