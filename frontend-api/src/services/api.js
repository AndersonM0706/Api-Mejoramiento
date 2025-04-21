const API_BASE_URL = 'http://localhost:3000'; // Reemplaza con la URL de tu API backend

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw error; // Lanza el error para que lo captures en tus componentes
  }
  return await response.json();
};

const api = {
  get: async (endpoint, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: headers,
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: headers,
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

export default api;