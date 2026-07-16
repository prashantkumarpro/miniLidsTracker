const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
};

/**
 * Custom fetch wrapper that appends JWT token, parses JSON, and logs out on 401.
 * @param {string} endpoint - API path (e.g. '/leads')
 * @param {Object} options - Standard fetch options
 * @param {Function} logoutHandler - Auth Context logout trigger
 */
export const apiFetch = async (endpoint, options = {}, logoutHandler) => {
  const baseUrl = getApiUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);
    
    // Parse response
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = {
        success: false,
        message: 'Could not parse server response'
      };
    }

    // Auto logout on 401 Unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (logoutHandler) {
          logoutHandler();
        } else {
          window.location.href = '/login';
        }
      }
      const err = new Error(responseData.message || 'Session expired');
      err.statusCode = 401;
      throw err;
    }

    if (!response.ok || responseData.success === false) {
      const error = new Error(responseData.message || 'An error occurred on the server');
      error.statusCode = response.status;
      error.errors = responseData.errors || [];
      throw error;
    }

    return responseData;
  } catch (error) {
    // Forward the error
    throw error;
  }
};
