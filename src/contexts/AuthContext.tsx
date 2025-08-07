import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string, username?: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signInWithEmailOrUsername: (emailOrUsername: string, password: string) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string, username?: string) => {
    try {
      // Check if username is available if provided
      if (username) {
        const isAvailable = await checkUsernameAvailability(username);
        if (!isAvailable) {
          toast({
            title: "Username indisponível",
            description: "Este username já está sendo usado. Escolha outro.",
            variant: "destructive"
          });
          return { error: "Username already taken" };
        }
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
            username: username
          }
        }
      });
      
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      // Update profile with username after signup
      if (username) {
        setTimeout(async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase
                .from('profiles')
                .update({ username })
                .eq('user_id', user.id);
            }
          } catch (err) {
            console.error('Error updating profile with username:', err);
          }
        }, 1000);
      }

      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta."
      });
      
      return {};
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!"
      });
      
      return {};
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast({
          title: "Erro no login com Google",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      return {};
    } catch (error) {
      toast({
        title: "Erro no login com Google",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clean up any local storage
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive"
      });
    }
  };

  const signInWithEmailOrUsername = async (emailOrUsername: string, password: string) => {
    try {
      let email = emailOrUsername;
      
      // Check if input contains @ (email) or not (username)
      if (!emailOrUsername.includes('@')) {
        // It's a username, get the email
        const { data, error } = await supabase.rpc('get_email_by_username', {
          lookup_username: emailOrUsername
        });
        
        if (error || !data) {
          toast({
            title: "Username não encontrado",
            description: "Verifique se o username está correto.",
            variant: "destructive"
          });
          return { error: "Username not found" };
        }
        
        email = data;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!"
      });
      
      return {};
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_username_available', {
        check_username: username
      });
      
      if (error) {
        console.error('Error checking username availability:', error);
        return false;
      }
      
      return data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha."
      });
      
      return {};
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithEmailOrUsername,
    signInWithGoogle,
    signOut,
    resetPassword,
    checkUsernameAvailability
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};