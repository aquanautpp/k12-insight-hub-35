import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) {
    return new Response('missing supabase env', { status: 500, headers: corsHeaders })
  }

  try {
    const supabase = createClient(url, serviceKey)
    const { data, error } = await supabase.from('v_weekly_summary').select('*')
    if (error) throw error
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
  } catch (e) {
    return new Response((e as Error).message, { status: 500, headers: corsHeaders })
  }
})
