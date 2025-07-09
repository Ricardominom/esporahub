import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, AuthResponse } from '../types';
import { authenticateUser, User as AppUser } from '../data/users';

interface AuthState {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          
          // Limpiar cualquier token anterior
          localStorage.removeItem('authToken');

          // Autenticar con datos locales
          const user = authenticateUser(credentials.email, credentials.password);

          if (user) {
            // Generar un token falso para simular autenticación
            const fakeToken = `token_${Math.random().toString(36).substring(2)}`;
            
            // Guardar token en localStorage
            localStorage.setItem('authToken', fakeToken);
            
            set({
              user,
              token: fakeToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Credenciales inválidas');
          }
        } catch (error: any) {
          set({
            error: error.message || 'Error al iniciar sesión',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        // Asegurarse de que el estado se actualice correctamente
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      refreshToken: async () => {
        try {
          const currentToken = get().token;
          const storedToken = localStorage.getItem('authToken');
          
          // Si no hay token en el estado o en localStorage, hacer logout
          if (!currentToken && !storedToken) {
            get().logout();
            return;
          }
          
          // Si hay token en localStorage pero no en el estado, intentar restaurar la sesión
          if (storedToken && !currentToken) {
            // Aquí podríamos hacer una verificación del token
            // Por ahora simplemente asumimos que es válido
            set({
              token: storedToken,
              isAuthenticated: true,
              isLoading: false
            });
          }
        } catch (error) {
          // Si falla el refresh, hacer logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);