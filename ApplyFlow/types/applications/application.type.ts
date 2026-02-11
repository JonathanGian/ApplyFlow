import { Database } from "../supabase/database.types";

export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];

export type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];

export type ApplicationUpdate = Database["public"]["Tables"]["applications"]["Update"];

export type ApplicationStage = Database["public"]["Enums"]["application_stage"];