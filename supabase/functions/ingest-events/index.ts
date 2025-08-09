// deno
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response("missing supabase env", { status: 500, headers: corsHeaders });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.events)) {
      return new Response("bad payload", { status: 400, headers: corsHeaders });
    }

    const claimedUser = (body.user_id as string | undefined) ?? undefined;
    if (!claimedUser) {
      return new Response("missing user", { status: 401, headers: corsHeaders });
    }

    // Validate caller identity via JWT
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user?.id) {
      return new Response("unauthorized", { status: 401, headers: corsHeaders });
    }
    if (userData.user.id !== claimedUser) {
      return new Response("forbidden", { status: 403, headers: corsHeaders });
    }

    const rows = (body.events as any[])
      .slice(0, 200)
      .map((e) => ({
        user_id: claimedUser,
        name: String(e?.name ?? "unknown"),
        props: typeof e?.props === "object" && e?.props !== null ? e.props : {},
        ts: e?.ts ? new Date(e.ts) : new Date(),
      }));

    const { error } = await supabase.from("app_events").insert(rows);
    if (error) {
      return new Response(error.message, { status: 500, headers: corsHeaders });
    }

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response((err as Error).message, { status: 500, headers: corsHeaders });
  }
});
