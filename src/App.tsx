import { useState } from "react";
import { Activity, Users, Shield, AlertOctagon, GitBranch, Circle } from "lucide-react";
import { OverviewView } from "./views/OverviewView";
import { TeamsView } from "./views/TeamsView";
import { VulnerabilitiesView } from "./views/VulnerabilitiesView";
import { IssuesView } from "./views/IssuesView";
import { MapsView } from "./views/MapsView";
import { DrillDownDrawer } from "./components/DrillDownDrawer";
import type { DrillDown } from "./components/DrillDownDrawer";

type ViewId = "overview" | "teams" | "vulns" | "issues" | "maps";

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "teams", label: "Teams", icon: Users },
  { id: "vulns", label: "Vulnerabilities", icon: Shield },
  { id: "issues", label: "Issues", icon: AlertOctagon },
  { id: "maps", label: "MAPs", icon: GitBranch },
];

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [focusIssue, setFocusIssue] = useState<string | null>(null);
  const [drillDown, setDrillDown] = useState<DrillDown | null>(null);

  const handleNavigate = (v: string, focus?: string) => {
    setView(v as ViewId);
    if (focus) setFocusIssue(focus);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink-0)", fontFamily: "var(--font-body)" }}>
      <style>{`
        :root {
          --bg: #0e1014;
          --surface-1: #15181f;
          --surface-2: #1c2029;
          --border: #262b36;
          --ink-0: #e8e9eb;
          --ink-1: #b8bcc4;
          --ink-2: #7e8591;
          --ink-3: #4a505b;
          --rag-red: #dc4343;
          --rag-amber: #d49538;
          --rag-green: #5e9a64;
          --font-display: 'Fraunces', 'Iowan Old Style', Georgia, serif;
          --font-body: 'Söhne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --font-mono: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;
        }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');
        body { margin: 0; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(220, 67, 67, 0.3); }
      `}</style>

      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "14px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 26,
                height: 26,
                background: "var(--rag-red)",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1, color: "var(--ink-0)" }}>
                Sentinel
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.22em", color: "var(--ink-3)", textTransform: "uppercase", marginTop: 2 }}>
                Security Posture
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map((n) => {
              const Icon = n.icon;
              const active = view === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setView(n.id);
                    if (n.id !== "issues") setFocusIssue(null);
                  }}
                  style={{
                    background: active ? "var(--surface-2)" : "transparent",
                    border: "1px solid",
                    borderColor: active ? "var(--border)" : "transparent",
                    color: active ? "var(--ink-0)" : "var(--ink-2)",
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    transition: "all 120ms",
                  }}
                >
                  <Icon size={13} />
                  {n.label}
                </button>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>
            <Circle size={6} fill="var(--rag-green)" stroke="none" />
            <span>Mock data · prototype</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "36px 36px 80px" }}>
        {view === "overview" && <OverviewView onNavigate={handleNavigate} onDrillDown={setDrillDown} />}
        {view === "teams" && <TeamsView onDrillDown={setDrillDown} />}
        {view === "vulns" && <VulnerabilitiesView onDrillDown={setDrillDown} />}
        {view === "issues" && <IssuesView focusId={focusIssue} onClearFocus={() => setFocusIssue(null)} />}
        {view === "maps" && <MapsView onDrillDown={setDrillDown} />}
      </main>

      <DrillDownDrawer drillDown={drillDown} onClose={() => setDrillDown(null)} />

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "18px 36px",
          maxWidth: 1440,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "var(--ink-3)",
          textTransform: "uppercase",
        }}
      >
        <span>Sentinel v0.1 · Prototype</span>
        <span>Last sync · {new Date().toLocaleString()}</span>
      </footer>
    </div>
  );
}
