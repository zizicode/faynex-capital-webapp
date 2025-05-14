import api from '../api.json';
const isDev = import.meta.env.MODE === 'development' ? api.dev : api.prod;

/**
 * Registra una solicitud de retiro para un usuario
 * @param {Object} data - Datos del retiro
 * @param {string | number} data.user_id - ID del usuario
 * @param {string} data.wallet_address - Dirección USDT del usuario
 * @param {number} data.original_amount - Monto original solicitado
 * @param {number} data.fee - Comisión aplicada al retiro
 * @param {number} data.amount - Monto neto a recibir
 * @returns {Promise<Object>} - Resultado de la operación
 */

export const createPayments = async ({user_id, wallet_address, original_amount, fee, amount}) => {
    const { token } = JSON.parse(localStorage.getItem('token'));
  try {
    const response = await fetch(`${isDev}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id, wallet_address, original_amount, fee, amount }),
      });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      throw new Error(errorData.message || 'Error al obtener los solicitudes de pago');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en getPaymentsByUserId:', error);
    throw error;
  }
};
