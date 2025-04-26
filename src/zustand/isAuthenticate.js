import { create } from 'zustand';
import useTokenStore from './isTokenStore';
const InituserData = JSON.parse(localStorage.getItem('currentUser')) || null;

const useUserDataStore = create((set) => ({
  isAuthenticate: !!InituserData,
  isAdminAuthenticate: InituserData && String(InituserData.rol) === 'Admin',
  currentUser: InituserData,

  setUserData: (data) => {
    localStorage.setItem('currentUser', JSON.stringify(data));
    set({
      currentUser: data,
      isAuthenticate: data ? true : false,
      isAdminAuthenticate: String(data?.rol) === 'Admin',
    });
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    const { deleteTokenData } = useTokenStore.getState();
    set({
      currentUser: null,
      isAuthenticate: false,
      isAdminAuthenticate: false,
    });
    deleteTokenData()
  },
}));

export default useUserDataStore;
