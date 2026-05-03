export * from "./types";
export { TEAMS } from "./fixtures/teams";
export { APPS } from "./fixtures/apps";
export { VULNS } from "./fixtures/vulns";
export { ISSUES } from "./fixtures/issues";
export { MAPS } from "./fixtures/maps";
export { TREND_30D } from "./fixtures/trend";

import { TEAMS } from "./fixtures/teams";
import { APPS } from "./fixtures/apps";
import { VULNS } from "./fixtures/vulns";
import type { Rag, Severity } from "./types";

export const teamById = (id: string) => TEAMS.find((t) => t.id === id);
export const appById = (id: string) => APPS.find((a) => a.id === id);
export const vulnByAppId = (appId: string) => VULNS.find((v) => v.appId === appId);

export const RAG_STYLES: Record<Rag, { label: string; color: string; bg: string; border: string }> = {
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

export const SEV_STYLES: Record<Severity, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#dc4343" },
  high: { label: "High", color: "#d49538" },
  medium: { label: "Medium", color: "#c8b454" },
  low: { label: "Low", color: "#7a8a99" },
};
