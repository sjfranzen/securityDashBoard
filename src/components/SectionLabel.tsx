import type { ReactNode } from "react";

export function SectionLabel({ children, accent }: { children: ReactNode; accent?: string }) {
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
