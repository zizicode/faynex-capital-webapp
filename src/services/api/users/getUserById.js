import api from '../api.json';
const isDev = import.meta.env.MODE === 'development' ? api.dev : api.prod;

export const getUserById = async (userId) => {
    const { token } = JSON.parse(localStorage.getItem('token'));
    try {
        const response = await fetch(`${isDev}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el usuario');
        }

        const { data } = await response.json();
        return { success: true, data };

    } catch (error) {
        console.error('Error en getUserById:', error);
        return { success: false, data: null };
    }
};
