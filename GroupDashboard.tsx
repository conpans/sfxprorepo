import * as React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import { IGroupDashboardProps } from "./IGroupDashboardProps";

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────
interface IPM {
  name: string;
  daysUntil: number;
  link: string;
}

interface IJHA {
  name: string;
  link: string;
}

interface IChamber {
  id: string;
  label: string;
  pms: IPM[];
  jhas: IJHA[];
  onenote: string;
  photos: string;
}

interface IFrame {
  id: string;
  label: string;
  chambers: IChamber[];
}

interface IETO {
  author: string;
  date: string;
  text: string;
}

interface ITool {
  id: string;
  num: number;
  vendor: string;
  vendorLabel: string;
  platform: string;
  building: string;
  row: number;
  x: number;
  z: number;
  frames: IFrame[];
  etos: IETO[];
  detailed: boolean;
  confluence: string;
  tableau: string;
  oem: string;
  urgentPM: number;
}

interface IBuildingConfig {
  id: string;
  x: number;
  z: number;
  w: number;
  d: number;
  rows: number;
  color: string;
}

interface ICamState {
  theta: number;
  phi: number;
  radius: number;
  target: THREE.Vector3;
  tTheta: number;
  tPhi: number;
  tRadius: number;
  tTarget: THREE.Vector3;
  isDragging: boolean;
  prevX: number;
  prevY: number;
  idleTimer: number;
  autoRotate: boolean;
}

interface ISelectedChamber extends IChamber {
  frame: IFrame;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const VENDOR_COLORS: Record<string, string> = { A: "#00d4ff", B: "#c084fc" };
const BUILDING_COLORS: Record<string, string> = { A: "#3b82f6", B: "#a855f7", C: "#06b6d4" };
const URGENCY: Record<string, string> = { urgent: "#ef4444", soon: "#f59e0b", upcoming: "#22c55e" };

const BUILDING_CONFIG: IBuildingConfig[] = [
  { id: "A", x: -38, z: 0, w: 30, d: 38, rows: 4, color: BUILDING_COLORS.A },
  { id: "B", x: 5, z: -2, w: 26, d: 32, rows: 3, color: BUILDING_COLORS.B },
  { id: "C", x: 42, z: -2, w: 24, d: 30, rows: 3, color: BUILDING_COLORS.C },
];

const LAYOUT: Record<string, number[][]> = {
  A: [[101, 102, 103], [104, 105, 106], [107, 108, 109], [110, 111, 112]],
  B: [[113, 114, 115], [116, 117, 118], [119, 120, 121, 122]],
  C: [[123, 124, 125], [126, 127, 128], [129, 130, 131]],
};

const VENDOR_MAP: Record<number, string> = {
  101: "A", 102: "A", 103: "B", 104: "A", 105: "B", 106: "A", 107: "B", 108: "A", 109: "B", 110: "A", 111: "B", 112: "A",
  113: "A", 114: "A", 115: "B", 116: "A", 117: "B", 118: "A", 119: "B", 120: "A", 121: "A", 122: "B",
  123: "B", 124: "B", 125: "A", 126: "B", 127: "B", 128: "A", 129: "B", 130: "B", 131: "A",
};

const PLATFORM_MAP: Record<number, string> = {
  101: "Alpha", 102: "Alpha", 103: "Beta", 104: "Alpha", 105: "Beta", 106: "Gamma", 107: "Beta", 108: "Alpha", 109: "Gamma", 110: "Alpha", 111: "Beta", 112: "Alpha",
  113: "Alpha", 114: "Gamma", 115: "Beta", 116: "Alpha", 117: "Gamma", 118: "Alpha", 119: "Beta", 120: "Gamma", 121: "Alpha", 122: "Beta",
  123: "Beta", 124: "Gamma", 125: "Alpha", 126: "Beta", 127: "Gamma", 128: "Alpha", 129: "Beta", 130: "Gamma", 131: "Alpha",
};

const DETAILED_IDS: Set<number> = new Set([101, 103, 105, 108, 113, 117, 123, 126, 129]);

// ─────────────────────────────────────────────
// DATA GENERATION
// ─────────────────────────────────────────────
function makePMs(chamberId: string, detailed: boolean): IPM[] {
  if (!detailed) return [{ name: "2K PM", daysUntil: 12, link: "#" }];
  const pms: IPM[] = [
    { name: "2K PM — Standard Clean", daysUntil: Math.floor(Math.random() * 14) + 1, link: "#" },
    { name: "5K PM — Full Chamber", daysUntil: Math.floor(Math.random() * 20) + 3, link: "#" },
    { name: "Quarterly Inspection", daysUntil: Math.floor(Math.random() * 30) + 5, link: "#" },
  ];
  if (Math.random() > 0.5) pms.push({ name: "Annual Rebuild", daysUntil: Math.floor(Math.random() * 60) + 15, link: "#" });
  return pms;
}

function makeJHAs(detailed: boolean): IJHA[] {
  if (!detailed) return [{ name: "JHA — General Chamber Access", link: "#" }];
  return [
    { name: "JHA — Chamber Lid Removal", link: "#" },
    { name: "JHA — Gas Line Purge & Reconnect", link: "#" },
    { name: "JHA — RF Generator Lockout/Tagout", link: "#" },
  ];
}

function makeETOs(toolId: string, detailed: boolean): IETO[] {
  if (!detailed) return [];
  const authors: string[] = ["J. Martinez", "R. Chen", "A. Kowalski", "T. Nguyen", "S. Patel"];
  const notes: string[] = [
    `Completed 2K PM on Frame A. Replaced showerhead gasket — old one showed pitting. Chamber leak rate tested good at 1.2 mT/min.`,
    `Chamber B running hot after last qual — ceramic heater element may be degrading. Flagged for engineering review.`,
    `Swapped out throttle valve actuator on Frame A Ch-A. Previous unit had intermittent response >150ms. New unit qualifying now.`,
    `ETO: Tool brought up after weekend facilities power event. All chambers qual'd, particle counts nominal. Released to production.`,
    `Noticed intermittent RF reflect spike on Ch-B during burn-in recipe. Occurs ~1 in 50 cycles. Monitoring — may need match network tuning.`,
    `Replaced turbo pump bearing assembly. Previous pump was showing elevated vibration on spectrum analyzer. New pump baseline captured.`,
  ];
  const count: number = 3 + Math.floor(Math.random() * 3);
  return Array.from({ length: count }, (_, i) => ({
    author: authors[i % authors.length],
    date: `2026-03-${String(28 - i * 2).padStart(2, "0")}`,
    text: notes[i % notes.length],
  }));
}

function generateTools(): ITool[] {
  const tools: ITool[] = [];
  for (const [bldg, rows] of Object.entries(LAYOUT)) {
    rows.forEach((row: number[], ri: number) => {
      row.forEach((num: number, ti: number) => {
        const id: string = `DEP-${num}`;
        const vendor: string = VENDOR_MAP[num];
        const platform: string = PLATFORM_MAP[num];
        const detailed: boolean = DETAILED_IDS.has(num);
        const frameCount: number = (num % 3 === 0) ? 1 : 2;
        const frames: IFrame[] = [];
        for (let f = 0; f < frameCount; f++) {
          const fLabel: string = String.fromCharCode(65 + f);
          const chCount: number = (f === 0) ? 2 : 1;
          const chambers: IChamber[] = [];
          for (let c = 0; c < chCount; c++) {
            const cLabel: string = String.fromCharCode(65 + c);
            const cid: string = `${id}-F${fLabel}-Ch${cLabel}`;
            chambers.push({
              id: cid,
              label: `Chamber ${cLabel}`,
              pms: makePMs(cid, detailed),
              jhas: makeJHAs(detailed),
              onenote: "#",
              photos: "#",
            });
          }
          frames.push({ id: `${id}-F${fLabel}`, label: `Frame ${fLabel}`, chambers });
        }
        const bCfg: IBuildingConfig = BUILDING_CONFIG.find(b => b.id === bldg)!;
        const rowZ: number = bCfg.z - bCfg.d / 2 + 6 + ri * 8;
        const toolsInRow: number = row.length;
        const startX: number = bCfg.x - (toolsInRow - 1) * 3.5;
        const toolX: number = startX + ti * 7;

        tools.push({
          id,
          num,
          vendor,
          vendorLabel: `Vendor ${vendor}`,
          platform: `Platform ${platform}`,
          building: bldg,
          row: ri + 1,
          x: toolX,
          z: rowZ,
          frames,
          etos: makeETOs(id, detailed),
          detailed,
          confluence: "#",
          tableau: "#",
          oem: "#",
          urgentPM: Infinity,
        });
      });
    });
  }
  // compute urgent PM
  tools.forEach((t: ITool) => {
    let minDays: number = Infinity;
    t.frames.forEach((f: IFrame) => f.chambers.forEach((c: IChamber) => c.pms.forEach((p: IPM) => {
      if (p.daysUntil < minDays) minDays = p.daysUntil;
    })));
    t.urgentPM = minDays;
  });
  return tools;
}

const ALL_TOOLS: ITool[] = generateTools();

// ─────────────────────────────────────────────
// STYLESHEET
// ─────────────────────────────────────────────
const STYLE_ID = "fab-dashboard-styles";

const CSS: string = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

.fab-root {
  width: 100%; height: 700px; min-height: 500px;
  display: flex; background: #080c14;
  font-family: 'Rajdhani', sans-serif; color: #c8d0dc;
  overflow: hidden; position: relative; border-radius: 4px;
}

/* LEFT PANEL */
.fab-left-panel {
  width: 200px; min-width: 200px;
  background: #0b1120; border-right: 1px solid #1a2540;
  display: flex; flex-direction: column; z-index: 10;
}
.fab-left-header {
  padding: 14px 14px 10px; border-bottom: 1px solid #1a2540;
}
.fab-left-title {
  font-size: 13px; font-weight: 700; color: #e2e8f0;
  letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;
}
.fab-search-box {
  width: 100%; padding: 6px 10px; border-radius: 4px;
  background: #111a2e; border: 1px solid #1e2d4a; color: #c8d0dc;
  font-family: 'Share Tech Mono', monospace; font-size: 12px; outline: none;
}
.fab-search-box::placeholder { color: #4a5568; }
.fab-search-box:focus { border-color: #3b82f6; }

.fab-tool-list { flex: 1; overflow-y: auto; padding: 6px 0; }
.fab-tool-list::-webkit-scrollbar { width: 4px; }
.fab-tool-list::-webkit-scrollbar-thumb { background: #1e2d4a; border-radius: 2px; }

.fab-bldg-group { margin-bottom: 2px; }
.fab-bldg-header {
  padding: 6px 14px; font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 1.2px; color: #64748b;
  display: flex; align-items: center; gap: 6px;
}
.fab-bldg-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.fab-tool-item {
  padding: 5px 14px 5px 24px; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  font-family: 'Share Tech Mono', monospace; font-size: 12px;
  transition: background 0.15s;
}
.fab-tool-item:hover { background: #111d35; }
.fab-tool-item.active { background: #162040; color: #e2e8f0; }
.fab-tool-item.hovered-3d { background: #111d35; }
.fab-vendor-tag {
  width: 4px; height: 14px; border-radius: 2px; flex-shrink: 0; display: inline-block;
}
.fab-tool-urgency {
  margin-left: auto; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  display: inline-block;
}
.fab-tool-item .fab-platform-hint {
  margin-left: auto; font-size: 9px; color: #475569; font-family: 'Rajdhani', sans-serif;
}

/* 3D VIEWPORT */
.fab-viewport-wrap {
  flex: 1; position: relative; background: #080c14;
}
.fab-viewport-wrap canvas { display: block; width: 100% !important; height: 100% !important; }

.fab-tooltip-3d {
  position: absolute; pointer-events: none; z-index: 20;
  background: #0f172aee; border: 1px solid #1e2d4a;
  padding: 6px 10px; border-radius: 4px;
  font-family: 'Share Tech Mono', monospace; font-size: 11px;
  color: #e2e8f0; white-space: nowrap; display: none;
  box-shadow: 0 4px 12px #00000066;
}
.fab-tooltip-3d .fab-tt-id { font-weight: 600; }
.fab-tooltip-3d .fab-tt-sub { color: #94a3b8; font-size: 10px; }

.fab-reset-cam-btn {
  position: absolute; bottom: 14px; left: 14px; z-index: 15;
  background: #111a2ecc; border: 1px solid #1e2d4a; border-radius: 4px;
  color: #94a3b8; font-family: 'Share Tech Mono', monospace; font-size: 11px;
  padding: 5px 12px; cursor: pointer; transition: all 0.2s;
}
.fab-reset-cam-btn:hover { background: #162040; color: #e2e8f0; border-color: #3b82f6; }

/* RIGHT PANEL */
.fab-right-panel {
  width: 0; overflow: hidden; background: #0b1120;
  border-left: 1px solid #1a2540; transition: width 0.3s ease;
  display: flex; flex-direction: column; z-index: 10;
}
.fab-right-panel.open { width: 330px; min-width: 330px; }

.fab-right-scroll { flex: 1; overflow-y: auto; padding: 16px; }
.fab-right-scroll::-webkit-scrollbar { width: 4px; }
.fab-right-scroll::-webkit-scrollbar-thumb { background: #1e2d4a; border-radius: 2px; }

.fab-right-close {
  position: absolute; top: 10px; right: 10px; background: none; border: none;
  color: #64748b; cursor: pointer; font-size: 18px; z-index: 5; line-height: 1;
}
.fab-right-close:hover { color: #e2e8f0; }

.fab-detail-header {
  font-family: 'Share Tech Mono', monospace; font-size: 18px;
  font-weight: 600; color: #e2e8f0; margin-bottom: 4px;
}
.fab-detail-meta {
  font-size: 12px; color: #64748b; margin-bottom: 14px;
  display: flex; flex-wrap: wrap; gap: 6px 14px;
}
.fab-meta-tag { display: flex; align-items: center; gap: 4px; }
.fab-meta-dot { width: 5px; height: 5px; border-radius: 50%; display: inline-block; }

.fab-section-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.4px; color: #475569; margin: 16px 0 8px; padding-bottom: 4px;
  border-bottom: 1px solid #1a2540;
}

/* Frame / Chamber tree */
.fab-frame-block { margin-bottom: 10px; }
.fab-frame-label {
  font-size: 12px; font-weight: 600; color: #94a3b8;
  margin-bottom: 4px; padding-left: 2px;
}
.fab-chamber-btn {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 7px 10px; margin-bottom: 3px;
  background: #111a2e; border: 1px solid #1a2540; border-radius: 4px;
  color: #c8d0dc; font-family: 'Share Tech Mono', monospace; font-size: 12px;
  cursor: pointer; transition: all 0.15s; text-align: left;
}
.fab-chamber-btn:hover { border-color: #3b82f6; background: #162040; }
.fab-chamber-btn.active { border-color: #3b82f6; background: #162040; color: #e2e8f0; }
.fab-chamber-pm-dots { margin-left: auto; display: flex; gap: 3px; }
.fab-chamber-pm-dot { width: 5px; height: 5px; border-radius: 50%; display: inline-block; }

/* PM / JHA list */
.fab-doc-link {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; margin-bottom: 3px; border-radius: 4px;
  background: #111a2e; border: 1px solid transparent;
  color: #c8d0dc; text-decoration: none;
  font-size: 12px; transition: all 0.15s; cursor: pointer;
}
.fab-doc-link:hover { border-color: #1e2d4a; background: #162040; color: #e2e8f0; }
.fab-pm-badge {
  margin-left: auto; font-family: 'Share Tech Mono', monospace;
  font-size: 10px; padding: 1px 6px; border-radius: 3px;
  font-weight: 600; flex-shrink: 0;
}

/* Quick links row */
.fab-quick-links { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.fab-quick-link {
  padding: 4px 10px; border-radius: 3px; font-size: 11px;
  background: #111a2e; border: 1px solid #1a2540; color: #94a3b8;
  text-decoration: none; cursor: pointer; transition: all 0.15s;
}
.fab-quick-link:hover { border-color: #3b82f6; color: #e2e8f0; }

/* ETO notes */
.fab-eto-entry {
  padding: 8px 10px; margin-bottom: 6px; border-radius: 4px;
  background: #111a2e; border-left: 2px solid #1e2d4a;
}
.fab-eto-head { display: flex; justify-content: space-between; margin-bottom: 4px; }
.fab-eto-author { font-size: 11px; font-weight: 600; color: #94a3b8; }
.fab-eto-date { font-size: 10px; color: #475569; font-family: 'Share Tech Mono', monospace; }
.fab-eto-text { font-size: 11px; line-height: 1.5; color: #8896a8; }

/* Overview state */
.fab-overview-panel { padding: 16px; }
.fab-overview-title { font-size: 16px; font-weight: 700; color: #e2e8f0; margin-bottom: 12px; }
.fab-overview-stat { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 13px; }
.fab-stat-num { font-family: 'Share Tech Mono', monospace; font-size: 20px; font-weight: 600; color: #e2e8f0; width: 36px; }
.fab-legend-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 12px; }
.fab-legend-swatch { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }
`;

// ─────────────────────────────────────────────
// THREE.JS SCENE BUILDER
// ─────────────────────────────────────────────
function createTextCanvas(text: string, color: string, fontSize: number = 28): HTMLCanvasElement {
  const c: HTMLCanvasElement = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx: CanvasRenderingContext2D = c.getContext("2d")!;
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
  return c;
}

function buildScene(toolMeshes: Map<string, THREE.Mesh>): THREE.Scene {
  const scene: THREE.Scene = new THREE.Scene();
  scene.background = new THREE.Color("#080c14");
  scene.fog = new THREE.Fog("#080c14", 80, 160);

  // Lights
  const ambient: THREE.AmbientLight = new THREE.AmbientLight("#4466aa", 0.6);
  scene.add(ambient);
  const dir: THREE.DirectionalLight = new THREE.DirectionalLight("#ffffff", 0.8);
  dir.position.set(30, 50, 40);
  dir.castShadow = false;
  scene.add(dir);
  const dir2: THREE.DirectionalLight = new THREE.DirectionalLight("#6688cc", 0.3);
  dir2.position.set(-20, 30, -30);
  scene.add(dir2);

  // Ground grid
  const grid: THREE.GridHelper = new THREE.GridHelper(200, 80, "#111a2e", "#0d1525");
  grid.position.y = -0.01;
  scene.add(grid);

  // Buildings
  BUILDING_CONFIG.forEach((b: IBuildingConfig) => {
    // Floor plane
    const floorGeo: THREE.PlaneGeometry = new THREE.PlaneGeometry(b.w, b.d);
    const floorMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: b.color, transparent: true, opacity: 0.04, side: THREE.DoubleSide,
    });
    const floor: THREE.Mesh = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(b.x, 0.01, b.z);
    scene.add(floor);

    // Outline
    const hw: number = b.w / 2;
    const hd: number = b.d / 2;
    const pts: THREE.Vector3[] = [
      new THREE.Vector3(b.x - hw, 0.02, b.z - hd),
      new THREE.Vector3(b.x + hw, 0.02, b.z - hd),
      new THREE.Vector3(b.x + hw, 0.02, b.z + hd),
      new THREE.Vector3(b.x - hw, 0.02, b.z + hd),
      new THREE.Vector3(b.x - hw, 0.02, b.z - hd),
    ];
    const lineGeo: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints(pts);
    const lineMat: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: b.color, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Line(lineGeo, lineMat));

    // Vertical corner posts
    const postH: number = 5;
    const corners: number[][] = [
      [b.x - hw, b.z - hd],
      [b.x + hw, b.z - hd],
      [b.x + hw, b.z + hd],
      [b.x - hw, b.z + hd],
    ];
    corners.forEach(([px, pz]: number[]) => {
      const pg: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(px, 0, pz), new THREE.Vector3(px, postH, pz),
      ]);
      scene.add(new THREE.Line(pg, lineMat));
    });

    // Top edges
    const topPts: THREE.Vector3[] = [
      new THREE.Vector3(b.x - hw, postH, b.z - hd),
      new THREE.Vector3(b.x + hw, postH, b.z - hd),
      new THREE.Vector3(b.x + hw, postH, b.z + hd),
      new THREE.Vector3(b.x - hw, postH, b.z + hd),
      new THREE.Vector3(b.x - hw, postH, b.z - hd),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(topPts), lineMat));

    // Building label
    const tex: THREE.CanvasTexture = new THREE.CanvasTexture(createTextCanvas(`BLDG ${b.id}`, b.color, 26));
    const sprite: THREE.Sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.8 }));
    sprite.scale.set(10, 2.5, 1);
    sprite.position.set(b.x, postH + 2, b.z - hd);
    scene.add(sprite);

    // Row labels
    const rows: number[][] = LAYOUT[b.id];
    rows.forEach((_: number[], ri: number) => {
      const rz: number = b.z - b.d / 2 + 6 + ri * 8;
      const rTex: THREE.CanvasTexture = new THREE.CanvasTexture(createTextCanvas(`R${ri + 1}`, "#475569", 20));
      const rSprite: THREE.Sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: rTex, transparent: true, opacity: 0.5 }));
      rSprite.scale.set(4, 1, 1);
      rSprite.position.set(b.x - hw - 3, 1.5, rz);
      scene.add(rSprite);
    });
  });

  // Tool blocks
  const blockGeo: THREE.BoxGeometry = new THREE.BoxGeometry(3.5, 2, 2.5);

  ALL_TOOLS.forEach((tool: ITool) => {
    const vendorColor: string = VENDOR_COLORS[tool.vendor];
    const mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: vendorColor,
      roughness: 0.55,
      metalness: 0.35,
      emissive: new THREE.Color("#000000"),
      emissiveIntensity: 0,
    });
    const mesh: THREE.Mesh = new THREE.Mesh(blockGeo, mat);
    mesh.position.set(tool.x, 1.2, tool.z);
    mesh.userData = { toolId: tool.id };
    scene.add(mesh);
    toolMeshes.set(tool.id, mesh);

    // Urgent PM ring
    if (tool.urgentPM <= 2) {
      const ringGeo: THREE.RingGeometry = new THREE.RingGeometry(2.2, 2.5, 32);
      const ringMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: URGENCY.urgent, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const ring: THREE.Mesh = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(tool.x, 0.05, tool.z);
      ring.userData = { pmRing: true, toolId: tool.id };
      scene.add(ring);
    } else if (tool.urgentPM <= 5) {
      const ringGeo: THREE.RingGeometry = new THREE.RingGeometry(2.2, 2.4, 32);
      const ringMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: URGENCY.soon, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
      const ring: THREE.Mesh = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(tool.x, 0.05, tool.z);
      scene.add(ring);
    }

    // ETO indicator dot
    if (tool.etos.length > 0) {
      const dotGeo: THREE.SphereGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const dotMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: "#f59e0b" });
      const dot: THREE.Mesh = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(tool.x + 1.8, 2.5, tool.z);
      scene.add(dot);
    }
  });

  return scene;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const GroupDashboard: React.FC<IGroupDashboardProps> = (props: IGroupDashboardProps) => {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedChamberId, setSelectedChamberId] = useState<string | null>(null);
  const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const toolMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animFrameRef = useRef<number>(0);

  // Camera orbit state
  const camState = useRef<ICamState>({
    theta: Math.PI * 0.3,
    phi: Math.PI * 0.28,
    radius: 90,
    target: new THREE.Vector3(-5, 0, 0),
    tTheta: Math.PI * 0.3,
    tPhi: Math.PI * 0.28,
    tRadius: 90,
    tTarget: new THREE.Vector3(-5, 0, 0),
    isDragging: false,
    prevX: 0,
    prevY: 0,
    idleTimer: 0,
    autoRotate: true,
  });

  const selectedToolRef = useRef<string | null>(null);

  // Sync refs for animation loop
  useEffect(() => { selectedToolRef.current = selectedToolId; }, [selectedToolId]);

  const selectedTool: ITool | undefined = useMemo(() => ALL_TOOLS.find(t => t.id === selectedToolId), [selectedToolId]);
  const selectedChamber: ISelectedChamber | null = useMemo(() => {
    if (!selectedTool || !selectedChamberId) return null;
    for (const f of selectedTool.frames) {
      const c: IChamber | undefined = f.chambers.find(ch => ch.id === selectedChamberId);
      if (c) return { ...c, frame: f };
    }
    return null;
  }, [selectedTool, selectedChamberId]);

  const filteredTools: ITool[] = useMemo(() => {
    if (!searchQuery.trim()) return ALL_TOOLS;
    const q: string = searchQuery.toLowerCase();
    return ALL_TOOLS.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.vendorLabel.toLowerCase().includes(q) ||
      t.platform.toLowerCase().includes(q) ||
      `building ${t.building}`.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toolsByBuilding: Record<string, ITool[]> = useMemo(() => {
    const groups: Record<string, ITool[]> = { A: [], B: [], C: [] };
    filteredTools.forEach(t => {
      if (groups[t.building]) groups[t.building].push(t);
    });
    return groups;
  }, [filteredTools]);

  // ─── Inject stylesheet ───
  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style: HTMLStyleElement = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    return () => {
      const existing: HTMLElement | null = document.getElementById(STYLE_ID);
      if (existing) existing.remove();
    };
  }, []);

  // ─── FLY TO TOOL ───
  const flyToTool = useCallback((tool: ITool): void => {
    const cs: ICamState = camState.current;
    cs.tTarget = new THREE.Vector3(tool.x, 1, tool.z);
    cs.tRadius = 18;
    cs.tPhi = Math.PI * 0.25;
    cs.autoRotate = false;
    cs.idleTimer = 0;
  }, []);

  const resetCamera = useCallback((): void => {
    const cs: ICamState = camState.current;
    cs.tTheta = Math.PI * 0.3;
    cs.tPhi = Math.PI * 0.28;
    cs.tRadius = 90;
    cs.tTarget = new THREE.Vector3(-5, 0, 0);
    cs.autoRotate = true;
    setSelectedToolId(null);
    setSelectedChamberId(null);
  }, []);

  // ─── SELECT TOOL ───
  const selectTool = useCallback((toolId: string): void => {
    const tool: ITool | undefined = ALL_TOOLS.find(t => t.id === toolId);
    if (!tool) return;
    setSelectedToolId(toolId);
    setSelectedChamberId(null);
    flyToTool(tool);
  }, [flyToTool]);

  // ─── THREE.JS SETUP ───
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const toolMeshes: Map<string, THREE.Mesh> = toolMeshesRef.current;
    const scene: THREE.Scene = buildScene(toolMeshes);

    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.5, 300);
    cameraRef.current = camera;

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;

    // Mouse handlers
    const onMouseDown = (e: MouseEvent): void => {
      if (e.button !== 0) return;
      const cs: ICamState = camState.current;
      cs.isDragging = true;
      cs.prevX = e.clientX;
      cs.prevY = e.clientY;
    };
    const onMouseUp = (): void => { camState.current.isDragging = false; };
    const onMouseMove = (e: MouseEvent): void => {
      const rect: DOMRect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Tooltip position
      if (tooltipRef.current) {
        tooltipRef.current.style.left = (e.clientX - rect.left + 14) + "px";
        tooltipRef.current.style.top = (e.clientY - rect.top - 10) + "px";
      }

      const cs: ICamState = camState.current;
      if (cs.isDragging) {
        const dx: number = e.clientX - cs.prevX;
        const dy: number = e.clientY - cs.prevY;
        cs.tTheta -= dx * 0.005;
        cs.tPhi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, cs.tPhi - dy * 0.005));
        cs.prevX = e.clientX;
        cs.prevY = e.clientY;
        cs.autoRotate = false;
        cs.idleTimer = 0;
      }
    };
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const cs: ICamState = camState.current;
      cs.tRadius = Math.max(12, Math.min(150, cs.tRadius + e.deltaY * 0.06));
      cs.idleTimer = 0;
    };
    const onClick = (): void => {
      if (camState.current.isDragging) return;
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const hits: THREE.Intersection[] = raycasterRef.current.intersectObjects(
        Array.from(toolMeshes.values()), false
      );
      if (hits.length > 0) {
        const tid: string | undefined = hits[0].object.userData.toolId;
        if (tid) selectTool(tid);
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("click", onClick);

    // Animation loop
    let prevHovered: string | null = null;
    const clock: THREE.Clock = new THREE.Clock();

    const animate = (): void => {
      animFrameRef.current = requestAnimationFrame(animate);
      const dt: number = clock.getDelta();
      const cs: ICamState = camState.current;

      // Auto-rotate
      cs.idleTimer += dt;
      if (cs.idleTimer > 4 && cs.radius > 40) {
        cs.autoRotate = true;
      }
      if (cs.autoRotate) {
        cs.tTheta += dt * 0.06;
      }

      // Lerp camera
      cs.theta += (cs.tTheta - cs.theta) * 0.06;
      cs.phi += (cs.tPhi - cs.phi) * 0.06;
      cs.radius += (cs.tRadius - cs.radius) * 0.06;
      cs.target.lerp(cs.tTarget, 0.06);

      camera.position.x = cs.target.x + cs.radius * Math.sin(cs.phi) * Math.cos(cs.theta);
      camera.position.y = cs.target.y + cs.radius * Math.cos(cs.phi);
      camera.position.z = cs.target.z + cs.radius * Math.sin(cs.phi) * Math.sin(cs.theta);
      camera.lookAt(cs.target);

      // Raycasting for hover
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const hits: THREE.Intersection[] = raycasterRef.current.intersectObjects(Array.from(toolMeshes.values()), false);
      const hitId: string | null = hits.length > 0 ? hits[0].object.userData.toolId : null;

      if (hitId !== prevHovered) {
        prevHovered = hitId;
        setHoveredToolId(hitId);
        if (tooltipRef.current) {
          if (hitId) {
            const t: ITool | undefined = ALL_TOOLS.find(x => x.id === hitId);
            tooltipRef.current.style.display = "block";
            tooltipRef.current.innerHTML = `<span class="fab-tt-id">${hitId}</span><br/><span class="fab-tt-sub">${t?.platform} · ${t?.vendorLabel}</span>`;
          } else {
            tooltipRef.current.style.display = "none";
          }
        }
      }

      // Update mesh visuals
      const sel: string | null = selectedToolRef.current;
      const time: number = clock.elapsedTime;
      toolMeshes.forEach((mesh: THREE.Mesh, id: string) => {
        const mat: THREE.MeshStandardMaterial = mesh.material as THREE.MeshStandardMaterial;
        if (id === sel) {
          const tool: ITool | undefined = ALL_TOOLS.find(t => t.id === id);
          mat.emissive.set(VENDOR_COLORS[tool?.vendor || "A"]);
          mat.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.1;
          mesh.scale.setScalar(1.08);
        } else if (id === hitId) {
          mat.emissive.set("#ffffff");
          mat.emissiveIntensity = 0.15;
          mesh.scale.setScalar(1.04);
        } else {
          mat.emissive.set("#000000");
          mat.emissiveIntensity = 0;
          mesh.scale.setScalar(1);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = (): void => {
      const w: number = canvas.clientWidth;
      const h: number = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro: ResizeObserver = new ResizeObserver(onResize);
    ro.observe(canvas.parentElement!);

    return (): void => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("click", onClick);
      ro.disconnect();
      renderer.dispose();
    };
  }, [selectTool]);

  // ─── URGENCY HELPER ───
  const urgencyColor = (days: number): string => days <= 2 ? URGENCY.urgent : days <= 5 ? URGENCY.soon : URGENCY.upcoming;
  const urgencyLabel = (days: number): string => days <= 2 ? "URGENT" : days <= 5 ? "SOON" : `${days}d`;

  // ─── RENDER ───
  return (
    <div className="fab-root">
      {/* LEFT PANEL */}
      <div className="fab-left-panel">
        <div className="fab-left-header">
          <div className="fab-left-title">Deposition Module</div>
          <input
            className="fab-search-box"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="fab-tool-list">
          {["A", "B", "C"].map((bldg: string) => {
            const tools: ITool[] = toolsByBuilding[bldg];
            if (!tools || tools.length === 0) return null;
            return (
              <div key={bldg} className="fab-bldg-group">
                <div className="fab-bldg-header">
                  <span className="fab-bldg-dot" style={{ background: BUILDING_COLORS[bldg] }} />
                  Building {bldg}
                </div>
                {tools.map((t: ITool) => (
                  <div
                    key={t.id}
                    className={`fab-tool-item${t.id === selectedToolId ? " active" : ""}${t.id === hoveredToolId && t.id !== selectedToolId ? " hovered-3d" : ""}`}
                    onClick={() => selectTool(t.id)}
                    onMouseEnter={() => {
                      const mesh: THREE.Mesh | undefined = toolMeshesRef.current.get(t.id);
                      if (mesh) {
                        (mesh.material as THREE.MeshStandardMaterial).emissive.set("#ffffff");
                        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.12;
                        mesh.scale.setScalar(1.04);
                      }
                    }}
                    onMouseLeave={() => {
                      if (t.id !== selectedToolId) {
                        const mesh: THREE.Mesh | undefined = toolMeshesRef.current.get(t.id);
                        if (mesh) {
                          (mesh.material as THREE.MeshStandardMaterial).emissive.set("#000000");
                          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
                          mesh.scale.setScalar(1);
                        }
                      }
                    }}
                  >
                    <span className="fab-vendor-tag" style={{ background: VENDOR_COLORS[t.vendor] }} />
                    {t.id}
                    {t.urgentPM <= 5 && (
                      <span className="fab-tool-urgency" style={{ background: urgencyColor(t.urgentPM) }} />
                    )}
                    <span className="fab-platform-hint">{t.platform.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D VIEWPORT */}
      <div className="fab-viewport-wrap">
        <canvas ref={canvasRef} />
        <div ref={tooltipRef} className="fab-tooltip-3d" />
        <button className="fab-reset-cam-btn" onClick={resetCamera}>↻ Overview</button>
      </div>

      {/* RIGHT PANEL */}
      <div className={`fab-right-panel${selectedTool ? " open" : ""}`}>
        {selectedTool && (
          <div className="fab-right-scroll" style={{ position: "relative" }}>
            <button className="fab-right-close" onClick={resetCamera}>✕</button>

            {/* ── Tool Header ── */}
            <div className="fab-detail-header">{selectedTool.id}</div>
            <div className="fab-detail-meta">
              <span className="fab-meta-tag">
                <span className="fab-meta-dot" style={{ background: VENDOR_COLORS[selectedTool.vendor] }} />
                {selectedTool.vendorLabel}
              </span>
              <span className="fab-meta-tag">{selectedTool.platform}</span>
              <span className="fab-meta-tag">
                <span className="fab-meta-dot" style={{ background: BUILDING_COLORS[selectedTool.building] }} />
                Bldg {selectedTool.building} · Row {selectedTool.row}
              </span>
            </div>

            {/* ── Frames & Chambers ── */}
            <div className="fab-section-label">Equipment Hierarchy</div>
            {selectedTool.frames.map((f: IFrame) => (
              <div key={f.id} className="fab-frame-block">
                <div className="fab-frame-label">{f.label}</div>
                {f.chambers.map((ch: IChamber) => (
                  <button
                    key={ch.id}
                    className={`fab-chamber-btn${ch.id === selectedChamberId ? " active" : ""}`}
                    onClick={() => setSelectedChamberId(ch.id === selectedChamberId ? null : ch.id)}
                  >
                    ▸ {ch.label}
                    <span className="fab-chamber-pm-dots">
                      {ch.pms.map((p: IPM, i: number) => (
                        <span key={i} className="fab-chamber-pm-dot" style={{ background: urgencyColor(p.daysUntil) }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            ))}

            {/* ── Chamber Detail ── */}
            {selectedChamber && (
              <>
                <div className="fab-section-label">PM Procedures — {selectedChamber.label}</div>
                {selectedChamber.pms.map((pm: IPM, i: number) => (
                  <a key={i} href={pm.link} className="fab-doc-link">
                    <span style={{ color: "#94a3b8" }}>⚙</span>
                    {pm.name}
                    <span
                      className="fab-pm-badge"
                      style={{
                        background: urgencyColor(pm.daysUntil) + "22",
                        color: urgencyColor(pm.daysUntil),
                        border: `1px solid ${urgencyColor(pm.daysUntil)}44`,
                      }}
                    >
                      {urgencyLabel(pm.daysUntil)}
                    </span>
                  </a>
                ))}

                <div className="fab-section-label">JHA Documents</div>
                {selectedChamber.jhas.map((j: IJHA, i: number) => (
                  <a key={i} href={j.link} className="fab-doc-link">
                    <span style={{ color: "#f59e0b" }}>⚠</span>
                    {j.name}
                  </a>
                ))}

                <div className="fab-section-label">Quick Links</div>
                <div className="fab-quick-links">
                  <a href={selectedChamber.onenote} className="fab-quick-link">📓 OneNote</a>
                  <a href={selectedChamber.photos} className="fab-quick-link">📷 Photos</a>
                  <a href={selectedTool.confluence} className="fab-quick-link">📄 Confluence</a>
                  <a href={selectedTool.tableau} className="fab-quick-link">📊 Tableau</a>
                  <a href={selectedTool.oem} className="fab-quick-link">📘 OEM Manual</a>
                </div>
              </>
            )}

            {/* ── Tool-Level Links ── */}
            {!selectedChamber && (
              <>
                <div className="fab-section-label">Tool Links</div>
                <div className="fab-quick-links">
                  <a href={selectedTool.confluence} className="fab-quick-link">📄 Confluence</a>
                  <a href={selectedTool.tableau} className="fab-quick-link">📊 Tableau</a>
                  <a href={selectedTool.oem} className="fab-quick-link">📘 OEM Manual</a>
                </div>
              </>
            )}

            {/* ── ETO Notes ── */}
            {selectedTool.etos.length > 0 && (
              <>
                <div className="fab-section-label">ETO Notes</div>
                {selectedTool.etos.map((eto: IETO, i: number) => (
                  <div key={i} className="fab-eto-entry">
                    <div className="fab-eto-head">
                      <span className="fab-eto-author">{eto.author}</span>
                      <span className="fab-eto-date">{eto.date}</span>
                    </div>
                    <div className="fab-eto-text">{eto.text}</div>
                  </div>
                ))}
              </>
            )}
            {selectedTool.etos.length === 0 && (
              <>
                <div className="fab-section-label">ETO Notes</div>
                <div style={{ fontSize: 12, color: "#475569", padding: "8px 0" }}>
                  No recent notes for this tool.
                </div>
              </>
            )}
          </div>
        )}

        {/* Overview state when nothing selected */}
        {!selectedTool && (
          <div className="fab-overview-panel">
            <div className="fab-overview-title">Module Overview</div>
            <div className="fab-overview-stat">
              <span className="fab-stat-num">31</span> Tools across 3 buildings
            </div>
            <div className="fab-overview-stat">
              <span className="fab-stat-num" style={{ color: URGENCY.urgent }}>
                {ALL_TOOLS.filter(t => t.urgentPM <= 2).length}
              </span> Urgent PMs (≤2 days)
            </div>
            <div className="fab-overview-stat">
              <span className="fab-stat-num" style={{ color: URGENCY.soon }}>
                {ALL_TOOLS.filter(t => t.urgentPM > 2 && t.urgentPM <= 5).length}
              </span> Upcoming PMs (≤5 days)
            </div>
            <div style={{ height: 1, background: "#1a2540", margin: "14px 0" }} />
            <div className="fab-section-label" style={{ marginTop: 0 }}>Legend</div>
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: VENDOR_COLORS.A }} />
              Vendor A
            </div>
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: VENDOR_COLORS.B }} />
              Vendor B
            </div>
            <div style={{ height: 8 }} />
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: BUILDING_COLORS.A }} />
              Building A
            </div>
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: BUILDING_COLORS.B }} />
              Building B
            </div>
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: BUILDING_COLORS.C }} />
              Building C
            </div>
            <div style={{ height: 8 }} />
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: URGENCY.urgent, borderRadius: "50%" }} />
              PM ≤2 days (urgent)
            </div>
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: URGENCY.soon, borderRadius: "50%" }} />
              PM ≤5 days (soon)
            </div>
            <div className="fab-legend-row">
              <span className="fab-legend-swatch" style={{ background: URGENCY.upcoming, borderRadius: "50%" }} />
              PM &gt;5 days
            </div>
            <div style={{ height: 14 }} />
            <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
              Click a tool in the list or 3D view to inspect equipment hierarchy, PM schedules, JHAs, and ETO notes. Drag to orbit, scroll to zoom.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDashboard;
