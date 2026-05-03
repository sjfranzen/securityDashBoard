import { TEAMS, MAPS, RAG_STYLES, teamById } from "../data";
import { RagPill } from "../components/RagPill";
import { SectionLabel } from "../components/SectionLabel";
import { ProgressBar } from "../components/ProgressBar";
import type { DrillDown } from "../components/DrillDownDrawer";

interface Props {
  onDrillDown: (d: DrillDown) => void;
}

export function MapsView({ onDrillDown }: Props) {
  const matrix = TEAMS.map((owner) => ({
    owner,
    cells: TEAMS.map((other) => {
      if (owner.id === other.id) {
        const count = MAPS.filter((m) => m.ownerTeam === owner.id && m.crossImpact.length === 0).length;
        return { count, self: true };
      }
      const count = MAPS.filter((m) => m.ownerTeam === owner.id && m.crossImpact.includes(other.id)).length;
      return { count, self: false };
    }),
  }));

  const max = Math.max(...matrix.flatMap((r) => r.cells.map((c) => c.count)), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Dependency matrix */}
      <div>
        <SectionLabel>Cross-team MAP dependencies</SectionLabel>
        <p style={{ color: "var(--ink-2)", fontFamily: "var(--font-body)", fontSize: 13, margin: "10px 0 20px", maxWidth: 680, lineHeight: 1.6 }}>
          Rows = owning team. Columns = team with cross-impact dependency. Diagonal cells show MAPs owned with no external dependency.
        </p>
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", padding: "24px 28px", overflow: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: 12, width: "100%" }}>
            <thead>
              <tr>
                <th style={{ padding: 12, textAlign: "left", color: "var(--ink-3)", letterSpacing: "0.15em", fontSize: 10, textTransform: "uppercase", fontWeight: 500 }}>
                  Owner ↓ / Impacts →
                </th>
                {TEAMS.map((t) => (
                  <th key={t.id} style={{ padding: 12, textAlign: "center", color: "var(--ink-2)", fontWeight: 500, fontSize: 11, borderBottom: "1px solid var(--border)" }}>
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.owner.id}>
                  <td style={{ padding: 12, color: "var(--ink-1)", fontWeight: 500, fontSize: 12, borderRight: "1px solid var(--border)" }}>
                    {row.owner.name}
                  </td>
                  {row.cells.map((c, idx) => {
                    const intensity = c.count / max;
                    const bg = c.self
                      ? `rgba(122, 138, 153, ${0.05 + intensity * 0.3})`
                      : `rgba(220, 67, 67, ${0.05 + intensity * 0.5})`;
                    return (
                      <td
                        key={idx}
                        style={{
                          padding: "20px 12px",
                          textAlign: "center",
                          background: c.count > 0 ? bg : "transparent",
                          borderBottom: "1px solid var(--border)",
                          color: c.count > 0 ? "var(--ink-0)" : "var(--ink-3)",
                          fontFamily: "var(--font-display)",
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {c.count || "·"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All MAPs table */}
      <div>
        <SectionLabel>All managed action plans</SectionLabel>
        <div style={{ marginTop: 16, background: "var(--surface-1)", border: "1px solid var(--border)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 2.5fr 1.2fr 1.5fr 100px 90px 100px",
              gap: 16,
              padding: "12px 24px",
              background: "var(--surface-2)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--ink-3)",
              textTransform: "uppercase",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>MAP</div>
            <div>Title</div>
            <div>Owner</div>
            <div>Cross-impact</div>
            <div>Due</div>
            <div>Progress</div>
            <div>RAG</div>
          </div>
          {MAPS.map((m, i) => (
            <div
              key={m.id}
              onClick={() => onDrillDown({ type: "map-detail", mapId: m.id })}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 2.5fr 1.2fr 1.5fr 100px 90px 100px",
                gap: 16,
                padding: "16px 24px",
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                fontSize: 13,
                cursor: "pointer",
                transition: "background 120ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontSize: 11 }}>{m.id}</div>
              <div style={{ color: "var(--ink-0)" }}>{m.title}</div>
              <div style={{ color: "var(--ink-1)", fontSize: 12 }}>{teamById(m.ownerTeam)?.name}</div>
              <div style={{ color: "var(--ink-2)", fontSize: 12 }}>
                {m.crossImpact.length === 0 ? "—" : m.crossImpact.map((id) => teamById(id)?.name).join(", ")}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontSize: 11 }}>{m.due}</div>
              <ProgressBar progress={m.progress} color={RAG_STYLES[m.rag].color} />
              <RagPill rag={m.rag} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
