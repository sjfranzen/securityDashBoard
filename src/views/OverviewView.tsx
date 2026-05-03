import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TEAMS, APPS, VULNS, ISSUES, MAPS, TREND_30D, SEV_STYLES } from "../data";
import { RagPill } from "../components/RagPill";
import { StatCard } from "../components/StatCard";
import { SectionLabel } from "../components/SectionLabel";
import type { DrillDown } from "../components/DrillDownDrawer";

interface Props {
  onNavigate: (view: string, focusId?: string) => void;
  onDrillDown: (d: DrillDown) => void;
}

export function OverviewView({ onNavigate, onDrillDown }: Props) {
  const totals = useMemo(() => {
    return VULNS.reduce(
      (acc, v) => {
        acc.critical += v.critical;
        acc.high += v.high;
        acc.medium += v.medium;
        acc.low += v.low;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0 }
    );
  }, []);

  const issueStats = useMemo(() => {
    const r = ISSUES.filter((i) => i.rag === "R").length;
    const a = ISSUES.filter((i) => i.rag === "A").length;
    const g = ISSUES.filter((i) => i.rag === "G").length;
    return { r, a, g, total: ISSUES.length };
  }, []);

  const mapStats = useMemo(() => {
    const r = MAPS.filter((m) => m.rag === "R").length;
    const a = MAPS.filter((m) => m.rag === "A").length;
    const g = MAPS.filter((m) => m.rag === "G").length;
    return { r, a, g, total: MAPS.length };
  }, []);

  const teamBarData = TEAMS.map((t) => {
    const apps = APPS.filter((a) => a.teamId === t.id);
    const critical = apps.reduce(
      (acc, a) => acc + (VULNS.find((v) => v.appId === a.id)?.critical ?? 0),
      0
    );
    const high = apps.reduce(
      (acc, a) => acc + (VULNS.find((v) => v.appId === a.id)?.high ?? 0),
      0
    );
    return { name: t.name.split(" ")[0], critical, high };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Hero strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "stretch" }}>
        <div
          style={{
            background: "linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)",
            border: "1px solid var(--border)",
            padding: "32px 36px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,67,67,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <SectionLabel accent="var(--rag-red)">
            Posture · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </SectionLabel>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 44,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: "16px 0 12px",
              color: "var(--ink-0)",
            }}
          >
            <span
              onClick={() => onDrillDown({ type: "vulns-severity", severity: "critical" })}
              style={{ color: "var(--rag-red)", cursor: "pointer", borderBottom: "1px dashed var(--rag-red)" }}
            >
              {totals.critical + totals.high}
            </span>{" "}
            high-priority findings
            <br />
            across <span style={{ color: "var(--ink-1)" }}>{TEAMS.length} teams</span> and{" "}
            <span style={{ color: "var(--ink-1)" }}>{APPS.length} apps</span>.
          </h1>
          <p
            style={{
              color: "var(--ink-2)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 560,
              margin: 0,
            }}
          >
            {issueStats.r} red issues require this-quarter attention.{" "}
            {mapStats.r + mapStats.a} active MAPs are tracking remediation across team boundaries.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 24 }}>
          <StatCard
            label="Open Issues"
            value={issueStats.total}
            sub={`${issueStats.r} red · ${issueStats.a} amber · ${issueStats.g} green`}
            accent="var(--rag-amber)"
            onClick={() => onDrillDown({ type: "issues-by-rag" })}
          />
          <StatCard
            label="Active MAPs"
            value={mapStats.total}
            sub={`${mapStats.r} at risk · ${mapStats.g} on track`}
            accent="var(--rag-green)"
            onClick={() => onDrillDown({ type: "maps-by-team" })}
          />
        </div>
      </div>

      {/* Severity row */}
      <div>
        <SectionLabel>Vulnerability inventory</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 16 }}>
          <StatCard label="Critical" value={totals.critical} trend={-12} accent={SEV_STYLES.critical.color} sub="across 9 applications" onClick={() => onDrillDown({ type: "vulns-severity", severity: "critical" })} />
          <StatCard label="High" value={totals.high} trend={-8} accent={SEV_STYLES.high.color} sub="across 12 applications" onClick={() => onDrillDown({ type: "vulns-severity", severity: "high" })} />
          <StatCard label="Medium" value={totals.medium} trend={-3} accent={SEV_STYLES.medium.color} sub="rolling backlog" onClick={() => onDrillDown({ type: "vulns-severity", severity: "medium" })} />
          <StatCard label="Low" value={totals.low} trend={1} accent={SEV_STYLES.low.color} sub="advisory tier" onClick={() => onDrillDown({ type: "vulns-severity", severity: "low" })} />
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", padding: "24px 26px 16px" }}>
          <SectionLabel>30-day vulnerability trend</SectionLabel>
          <div style={{ height: 240, marginTop: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_30D}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="day" stroke="var(--ink-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis stroke="var(--ink-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }} />
                <Line type="monotone" dataKey="critical" stroke={SEV_STYLES.critical.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="high" stroke={SEV_STYLES.high.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="medium" stroke={SEV_STYLES.medium.color} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="low" stroke={SEV_STYLES.low.color} strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", padding: "24px 26px" }}>
          <SectionLabel>By team — critical & high</SectionLabel>
          <div style={{ height: 240, marginTop: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamBarData} margin={{ left: -10 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="name" stroke="var(--ink-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis stroke="var(--ink-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12 }} />
                <Bar dataKey="critical" stackId="a" fill={SEV_STYLES.critical.color} />
                <Bar dataKey="high" stackId="a" fill={SEV_STYLES.high.color} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top issues */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <SectionLabel>Top issues</SectionLabel>
          <button
            onClick={() => onNavigate("issues")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--ink-1)",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            All issues <ArrowUpRight size={14} />
          </button>
        </div>
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}>
          {ISSUES.slice(0, 4).map((issue, i) => {
            const issueMaps = MAPS.filter((m) => m.issueId === issue.id);
            return (
              <div
                key={issue.id}
                onClick={() => onNavigate("issues", issue.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto auto",
                  gap: 24,
                  alignItems: "center",
                  padding: "18px 24px",
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background 120ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.05em" }}>
                  {issue.id}
                </div>
                <div>
                  <div style={{ color: "var(--ink-0)", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{issue.title}</div>
                  <div style={{ color: "var(--ink-2)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{issue.policy}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>
                  {issueMaps.length} MAP{issueMaps.length !== 1 ? "s" : ""}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>Due {issue.due}</div>
                <RagPill rag={issue.rag} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
