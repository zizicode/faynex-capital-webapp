import api from './api.json';
const isDev = import.meta.env.MODE === 'development' ? api.dev : api.prod;

export const getReferralByUsername = async (payload) => {
    try {
      const response = await fetch(`${isDev}/get/referral`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Verificar si la respuesta es exitosa (status 2xx)
      if (!response.ok) {
        // Leer el mensaje de error del backend
        const errorData = await response.json();
        console.log(errorData);
        return errorData;
      }
  
      // Si la respuesta es exitosa, leer los datos
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error en searchUser:', error);
      throw error;
    }
};