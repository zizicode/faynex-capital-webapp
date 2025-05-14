import api from '../api.json';

const isDev = import.meta.env.MODE === 'development' ? api.dev : api.prod;

/**
 * Obtiene la red de referidos de un usuario por ID
 * @param {string | number} userId - ID del usuario a consultar
 * @returns {Promise<Object>} - Objeto con la red de referidos por niveles
 */
export const getReferralsTree = async (userId) => {
  const { token } = JSON.parse(localStorage.getItem('token'));

  try {
    const response = await fetch(`${isDev}/referrals/referralTree/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      throw new Error(errorData.message || 'Error al obtener la red de referidos');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en getReferralsTree:', error);
    throw error;
  }
};
