import * as React from 'react';
import type { IGroupDashboardProps } from './IGroupDashboardProps';

/* ============================================================
   FLEET TOOLKIT V1 — SPFx Version
   
   Click a frame on the map → see all links flat.
   Edit CONFIG, VENDORS, and TOOLS below to customize.
   
   LINK FORMAT: { url: "https://...", name: "Display Name" }
   Set to null to hide a link.
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

const VENDORS: Record<string, { label: string; color: string; fill: string }> = {
  A: { label: "Vendor A", color: "#4a90e2", fill: "#4a90e208" },
  B: { label: "Vendor B", color: "#34b864", fill: "#34b86408" },
  C: { label: "Vendor C", color: "#e24a4a", fill: "#e24a4a08" },
};

/* ============================================================
   TOOL DATA — Edit IDs, links, chambers here.
   See the Editing Guide for detailed instructions.
   ============================================================ */
const TOOLS: AnyTool[] = [
  // ── BUILDING A ──
  { id: "VVEX54200", vendor: "A", frameType: "Type-Alpha", building: "A", col: "7", pos: 0, posTotal: 2,
    image: null, // Set to SharePoint image URL like: "https://your-site.sharepoint.com/SiteAssets/photos/VVEX54200.jpg"
    links: {
      oneNote: { url: "https://onenote.example.com/frame-vvex54200", name: "VVEX54200 Frame Overview" },
      jha: { url: "https://sharepoint.example.com/jha/JHA-CVD-042", name: "JHA-CVD-042" },
      pm: null,
    },
    chambers: [
      { id: "VVEX54200-A", label: "Chamber A", links: {
        oneNote: { url: "https://onenote.example.com/ch-a", name: "Chamber A Photos" },
        jha: null,
        pm: { url: "https://sharepoint.example.com/pm/202-250669-001", name: "202-250669-001" },
      }},
      { id: "VVEX54200-B", label: "Chamber B", links: {
        oneNote: { url: "https://onenote.example.com/ch-b", name: "Chamber B Photos" },
        jha: null,
        pm: { url: "https://sharepoint.example.com/pm/202-250669-002", name: "202-250669-002" },
      }},
      { id: "VVEX54200-C", label: "Chamber C", links: {
        oneNote: { url: "https://onenote.example.com/ch-c", name: "Chamber C Photos" },
        jha: null,
        pm: { url: "https://sharepoint.example.com/pm/202-250670-001", name: "202-250670-001" },
      }},
    ]},
  { id: "TNYE50500", vendor: "B", frameType: "Type-Beta", building: "A", col: "7", pos: 1, posTotal: 2,
    image: null,
    links: {
      oneNote: { url: "https://onenote.example.com/frame-tnye50500", name: "TNYE50500 Frame Overview" },
      jha: null,
      pm: { url: "https://sharepoint.example.com/pm/305-110440-001", name: "305-110440-001" },
    },
    chambers: [
      { id: "TNYE50500-A", label: "Chamber A", links: {
        oneNote: { url: "https://onenote.example.com/ch-a", name: "Chamber A Photos" },
        jha: { url: "https://sharepoint.example.com/jha/JHA-TEL-018-A", name: "JHA-TEL-018-A" },
        pm: null,
      }},
      { id: "TNYE50500-B", label: "Chamber B", links: {
        oneNote: { url: "https://onenote.example.com/ch-b", name: "Chamber B Photos" },
        jha: { url: "https://sharepoint.example.com/jha/JHA-TEL-018-B", name: "JHA-TEL-018-B" },
        pm: null,
      }},
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
  { id: "LSTA10100", vendor: "A", frameType: "Type-Delta", building: "C", col: "10", pos: 0, posTotal: 1,
    image: null,
    links: { oneNote: { url: "#", name: "LSTA10100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-055" }, pm: null },
    chambers: [
      { id: "LSTA10100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250680-001" } }},
      { id: "LSTA10100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250680-002" } }},
    ]},
  { id: "TVEX20100", vendor: "B", frameType: "Type-Beta", building: "C", col: "21", pos: 0, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "TVEX20100 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-021" }, pm: null },
    chambers: [
      { id: "TVEX20100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110450-001" } }},
    ]},
  { id: "LVEX20200", vendor: "A", frameType: "Type-Alpha", building: "C", col: "21", pos: 1, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "LVEX20200 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LVEX20200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250669-001" } }},
      { id: "LVEX20200-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250669-002" } }},
    ]},
  { id: "AVEX20300", vendor: "C", frameType: "Type-Gamma", building: "C", col: "21", pos: 2, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "AVEX20300 Frame Overview" }, jha: { url: "#", name: "JHA-ASM-005" }, pm: { url: "#", name: "410-330015-001" } },
    chambers: [
      { id: "AVEX20300-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: null }},
    ]},
  { id: "LRTR11100", vendor: "A", frameType: "Type-Alpha", building: "C", col: "24", pos: 0, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "LRTR11100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LRTR11100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250675-001" } }},
      { id: "LRTR11100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250675-002" } }},
    ]},
  { id: "TATA11200", vendor: "B", frameType: "Type-Beta", building: "C", col: "24", pos: 1, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "TATA11200 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-022" }, pm: null },
    chambers: [
      { id: "TATA11200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110452-001" } }},
    ]},
  { id: "LV4T10100", vendor: "A", frameType: "Type-Alpha", building: "C", col: "24", pos: 2, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "LV4T10100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LV4T10100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250676-001" } }},
      { id: "LV4T10100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "202-250676-002" } }},
    ]},
  { id: "TV4T10200", vendor: "B", frameType: "Type-Beta", building: "C", col: "27", pos: 0, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "TV4T10200 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-023" }, pm: null },
    chambers: [
      { id: "TV4T10200-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110455-001" } }},
    ]},
  { id: "LV4T10300", vendor: "A", frameType: "Type-Alpha", building: "C", col: "27", pos: 1, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "LV4T10300 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-042" }, pm: null },
    chambers: [
      { id: "LV4T10300-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250677-001" } }},
    ]},
  { id: "AV4T10400", vendor: "C", frameType: "Type-Gamma", building: "C", col: "27", pos: 2, posTotal: 3,
    image: null,
    links: { oneNote: { url: "#", name: "AV4T10400 Frame Overview" }, jha: { url: "#", name: "JHA-ASM-005" }, pm: { url: "#", name: "410-330018-001" } },
    chambers: [
      { id: "AV4T10400-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: null }},
    ]},
  { id: "LRLT10100", vendor: "A", frameType: "Type-Delta", building: "C", col: "38", pos: 0, posTotal: 1,
    image: null,
    links: { oneNote: { url: "#", name: "LRLT10100 Frame Overview" }, jha: { url: "#", name: "JHA-CVD-055" }, pm: null },
    chambers: [
      { id: "LRLT10100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "202-250681-001" } }},
    ]},
  { id: "TEZ410100", vendor: "B", frameType: "Type-Beta", building: "C", col: "41", pos: 0, posTotal: 1,
    image: null,
    links: { oneNote: { url: "#", name: "TEZ410100 Frame Overview" }, jha: { url: "#", name: "JHA-TEL-025" }, pm: null },
    chambers: [
      { id: "TEZ410100-A", label: "Chamber A", links: { oneNote: { url: "#", name: "Chamber A Photos" }, jha: null, pm: { url: "#", name: "305-110460-001" } }},
      { id: "TEZ410100-B", label: "Chamber B", links: { oneNote: { url: "#", name: "Chamber B Photos" }, jha: null, pm: { url: "#", name: "305-110460-002" } }},
    ]},
];

/* ============================================================
   RENDERING — You shouldn't need to edit below this line
   ============================================================ */

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
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, background: "#22c55e08", border: "1px solid #22c55e22", borderRadius: 6, padding: m ? "8px 10px" : "6px 9px", textDecoration: "none", cursor: "pointer" }}>
      <span style={{ fontSize: 9, color: "#22c55e88", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>OneNote</span>
      <div style={{ fontSize: m ? 12 : 11, color: "#dde1e8", fontWeight: 500 }}>{link.name}</div>
    </a>
  );
};

const PillLnk: React.FC<{ link: AnyLink; type: string; m: boolean }> = ({ link, type, m }) => {
  if (!link) return null;
  const label = type === "jha" ? "JHA" : "PM";
  const color = type === "jha" ? "#e5a33b" : "#5b7ee5";
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "#111620", border: "1px solid #171d2a", borderRadius: 5,
      padding: m ? "5px 9px" : "4px 7px", textDecoration: "none", cursor: "pointer",
    }}>
      <span style={{ fontSize: 8, color: `${color}99`, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: m ? 11 : 10, color: "#c0c8d4", fontWeight: 500, fontFamily: "'Courier New', monospace" }}>{link.name}</span>
    </a>
  );
};

const Sec: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 9, color: "#2d3a4c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, marginTop: 8, fontWeight: 700, borderTop: "1px solid #131825", paddingTop: 6 }}>{children}</div>
);

const ActionPanel: React.FC<{ tool: AnyTool; onClose: () => void; isMobile: boolean }> = ({ tool, onClose, isMobile: m }) => {
  if (!tool) return null;
  const vc = VENDORS[tool.vendor] || VENDORS.A;

  const renderLinks = (links: AnyLink): JSX.Element => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <NoteLnk link={links.oneNote} m={m} />
      </div>
      {(links.jha || links.pm) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center", flexShrink: 0 }}>
          <PillLnk link={links.jha} type="jha" m={m} />
          <PillLnk link={links.pm} type="pm" m={m} />
        </div>
      )}
    </div>
  );

  const content = (
    <>
      {tool.image && <img src={tool.image} alt={tool.id} style={{ width: "100%", height: m ? 160 : 140, objectFit: "cover", display: "block" }} />}
      <div style={{ padding: m ? "8px 20px 10px" : "12px 16px 8px", borderBottom: "1px solid #131825" }}>
        {m && !tool.image && <div style={{ display: "flex", justifyContent: "center", padding: "0 0 8px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#222c3a" }} /></div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: m ? 17 : 15, fontWeight: 700, color: "#f0f2f5", fontFamily: "'Courier New', monospace", wordBreak: "break-all" as const }}>{tool.id}</div>
            <div style={{ fontSize: 11, color: "#3d4a5c", marginTop: 2 }}>{tool.frameType} · {CONFIG.buildings[tool.building].label} · Col {tool.col}</div>
          </div>
          <button onClick={onClose} style={{ background: "#111620", border: "1px solid #1a2030", color: "#3d4a5c", borderRadius: 7, width: 28, height: 28, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8 }}>✕</button>
        </div>
        <div style={{ marginTop: 6, display: "inline-flex", background: `${vc.color}10`, border: `1px solid ${vc.color}30`, borderRadius: 5, padding: "2px 9px", fontSize: 10, color: vc.color, fontWeight: 700 }}>{vc.label}</div>
      </div>
      <div style={{ padding: m ? "0 16px 20px" : "0 14px 14px" }}>
        <Sec>Frame — {tool.id}</Sec>
        {renderLinks(tool.links)}
        {(tool.chambers || []).map((ch: AnyTool) => (
          <div key={ch.id}>
            <Sec>{ch.label} — {ch.id}</Sec>
            {renderLinks(ch.links)}
          </div>
        ))}
        <div style={{ marginTop: 12, background: "#111620", border: "1px solid #171d2a", borderRadius: 7, padding: "7px 10px", fontSize: 9, color: "#3d4a5c", lineHeight: 1.6 }}>
          <span style={{ color: "#5a6a80", fontWeight: 600 }}>OneNote:</span> {CONFIG.oneNoteTip}
        </div>
        {CONFIG.quickLinks.length > 0 && (
          <>
            <Sec>Quick Links</Sec>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {CONFIG.quickLinks.map((q) => (
                <a key={q.label} href={q.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#111620", border: "1px solid #171d2a", borderRadius: 6, padding: "5px 9px", textDecoration: "none", fontSize: 10, color: "#5a6a80" }}>
                  <span>{q.icon}</span> {q.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );

  return m ? (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 900 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "88vh", background: "#0b0e14", borderRadius: "14px 14px 0 0", zIndex: 1000, overflowY: "auto", borderTop: `2px solid ${vc.color}33`, boxShadow: "0 -6px 32px rgba(0,0,0,0.7)" }}>{content}</div>
    </>
  ) : (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#00000044", zIndex: 400 }} />
      <div style={{ position: "fixed", top: 0, right: 0, width: 340, height: "100vh", background: "#0b0e14", borderLeft: `1px solid ${vc.color}20`, zIndex: 500, overflowY: "auto", boxShadow: "-4px 0 28px rgba(0,0,0,0.5)" }}>{content}</div>
    </>
  );
};

const DesktopMap: React.FC<{ tools: AnyTool[]; vf: string; onSelect: (t: AnyTool) => void }> = ({ tools, vf, onSelect }) => {
  const [ht, setHt] = React.useState<AnyTool>(null);
  const [hp, setHp] = React.useState({ x: 0, y: 0 });
  const f = vf === "ALL" ? tools : tools.filter((t: AnyTool) => t.vendor === vf);

  return (
    <div style={{ flex: 1, background: "#0e1219", borderRadius: 8, padding: 4, position: "relative", minHeight: 0, overflow: "hidden" }} onMouseMove={(e: React.MouseEvent) => { if (ht) setHp({ x: e.clientX, y: e.clientY }); }}>
      <svg viewBox="0 0 160 66" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", background: "#0a0e15", borderRadius: 6 }}>
        {Object.entries(CONFIG.buildings).map(([k, b]) => (
          <g key={k}>
            <rect x={b.x} y={b.y} width={b.width} height={b.height} rx={1} fill="#0d1118" stroke="#192030" strokeWidth={0.3} />
            <text x={b.x + b.width / 2} y={b.y - 1.5} textAnchor="middle" fill="#2a3545" fontSize={2.5} fontWeight={700} fontFamily="sans-serif">{b.label}</text>
          </g>
        ))}
        {Object.entries(CONFIG.bays).map(([bk, bays]) => {
          const b = CONFIG.buildings[bk];
          const lines = getBayLines(bays);
          return (
            <g key={`l-${bk}`}>
              {lines.map((relX, i) => { const x = b.x + b.width * relX; return <line key={i} x1={x} y1={b.y + 1.5} x2={x} y2={b.y + b.height - 1.5} stroke="#1e2a3a" strokeWidth={0.25} />; })}
              {bays.map((bay) => <text key={bay.label} x={b.x + b.width * bay.relX} y={b.y + b.height + 2.5} textAnchor="middle" fill="#222e3e" fontSize={1.6} fontFamily="monospace" fontWeight={600}>{bay.label}</text>)}
            </g>
          );
        })}
        {(() => { const bB = CONFIG.buildings.B, bC = CONFIG.buildings.C, y1 = bB.y + bB.height * 0.43, y2 = bB.y + bB.height * 0.57; return (<g><rect x={bB.x + bB.width} y={y1} width={bC.x - (bB.x + bB.width)} height={y2 - y1} fill="#0d1118" stroke="#192030" strokeWidth={0.2} rx={0.4} /><text x={(bB.x + bB.width + bC.x) / 2} y={(y1 + y2) / 2 + 0.5} textAnchor="middle" fill="#192030" fontSize={1.2}>walkway</text></g>); })()}
        {f.map((t: AnyTool) => {
          const p = getPos(t);
          const vc = VENDORS[t.vendor] || VENDORS.A;
          const h = ht?.id === t.id;
          const sz = 3;
          return (
            <g key={t.id} style={{ cursor: "pointer" }}
              onMouseEnter={(e: React.MouseEvent) => { setHt(t); setHp({ x: e.clientX, y: e.clientY }); }}
              onMouseLeave={() => setHt(null)}
              onClick={() => { onSelect(t); setHt(null); }}>
              <rect x={p.x - sz / 2} y={p.y - sz / 2} width={sz} height={sz} rx={0.4} fill={h ? `${vc.color}20` : vc.fill} stroke={vc.color} strokeWidth={h ? 0.5 : 0.25} />
              <rect x={p.x - sz / 2} y={p.y - sz / 2} width={sz} height={0.5} fill={vc.color} opacity={0.6} />
              <text x={p.x} y={p.y + sz / 2 + 1.4} textAnchor="middle" fill="#4a5a70" fontSize={1.15} fontWeight={500} fontFamily="monospace">{t.id}</text>
            </g>
          );
        })}
      </svg>
      {ht && (
        <div style={{ position: "fixed", left: hp.x + 14, top: hp.y - 4, background: "#0b0e14ee", border: `1px solid ${VENDORS[ht.vendor].color}30`, borderRadius: 7, padding: 0, minWidth: 200, maxWidth: 280, pointerEvents: "none", zIndex: 300, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", overflow: "hidden" }}>
          {ht.image && <img src={ht.image} alt={ht.id} style={{ width: "100%", height: 120, objectFit: "cover", display: "block", borderBottom: "1px solid #1a2030" }} />}
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f2f5", fontFamily: "monospace", marginBottom: 3 }}>{ht.id}</div>
            <div style={{ fontSize: 10, color: "#5a6a80", marginBottom: 2 }}>{ht.frameType} · {VENDORS[ht.vendor].label}</div>
            <div style={{ fontSize: 10, color: "#5a6a80" }}>{CONFIG.buildings[ht.building].label} · Col {ht.col} · {ht.chambers?.length || 0} ch</div>
            <div style={{ fontSize: 8, color: "#2d3a4c", marginTop: 5, fontStyle: "italic" }}>Click for links</div>
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
    <div>
      {Object.entries(CONFIG.buildings).sort((a, b) => a[1].order - b[1].order).map(([bk, bv]) => {
        const cols = g[bk];
        if (!cols) return null;
        return (
          <div key={bk}>
            <div style={{ padding: "10px 16px 7px", background: "#0b0e14", borderBottom: "1px solid #111822", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#2a3545", textTransform: "uppercase", letterSpacing: "0.12em" }}>{bv.label}</div>
            </div>
            {Object.entries(cols).sort((a, b) => Number(a[0]) - Number(b[0])).map(([cn, ct]) => (
              <div key={`${bk}-${cn}`} style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: "1px solid #0d1219", minHeight: 50 }}>
                <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {ct.map((t: AnyTool) => {
                    const vc = VENDORS[t.vendor] || VENDORS.A;
                    return (
                      <button key={t.id} onClick={() => onSelect(t)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        <div style={{ width: 30, height: 30, border: `1.5px solid ${vc.color}55`, borderRadius: 5, background: vc.fill, position: "relative", overflow: "hidden" }}>
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: vc.color, opacity: 0.4 }} />
                        </div>
                        <div style={{ fontSize: 7, color: "#3d4a5c", fontFamily: "monospace", maxWidth: 54, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.id}</div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 14, color: "#222e3e", fontWeight: 700, fontFamily: "monospace", minWidth: 30, textAlign: "right" as const, paddingLeft: 8 }}>{cn}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/* ── Main Component (SPFx entry point) ── */

export default class GroupDashboard extends React.Component<IGroupDashboardProps, {
  vf: string;
  sel: AnyTool;
  mob: boolean;
  fv: string | null;
}> {

  constructor(props: IGroupDashboardProps) {
    super(props);
    this.state = { vf: "ALL", sel: null, mob: false, fv: null };
  }

  public componentDidMount(): void {
    this._checkMobile();
    window.addEventListener("resize", this._checkMobile);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this._checkMobile);
  }

  private _checkMobile = (): void => {
    this.setState({ mob: window.innerWidth < 768 });
  };

  public render(): React.ReactElement<IGroupDashboardProps> {
    const { vf, sel, mob, fv } = this.state;
    const sm = fv ? fv === "mobile" : mob;

    return (
      <div style={{ fontFamily: "Segoe UI, sans-serif", background: "#090c11", color: "#dde1e8", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid #111822", background: "#0b0e14", flexWrap: "wrap", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "#111822", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, border: "1px solid #192030" }}>◈</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Fleet Toolkit</div>
              <div style={{ fontSize: 9, color: "#2a3545" }}>PCVD · Vendor A / B / C</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ display: "flex", gap: 1, background: "#0e1219", borderRadius: 5, padding: 2 }}>
              {["ALL", "A", "B", "C"].map((v) => (
                <button key={v} onClick={() => this.setState({ vf: v })} style={{
                  background: vf === v ? "#151d2a" : "transparent", border: "none", borderRadius: 3,
                  padding: "3px 7px", fontSize: 9, cursor: "pointer", fontWeight: vf === v ? 700 : 400,
                  fontFamily: "monospace", color: vf === v ? (VENDORS[v]?.color || "#dde1e8") : "#222e3e",
                }}>{v === "ALL" ? "ALL" : VENDORS[v]?.label || v}</button>
              ))}
            </div>
            {!mob && (
              <>
                <div style={{ width: 1, height: 16, background: "#111822" }} />
                <div style={{ display: "flex", gap: 1, background: "#0e1219", borderRadius: 5, padding: 2 }}>
                  {([{ k: null, l: "Auto" }, { k: "desktop", l: "Desktop" }, { k: "mobile", l: "Mobile" }] as Array<{ k: string | null; l: string }>).map((m) => (
                    <button key={String(m.k)} onClick={() => this.setState({ fv: m.k })} style={{
                      background: fv === m.k ? "#151d2a" : "transparent", border: "none", borderRadius: 3,
                      padding: "3px 7px", fontSize: 9, cursor: "pointer", color: fv === m.k ? "#dde1e8" : "#222e3e",
                    }}>{m.l}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Vendor legend */}
        <div style={{ display: "flex", gap: 14, padding: "6px 16px", borderBottom: "1px solid #0d1219" }}>
          {Object.entries(VENDORS).map(([v, c]) => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#2a3545" }}>
              <div style={{ width: 10, height: 10, border: `1.5px solid ${c.color}55`, borderRadius: 2, background: c.fill }} />
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
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 6, minHeight: 0, overflow: "hidden" }}>
            <DesktopMap tools={TOOLS} vf={vf} onSelect={(t: AnyTool) => this.setState({ sel: t })} />
          </div>
        )}

        {/* Action Panel */}
        <ActionPanel tool={sel} onClose={() => this.setState({ sel: null })} isMobile={sm} />
      </div>
    );
  }
}
