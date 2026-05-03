import type { Issue } from "../types";

export const ISSUES: Issue[] = [
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
