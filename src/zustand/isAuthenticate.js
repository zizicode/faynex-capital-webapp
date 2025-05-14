import { create } from 'zustand';
import useTokenStore from './isTokenStore';
import { getUserById } from '@/services/api/users/getUserById'; // asegúrate de que esta ruta sea correcta

const InituserData = JSON.parse(localStorage.getItem('currentUser')) || null;

const useUserDataStore = create((set) => ({
  isAuthenticate: !!InituserData,
  currentUser: InituserData,

  setUserData: (data) => {
    localStorage.setItem('currentUser', JSON.stringify(data));
    set({
      currentUser: data,
      isAuthenticate: !!data,
    });
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    const { deleteTokenData } = useTokenStore.getState();
    set({
      currentUser: null,
      isAuthenticate: false,
    });
    deleteTokenData();
  },

  syncUserDataFromServer: async () => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!storedUser || !storedUser.id) return;

    try {
      const response = await getUserById(storedUser.id);

      if (response.success && response.data) {
        const isEqual = JSON.stringify(storedUser) === JSON.stringify(response.data);

        if (!isEqual) {
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          set({
            currentUser: response.data,
            isAuthenticate: true,
          });
        }
      }
    } catch (error) {
      console.error('Error al sincronizar datos del usuario:', error);
    }
  },
}));

export default useUserDataStore;
