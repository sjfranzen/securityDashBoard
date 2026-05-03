export type Rag = "R" | "A" | "G";
export type Severity = "critical" | "high" | "medium" | "low";

export interface Team {
  id: string;
  name: string;
  lead: string;
  members: number;
}

export interface App {
  id: string;
  name: string;
  teamId: string;
}

export interface VulnCount {
  appId: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface Issue {
  id: string;
  title: string;
  policy: string;
  rag: Rag;
  opened: string;
  due: string;
  teams: string[];
  summary: string;
}

export interface MAP {
  id: string;
  issueId: string;
  title: string;
  ownerTeam: string;
  crossImpact: string[];
  rag: Rag;
  progress: number;
  due: string;
}

export interface TrendPoint {
  day: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}
