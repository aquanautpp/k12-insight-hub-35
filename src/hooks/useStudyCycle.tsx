import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StudyTask = { title: string; done: boolean };
export interface StudyCycleRow {
  id: string;
  user_id: string;
  week_start: string; // ISO date
  goals: any; // string[] or richer objects
  tasks: any; // StudyTask[]
  reflection: string | null;
  self_rating: number | null;
  created_at: string;
  updated_at: string;
}

function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  // Make Monday the start (0=Sunday, 1=Monday...)
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function useStudyCycle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cycle, setCycle] = useState<StudyCycleRow | null>(null);
  const weekStart = useMemo(() => getWeekStart(), []);

  useEffect(() => {
    loadCycle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  async function getUserId() {
    const { data } = await (supabase as any).auth.getUser();
    return data.user?.id || null;
  }

  async function loadCycle() {
    try {
      setLoading(true);
      setError(null);
      const userId = await getUserId();
      if (!userId) {
        setCycle(null);
        return;
      }
      const { data, error } = await (supabase as any)
        .from("study_cycles")
        .select("*")
        .eq("week_start", weekStart)
        .maybeSingle();
      if (error) throw error;
      setCycle(data as StudyCycleRow | null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function upsertPlan(goals: string[], tasks: StudyTask[]) {
    const userId = await getUserId();
    if (!userId) throw new Error("Usuário não autenticado");

    const payload = {
      user_id: userId,
      week_start: weekStart,
      goals,
      tasks,
    };

    const { data, error } = await (supabase as any)
      .from("study_cycles")
      .upsert(payload, { onConflict: "user_id,week_start" })
      .select()
      .single();

    if (error) throw error;
    setCycle(data as StudyCycleRow);
    return data as StudyCycleRow;
  }

  async function toggleTaskDone(index: number) {
    if (!cycle) return;
    const tasks: StudyTask[] = Array.isArray(cycle.tasks) ? [...cycle.tasks] : [];
    if (!tasks[index]) return;
    tasks[index] = { ...tasks[index], done: !tasks[index].done };

    const { data, error } = await (supabase as any)
      .from("study_cycles")
      .update({ tasks })
      .eq("id", cycle.id)
      .select()
      .single();

    if (error) throw error;
    setCycle(data as StudyCycleRow);
    return data as StudyCycleRow;
  }

  async function saveReflection(reflection: string, self_rating: number | null) {
    if (!cycle) {
      // if no cycle yet, create minimal row then update
      await upsertPlan([], []);
    }
    const id = cycle?.id;
    const { data, error } = await (supabase as any)
      .from("study_cycles")
      .update({ reflection, self_rating })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setCycle(data as StudyCycleRow);
    return data as StudyCycleRow;
  }

  const completedRatio = useMemo(() => {
    const tasks: StudyTask[] = Array.isArray(cycle?.tasks) ? cycle!.tasks : [];
    if (tasks.length === 0) return 0;
    const done = tasks.filter(t => t.done).length;
    return done / tasks.length;
  }, [cycle?.tasks]);

  return {
    loading,
    error,
    cycle,
    weekStart,
    loadCycle,
    upsertPlan,
    toggleTaskDone,
    saveReflection,
    completedRatio,
  };
}
