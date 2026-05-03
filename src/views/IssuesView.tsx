import { useState } from "react";
import { ISSUES, MAPS, RAG_STYLES, teamById } from "../data";
import { RagPill, RagDot } from "../components/RagPill";
import { SectionLabel } from "../components/SectionLabel";
import { ProgressBar } from "../components/ProgressBar";

interface Props {
  focusId?: string | null;
  onClearFocus?: () => void;
}

export function IssuesView({ focusId, onClearFocus }: Props) {
  const [selectedId, setSelectedId] = useState(focusId ?? ISSUES[0].id);
  const issue = ISSUES.find((i) => i.id === selectedId)!;
  const issueMaps = MAPS.filter((m) => m.issueId === issue.id);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
      {/* Issue list */}
      <div>
        <SectionLabel>Issues</SectionLabel>
        <div style={{ marginTop: 16, background: "var(--surface-1)", border: "1px solid var(--border)" }}>
          {ISSUES.map((iss, i) => (
            <div
              key={iss.id}
              onClick={() => {
                setSelectedId(iss.id);
                onClearFocus?.();
              }}
              style={{
                padding: "16px 18px",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                cursor: "pointer",
                background: iss.id === selectedId ? "var(--surface-2)" : "transparent",
                borderLeft: iss.id === selectedId ? `3px solid ${RAG_STYLES[iss.rag].color}` : "3px solid transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.05em" }}>
                  {iss.id}
                </div>
                <RagDot rag={iss.rag} size={8} />
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-0)", lineHeight: 1.4, fontWeight: 500 }}>
                {iss.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue detail */}
      <div>
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-2)",
                letterSpacing: "0.08em",
                background: "var(--surface-2)",
                padding: "3px 10px",
                border: "1px solid var(--border)",
              }}
            >
              {issue.id}
            </span>
            <RagPill rag={issue.rag} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
              {issue.policy}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: "-0.015em",
              lineHeight: 1.15,
              margin: "0 0 16px",
              color: "var(--ink-0)",
            }}
          >
            {issue.title}
          </h2>

          <p style={{ color: "var(--ink-2)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 680 }}>
            {issue.summary}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, paddingTop: 20, borderTop: "1px dashed var(--border)" }}>
            {[
              { label: "Opened", value: issue.opened },
              { label: "Target Date", value: issue.due },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 6 }}>
                  {label}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-1)", fontSize: 13 }}>{value}</div>
              </div>
            ))}
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 6 }}>
                Affected Teams
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {issue.teams.map((tid) => (
                  <span
                    key={tid}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--ink-1)",
                      padding: "1px 8px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {teamById(tid)?.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MAPs */}
        <div style={{ marginTop: 28 }}>
          <SectionLabel>Managed Action Plans · {issueMaps.length}</SectionLabel>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            {issueMaps.map((m) => {
              const owner = teamById(m.ownerTeam);
              return (
                <div
                  key={m.id}
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${RAG_STYLES[m.rag].color}`,
                    padding: "20px 24px",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>{m.id}</span>
                    <div style={{ fontSize: 15, color: "var(--ink-0)", fontWeight: 500 }}>{m.title}</div>
                    <RagPill rag={m.rag} />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr",
                      gap: 24,
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px dashed var(--border)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>Owner</div>
                      <div style={{ color: "var(--ink-1)" }}>{owner?.name}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>Cross-impact</div>
                      <div style={{ color: "var(--ink-1)" }}>
                        {m.crossImpact.length === 0 ? "—" : m.crossImpact.map((id) => teamById(id)?.name).join(", ")}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>Due</div>
                      <div style={{ color: "var(--ink-1)" }}>{m.due}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>Progress</div>
                      <ProgressBar progress={m.progress} color={RAG_STYLES[m.rag].color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
