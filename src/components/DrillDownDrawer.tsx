import { X } from "lucide-react";
import type { Severity } from "../data";
import {
  TEAMS, APPS, VULNS, ISSUES, MAPS,
  RAG_STYLES, SEV_STYLES,
  teamById, appById, vulnByAppId,
} from "../data";
import { RagPill, RagDot } from "./RagPill";
import { ProgressBar } from "./ProgressBar";
import { SectionLabel } from "./SectionLabel";

// ── Drill-down payload types ─────────────────────────────────────────────────

export type DrillDown =
  | { type: "maps-by-team" }
  | { type: "issues-by-rag" }
  | { type: "vulns-severity"; severity: Severity }
  | { type: "team-detail"; teamId: string }
  | { type: "app-detail"; appId: string }
  | { type: "map-detail"; mapId: string };

// ── Content components ────────────────────────────────────────────────────────

function MapsByTeam() {
  const teamMap = TEAMS.map((t) => {
    const maps = MAPS.filter((m) => m.ownerTeam === t.id);
    const rag = maps.some((m) => m.rag === "R")
      ? "R"
      : maps.some((m) => m.rag === "A")
      ? "A"
      : "G";
    return { team: t, maps, rag };
  }).filter((td) => td.maps.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {teamMap.map(({ team, maps, rag }) => (
        <div key={team.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <RagDot rag={rag} size={8} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-0)", letterSpacing: "-0.01em" }}>
              {team.name}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
              {maps.length} MAP{maps.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {maps.map((m) => (
              <div
                key={m.id}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${RAG_STYLES[m.rag].color}`,
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", marginBottom: 4 }}>{m.id}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-0)", fontWeight: 500, lineHeight: 1.4 }}>{m.title}</div>
                  </div>
                  <RagPill rag={m.rag} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
                  <ProgressBar progress={m.progress} color={RAG_STYLES[m.rag].color} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", textAlign: "right" }}>Due {m.due}</div>
                </div>
                {m.crossImpact.length > 0 && (
                  <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                    Cross-impact:{" "}
                    <span style={{ color: "var(--ink-2)" }}>
                      {m.crossImpact.map((id) => teamById(id)?.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IssuesByRag() {
  const groups = (["R", "A", "G"] as const).map((rag) => ({
    rag,
    issues: ISSUES.filter((i) => i.rag === rag),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {groups.filter((g) => g.issues.length > 0).map(({ rag, issues }) => (
        <div key={rag}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <RagDot rag={rag} size={8} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: RAG_STYLES[rag].color }}>
              {RAG_STYLES[rag].label} · {issues.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {issues.map((iss) => (
              <div
                key={iss.id}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${RAG_STYLES[rag].color}`,
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{iss.id}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>Due {iss.due}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-0)", fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{iss.title}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{iss.policy}</div>
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {iss.teams.map((tid) => (
                    <span key={tid} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)", padding: "1px 7px", border: "1px solid var(--border)" }}>
                      {teamById(tid)?.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function VulnsBySeverity({ severity }: { severity: Severity }) {
  const rows = APPS
    .map((a) => {
      const v = vulnByAppId(a.id) ?? { critical: 0, high: 0, medium: 0, low: 0, appId: a.id };
      return { app: a, team: teamById(a.teamId)!, count: v[severity] };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxCount = rows[0]?.count ?? 1;

  return (
    <div>
      <div style={{ marginBottom: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
        {rows.length} application{rows.length !== 1 ? "s" : ""} affected
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map(({ app, team, count }) => (
          <div
            key={app.id}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, color: "var(--ink-0)", fontWeight: 500 }}>{app.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>{team.name}</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: SEV_STYLES[severity].color, lineHeight: 1 }}>
                {count}
              </div>
            </div>
            <div style={{ height: 4, background: "var(--surface-1)" }}>
              <div style={{ height: "100%", width: `${(count / maxCount) * 100}%`, background: SEV_STYLES[severity].color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamDetail({ teamId }: { teamId: string }) {
  const team = teamById(teamId)!;
  const apps = APPS.filter((a) => a.teamId === teamId);
  const teamIssues = ISSUES.filter((i) => i.teams.includes(teamId));
  const ownedMaps = MAPS.filter((m) => m.ownerTeam === teamId);
  const impactedMaps = MAPS.filter((m) => m.crossImpact.includes(teamId));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Team meta */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>
        Lead · {team.lead} · {team.members} members
      </div>

      {/* Applications */}
      <div>
        <SectionLabel>Applications · {apps.length}</SectionLabel>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {apps.map((a) => {
            const v = vulnByAppId(a.id) ?? { critical: 0, high: 0, medium: 0, low: 0, appId: a.id };
            const total = v.critical + v.high + v.medium + v.low;
            return (
              <div key={a.id} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--ink-0)", fontWeight: 500 }}>{a.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{total} total</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  {(["critical", "high", "medium", "low"] as Severity[]).map((k) => (
                    <span key={k} style={{ color: v[k] > 0 ? SEV_STYLES[k].color : "var(--ink-3)" }}>
                      {k.slice(0, 4).toUpperCase()} {v[k]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issues */}
      {teamIssues.length > 0 && (
        <div>
          <SectionLabel>Issues affecting this team · {teamIssues.length}</SectionLabel>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {teamIssues.map((iss) => (
              <div
                key={iss.id}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${RAG_STYLES[iss.rag].color}`,
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", marginBottom: 4 }}>{iss.id}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-0)", fontWeight: 500 }}>{iss.title}</div>
                </div>
                <RagPill rag={iss.rag} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAPs owned */}
      {ownedMaps.length > 0 && (
        <div>
          <SectionLabel>MAPs owned · {ownedMaps.length}</SectionLabel>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {ownedMaps.map((m) => (
              <div
                key={m.id}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${RAG_STYLES[m.rag].color}`,
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{m.id}</span>
                  <RagPill rag={m.rag} />
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-0)", fontWeight: 500, marginBottom: 8 }}>{m.title}</div>
                <ProgressBar progress={m.progress} color={RAG_STYLES[m.rag].color} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAPs cross-impact */}
      {impactedMaps.length > 0 && (
        <div>
          <SectionLabel>Cross-impact MAPs · {impactedMaps.length}</SectionLabel>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {impactedMaps.map((m) => (
              <div
                key={m.id}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", marginBottom: 4 }}>{m.id}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-1)" }}>{m.title}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
                    Owner: {teamById(m.ownerTeam)?.name}
                  </div>
                </div>
                <RagPill rag={m.rag} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AppDetail({ appId }: { appId: string }) {
  const app = appById(appId)!;
  const team = teamById(app.teamId)!;
  const v = vulnByAppId(appId) ?? { critical: 0, high: 0, medium: 0, low: 0, appId };
  const total = v.critical + v.high + v.medium + v.low;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>
        Team · {team.name}
      </div>

      {/* Severity breakdown */}
      <div>
        <SectionLabel>Vulnerability breakdown · {total} total</SectionLabel>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {(["critical", "high", "medium", "low"] as Severity[]).map((k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: SEV_STYLES[k].color, width: 50, textTransform: "uppercase" }}>
                {k === "critical" ? "CRIT" : k === "medium" ? "MED" : k.toUpperCase()}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: v[k] > 0 ? SEV_STYLES[k].color : "var(--ink-3)", lineHeight: 1, width: 36, textAlign: "right" }}>
                {v[k]}
              </div>
              <div style={{ flex: 1, height: 6, background: "var(--surface-2)" }}>
                <div style={{ height: "100%", width: `${total ? (v[k] / total) * 100 : 0}%`, background: SEV_STYLES[k].color }} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", width: 36, textAlign: "right" }}>
                {total ? Math.round((v[k] / total) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution bar */}
      <div style={{ display: "flex", height: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
        {(["critical", "high", "medium", "low"] as Severity[]).map((k) => (
          <div key={k} style={{ width: `${total ? (v[k] / total) * 100 : 0}%`, background: SEV_STYLES[k].color }} />
        ))}
      </div>
    </div>
  );
}

function MapDetail({ mapId }: { mapId: string }) {
  const m = MAPS.find((mp) => mp.id === mapId)!;
  const owner = teamById(m.ownerTeam)!;
  const parentIssue = ISSUES.find((i) => i.id === m.issueId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header meta */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <RagPill rag={m.rag} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>Due {m.due}</span>
      </div>

      {/* Progress */}
      <div>
        <SectionLabel>Progress</SectionLabel>
        <div style={{ marginTop: 14 }}>
          <ProgressBar progress={m.progress} color={RAG_STYLES[m.rag].color} />
        </div>
      </div>

      {/* Ownership */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 8 }}>Owner</div>
          <div style={{ fontSize: 14, color: "var(--ink-0)", fontWeight: 500 }}>{owner.name}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>Lead · {owner.lead}</div>
        </div>
        {m.crossImpact.length > 0 && (
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 8 }}>Cross-impact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {m.crossImpact.map((id) => (
                <div key={id} style={{ fontSize: 13, color: "var(--ink-1)" }}>{teamById(id)?.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parent issue */}
      {parentIssue && (
        <div>
          <SectionLabel>Remediates issue</SectionLabel>
          <div
            style={{
              marginTop: 14,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${RAG_STYLES[parentIssue.rag].color}`,
              padding: "16px 18px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{parentIssue.id}</span>
              <RagPill rag={parentIssue.rag} />
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-0)", fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{parentIssue.title}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>{parentIssue.policy}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function drawerTitle(d: DrillDown): string {
  switch (d.type) {
    case "maps-by-team": return `Active MAPs · ${MAPS.length}`;
    case "issues-by-rag": return `Open Issues · ${ISSUES.length}`;
    case "vulns-severity": return `${SEV_STYLES[d.severity].label} Vulnerabilities`;
    case "team-detail": return teamById(d.teamId)?.name ?? "Team";
    case "app-detail": return appById(d.appId)?.name ?? "Application";
    case "map-detail": {
      const m = MAPS.find((mp) => mp.id === d.mapId);
      return m ? `${m.id}` : "MAP";
    }
  }
}

function drawerSubtitle(d: DrillDown): string | null {
  switch (d.type) {
    case "vulns-severity": {
      const count = VULNS.reduce((acc, v) => acc + v[d.severity], 0);
      return `${count} total across ${APPS.filter((a) => (vulnByAppId(a.id)?.[d.severity] ?? 0) > 0).length} apps`;
    }
    case "team-detail": {
      const team = teamById(d.teamId);
      return team ? `Lead · ${team.lead} · ${team.members} members` : null;
    }
    case "app-detail": {
      const app = appById(d.appId);
      return app ? `${teamById(app.teamId)?.name}` : null;
    }
    case "map-detail": {
      const m = MAPS.find((mp) => mp.id === d.mapId);
      return m?.title ?? null;
    }
    default: return null;
  }
}

// ── Drawer shell ──────────────────────────────────────────────────────────────

interface Props {
  drillDown: DrillDown | null;
  onClose: () => void;
}

export function DrillDownDrawer({ drillDown, onClose }: Props) {
  if (!drillDown) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(14, 16, 20, 0.6)",
          zIndex: 40,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 520,
          maxWidth: "90vw",
          background: "var(--surface-1)",
          borderLeft: "1px solid var(--border)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  margin: 0,
                  color: "var(--ink-0)",
                  lineHeight: 1.1,
                }}
              >
                {drawerTitle(drillDown)}
              </h2>
              {drawerSubtitle(drillDown) && (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                  {drawerSubtitle(drillDown)}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--ink-2)",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {drillDown.type === "maps-by-team" && <MapsByTeam />}
          {drillDown.type === "issues-by-rag" && <IssuesByRag />}
          {drillDown.type === "vulns-severity" && <VulnsBySeverity severity={drillDown.severity} />}
          {drillDown.type === "team-detail" && <TeamDetail teamId={drillDown.teamId} />}
          {drillDown.type === "app-detail" && <AppDetail appId={drillDown.appId} />}
          {drillDown.type === "map-detail" && <MapDetail mapId={drillDown.mapId} />}
        </div>
      </div>
    </>
  );
}
