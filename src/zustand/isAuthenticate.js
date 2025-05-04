import { create } from 'zustand';
import useTokenStore from './isTokenStore';
const InituserData = JSON.parse(localStorage.getItem('currentUser')) || null;

const useUserDataStore = create((set) => ({
  isAuthenticate: !!InituserData,
  currentUser: InituserData,

  setUserData: (data) => {
    localStorage.setItem('currentUser', JSON.stringify(data));
    set({
      currentUser: data,
      isAuthenticate: data ? true : false,
    });
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    const { deleteTokenData } = useTokenStore.getState();
    set({
      currentUser: null,
      isAuthenticate: false,
    });
    deleteTokenData()
  },
}));

export default useUserDataStore;
