import api from '../api.json';
const isDev = import.meta.env.MODE === 'development' ? api.dev : api.prod;

/**
 * Consulta un plan por su ID
 * @param {string | number} id - ID del plan a consultar
 * @returns {Promise<Object>} - Datos del plan si existe
 */
export const getPlanByUserId = async (id) => {
    const { token } = JSON.parse(localStorage.getItem('token'));
  try {
    const response = await fetch(`${isDev}/plans/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      throw new Error(errorData.message || 'Error al obtener los Plan');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en getPlanById:', error);
    throw error;
  }
};
