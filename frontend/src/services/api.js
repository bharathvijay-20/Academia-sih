const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal API fetch wrapper with token injection and error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('academia_auth_token');
  const savedUser = localStorage.getItem('academia_auth_user');
  let currentRole = 'STUDENT';
  try {
    if (savedUser) {
      currentRole = JSON.parse(savedUser)?.role || 'STUDENT';
    }
  } catch {}

  // Auto-detect role by endpoint if needed
  if (endpoint.includes('/industry')) {
    currentRole = 'INDUSTRY_RECRUITER';
  } else if (endpoint.includes('/student')) {
    currentRole = 'STUDENT';
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-User-Role': currentRole,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.code = data.code;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.warn(`API [${endpoint}] notice:`, err.message);
    throw err;
  }
}

