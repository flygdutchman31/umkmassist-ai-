"use client";

import { useEffect, useRef, useState } from "react";
import ArrowIcon from "./ArrowIcon";
import { useLanguage } from "./LanguageProvider";
import * as THREE from "three";
import { createClothingRack, createSideTable } from "./furniture-models";
import { createWardrobe } from "./wardrobe-model";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./furniture-viewer.css";

function makeWoodTexture(seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) return null;

  const random = (index: number) => {
    const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };

  context.fillStyle = seed % 2 ? "#98724d" : "#aa8259";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 250; i += 1) {
    const y = random(i) * canvas.height;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(
      canvas.width * 0.3,
      y + (random(i + 4) - 0.5) * 10,
      canvas.width * 0.7,
      y + (random(i + 9) - 0.5) * 8,
      canvas.width,
      y + (random(i + 13) - 0.5) * 10,
    );
    context.strokeStyle = i % 7 === 0 ? "rgba(55, 34, 18, 0.13)" : "rgba(245, 215, 174, 0.08)";
    context.lineWidth = i % 9 === 0 ? 2 : 1;
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.4, 1);
  return texture;
}

function addBox(
  parent: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createTable() {
  const table = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: "#242827", metalness: 0.78, roughness: 0.31 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: "#151918", metalness: 0.6, roughness: 0.48 });
  const weld = new THREE.MeshStandardMaterial({ color: "#4b4d47", metalness: 0.73, roughness: 0.38 });

  // Six individually grained boards leave the timber seams visible.
  for (let i = 0; i < 6; i += 1) {
    const texture = makeWoodTexture(i + 1);
    const material = new THREE.MeshStandardMaterial({
      color: i % 3 === 0 ? "#d0b18a" : "#e0c19a",
      map: texture ?? undefined,
      bumpMap: texture ?? undefined,
      bumpScale: 0.018,
      roughness: 0.77,
      metalness: 0,
    });
    addBox(table, [2.62, 0.105, 0.205], [0, 1.22, (i - 2.5) * 0.218], material);
  }

  // Four square-tube legs and a welded apron frame.
  const legX = [-1.08, 1.08];
  const legZ = [-0.52, 0.52];
  for (const x of legX) {
    for (const z of legZ) {
      addBox(table, [0.085, 1.09, 0.085], [x, 0.62, z], steel);
      addBox(table, [0.13, 0.025, 0.13], [x, 0.12, z], weld);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.074, 0.095, 24), darkSteel);
      foot.position.set(x, 0.055, z);
      foot.castShadow = true;
      table.add(foot);
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.025, 24), new THREE.MeshStandardMaterial({ color: "#343735", roughness: 0.92 }));
      pad.position.set(x, 0.012, z);
      pad.receiveShadow = true;
      table.add(pad);
    }
  }

  addBox(table, [2.18, 0.085, 0.07], [0, 0.99, -0.52], steel);
  addBox(table, [2.18, 0.085, 0.07], [0, 0.99, 0.52], steel);
  addBox(table, [0.07, 0.085, 1.04], [-1.08, 0.99, 0], steel);
  addBox(table, [0.07, 0.085, 1.04], [1.08, 0.99, 0], steel);
  addBox(table, [0.07, 0.07, 1.04], [0, 0.78, 0], steel);
  addBox(table, [2.12, 0.065, 0.07], [0, 0.79, 0], steel);

  // Small gusset plates and exposed fasteners make the welded joins legible.
  for (const x of legX) {
    for (const z of legZ) {
      addBox(table, [0.19, 0.115, 0.018], [x, 0.96, z + (z > 0 ? -0.045 : 0.045)], weld);
      for (const offset of [-0.045, 0.045]) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 12), darkSteel);
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(x + offset, 0.96, z + (z > 0 ? -0.056 : 0.056));
        table.add(bolt);
      }
    }
  }

  return table;
}

export default function FurnitureViewer() {
  const { language } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<"table" | "rack" | "side" | "wardrobe">("table");
  const controlsRef = useRef<OrbitControls | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const copy = language === "id"
    ? {
        canvas: "Model 3D meja industrial dengan permukaan kayu dan rangka besi hitam. Seret untuk memutar.",
        section: "Pratinjau furnitur 3D",
        eyebrow: "Inspirasi desain",
        hint: "Putar model untuk melihat detail",
        model: "Meja kerja industrial",
        fallbackTitle: "Meja industrial custom",
        fallback: "Tampilan 3D tidak tersedia di browser ini. Model inspirasi ini memadukan bilah kayu dan rangka besi hitam.",
        disclaimer: "Model inspirasi · bukan produk dengan spesifikasi tetap",
        controls: "Kontrol tampilan model",
        turnLeft: "Putar model ke kiri",
        reset: "Atur ulang",
        turnRight: "Putar model ke kanan",
      }
    : {
        canvas: "3D model of an industrial table with a wooden top and black steel frame. Drag to rotate.",
        section: "3D furniture preview",
        eyebrow: "Design inspiration",
        hint: "Rotate the model to explore the details",
        model: "Industrial work table",
        fallbackTitle: "Custom industrial table",
        fallback: "3D viewing is unavailable in this browser. This inspirational design combines wooden slats with a black steel frame.",
        disclaimer: "Design inspiration · not a fixed-specification product",
        controls: "Model viewing controls",
        turnLeft: "Rotate model left",
        reset: "Reset view",
        turnRight: "Rotate model right",
      };

  const modelNames = language === "id" ? { table: "Meja industrial", rack: "Rak pakaian", side: "Meja samping", wardrobe: "Lemari kaca" } : { table: "Industrial table", rack: "Clothing rack", side: "Side table", wardrobe: "Glass wardrobe" };
  const canvasLabel = language === "id" ? `Model 3D ${modelNames[model]}. Seret untuk memutar.` : `3D model of ${modelNames[model]}. Drag to rotate.`;
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
    const cameraScale = model === "side" ? 0.68 : model === "rack" ? 0.78 : model === "wardrobe" ? 1.15 : 1;
    camera.position.set(3.85 * cameraScale, 3.05 * cameraScale, 4.55 * cameraScale);
    camera.lookAt(0, 0.78, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.tabIndex = 0;
    stage.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight("#fff3df", "#454641", 2.05));
    const keyLight = new THREE.DirectionalLight("#fff0d8", 3.2);
    keyLight.position.set(-3.5, 6, 4.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#e4a15d", 1.5);
    rimLight.position.set(4, 3, -4);
    scene.add(rimLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ color: "#28241f", opacity: 0.19 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.001;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.add(model === "rack" ? createClothingRack() : model === "side" ? createSideTable() : model === "wardrobe" ? createWardrobe() : createTable());

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.78, 0);
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = model === "table" ? 3.7 : 2.7;
    controls.maxDistance = 7.4;
    controls.minPolarAngle = 0.42;
    controls.maxPolarAngle = 1.42;
    controlsRef.current = controls;
    controls.update();
    controls.saveState();

    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    const resizeObserver = new ResizeObserver(() => {
      if (!stage.clientWidth || !stage.clientHeight) return;
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    });
    resizeObserver.observe(stage);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      controlsRef.current = null;
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          const textured = material as THREE.Material & { map?: THREE.Texture; bumpMap?: THREE.Texture };
          textured.map?.dispose();
          textured.bumpMap?.dispose();
          material.dispose();
        });
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [model]);

  useEffect(() => {
    stageRef.current?.querySelector("canvas")?.setAttribute("aria-label", canvasLabel);
  }, [canvasLabel, model]);

  const rotate = (direction: number) => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.object.position
      .sub(controls.target)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), direction * (Math.PI / 4))
      .add(controls.target);
    controls.update();
  };

  return (
    <section className="furniture-viewer" aria-label={copy.section}>
      <div className="furniture-viewer__heading">
        <span className="furniture-viewer__eyebrow">{copy.eyebrow}</span>
        <span className="furniture-viewer__hint">{copy.hint}</span>
      </div>
      <div className="furniture-viewer__choices" role="group" aria-label={language === "id" ? "Pilih model" : "Choose model"}>
        {(["table", "rack", "side", "wardrobe"] as const).map((key) => <button type="button" key={key} aria-pressed={model === key} onClick={() => setModel(key)}>{modelNames[key]}</button>)}
      </div>
      <div className="furniture-viewer__stage" ref={stageRef}>
        <div className="furniture-viewer__model-tag"><span /> {modelNames[model]}</div>
        {webglUnavailable && (
          <div className="furniture-viewer__fallback" role="status">
            <span className="furniture-viewer__fallback-icon"><ArrowIcon /></span>
            <strong>{modelNames[model]}</strong>
            <span>{language === "id" ? "Tampilan 3D tidak tersedia di browser ini." : "3D viewing is unavailable in this browser."}</span>
          </div>
        )}
      </div>
      <div className="furniture-viewer__footer">
        <span className="furniture-viewer__disclaimer">{copy.disclaimer}</span>
        <div className="furniture-viewer__controls" aria-label={copy.controls}>
          <button type="button" onClick={() => rotate(-1)} aria-label={copy.turnLeft} disabled={webglUnavailable}>↶</button>
          <button type="button" onClick={() => controlsRef.current?.reset()} aria-label={copy.reset} disabled={webglUnavailable}>{copy.reset}</button>
          <button type="button" onClick={() => rotate(1)} aria-label={copy.turnRight} disabled={webglUnavailable}>↷</button>
        </div>
      </div>
    </section>
  );
}
