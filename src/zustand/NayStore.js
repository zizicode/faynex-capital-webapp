import { create } from 'zustand';

const defaultConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
};

const useNayStore = create((set) => ({
  isNay: false,
  Nay: null,
  toastType: 'default', // 👉 success, error, info, warning, default
  config: defaultConfig,
  timeout: 10000, // Tiempo para restablecer el estado (en ms)

  setNayData: (data, toastType = 'default', customConfig = {}, timeout) => {
    set({
      Nay: data,
      isNay: true,
      toastType,
      config: { ...defaultConfig, ...customConfig },
    });

    const resetTime = timeout || defaultConfig.autoClose;
    setTimeout(() => {
      set({ isNay: false, Nay: null, toastType: 'default' });
    }, resetTime);
  },
}));

export default useNayStore;
