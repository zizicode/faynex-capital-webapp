import { create } from 'zustand';
import useAuthStore from './isAuthenticate'; // Este es el store donde tienes `logout`

const InitTokenData = JSON.parse(localStorage.getItem('token')) || null;

const useTokenStore = create((set) => ({
  token: InitTokenData?.token || null,
  timeout: InitTokenData?.timeout || null,

  setTokenData: (data) => {
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora desde ahora
    const tokenData = {
      token: data?.token,
      timeout: expiration.toISOString(),
    };
    localStorage.setItem('token', JSON.stringify(tokenData));
    set({
      token: tokenData.token,
      timeout: tokenData.timeout,
    });
  },

  deleteTokenData: () => {
    localStorage.removeItem('token');
    set({
      token: null,
      timeout: null,
    });
  },

  verifyTimeout: () => {
    const stored = JSON.parse(localStorage.getItem('token'));
    if (!stored) return false;

    const now = new Date();
    const expiry = new Date(stored.timeout);
    const isValid = now < expiry;

    if (!isValid) {
      localStorage.removeItem('token');
      set({ token: null, timeout: null });
      const { logout } = useAuthStore.getState(); // accedemos al estado directamente
      logout();
    }

    return isValid;
  },
}));

export default useTokenStore;
