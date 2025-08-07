import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ReviewItemRow {
  id: string;
  user_id: string;
  item_id: string;
  title: string | null;
  last_reviewed: string | null;
  next_review_at: string | null;
  interval_days: number;
  ease: number;
  repetitions: number;
  successes: number;
  failures: number;
  created_at: string;
  updated_at: string;
}

export function useReviewQueue() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ReviewItemRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDue();
  }, []);

  async function getUserId() {
    const { data } = await (supabase as any).auth.getUser();
    return data.user?.id || null;
  }

  async function loadDue(limit = 5) {
    try {
      setLoading(true);
      setError(null);
      const nowIso = new Date().toISOString();
      const { data, error } = await (supabase as any)
        .from("review_items")
        .select("*")
        .or(`next_review_at.is.null,next_review_at.lte.${nowIso}`)
        .order("next_review_at", { ascending: true, nullsFirst: true })
        .limit(limit);
      if (error) throw error;
      setItems((data || []) as ReviewItemRow[]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(item_id: string, title: string) {
    const userId = await getUserId();
    if (!userId) throw new Error("Usuário não autenticado");
    const now = new Date();

    const { data, error } = await (supabase as any)
      .from("review_items")
      .upsert({
        user_id: userId,
        item_id,
        title,
        last_reviewed: null,
        next_review_at: now.toISOString(),
        interval_days: 0,
        ease: 2.5,
        repetitions: 0,
        successes: 0,
        failures: 0,
      }, { onConflict: "user_id,item_id" })
      .select()
      .single();

    if (error) throw error;
    await loadDue();
    return data as ReviewItemRow;
  }

  function scheduleNext(item: ReviewItemRow, success: boolean) {
    let { repetitions, interval_days, ease, successes, failures } = item;

    if (success) {
      successes += 1;
      repetitions += 1;
      if (repetitions === 1) interval_days = 1;
      else if (repetitions === 2) interval_days = 6;
      else interval_days = Math.max(1, Math.round(interval_days * ease));
      ease = Math.max(1.3, ease + 0.1);
    } else {
      failures += 1;
      repetitions = 0;
      interval_days = 1;
      ease = Math.max(1.3, ease - 0.2);
    }

    const next = new Date();
    next.setDate(next.getDate() + interval_days);

    return {
      repetitions,
      interval_days,
      ease,
      successes,
      failures,
      last_reviewed: new Date().toISOString(),
      next_review_at: next.toISOString(),
    } as Partial<ReviewItemRow>;
  }

  async function review(item: ReviewItemRow, success: boolean) {
    const updates = scheduleNext(item, success);
    const { data, error } = await (supabase as any)
      .from("review_items")
      .update(updates)
      .eq("id", item.id)
      .select()
      .single();
    if (error) throw error;
    await loadDue();
    return data as ReviewItemRow;
  }

  return {
    loading,
    items,
    error,
    loadDue,
    addItem,
    review,
  };
}
