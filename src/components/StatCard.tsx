import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  trend?: number;
  accent?: string;
  onClick?: () => void;
}

export function StatCard({ label, value, sub, trend, accent, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "background 120ms",
      }}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.background = "var(--surface-2)"; }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.background = "var(--surface-1)"; }}
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
