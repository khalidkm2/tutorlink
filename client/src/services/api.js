import axios from 'axios';

// Create custom axios instance
const api = axios.create({
  baseURL: '', // Left blank to leverage Vite's /api proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for automatic error formatting or handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const responseData = error?.response?.data;

  if (responseData) {
    if (typeof responseData.message === 'string' && responseData.message.trim()) {
      return responseData.message;
    }

    if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      return responseData.errors[0];
    }
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const getApiFieldErrors = (error) => {
  const responseErrors = error?.response?.data?.errors;

  if (!responseErrors || typeof responseErrors !== 'object' || Array.isArray(responseErrors)) {
    return {};
  }

  return Object.entries(responseErrors).reduce((acc, [field, value]) => {
    acc[field] = Array.isArray(value) ? value[0] : String(value);
    return acc;
  }, {});
};

export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  me: () => api.get('/api/auth/me'),
};

export const profileAPI = {
  getTutors: (params) => api.get('/api/profiles/tutors', { params }),
  getTutorById: (id) => api.get(`/api/profiles/tutors/${id}`),
  updateStudentProfile: (profileData) => api.put('/api/profiles/student', profileData),
  updateTutorProfile: (profileData) => api.put('/api/profiles/tutor', profileData),
  uploadCertificate: (formData) => api.post('/api/profiles/upload-certificate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getPendingTutors: () => api.get('/api/profiles/admin/pending-tutors'),
  approveTutor: (id) => api.patch(`/api/profiles/admin/approve-tutor/${id}`),
};

export const recommendationAPI = {
  getRecommendations: (criteria) => api.post('/api/recommendations', criteria),
};

export const requestAPI = {
  createRequest: (requestData) => api.post('/api/requests', requestData),
  getStudentRequests: () => api.get('/api/requests/student'),
  getTutorRequests: () => api.get('/api/requests/tutor'),
  updateRequestStatus: (id, statusData) => api.patch(`/api/requests/${id}`, statusData),
};

export const reviewAPI = {
  createReview: (reviewData) => api.post('/api/reviews', reviewData),
  getTutorReviews: (tutorId) => api.get(`/api/reviews/tutor/${tutorId}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/api/notifications'),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
};

export default api;
