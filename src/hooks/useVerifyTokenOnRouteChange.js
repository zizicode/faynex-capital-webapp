import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useTokenStore from '@/zustand/isTokenStore'; // Ajusta la ruta según tu estructura

const useVerifyTokenOnRouteChange = () => {
  const location = useLocation();
  const { verifyTimeout } = useTokenStore();

  useEffect(() => {
    verifyTimeout();
  }, [location.pathname]);
};

export default useVerifyTokenOnRouteChange;
