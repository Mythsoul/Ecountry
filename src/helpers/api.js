
export const getCSRFToken = () => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrf-token=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

export const apiFetch = async (url, options = {}) => {
  let csrfToken = getCSRFToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase()) && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' 
  });
  
  if (response.status === 401 && url !== '/api/auth/refresh') {
    console.log('Access token expired, attempting refresh...');

    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (refreshResponse.ok) {
      console.log('Tokens refreshed successfully');
      
      const newCSRFToken = getCSRFToken();
      
      const retryHeaders = { ...headers };
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase()) && newCSRFToken) {
        retryHeaders['X-CSRF-Token'] = newCSRFToken;
      }
      
      return fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: 'include'
      });
    } else {
      console.log('❌ Token refresh failed, user needs to login');
    }
  }
  
  return response;
};

export const api = {

  get: (url, options = {}) => apiFetch(url, { ...options, method: 'GET' }),
  

  post: (url, data, options = {}) => apiFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  /**
   * PUT request
   */
  put: (url, data, options = {}) => apiFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  /**
   * DELETE request
   */
  delete: (url, options = {}) => apiFetch(url, { ...options, method: 'DELETE' }),
  
  /**
   * PATCH request
   */
  patch: (url, data, options = {}) => apiFetch(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data)
  })
};


export default api;
