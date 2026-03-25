import * as React from 'react';
import type { IGroupDashboardProps } from './IGroupDashboardProps';

/* ============================================================
   FLEET TOOLKIT V1 — SPFx Light Theme
   Matches SharePoint's native look. Bigger text, wider layout.
   ============================================================ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTool = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyLink = any;

const CONFIG = {
  buildings: {
    A: { label: "Building A", x: 3, y: 28, width: 22, height: 32, order: 1 },
    B: { label: "Building B", x: 34, y: 5, width: 38, height: 32, order: 2 },
    C: { label: "Building C", x: 80, y: 5, width: 72, height: 32, order: 3 },
  } as Record<string, { label: string; x: number; y: number; width: number; height: number; order: number }>,
  bays: {
    A: [{ label: "7", relX: 0.3 }, { label: "8", relX: 0.7 }],
    B: [{ label: "4", relX: 0.2 }, { label: "12", relX: 0.5 }, { label: "16", relX: 0.8 }],
    C: [{ label: "10", relX: 0.08 }, { label: "21", relX: 0.22 }, { label: "24", relX: 0.38 }, { label: "27", relX: 0.54 }, { label: "38", relX: 0.74 }, { label: "41", relX: 0.9 }],
  } as Record<string, Array<{ label: string; relX: number }>>,
  oneNoteTip: 'Opens read-only. Use "..." → "Copy to My Notebooks" for your own editable copy.',
  quickLinks: [
    { url: "https://sharepoint.example.com/onboarding", label: "Onboarding Guide", icon: "🎓" },
  ],
};

function getBayLines(bays: Array<{ relX: number }>): number[] {
  if (!bays || bays.length === 0) return [];
  const lines: number[] = [];
  const edge = 0.04;
  lines.push(Math.max(edge, bays[0].relX - (bays.length > 1 ? (bays[1].relX - bays[0].relX) / 2 : 0.15)));
  for (let i = 0; i < bays.length - 1; i++) lines.push((bays[i].relX + bays[i + 1].relX) / 2);
  lines.push(Math.min(1 - edge, bays[bays.length - 1].relX + (bays.length > 1 ? (bays[bays.length - 1].relX - bays[bays.length - 2].relX) / 2 : 0.15)));
  return lines;
}

const VENDORS: Record<string, { label: string; color: string; fill: string; light: string }> = {
  A: { label: "Vendor A", color: "#2b5797", fill: "#2b579710", light: "#e8eef7" },
  B: { label: "Vendor B", color: "#217346", fill: "#21734610", light: "#e6f4ec" },
  C: { label: "Vendor C", color: "#c43e1c", fill: "#c43e1c10", light: "#fce8e4" },
};

/* ============================================================
   TOOL DATA
   ============================================================ */
const TOOLS: AnyTool[] = [
  // ── BUILDING A ──
  { id: "VVEX54200", vendor: "A", frameType: "Type-Alpha", building: "A", col: "7", pos: 0, posTotal: 2,
    image: null,
    links: { oneNote: { url: "#", name: "VVEX54200 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "VVEX54200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250669-001" } }},
      { id: "VVEX54200-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250669-002" } }},
      { id: "VVEX54200-C", label: "Chamber C", links: { oneNote: { url: "#", name: "Chamber C Photos" }, jha: null, pm: { url: "#", name: "202-250670-001" } }},
    ]},
  { id: "TNYE50500", vendor: "B", frameType: "Type-Beta", building: "A", col: "7", pos: 1, posTotal: 2,
    image: null,
    links: { oneNote: { url: "#", name: "TNYE50500 Frame Overview" }, jha: null, pm: { url: "#", name: "305-110440-001" } },
    chambers: [
      { id: "TNYE50500-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: { url: "#", name: "JHA-TEL-018-A" }, pm: null }},
      { id: "TNYE50500-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: { url: "#", name: "JHA-TEL-018-B" }, pm: null }},
    ]},
  { id: "VVEX54300", vendor: "A", frameType: "Type-Alpha", building: "A", col: "8", pos: 0, posTotal: 2,
    image: null,
    links: { oneNote: { url: "#", name: "VVEX54300 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "VVEX54300-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250669-001" } }},
      { id: "VVEX54300-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250669-002" } }},
    ]},
  { id: "TNYE50600", vendor: "B", frameType: "Type-Beta", building: "A", col: "8", pos: 1, posTotal: 2,
    image: null,
    links: { oneNote: { url: "#", name: "TNYE50600 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-019" }, pm: { url: "#", name: "305-110441-001" } },
    chambers: [
      { id: "TNYE50600-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: null }},
    ]},

  // ── BUILDING B ──
  { id: "LRCE40100", vendor: "A", frameType: "Type-Alpha", building: "B", col: "4", pos: 0, posTotal: 1,
    image: null,
    links: { oneNote: { url: "#", name: "LRCE40100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LRCE40100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250672-001" } }},
      { id: "LRCE40100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250672-002" } }},
      { id: "LRCE40100-C", label: "Chamber C", links: { oneNote: { url: "#", name: "Chamber C Photos" }, jha: null, pm: { url: "#", name: "202-250672-003" } }},
      { id: "LRCE40100-D", label: "Chamber D", links: { oneNote: { url: "#", name: "Chamber D Photos" }, jha: null, pm: { url: "#", name: "202-250672-004" } }},
    ]},
  { id: "TVEX10100", vendor: "B", frameType: "Type-Beta", building: "B", col: "12", pos: 0, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "TVEX10100 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-020" }, pm: null },
    chambers: [
      { id: "TVEX10100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110445-001" } }},
      { id: "TVEX10100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "305-110445-002" } }},
    ]},
  { id: "TVEX10200", vendor: "B", frameType: "Type-Beta", building: "B", col: "12", pos: 1, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "TVEX10200 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-020" }, pm: null },
    chambers: [
      { id: "TVEX10200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110446-001" } }},
    ]},
  { id: "AALS20100", vendor: "C", frameType: "Type-Gamma", building: "B", col: "12", pos: 2, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "AALS20100 Frame Overview" }, jha: { url: "#", name: "JHA-ASM-005" }, pm: { url: "#", name: "410-330012-001" } },
    chambers: [
      { id: "AALS20100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: null }},
    ]},
  { id: "LRCE40200", vendor: "A", frameType: "Type-Alpha", building: "B", col: "16", pos: 0, posTotal: 1,
    image: null,
    links: { oneNote: { url: "#", name: "LRCE40200 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LRCE40200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250673-001" } }},
      { id: "LRCE40200-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250673-002" } }},
    ]},

  // ── BUILDING C ──
  { id: "LSTA10100", vendor: "A", frameType: "Type-Delta", building: "C", col: "10", pos: 0, posTotal: 1, image: null,
    links: { oneNote: { url: "#", name: "LSTA10100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-055" }, pm: null },
    chambers: [
      { id: "LSTA10100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250680-001" } }},
      { id: "LSTA10100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250680-002" } }},
    ]},
  { id: "TVEX20100", vendor: "B", frameType: "Type-Beta", building: "C", col: "21", pos: 0, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "TVEX20100 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-021" }, pm: null },
    chambers: [{ id: "TVEX20100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110450-001" } }}]},
  { id: "LVEX20200", vendor: "A", frameType: "Type-Alpha", building: "C", col: "21", pos: 1, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "LVEX20200 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LVEX20200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250669-001" } }},
      { id: "LVEX20200-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250669-002" } }},
    ]},
  { id: "AVEX20300", vendor: "C", frameType: "Type-Gamma", building: "C", col: "21", pos: 2, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "AVEX20300 Frame Overview" }, jha: { url: "#", name: "JHA-ASM-005" }, pm: { url: "#", name: "410-330015-001" } },
    chambers: [{ id: "AVEX20300-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: null }}]},
  { id: "LRTR11100", vendor: "A", frameType: "Type-Alpha", building: "C", col: "24", pos: 0, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "LRTR11100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LRTR11100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250675-001" } }},
      { id: "LRTR11100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250675-002" } }},
    ]},
  { id: "TRTR11200", vendor: "B", frameType: "Type-Beta", building: "C", col: "24", pos: 1, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "TRTR11200 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-022" }, pm: null },
    chambers: [{ id: "TRTR11200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110452-001" } }}]},
  { id: "LV4T10100", vendor: "A", frameType: "Type-Alpha", building: "C", col: "24", pos: 2, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "LV4T10100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LV4T10100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250676-001" } }},
      { id: "LV4T10100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250676-002" } }},
    ]},
  { id: "TV4T10200", vendor: "B", frameType: "Type-Beta", building: "C", col: "27", pos: 0, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "TV4T10200 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-023" }, pm: null },
    chambers: [{ id: "TV4T10200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110455-001" } }}]},
  { id: "LV4T10300", vendor: "A", frameType: "Type-Alpha", building: "C", col: "27", pos: 1, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "LV4T10300 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [{ id: "LV4T10300-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250677-001" } }}]},
  { id: "AV4T10400", vendor: "C", frameType: "Type-Gamma", building: "C", col: "27", pos: 2, posTotal: 3, image: null,
    links: { oneNote: { url: "#", name: "AV4T10400 Frame Overview" }, jha: { url: "#", name: "JHA-ASM-005" }, pm: { url: "#", name: "410-330018-001" } },
    chambers: [{ id: "AV4T10400-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: null }}]},
  { id: "LRLT10100", vendor: "A", frameType: "Type-Delta", building: "C", col: "38", pos: 0, posTotal: 1, image: null,
    links: { oneNote: { url: "#", name: "LRLT10100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-055" }, pm: null },
    chambers: [{ id: "LRLT10100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250681-001" } }}]},
  { id: "TEZ410100", vendor: "B", frameType: "Type-Beta", building: "C", col: "41", pos: 0, posTotal: 1, image: null,
    links: { oneNote: { url: "#", name: "TEZ410100 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-025" }, pm: null },
    chambers: [
      { id: "TEZ410100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110460-001" } }},
      { id: "TEZ410100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "305-110460-002" } }},
    ]},
];

/* ============================================================
   RENDERING — Light theme
   ============================================================ */

/* Light theme colors */
const T = {
  bg: "#ffffff",
  bgAlt: "#f5f6f8",
  bgMap: "#eef1f5",
  border: "#e1e4e8",
  borderLight: "#eef0f3",
  text: "#24292f",
  textMuted: "#656d76",
  textFaint: "#8b949e",
  panelBg: "#ffffff",
  panelOverlay: "rgba(0,0,0,0.25)",
};

function getPos(t: AnyTool): { x: number; y: number } {
  const b = CONFIG.buildings[t.building];
  const bay = CONFIG.bays[t.building]?.find((c: { label: string }) => c.label === t.col);
  if (!b || !bay) return { x: 0, y: 0 };
  const x = b.x + b.width * bay.relX;
  const pad = 3;
  const sp = (b.height - pad * 2) / (t.posTotal + 1);
  return { x, y: b.y + pad + sp * (t.pos + 1) };
}

const NoteLnk: React.FC<{ link: AnyLink; m: boolean }> = ({ link, m }) => {
  if (!link) return null;
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: m ? "10px 12px" : "8px 12px", textDecoration: "none", cursor: "pointer" }}>
      <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em", flexShrink: 0 }}>OneNote</span>
      <div style={{ fontSize: m ? 14 : 13, color: T.text, fontWeight: 500 }}>{link.name}</div>
    </a>
  );
};

const PillLnk: React.FC<{ link: AnyLink; type: string; m: boolean }> = ({ link, type, m }) => {
  if (!link) return null;
  const label = type === "jha" ? "JHA" : "PM";
  const color = type === "jha" ? "#b45309" : "#1d4ed8";
  const bg = type === "jha" ? "#fffbeb" : "#eff6ff";
  const bdr = type === "jha" ? "#fde68a" : "#bfdbfe";
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: bg, border: `1px solid ${bdr}`, borderRadius: 5,
      padding: m ? "6px 10px" : "5px 9px", textDecoration: "none", cursor: "pointer",
    }}>
      <span style={{ fontSize: 9, color, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: m ? 12 : 11, color: T.text, fontWeight: 500, fontFamily: "'Courier New', monospace" }}>{link.name}</span>
    </a>
  );
};

const Sec: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 11, color: T.textFaint, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6, marginTop: 14, fontWeight: 600, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>{children}</div>
);

const ActionPanel: React.FC<{ tool: AnyTool; onClose: () => void; isMobile: boolean }> = ({ tool, onClose, isMobile: m }) => {
  if (!tool) return null;
  const vc = VENDORS[tool.vendor] || VENDORS.A;

  const renderLinks = (links: AnyLink): JSX.Element => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 auto", minWidth: 0 }}><NoteLnk link={links.oneNote} m={m} /></div>
      {(links.jha || links.pm) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", flexShrink: 0 }}>
          <PillLnk link={links.jha} type="jha" m={m} />
          <PillLnk link={links.pm} type="pm" m={m} />
        </div>
      )}
    </div>
  );

  const content = (
    <>
      {tool.image && <img src={tool.image} alt={tool.id} style={{ width: "100%", height: m ? 160 : 140, objectFit: "cover" as const, display: "block" }} />}
      <div style={{ padding: m ? "12px 20px 14px" : "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
        {m && !tool.image && <div style={{ display: "flex", justifyContent: "center", padding: "0 0 10px" }}><div style={{ width: 40, height: 4, borderRadius: 2, background: "#d1d5db" }} /></div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: m ? 20 : 18, fontWeight: 700, color: T.text, fontFamily: "'Courier New', monospace", wordBreak: "break-all" as const }}>{tool.id}</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 3 }}>{tool.frameType} · {CONFIG.buildings[tool.building].label} · Col {tool.col}</div>
          </div>
          <button onClick={onClose} style={{ background: T.bgAlt, border: `1px solid ${T.border}`, color: T.textMuted, borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 10 }}>✕</button>
        </div>
        <div style={{ marginTop: 8, display: "inline-flex", background: vc.light, border: `1px solid ${vc.color}30`, borderRadius: 5, padding: "3px 10px", fontSize: 11, color: vc.color, fontWeight: 700 }}>{vc.label}</div>
      </div>
      <div style={{ padding: m ? "0 20px 24px" : "0 20px 20px" }}>
        <Sec>Frame — {tool.id}</Sec>
        {renderLinks(tool.links)}
        {(tool.chambers || []).map((ch: AnyTool) => (
          <div key={ch.id}>
            <Sec>{ch.label} — {ch.id}</Sec>
            {renderLinks(ch.links)}
          </div>
        ))}
        <div style={{ marginTop: 16, background: T.bgAlt, border: `1px solid ${T.borderLight}`, borderRadius: 6, padding: "10px 12px", fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>
          <span style={{ color: T.textFaint, fontWeight: 600 }}>OneNote:</span> {CONFIG.oneNoteTip}
        </div>
        {CONFIG.quickLinks.length > 0 && (
          <><Sec>Quick Links</Sec><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CONFIG.quickLinks.map((q) => (
              <a key={q.label} href={q.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 10px", textDecoration: "none", fontSize: 12, color: T.textMuted }}><span>{q.icon}</span> {q.label}</a>
            ))}</div></>
        )}
      </div>
    </>
  );

  return m ? (
    <><div onClick={onClose} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: T.panelOverlay, zIndex: 900 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, maxHeight: "80%", background: T.panelBg, borderRadius: "16px 16px 0 0", zIndex: 1000, overflowY: "auto", borderTop: `3px solid ${vc.color}`, boxShadow: "0 -4px 24px rgba(0,0,0,0.15)" }}>{content}</div></>
  ) : (
    <><div onClick={onClose} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: T.panelOverlay, zIndex: 400 }} />
    <div style={{ position: "absolute", top: 0, right: 0, width: 380, bottom: 0, background: T.panelBg, borderLeft: `3px solid ${vc.color}`, zIndex: 500, overflowY: "auto", boxShadow: "-4px 0 24px rgba(0,0,0,0.1)" }}>{content}</div></>
  );
};

const DesktopMap: React.FC<{ tools: AnyTool[]; vf: string; onSelect: (t: AnyTool) => void }> = ({ tools, vf, onSelect }) => {
  const [ht, setHt] = React.useState<AnyTool>(null);
  const [hp, setHp] = React.useState({ x: 0, y: 0 });
  const f = vf === "ALL" ? tools : tools.filter((t: AnyTool) => t.vendor === vf);

  return (
    <div style={{ flex: 1, background: T.bgMap, borderRadius: 8, border: `1px solid ${T.border}`, padding: 6, position: "relative", minHeight: 0, overflow: "hidden" }} onMouseMove={(e: React.MouseEvent) => { if (ht) setHp({ x: e.clientX, y: e.clientY }); }}>
      <svg viewBox="0 0 160 66" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", borderRadius: 6 }}>
        {Object.entries(CONFIG.buildings).map(([k, b]) => (
          <g key={k}>
            <rect x={b.x} y={b.y} width={b.width} height={b.height} rx={1} fill="#ffffff" stroke="#d0d7de" strokeWidth={0.3} />
            <text x={b.x + b.width / 2} y={b.y - 1.5} textAnchor="middle" fill="#656d76" fontSize={2.5} fontWeight={700} fontFamily="Segoe UI, sans-serif">{b.label}</text>
          </g>
        ))}
        {Object.entries(CONFIG.bays).map(([bk, bays]) => {
          const b = CONFIG.buildings[bk];
          const lines = getBayLines(bays);
          return (
            <g key={`l-${bk}`}>
              {lines.map((relX, i) => { const x = b.x + b.width * relX; return <line key={i} x1={x} y1={b.y + 1.5} x2={x} y2={b.y + b.height - 1.5} stroke="#d0d7de" strokeWidth={0.2} />; })}
              {bays.map((bay) => <text key={bay.label} x={b.x + b.width * bay.relX} y={b.y + b.height + 2.5} textAnchor="middle" fill="#8b949e" fontSize={1.6} fontFamily="monospace" fontWeight={600}>{bay.label}</text>)}
            </g>
          );
        })}
        {(() => { const bB = CONFIG.buildings.B, bC = CONFIG.buildings.C, y1 = bB.y + bB.height * 0.43, y2 = bB.y + bB.height * 0.57; return (<g><rect x={bB.x + bB.width} y={y1} width={bC.x - (bB.x + bB.width)} height={y2 - y1} fill="#f5f6f8" stroke="#d0d7de" strokeWidth={0.2} rx={0.4} /><text x={(bB.x + bB.width + bC.x) / 2} y={(y1 + y2) / 2 + 0.5} textAnchor="middle" fill="#8b949e" fontSize={1.2}>walkway</text></g>); })()}
        {f.map((t: AnyTool) => {
          const p = getPos(t);
          const vc = VENDORS[t.vendor] || VENDORS.A;
          const h = ht?.id === t.id;
          const sz = 3.5;
          return (
            <g key={t.id} style={{ cursor: "pointer" }}
              onMouseEnter={(e: React.MouseEvent) => { setHt(t); setHp({ x: e.clientX, y: e.clientY }); }}
              onMouseLeave={() => setHt(null)}
              onClick={() => { onSelect(t); setHt(null); }}>
              <rect x={p.x - sz / 2} y={p.y - sz / 2} width={sz} height={sz} rx={0.5} fill={h ? vc.light : "#ffffff"} stroke={vc.color} strokeWidth={h ? 0.6 : 0.3} />
              <rect x={p.x - sz / 2} y={p.y - sz / 2} width={sz} height={0.7} fill={vc.color} opacity={0.8} />
              <text x={p.x} y={p.y + sz / 2 + 1.6} textAnchor="middle" fill="#656d76" fontSize={1.2} fontWeight={600} fontFamily="monospace">{t.id}</text>
            </g>
          );
        })}
      </svg>
      {ht && (
        <div style={{ position: "fixed", left: hp.x + 16, top: hp.y - 6, background: "#ffffffee", border: `1px solid ${T.border}`, borderRadius: 8, padding: 0, minWidth: 220, maxWidth: 300, pointerEvents: "none", zIndex: 300, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          {ht.image && <img src={ht.image} alt={ht.id} style={{ width: "100%", height: 120, objectFit: "cover" as const, display: "block", borderBottom: `1px solid ${T.border}` }} />}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "monospace", marginBottom: 3 }}>{ht.id}</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 2 }}>{ht.frameType} · {VENDORS[ht.vendor].label}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{CONFIG.buildings[ht.building].label} · Col {ht.col} · {ht.chambers?.length || 0} ch</div>
            <div style={{ fontSize: 10, color: T.textFaint, marginTop: 6, fontStyle: "italic" }}>Click for links</div>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileNav: React.FC<{ tools: AnyTool[]; vf: string; onSelect: (t: AnyTool) => void }> = ({ tools, vf, onSelect }) => {
  const f = vf === "ALL" ? tools : tools.filter((t: AnyTool) => t.vendor === vf);
  const g: Record<string, Record<string, AnyTool[]>> = {};
  f.forEach((t: AnyTool) => { if (!g[t.building]) g[t.building] = {}; if (!g[t.building][t.col]) g[t.building][t.col] = []; g[t.building][t.col].push(t); });
  Object.values(g).forEach((c) => Object.values(c).forEach((a) => a.sort((x: AnyTool, y: AnyTool) => x.pos - y.pos)));

  return (
    <div>{Object.entries(CONFIG.buildings).sort((a, b) => a[1].order - b[1].order).map(([bk, bv]) => {
      const cols = g[bk]; if (!cols) return null;
      return (<div key={bk}>
        <div style={{ padding: "12px 16px 8px", background: T.bgAlt, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{bv.label}</div>
        </div>
        {Object.entries(cols).sort((a, b) => Number(a[0]) - Number(b[0])).map(([cn, ct]) => (
          <div key={`${bk}-${cn}`} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${T.borderLight}`, minHeight: 56 }}>
            <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 10 }}>{ct.map((t: AnyTool) => {
              const vc = VENDORS[t.vendor] || VENDORS.A;
              return (
                <button key={t.id} onClick={() => onSelect(t)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <div style={{ width: 36, height: 36, border: `2px solid ${vc.color}55`, borderRadius: 6, background: vc.light, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: vc.color, opacity: 0.6 }} />
                  </div>
                  <div style={{ fontSize: 9, color: T.textMuted, fontFamily: "monospace", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.id}</div>
                </button>);
            })}</div>
            <div style={{ fontSize: 16, color: T.textFaint, fontWeight: 700, fontFamily: "monospace", minWidth: 36, textAlign: "right" as const, paddingLeft: 10 }}>{cn}</div>
          </div>
        ))}</div>);
    })}</div>
  );
};

/* ── Main SPFx Component ── */

export default class GroupDashboard extends React.Component<IGroupDashboardProps, {
  vf: string; sel: AnyTool; mob: boolean; fv: string | null;
}> {
  private _rootRef = React.createRef<HTMLDivElement>();

  constructor(props: IGroupDashboardProps) {
    super(props);
    this.state = { vf: "ALL", sel: null, mob: false, fv: null };
  }

  private _ro: ResizeObserver | null = null;

  public componentDidMount(): void {
    this._checkMobile();
    window.addEventListener("resize", this._checkMobile);
    // ResizeObserver catches iframe/container resizes that window.resize misses
    if (typeof ResizeObserver !== "undefined" && this._rootRef.current) {
      this._ro = new ResizeObserver(this._checkMobile);
      this._ro.observe(this._rootRef.current);
    }
  }
  public componentWillUnmount(): void {
    window.removeEventListener("resize", this._checkMobile);
    if (this._ro) this._ro.disconnect();
  }
  private _checkMobile = (): void => {
    // Use container width if available (works inside SharePoint iframes/mobile preview)
    const containerW = this._rootRef.current?.offsetWidth || window.innerWidth;
    this.setState({ mob: containerW < 768 });
  };

  public render(): React.ReactElement<IGroupDashboardProps> {
    const { vf, sel, mob, fv } = this.state;
    const sm = fv ? fv === "mobile" : mob;

    return (
      <div ref={this._rootRef} style={{ fontFamily: "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, sans-serif", background: T.bg, color: T.text, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: `1px solid ${T.border}`, background: T.bgAlt, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#2b5797", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff" }}>◈</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Fleet Toolkit</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>PCVD · Vendor A / B / C</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* View toggle — lets you force desktop or mobile layout */}
            <div style={{ display: "flex", gap: 2, background: T.bg, borderRadius: 6, padding: 3, border: `1px solid ${T.border}` }}>
              {([["auto", "Auto"], ["desktop", "🖥"], ["mobile", "📱"]] as const).map(([k, lbl]) => (
                <button key={k} onClick={() => this.setState({ fv: k === "auto" ? null : k })} style={{
                  background: (fv === null ? k === "auto" : fv === k) ? T.bgAlt : "transparent",
                  border: "none", borderRadius: 4, padding: "4px 8px", fontSize: 11, cursor: "pointer",
                  fontWeight: (fv === null ? k === "auto" : fv === k) ? 700 : 400, color: T.textMuted,
                }}>{lbl}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 2, background: T.bg, borderRadius: 6, padding: 3, border: `1px solid ${T.border}` }}>
              {["ALL", "A", "B", "C"].map((v) => (
                <button key={v} onClick={() => this.setState({ vf: v })} style={{
                  background: vf === v ? (VENDORS[v]?.light || T.bgAlt) : "transparent", border: "none", borderRadius: 4,
                  padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: vf === v ? 700 : 400,
                  color: vf === v ? (VENDORS[v]?.color || T.text) : T.textMuted,
                }}>{v === "ALL" ? "All" : VENDORS[v]?.label || v}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Vendor legend */}
        <div style={{ display: "flex", gap: 18, padding: "8px 20px", borderBottom: `1px solid ${T.borderLight}` }}>
          {Object.entries(VENDORS).map(([v, c]) => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted }}>
              <div style={{ width: 12, height: 12, border: `2px solid ${c.color}55`, borderRadius: 3, background: c.light }} />
              {c.label}
            </div>
          ))}
        </div>

        {/* Content */}
        {sm ? (
          <div style={{ maxWidth: 430, width: "100%", margin: "0 auto", flex: 1, overflowY: "auto" }}>
            <MobileNav tools={TOOLS} vf={vf} onSelect={(t: AnyTool) => this.setState({ sel: t })} />
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 12, minHeight: 0 }}>
            <DesktopMap tools={TOOLS} vf={vf} onSelect={(t: AnyTool) => this.setState({ sel: t })} />
          </div>
        )}

        <ActionPanel tool={sel} onClose={() => this.setState({ sel: null })} isMobile={sm} />
      </div>
    );
  }
}
