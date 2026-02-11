import type { Database } from "@/types/supabase/database.types";

export type ApplicationStage = Database["public"]["Enums"]["application_stage"];

export const APPLICATION_STAGES = [
  "Interested",
  "Applied",
  "Phone Screen",
  "Technical Interview",
  "Onsite Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Accepted",
] as const satisfies readonly ApplicationStage[];

export function isApplicationStage(v: string): v is ApplicationStage {
  return (APPLICATION_STAGES as readonly string[]).includes(v);
}