import React, { useState, useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Users,
  Layers,
  GitBranch,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  Circle,
  Activity,
} from "lucide-react";
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

// ============================================================
// MOCK DATA — replace with real data ingested from Excel sources
// ============================================================

const TEAMS = [
  { id: "t1", name: "Platform Core", lead: "A. Reyes", members: 14 },
  { id: "t2", name: "Payments", lead: "M. Okafor", members: 9 },
  { id: "t3", name: "Customer Identity", lead: "S. Lindgren", members: 11 },
  { id: "t4", name: "Data & Analytics", lead: "J. Park", members: 8 },
];

const APPS = [
  { id: "a1", name: "Gateway API", teamId: "t1" },
  { id: "a2", name: "Service Mesh", teamId: "t1" },
  { id: "a3", name: "Config Registry", teamId: "t1" },
  { id: "a4", name: "Checkout", teamId: "t2" },
  { id: "a5", name: "Ledger", teamId: "t2" },
  { id: "a6", name: "Refunds Service", teamId: "t2" },
  { id: "a7", name: "Auth Server", teamId: "t3" },
  { id: "a8", name: "Customer Portal", teamId: "t3" },
  { id: "a9", name: "MFA Service", teamId: "t3" },
  { id: "a10", name: "Warehouse", teamId: "t4" },
  { id: "a11", name: "ETL Orchestrator", teamId: "t4" },
  { id: "a12", name: "BI Layer", teamId: "t4" },
];

// Vulnerabilities — counts per app per severity
const VULNS = [
  { appId: "a1", critical: 2, high: 5, medium: 12, low: 18 },
  { appId: "a2", critical: 0, high: 3, medium: 8, low: 14 },
  { appId: "a3", critical: 1, high: 2, medium: 6, low: 9 },
  { appId: "a4", critical: 4, high: 9, medium: 14, low: 22 },
  { appId: "a5", critical: 2, high: 6, medium: 11, low: 16 },
  { appId: "a6", critical: 0, high: 1, medium: 4, low: 7 },
  { appId: "a7", critical: 3, high: 7, medium: 10, low: 13 },
  { appId: "a8", critical: 1, high: 4, medium: 9, low: 19 },
  { appId: "a9", critical: 0, high: 2, medium: 5, low: 8 },
  { appId: "a10", critical: 1, high: 3, medium: 7, low: 11 },
  { appId: "a11", critical: 0, high: 2, medium: 4, low: 6 },
  { appId: "a12", critical: 2, high: 4, medium: 8, low: 12 },
];

const ISSUES = [
  {
    id: "ISS-2041",
    title: "Inconsistent secrets rotation across production services",
    policy: "InfoSec-07: Credential Lifecycle",
    rag: "R",
    opened: "2025-11-12",
    due: "2026-06-30",
    teams: ["t1", "t2", "t3"],
    summary:
      "Credential rotation cadence varies across services; several exceed the 90-day policy window.",
  },
  {
    id: "ISS-2055",
    title: "TLS 1.0/1.1 still negotiable on legacy endpoints",
    policy: "InfoSec-12: Transport Security",
    rag: "A",
    opened: "2026-01-08",
    due: "2026-07-15",
    teams: ["t1", "t3"],
    summary: "Several edge endpoints accept deprecated TLS versions.",
  },
  {
    id: "ISS-2068",
    title: "Logging gaps in privileged data access paths",
    policy: "InfoSec-19: Audit & Logging",
    rag: "R",
    opened: "2026-02-21",
    due: "2026-05-30",
    teams: ["t4", "t3"],
    summary:
      "Privileged access to warehouse layer is not consistently captured in central audit log.",
  },
  {
    id: "ISS-2074",
    title: "MFA bypass possible via legacy API token flow",
    policy: "InfoSec-04: Authentication",
    rag: "A",
    opened: "2026-02-02",
    due: "2026-08-01",
    teams: ["t3"],
    summary: "Legacy token issuance path skips MFA challenge in narrow conditions.",
  },
  {
    id: "ISS-2081",
    title: "Third-party library risk register out of date",
    policy: "InfoSec-22: SBOM",
    rag: "G",
    opened: "2026-03-14",
    due: "2026-09-30",
    teams: ["t1", "t2", "t3", "t4"],
    summary: "Quarterly SBOM review behind on two services; remediation underway.",
  },
];

const MAPS = [
  {
    id: "MAP-3301",
    issueId: "ISS-2041",
    title: "Centralize secret rotation via Vault dynamic creds",
    ownerTeam: "t1",
    crossImpact: ["t2"],
    rag: "A",
    progress: 60,
    due: "2026-05-15",
  },
  {
    id: "MAP-3302",
    issueId: "ISS-2041",
    title: "Migrate Checkout & Ledger to short-lived DB creds",
    ownerTeam: "t2",
    crossImpact: ["t1"],
    rag: "R",
    progress: 25,
    due: "2026-06-01",
  },
  {
    id: "MAP-3303",
    issueId: "ISS-2041",
    title: "Auth Server credential vault integration",
    ownerTeam: "t3",
    crossImpact: ["t1"],
    rag: "G",
    progress: 90,
    due: "2026-04-20",
  },
  {
    id: "MAP-3310",
    issueId: "ISS-2055",
    title: "Disable TLS 1.0/1.1 at edge load balancers",
    ownerTeam: "t1",
    crossImpact: [],
    rag: "G",
    progress: 80,
    due: "2026-05-30",
  },
  {
    id: "MAP-3311",
    issueId: "ISS-2055",
    title: "Legacy auth client TLS bump",
    ownerTeam: "t3",
    crossImpact: ["t1"],
    rag: "A",
    progress: 45,
    due: "2026-06-30",
  },
  {
    id: "MAP-3320",
    issueId: "ISS-2068",
    title: "Warehouse access audit pipeline",
    ownerTeam: "t4",
    crossImpact: ["t3"],
    rag: "R",
    progress: 15,
    due: "2026-05-15",
  },
  {
    id: "MAP-3321",
    issueId: "ISS-2068",
    title: "Auth event enrichment for privileged actors",
    ownerTeam: "t3",
    crossImpact: ["t4"],
    rag: "A",
    progress: 50,
    due: "2026-05-30",
  },
  {
    id: "MAP-3330",
    issueId: "ISS-2074",
    title: "Deprecate legacy token issuance",
    ownerTeam: "t3",
    crossImpact: [],
    rag: "A",
    progress: 55,
    due: "2026-07-15",
  },
  {
    id: "MAP-3340",
    issueId: "ISS-2081",
    title: "Automated SBOM publishing in CI",
    ownerTeam: "t1",
    crossImpact: ["t2", "t3", "t4"],
    rag: "G",
    progress: 70,
    due: "2026-08-30",
  },
];

const TREND_30D = [
  { day: "Apr 02", critical: 22, high: 58, medium: 102, low: 158 },
  { day: "Apr 06", critical: 21, high: 56, medium: 100, low: 156 },
  { day: "Apr 10", critical: 19, high: 55, medium: 99, low: 158 },
  { day: "Apr 14", critical: 20, high: 53, medium: 97, low: 159 },
  { day: "Apr 18", critical: 18, high: 51, medium: 96, low: 156 },
  { day: "Apr 22", critical: 17, high: 49, medium: 98, low: 155 },
  { day: "Apr 26", critical: 16, high: 48, medium: 99, low: 156 },
  { day: "Apr 30", critical: 16, high: 48, medium: 98, low: 155 },
];

// ============================================================
// HELPERS
// ============================================================

const teamById = (id) => TEAMS.find((t) => t.id === id);
const appById = (id) => APPS.find((a) => a.id === id);

const RAG_STYLES = {
  R: {
    label: "Red",
    color: "var(--rag-red)",
    bg: "rgba(220, 67, 67, 0.12)",
    border: "rgba(220, 67, 67, 0.45)",
  },
  A: {
    label: "Amber",
    color: "var(--rag-amber)",
    bg: "rgba(212, 149, 56, 0.12)",
    border: "rgba(212, 149, 56, 0.45)",
  },
  G: {
    label: "Green",
    color: "var(--rag-green)",
    bg: "rgba(94, 154, 100, 0.12)",
    border: "rgba(94, 154, 100, 0.45)",
  },
};

const SEV_STYLES = {
  critical: { label: "Critical", color: "#dc4343" },
  high: { label: "High", color: "#d49538" },
  medium: { label: "Medium", color: "#c8b454" },
  low: { label: "Low", color: "#7a8a99" },
};

// ============================================================
// SHARED PIECES
// ============================================================

function RagDot({ rag, size = 10 }) {
  const s = RAG_STYLES[rag];
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: s.color,
        boxShadow: `0 0 0 3px ${s.bg}`,
      }}
    />
  );
}

function RagPill({ rag }) {
  const s = RAG_STYLES[rag];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "var(--font-mono)",
      }}
    >
      <RagDot rag={rag} size={6} />
      {s.label}
    </span>
  );
}

function SectionLabel({ children, accent }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--ink-2)",
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 18,
          height: 1,
          background: accent || "var(--ink-3)",
        }}
      />
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, trend, accent }) {
  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: accent || "var(--ink-3)",
        }}
      />
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
          fontFamily: "var(--font-mono)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div
          style={{
            fontSize: 38,
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "var(--ink-0)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </div>
        {trend !== undefined && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: trend < 0 ? "var(--rag-green)" : "var(--rag-red)",
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {trend < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--ink-2)",
            fontFamily: "var(--font-body)",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// ============================================================
// VIEWS
// ============================================================

function OverviewView({ onNavigate }) {
  const totals = useMemo(() => {
    const t = { critical: 0, high: 0, medium: 0, low: 0 };
    VULNS.forEach((v) => {
      t.critical += v.critical;
      t.high += v.high;
      t.medium += v.medium;
      t.low += v.low;
    });
    return t;
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Hero strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)",
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
              background:
                "radial-gradient(circle, rgba(220,67,67,0.18) 0%, transparent 70%)",
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
            <span style={{ color: "var(--rag-red)" }}>{totals.critical + totals.high}</span>{" "}
            high-priority findings
            <br />
            across{" "}
            <span style={{ color: "var(--ink-1)" }}>{TEAMS.length} teams</span> and{" "}
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
            {mapStats.r + mapStats.a} active MAPs are tracking remediation across team
            boundaries.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: 24,
          }}
        >
          <StatCard
            label="Open Issues"
            value={issueStats.total}
            sub={`${issueStats.r} red · ${issueStats.a} amber · ${issueStats.g} green`}
            accent="var(--rag-amber)"
          />
          <StatCard
            label="Active MAPs"
            value={mapStats.total}
            sub={`${mapStats.r} at risk · ${mapStats.g} on track`}
            accent="var(--rag-green)"
          />
        </div>
      </div>

      {/* Severity row */}
      <div>
        <SectionLabel>Vulnerability inventory</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            marginTop: 16,
          }}
        >
          <StatCard
            label="Critical"
            value={totals.critical}
            trend={-12}
            accent={SEV_STYLES.critical.color}
            sub="across 9 applications"
          />
          <StatCard
            label="High"
            value={totals.high}
            trend={-8}
            accent={SEV_STYLES.high.color}
            sub="across 12 applications"
          />
          <StatCard
            label="Medium"
            value={totals.medium}
            trend={-3}
            accent={SEV_STYLES.medium.color}
            sub="rolling backlog"
          />
          <StatCard
            label="Low"
            value={totals.low}
            trend={1}
            accent={SEV_STYLES.low.color}
            sub="advisory tier"
          />
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 24,
        }}
      >
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            padding: "24px 26px 16px",
          }}
        >
          <SectionLabel>30-day vulnerability trend</SectionLabel>
          <div style={{ height: 240, marginTop: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_30D}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--ink-3)"
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--ink-3)"
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                />
                <Line type="monotone" dataKey="critical" stroke={SEV_STYLES.critical.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="high" stroke={SEV_STYLES.high.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="medium" stroke={SEV_STYLES.medium.color} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="low" stroke={SEV_STYLES.low.color} strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            padding: "24px 26px",
          }}
        >
          <SectionLabel>By team — critical & high</SectionLabel>
          <div style={{ height: 240, marginTop: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TEAMS.map((t) => {
                  const apps = APPS.filter((a) => a.teamId === t.id);
                  const c = apps.reduce(
                    (acc, a) => acc + (VULNS.find((v) => v.appId === a.id)?.critical || 0),
                    0
                  );
                  const h = apps.reduce(
                    (acc, a) => acc + (VULNS.find((v) => v.appId === a.id)?.high || 0),
                    0
                  );
                  return { name: t.name.split(" ")[0], critical: c, high: h };
                })}
                margin={{ left: -10 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="var(--ink-3)"
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--ink-3)"
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="critical" stackId="a" fill={SEV_STYLES.critical.color} />
                <Bar dataKey="high" stackId="a" fill={SEV_STYLES.high.color} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent issues */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
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
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
          }}
        >
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
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-2)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {issue.id}
                </div>
                <div>
                  <div
                    style={{
                      color: "var(--ink-0)",
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {issue.title}
                  </div>
                  <div
                    style={{
                      color: "var(--ink-2)",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {issue.policy}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-2)",
                  }}
                >
                  {issueMaps.length} MAP{issueMaps.length !== 1 ? "s" : ""}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-2)",
                  }}
                >
                  Due {issue.due}
                </div>
                <RagPill rag={issue.rag} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeamsView() {
  const teamData = TEAMS.map((t) => {
    const apps = APPS.filter((a) => a.teamId === t.id);
    const totals = apps.reduce(
      (acc, a) => {
        const v = VULNS.find((vv) => vv.appId === a.id) || {};
        acc.critical += v.critical || 0;
        acc.high += v.high || 0;
        acc.medium += v.medium || 0;
        acc.low += v.low || 0;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0 }
    );
    const ownedMaps = MAPS.filter((m) => m.ownerTeam === t.id);
    const impactedMaps = MAPS.filter((m) => m.crossImpact.includes(t.id));
    const teamIssues = ISSUES.filter((i) => i.teams.includes(t.id));
    const rag =
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 24,
          marginTop: 16,
        }}
      >
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
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
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--ink-2)",
                  }}
                >
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
              {[
                { k: "critical", label: "CRIT" },
                { k: "high", label: "HIGH" },
                { k: "medium", label: "MED" },
                { k: "low", label: "LOW" },
              ].map((s) => (
                <div key={s.k}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: SEV_STYLES[s.k].color,
                      marginBottom: 4,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 26,
                      color: "var(--ink-0)",
                      lineHeight: 1,
                    }}
                  >
                    {td.totals[s.k]}
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
                <div style={{ color: "var(--ink-1)", fontSize: 13 }}>
                  {td.impactedMaps.length}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
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

function VulnerabilitiesView() {
  const [sortBy, setSortBy] = useState("critical");
  const sorted = [...APPS]
    .map((a) => ({ ...a, ...VULNS.find((v) => v.appId === a.id), team: teamById(a.teamId) }))
    .sort((x, y) => y[sortBy] - x[sortBy]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <SectionLabel>Vulnerabilities by application</SectionLabel>
        <div style={{ display: "flex", gap: 4, fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <span style={{ color: "var(--ink-3)", marginRight: 6 }}>SORT</span>
          {["critical", "high", "medium", "low"].map((k) => (
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

      <div
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
        }}
      >
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
                fontFamily: "var(--font-body)",
                fontSize: 14,
              }}
            >
              <div style={{ color: "var(--ink-0)", fontWeight: 500 }}>{row.name}</div>
              <div style={{ color: "var(--ink-2)", fontSize: 13 }}>{row.team.name}</div>
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "var(--font-mono)",
                  color: row.critical > 0 ? SEV_STYLES.critical.color : "var(--ink-3)",
                  fontWeight: row.critical > 0 ? 600 : 400,
                }}
              >
                {row.critical}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "var(--font-mono)",
                  color: row.high > 0 ? SEV_STYLES.high.color : "var(--ink-3)",
                }}
              >
                {row.high}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-2)",
                }}
              >
                {row.medium}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-3)",
                }}
              >
                {row.low}
              </div>
              <div
                style={{
                  display: "flex",
                  height: 8,
                  background: "var(--surface-2)",
                  overflow: "hidden",
                }}
              >
                {["critical", "high", "medium", "low"].map((k) => (
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

function IssuesView({ focusId, onClearFocus }) {
  const [selectedId, setSelectedId] = useState(focusId || ISSUES[0].id);
  const issue = ISSUES.find((i) => i.id === selectedId);
  const issueMaps = MAPS.filter((m) => m.issueId === issue.id);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
      {/* Issue list */}
      <div>
        <SectionLabel>Issues</SectionLabel>
        <div
          style={{
            marginTop: 16,
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
          }}
        >
          {ISSUES.map((iss, i) => (
            <div
              key={iss.id}
              onClick={() => {
                setSelectedId(iss.id);
                onClearFocus && onClearFocus();
              }}
              style={{
                padding: "16px 18px",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                cursor: "pointer",
                background:
                  iss.id === selectedId ? "var(--surface-2)" : "transparent",
                borderLeft:
                  iss.id === selectedId
                    ? `3px solid ${RAG_STYLES[iss.rag].color}`
                    : "3px solid transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-2)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {iss.id}
                </div>
                <RagDot rag={iss.rag} size={8} />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-0)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}
              >
                {iss.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue detail */}
      <div>
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            padding: "28px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
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
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-3)",
              }}
            >
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

          <p
            style={{
              color: "var(--ink-2)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: 1.6,
              margin: "0 0 24px",
              maxWidth: 680,
            }}
          >
            {issue.summary}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              paddingTop: 20,
              borderTop: "1px dashed var(--border)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Opened
              </div>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-1)", fontSize: 13 }}>
                {issue.opened}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Target Date
              </div>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-1)", fontSize: 13 }}>
                {issue.due}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
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
                    {teamById(tid).name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MAPs */}
        <div style={{ marginTop: 28 }}>
          <SectionLabel>
            Managed Action Plans · {issueMaps.length}
          </SectionLabel>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
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
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: 18,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--ink-2)",
                      }}
                    >
                      {m.id}
                    </span>
                    <div
                      style={{
                        fontSize: 15,
                        color: "var(--ink-0)",
                        fontWeight: 500,
                      }}
                    >
                      {m.title}
                    </div>
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
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>
                        Owner
                      </div>
                      <div style={{ color: "var(--ink-1)" }}>{owner.name}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>
                        Cross-impact
                      </div>
                      <div style={{ color: "var(--ink-1)" }}>
                        {m.crossImpact.length === 0
                          ? "—"
                          : m.crossImpact.map((id) => teamById(id).name).join(", ")}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>
                        Due
                      </div>
                      <div style={{ color: "var(--ink-1)" }}>{m.due}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ink-3)", fontSize: 10, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>
                        Progress
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 4,
                            background: "var(--surface-2)",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              height: "100%",
                              width: `${m.progress}%`,
                              background: RAG_STYLES[m.rag].color,
                            }}
                          />
                        </div>
                        <span style={{ color: "var(--ink-1)", minWidth: 32 }}>{m.progress}%</span>
                      </div>
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

function MapsView() {
  // Cross-team dependency matrix
  const matrix = TEAMS.map((owner) => {
    return {
      owner,
      cells: TEAMS.map((other) => {
        if (owner.id === other.id) {
          // Maps owned with no cross-impact
          const count = MAPS.filter(
            (m) => m.ownerTeam === owner.id && m.crossImpact.length === 0
          ).length;
          return { count, self: true };
        }
        const count = MAPS.filter(
          (m) => m.ownerTeam === owner.id && m.crossImpact.includes(other.id)
        ).length;
        return { count, self: false };
      }),
    };
  });

  const max = Math.max(
    ...matrix.flatMap((r) => r.cells.map((c) => c.count)),
    1
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <SectionLabel>Cross-team MAP dependencies</SectionLabel>
        <p
          style={{
            color: "var(--ink-2)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            margin: "10px 0 20px",
            maxWidth: 680,
            lineHeight: 1.6,
          }}
        >
          Rows = owning team. Columns = team with cross-impact dependency. Diagonal cells
          show MAPs owned with no external dependency.
        </p>

        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            padding: "24px 28px",
            overflow: "auto",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: 12, textAlign: "left", color: "var(--ink-3)", letterSpacing: "0.15em", fontSize: 10, textTransform: "uppercase", fontWeight: 500 }}>
                  Owner ↓ / Impacts →
                </th>
                {TEAMS.map((t) => (
                  <th
                    key={t.id}
                    style={{
                      padding: 12,
                      textAlign: "center",
                      color: "var(--ink-2)",
                      fontWeight: 500,
                      fontSize: 11,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.owner.id}>
                  <td
                    style={{
                      padding: 12,
                      color: "var(--ink-1)",
                      fontWeight: 500,
                      fontSize: 12,
                      borderRight: "1px solid var(--border)",
                    }}
                  >
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

      <div>
        <SectionLabel>All managed action plans</SectionLabel>
        <div
          style={{
            marginTop: 16,
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
          }}
        >
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
              style={{
                display: "grid",
                gridTemplateColumns: "120px 2.5fr 1.2fr 1.5fr 100px 90px 100px",
                gap: 16,
                padding: "16px 24px",
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontSize: 11 }}>
                {m.id}
              </div>
              <div style={{ color: "var(--ink-0)" }}>{m.title}</div>
              <div style={{ color: "var(--ink-1)", fontSize: 12 }}>{teamById(m.ownerTeam).name}</div>
              <div style={{ color: "var(--ink-2)", fontSize: 12 }}>
                {m.crossImpact.length === 0
                  ? "—"
                  : m.crossImpact.map((id) => teamById(id).name).join(", ")}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontSize: 11 }}>
                {m.due}
              </div>
              <div>
                <div
                  style={{
                    height: 4,
                    background: "var(--surface-2)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${m.progress}%`,
                      background: RAG_STYLES[m.rag].color,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-3)",
                    marginTop: 3,
                  }}
                >
                  {m.progress}%
                </div>
              </div>
              <RagPill rag={m.rag} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHELL
// ============================================================

export default function App() {
  const [view, setView] = useState("overview");
  const [focusIssue, setFocusIssue] = useState(null);

  const handleNavigate = (v, focus) => {
    setView(v);
    if (focus) setFocusIssue(focus);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "teams", label: "Teams", icon: Users },
    { id: "vulns", label: "Vulnerabilities", icon: Shield },
    { id: "issues", label: "Issues", icon: AlertOctagon },
    { id: "maps", label: "MAPs", icon: GitBranch },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink-0)",
        fontFamily: "var(--font-body)",
      }}
    >
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
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        body { margin: 0; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(220, 67, 67, 0.3); }
      `}</style>

      {/* Top bar */}
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
                position: "relative",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  color: "var(--ink-0)",
                }}
              >
                Sentinel
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Security Posture
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 4 }}>
            {navItems.map((n) => {
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-2)",
            }}
          >
            <Circle size={6} fill="var(--rag-green)" stroke="none" />
            <span>Mock data · prototype</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "36px 36px 80px",
        }}
      >
        {view === "overview" && <OverviewView onNavigate={handleNavigate} />}
        {view === "teams" && <TeamsView />}
        {view === "vulns" && <VulnerabilitiesView />}
        {view === "issues" && (
          <IssuesView focusId={focusIssue} onClearFocus={() => setFocusIssue(null)} />
        )}
        {view === "maps" && <MapsView />}
      </main>

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
