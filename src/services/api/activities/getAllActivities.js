import api from '../api.json';
const isDev = import.meta.env.MODE === 'development' ? api.dev : api.prod;

/**
 * Consulta las actividades por el ID de usuario
 * @param {string | number} userId - ID del usuario para filtrar las actividades
 * @returns {Promise<Object>} - Datos de las actividades si existen
 */
export const getActivitiesByUserId = async (userId) => {
    const { token } = JSON.parse(localStorage.getItem('token'));
  try {
    const response = await fetch(`${isDev}/activities/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      throw new Error(errorData.message || 'Error al obtener las actividades');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en getActivitiesByUserId:', error);
    throw error;
  }
};
