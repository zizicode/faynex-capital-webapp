import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useUserDataStore from '../../zustand/NayStore';

const Nay = () => {
  const { isNay, Nay, config, toastType } = useUserDataStore();

  useEffect(() => {
    if (isNay) {
      const showToast = toast[toastType] || toast;
      showToast(Nay, config, toastType);
    }
  }, [isNay, Nay, config, toastType]);

  return null; 
};

export default Nay;
//  Uso
//
// setNayData(
//   { message: "¡Esto es un toast personalizado!" },
//   { type: "success", autoClose: 2000 }, // config extra
//   3000 // reset time
// );
