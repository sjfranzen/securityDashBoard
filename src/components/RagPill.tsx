import type { Rag } from "../data";
import { RAG_STYLES } from "../data";

function RagDot({ rag, size = 10 }: { rag: Rag; size?: number }) {
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

export function RagPill({ rag }: { rag: Rag }) {
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

export { RagDot };
