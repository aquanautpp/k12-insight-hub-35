import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useXP() {
  const qc = useQueryClient()

  const total = useQuery({
    queryKey: ['xp_total'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_user_xp_total')
        .select('*')
        .maybeSingle()
      if (error) throw error
      return data?.xp_total ?? 0
    },
  })

  const add = useMutation({
    mutationFn: async (p: { amount: number; source: string; meta?: any }) => {
      const { data: auth } = await supabase.auth.getUser()
      const u = auth?.user
      if (!u) throw new Error('not auth')
      const { error } = await supabase
        .from('xp_events')
        .insert({ user_id: u.id, amount: p.amount, source: p.source, meta: p.meta ?? {} })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['xp_total'] }),
  })

  return { xp: total.data ?? 0, addXP: add.mutateAsync, loading: total.isLoading }
}
