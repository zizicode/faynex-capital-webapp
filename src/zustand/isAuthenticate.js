import { create } from 'zustand';

const InituserData = JSON.parse(localStorage.getItem('currentUser')) || null;

const useUserDataStore = create((set) => ({
  isAuthenticate: !!InituserData,
  isAdminAuthenticate: InituserData && String(InituserData.rol) === 'Admin',
  currentUser: InituserData,

  setUserData: (data) => {
    localStorage.setItem('currentUser', JSON.stringify(data));
    set({
      currentUser: data,
      isAuthenticate: !!data.name,
      isAdminAuthenticate: String(data.rol) === 'Admin',
    });
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    set({
      currentUser: null,
      isAuthenticate: false,
      isAdminAuthenticate: false,
    });
  },
}));

export default useUserDataStore;
