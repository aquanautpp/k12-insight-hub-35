-- 20250809_views_analytics.sql
CREATE OR REPLACE VIEW public.v_skill_mastery AS
SELECT user_id,
       activity_id,
       AVG(CASE WHEN correct THEN 1 ELSE 0 END) AS accuracy,
       COUNT(*) AS attempts
FROM public.activity_attempts
GROUP BY user_id, activity_id;

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_retention_week AS
SELECT user_id,
       date_trunc('week', ts) AS wk,
       COUNT(*) AS events
FROM public.app_events
WHERE name IN ('session_start','session_end')
GROUP BY 1,2;

CREATE OR REPLACE VIEW public.v_weekly_summary AS
SELECT user_id,
       COUNT(*) FILTER (WHERE correct) AS solved,
       COUNT(*) FILTER (WHERE NOT correct) AS unsolved,
       SUM(duration_ms) AS time_ms
FROM public.activity_attempts
WHERE ts > now() - interval '7 days'
GROUP BY user_id;