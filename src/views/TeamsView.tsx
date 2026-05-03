import { TEAMS, APPS, VULNS, ISSUES, MAPS, RAG_STYLES, SEV_STYLES } from "../data";
import type { Rag } from "../data";
import { RagPill } from "../components/RagPill";
import { SectionLabel } from "../components/SectionLabel";

export function TeamsView() {
  const teamData = TEAMS.map((t) => {
    const apps = APPS.filter((a) => a.teamId === t.id);
    const totals = apps.reduce(
      (acc, a) => {
        const v = VULNS.find((vv) => vv.appId === a.id);
        acc.critical += v?.critical ?? 0;
        acc.high += v?.high ?? 0;
        acc.medium += v?.medium ?? 0;
        acc.low += v?.low ?? 0;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0 }
    );
    const ownedMaps = MAPS.filter((m) => m.ownerTeam === t.id);
    const impactedMaps = MAPS.filter((m) => m.crossImpact.includes(t.id));
    const teamIssues = ISSUES.filter((i) => i.teams.includes(t.id));
    const rag: Rag =
      teamIssues.some((i) => i.rag === "R") || ownedMaps.some((m) => m.rag === "R")
        ? "R"
        : teamIssues.some((i) => i.rag === "A") || ownedMaps.some((m) => m.rag === "A")
        ? "A"
        : "G";
    return { team: t, apps, totals, ownedMaps, impactedMaps, teamIssues, rag };
  });

  return (
    <div>
      <SectionLabel>Teams · {TEAMS.length}</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginTop: 16 }}>
        {teamData.map((td) => (
          <div
            key={td.team.id}
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${RAG_STYLES[td.rag].color}`,
              padding: "24px 26px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    margin: "0 0 6px",
                    color: "var(--ink-0)",
                  }}
                >
                  {td.team.name}
                </h3>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>
                  Lead · {td.team.lead} · {td.team.members} members
                </div>
              </div>
              <RagPill rag={td.rag} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                marginBottom: 18,
                paddingBottom: 18,
                borderBottom: "1px dashed var(--border)",
              }}
            >
              {(["critical", "high", "medium", "low"] as const).map((k) => (
                <div key={k}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", color: SEV_STYLES[k].color, marginBottom: 4 }}>
                    {k === "critical" ? "CRIT" : k === "medium" ? "MED" : k.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-0)", lineHeight: 1 }}>
                    {td.totals[k]}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-2)",
              }}
            >
              <div>
                <div style={{ color: "var(--ink-3)", marginBottom: 3 }}>APPS</div>
                <div style={{ color: "var(--ink-1)", fontSize: 13 }}>{td.apps.length}</div>
              </div>
              <div>
                <div style={{ color: "var(--ink-3)", marginBottom: 3 }}>MAPS OWNED</div>
                <div style={{ color: "var(--ink-1)", fontSize: 13 }}>{td.ownedMaps.length}</div>
              </div>
              <div>
                <div style={{ color: "var(--ink-3)", marginBottom: 3 }}>CROSS-IMPACT</div>
                <div style={{ color: "var(--ink-1)", fontSize: 13 }}>{td.impactedMaps.length}</div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 8 }}>
                Applications
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {td.apps.map((a) => {
                  const v = VULNS.find((vv) => vv.appId === a.id);
                  const hasCrit = v && v.critical > 0;
                  return (
                    <span
                      key={a.id}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        padding: "3px 9px",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        color: hasCrit ? "var(--rag-red)" : "var(--ink-1)",
                      }}
                    >
                      {a.name}
                      {hasCrit && <span style={{ marginLeft: 5 }}>•{v.critical}</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
