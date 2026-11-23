import * as THREE from "three";

type Vec3 = [number, number, number];

function addBox(
  group: THREE.Group,
  size: Vec3,
  position: Vec3,
  material: THREE.Material,
  options: { castShadow?: boolean; receiveShadow?: boolean } = {},
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = options.receiveShadow ?? true;
  group.add(mesh);
  return mesh;
}

function addRod(group: THREE.Group, start: Vec3, end: Vec3, radius: number, material: THREE.Material) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 16), material);
  mesh.position.copy(from.add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function makeWoodTexture(seed: number) {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return undefined;

  const random = (index: number) => {
    const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  context.fillStyle = seed % 2 ? "#805536" : "#966845";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 320; i += 1) {
    const y = random(i) * canvas.height;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(
      128,
      y + (random(i + 2) - 0.5) * 8,
      360,
      y + (random(i + 5) - 0.5) * 10,
      canvas.width,
      y + (random(i + 9) - 0.5) * 5,
    );
    context.strokeStyle = i % 13 === 0 ? "rgba(48, 25, 13, 0.22)" : "rgba(238, 190, 133, 0.09)";
    context.lineWidth = i % 11 === 0 ? 2 : 1;
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.4, 1);
  return texture;
}

export function createWardrobe(): THREE.Group {
  const wardrobe = new THREE.Group();
  const width = 2.3;
  const depth = 0.66;
  const height = 1.95;
  const front = depth / 2;
  const back = -depth / 2;
  const bodyBottom = 0.09;
  const loftBottom = 1.49;
  const bayCenters = [-0.77, 0, 0.77];
  const bayWidth = 0.74;

  const frame = new THREE.MeshStandardMaterial({ color: "#171b1b", metalness: 0.72, roughness: 0.31 });
  const frameEdge = new THREE.MeshStandardMaterial({ color: "#353a38", metalness: 0.78, roughness: 0.27 });
  const darkInterior = new THREE.MeshStandardMaterial({ color: "#262522", metalness: 0.12, roughness: 0.78 });
  const walnutTexture = makeWoodTexture(2);
  const walnut = new THREE.MeshStandardMaterial({
    color: "#c49361",
    map: walnutTexture,
    bumpMap: walnutTexture,
    bumpScale: 0.012,
    roughness: 0.68,
    metalness: 0,
  });
  const walnutDark = new THREE.MeshStandardMaterial({ color: "#805837", roughness: 0.76 });
  const brass = new THREE.MeshStandardMaterial({ color: "#b18a55", metalness: 0.8, roughness: 0.27 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#c2d0d0",
    metalness: 0.16,
    roughness: 0.13,
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const led = new THREE.MeshStandardMaterial({
    color: "#ffc477",
    emissive: "#ff9d3d",
    emissiveIntensity: 1.5,
    roughness: 0.32,
  });

  // Dark outer carcass with warm walnut lining and a low recessed plinth.
  addBox(wardrobe, [width, 0.045, depth], [0, 0.035, 0], frame);
  addBox(wardrobe, [width - 0.1, 0.055, depth - 0.08], [0, 0.082, 0], frameEdge);
  addBox(wardrobe, [0.055, height - 0.1, depth], [-width / 2 + 0.0275, height / 2, 0], frame);
  addBox(wardrobe, [0.055, height - 0.1, depth], [width / 2 - 0.0275, height / 2, 0], frame);
  addBox(wardrobe, [width, 0.055, depth], [0, height - 0.0275, 0], frame);
  addBox(wardrobe, [width - 0.11, 0.035, 0.025], [0, 0.13, back + 0.045], walnutDark);
  addBox(wardrobe, [width - 0.11, height - 0.27, 0.018], [0, 1.04, back + 0.014], walnut);
  addBox(wardrobe, [0.018, loftBottom - bodyBottom, depth - 0.1], [-width / 2 + 0.07, (loftBottom + bodyBottom) / 2, 0], walnut);
  addBox(wardrobe, [0.018, loftBottom - bodyBottom, depth - 0.1], [width / 2 - 0.07, (loftBottom + bodyBottom) / 2, 0], walnut);

  // Three cabinet bays; the shallow upper cupboards continue across the full width.
  for (const x of [-0.39, 0.39]) {
    addBox(wardrobe, [0.032, height - 0.25, depth - 0.1], [x, (height + 0.04) / 2, 0], walnutDark);
    addBox(wardrobe, [0.012, loftBottom - bodyBottom, depth - 0.14], [x, (loftBottom + bodyBottom) / 2, back + 0.08], walnut);
    addBox(wardrobe, [0.028, height - loftBottom - 0.09, depth - 0.12], [x, (height + loftBottom) / 2 - 0.015, 0], walnutDark);
  }
  addBox(wardrobe, [width - 0.12, 0.035, depth - 0.1], [0, loftBottom, 0], walnut);
  addBox(wardrobe, [width - 0.12, 0.025, depth - 0.1], [0, height - 0.09, 0], walnut);

  // Left adjustable-style shelves and their slim finished front edges.
  for (const y of [0.34, 0.59, 0.84, 1.09, 1.34]) {
    addBox(wardrobe, [0.68, 0.026, 0.48], [-0.77, y, -0.01], walnut);
    addBox(wardrobe, [0.68, 0.018, 0.018], [-0.77, y - 0.004, 0.235], brass);
  }

  // Hanging rails, mounting cups, and a low center valet shelf.
  for (const [left, right, y] of [[-0.32, 0.32, 1.28], [0.45, 1.08, 1.28]] as const) {
    addRod(wardrobe, [left, y, -0.08], [right, y, -0.08], 0.016, brass);
    for (const x of [left, right]) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.025, 20), frameEdge);
      cup.rotation.z = Math.PI / 2;
      cup.position.set(x, y, -0.08);
      cup.castShadow = true;
      wardrobe.add(cup);
    }
  }
  addBox(wardrobe, [0.65, 0.032, 0.43], [0, 0.68, 0], walnut);
  addBox(wardrobe, [0.65, 0.018, 0.018], [0, 0.68, 0.22], brass);

  // Three walnut drawer fronts on the right with small brushed-metal pulls.
  for (const y of [0.26, 0.48, 0.7]) {
    addBox(wardrobe, [0.67, 0.17, 0.028], [0.77, y, 0.245], walnut);
    addBox(wardrobe, [0.67, 0.012, 0.009], [0.77, y + 0.08, 0.264], walnutDark);
    const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.11, 12), brass);
    pull.rotation.z = Math.PI / 2;
    pull.position.set(0.77, y + 0.012, 0.274);
    pull.castShadow = true;
    wardrobe.add(pull);
  }

  // Warm concealed strips brighten the vertical dividers and cupboard ceilings.
  for (const x of [-0.36, 0.36, 1.02]) {
    addBox(wardrobe, [0.012, 1.27, 0.012], [x, 0.82, 0.205], led, { castShadow: false });
    addBox(wardrobe, [0.62, 0.012, 0.012], [x === 1.02 ? 0.72 : x, 1.43, 0.17], led, { castShadow: false });
  }

  // Upper glass-front cupboards with matching dark metal stiles.
  const loftHeight = height - loftBottom - 0.09;
  for (const [index, center] of bayCenters.entries()) {
    const doorZ = front + 0.018 + index * 0.006;
    const upperGlass = addBox(wardrobe, [bayWidth - 0.064, loftHeight - 0.07, 0.009], [center, loftBottom + loftHeight / 2, doorZ], glass, { castShadow: false, receiveShadow: false });
    upperGlass.renderOrder = 2;
    for (const x of [center - bayWidth / 2, center + bayWidth / 2]) {
      addBox(wardrobe, [0.025, loftHeight, 0.035], [x, loftBottom + loftHeight / 2, doorZ + 0.008], frameEdge);
    }
    for (const y of [loftBottom, height - 0.09]) {
      addBox(wardrobe, [bayWidth, 0.024, 0.035], [center, y, doorZ + 0.008], frame);
    }
    addBox(wardrobe, [0.012, loftHeight - 0.06, 0.018], [center + 0.12, loftBottom + loftHeight / 2, doorZ + 0.022], brass);
  }

  // Sliding glass doors: narrow black profiles preserve a clear view into each bay.
  const mainHeight = loftBottom - bodyBottom;
  for (const [index, center] of bayCenters.entries()) {
    const doorZ = front + 0.025 + index * 0.012;
    const pane = addBox(wardrobe, [bayWidth - 0.07, mainHeight - 0.075, 0.008], [center, (loftBottom + bodyBottom) / 2, doorZ], glass, { castShadow: false, receiveShadow: false });
    pane.renderOrder = 2;
    for (const x of [center - bayWidth / 2, center + bayWidth / 2]) {
      addBox(wardrobe, [0.028, mainHeight, 0.04], [x, (loftBottom + bodyBottom) / 2, doorZ + 0.012], frameEdge);
      addBox(wardrobe, [0.006, mainHeight - 0.035, 0.008], [x + (x < center ? 0.018 : -0.018), (loftBottom + bodyBottom) / 2, doorZ + 0.034], brass);
    }
    for (const y of [bodyBottom, loftBottom]) {
      addBox(wardrobe, [bayWidth, 0.026, 0.04], [center, y, doorZ + 0.012], frame);
    }
  }

  // Double recessed tracks, glossy edge caps, and subtle panel seams.
  for (const y of [bodyBottom - 0.012, loftBottom + 0.015]) {
    addBox(wardrobe, [width - 0.08, 0.025, 0.078], [0, y, front + 0.035], frame);
    for (const z of [front + 0.012, front + 0.052]) {
      addBox(wardrobe, [width - 0.1, 0.004, 0.004], [0, y, z], frameEdge);
    }
  }

  // Small feet keep the broad plinth visually lifted from the floor.
  for (const x of [-0.98, 0.98]) {
    for (const z of [-0.25, 0.25]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.055, 20), frame);
      foot.position.set(x, 0.012, z);
      foot.castShadow = true;
      wardrobe.add(foot);
    }
  }

  return wardrobe;
}
