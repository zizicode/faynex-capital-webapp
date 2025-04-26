export const registerUser = async (formData) => {
    try {
      const response = await fetch(`https://api.faynexcapital.com/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Verificar si la respuesta es exitosa (status 2xx)
      if (!response.ok) {
        // Leer el mensaje de error del backend
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Error al registrar el usuario');
      }
  
      // Si la respuesta es exitosa, leer los datos
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error en registerUser:', error);
      throw error;
    }
};

export const loginUser = async (formData) => {
    try {
      const response = await fetch(`https://api.faynexcapital.com/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Verificar si la respuesta es exitosa (status 2xx)
      if (!response.ok) {
        // Leer el mensaje de error del backend
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Error al loguear el usuario');
      }
  
      // Si la respuesta es exitosa, leer los datos
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error en loginUser:', error);
      throw error;
    }
};

export const loginAdmin = async (formData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Verificar si la respuesta es exitosa (status 2xx)
      if (!response.ok) {
        throw new Error(response.message); // Solo si falla
      }
  
      // Si la respuesta es exitosa, leer los datos
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error en loginAdmin:', error);
      throw error;
    }
};


  
  