import '@testing-library/jest-dom'

// Mock leve do supabase para os testes (evita chamadas reais)
import { vi } from 'vitest'
vi.mock('@supabase/supabase-js', () => {
  const createClient = () => ({
    auth: {
      getUser: async () => ({ data: { user: { id: 'test-user' } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe(){} } } }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
      eq: () => ({ select: async () => ({ data: [], error: null }) }),
    }),
  })
  return { createClient }
})

// Define idioma inicial para os testes
localStorage.setItem('lang', 'pt-BR')

// Garante um container no DOM
const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)
