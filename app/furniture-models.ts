import * as THREE from "three";

function box(group: THREE.Group, dimensions: [number, number, number], position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
}

export function createClothingRack() {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: "#282b29", metalness: 0.7, roughness: 0.4 });
  const wood = new THREE.MeshStandardMaterial({ color: "#9b724c", roughness: 0.8 });
  for (const x of [-0.59, 0.59]) for (const z of [-0.34, 0.34]) {
    box(group, [0.065, 1.85, 0.065], [x, 0.925, z], steel);
    box(group, [0.1, 0.025, 0.1], [x, 0.015, z], steel);
  }
  for (const y of [0.15, 0.47, 0.79, 1.78]) {
    box(group, [1.22, 0.055, 0.72], [0, y, 0], wood);
    for (const z of [-0.34, 0.34]) box(group, [1.22, 0.06, 0.065], [0, y - 0.045, z], steel);
  }
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.08, 20), steel);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, 1.59, 0);
  rail.castShadow = true;
  group.add(rail);
  return group;
}

export function createSideTable() {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: "#242928", metalness: 0.75, roughness: 0.35 });
  const top = new THREE.MeshStandardMaterial({ color: "#363b39", metalness: 0.62, roughness: 0.4 });
  const surface = new THREE.Mesh(new THREE.CylinderGeometry(0.59, 0.59, 0.065, 64), top);
  surface.position.y = 1.24;
  surface.castShadow = true;
  surface.receiveShadow = true;
  group.add(surface);
  const base = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 12, 64), steel);
  base.rotation.x = Math.PI / 2;
  base.position.y = 0.055;
  base.castShadow = true;
  group.add(base);
  const lower = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.035, 12, 64), steel);
  lower.position.set(0, 0.42, 0);
  lower.rotation.set(0.25, 0, -0.6);
  lower.castShadow = true;
  group.add(lower);
  const upper = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.035, 12, 64), steel);
  upper.position.set(0, 0.9, 0);
  upper.rotation.set(-0.25, 0, 0.6);
  upper.castShadow = true;
  group.add(upper);
  box(group, [0.08, 0.08, 0.08], [0, 0.66, 0], steel);
  return group;
}
