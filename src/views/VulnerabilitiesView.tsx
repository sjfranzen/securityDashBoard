import { useState } from "react";
import { APPS, VULNS, SEV_STYLES } from "../data";
import type { Severity } from "../data";
import { teamById } from "../data";
import { SectionLabel } from "../components/SectionLabel";

export function VulnerabilitiesView() {
  const [sortBy, setSortBy] = useState<Severity>("critical");

  const sorted = [...APPS]
    .map((a) => {
      const v = VULNS.find((vv) => vv.appId === a.id) ?? { critical: 0, high: 0, medium: 0, low: 0, appId: a.id };
      return { ...a, ...v, team: teamById(a.teamId)! };
    })
    .sort((x, y) => y[sortBy] - x[sortBy]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SectionLabel>Vulnerabilities by application</SectionLabel>
        <div style={{ display: "flex", gap: 4, fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <span style={{ color: "var(--ink-3)", marginRight: 6 }}>SORT</span>
          {(["critical", "high", "medium", "low"] as Severity[]).map((k) => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              style={{
                background: sortBy === k ? "var(--surface-2)" : "transparent",
                border: `1px solid ${sortBy === k ? "var(--ink-3)" : "var(--border)"}`,
                color: sortBy === k ? "var(--ink-0)" : "var(--ink-2)",
                padding: "3px 10px",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.3fr 60px 60px 60px 60px 1fr",
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
          <div>Application</div>
          <div>Team</div>
          <div style={{ textAlign: "right" }}>Crit</div>
          <div style={{ textAlign: "right" }}>High</div>
          <div style={{ textAlign: "right" }}>Med</div>
          <div style={{ textAlign: "right" }}>Low</div>
          <div>Distribution</div>
        </div>
        {sorted.map((row, i) => {
          const total = row.critical + row.high + row.medium + row.low;
          return (
            <div
              key={row.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.3fr 60px 60px 60px 60px 1fr",
                gap: 16,
                padding: "16px 24px",
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                fontSize: 14,
              }}
            >
              <div style={{ color: "var(--ink-0)", fontWeight: 500 }}>{row.name}</div>
              <div style={{ color: "var(--ink-2)", fontSize: 13 }}>{row.team.name}</div>
              <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: row.critical > 0 ? SEV_STYLES.critical.color : "var(--ink-3)", fontWeight: row.critical > 0 ? 600 : 400 }}>
                {row.critical}
              </div>
              <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: row.high > 0 ? SEV_STYLES.high.color : "var(--ink-3)" }}>
                {row.high}
              </div>
              <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>{row.medium}</div>
              <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>{row.low}</div>
              <div style={{ display: "flex", height: 8, background: "var(--surface-2)", overflow: "hidden" }}>
                {(["critical", "high", "medium", "low"] as Severity[]).map((k) => (
                  <div
                    key={k}
                    style={{
                      width: `${total ? (row[k] / total) * 100 : 0}%`,
                      background: SEV_STYLES[k].color,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
