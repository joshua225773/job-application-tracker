const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/applications';

/**
 * Universal response handler for API calls
 */
const handleResponse = async (response) => {
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || 'An error occurred during the request.');
    error.status = response.status;
    error.data = result.data;
    throw error;
  }
  return result;
};

export const applicationService = {
  /**
   * Fetch all applications with optional status and search filters
   */
  async getApplications({ status = '', search = '' } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (search && search.trim() !== '') {
      params.append('search', search.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}${queryString}`);
    return handleResponse(res);
  },

  /**
   * Fetch summary count metrics across statuses
   */
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/stats`);
    return handleResponse(res);
  },

  /**
   * Fetch single application details by ID
   */
  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(res);
  },

  /**
   * Create a new job application
   */
  async create(data) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Update mutable fields of an existing application
   */
  async update(id, data) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Transition status workflow
   */
  async transitionStatus(id, nextStatus, notes = '') {
    const res = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: nextStatus, notes }),
    });
    return handleResponse(res);
  },

  /**
   * Delete application (enforces status rule on backend)
   */
  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};
