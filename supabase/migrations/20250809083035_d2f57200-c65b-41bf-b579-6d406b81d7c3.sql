-- 20250809_xp_events.sql
CREATE TABLE IF NOT EXISTS public.xp_events(
 id bigserial PRIMARY KEY,
 user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
 source text NOT NULL,
 amount int NOT NULL,
 meta jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own insert" ON public.xp_events FOR INSERT WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own read" ON public.xp_events FOR SELECT USING (auth.uid()=user_id);
CREATE OR REPLACE VIEW public.v_user_xp_total AS
  SELECT user_id, COALESCE(SUM(amount),0)::int AS xp_total
  FROM public.xp_events
  GROUP BY user_id;
CREATE OR REPLACE VIEW public.v_user_level AS
  SELECT user_id, width_bucket(COALESCE(SUM(amount),0), 0, 5000, 20) AS level
  FROM public.xp_events
  GROUP BY user_id;

-- 20250809_achievements.sql
CREATE TABLE IF NOT EXISTS public.achievements(
 user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
 key text NOT NULL,
 unlocked_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,key)
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own upsert" ON public.achievements FOR INSERT WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own read" ON public.achievements FOR SELECT USING (auth.uid()=user_id);

-- 20250809_app_events.sql
CREATE TABLE IF NOT EXISTS public.app_events(
 id bigserial PRIMARY KEY,
 user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
 name text NOT NULL,
 props jsonb NOT NULL DEFAULT '{}'::jsonb,
 ts timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own insert" ON public.app_events FOR INSERT WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own read" ON public.app_events FOR SELECT USING (auth.uid()=user_id);