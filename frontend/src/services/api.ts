import axios, { AxiosError } from 'axios';

// Determine API base URL: use VITE_API_BASE_URL if configured, otherwise auto-detect
// production Netlify deployment domain to avoid accidental 404s.
const defaultApiUrl =
  typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')
    ? 'https://csn-bhoomi-soil-testing.onrender.com'
    : 'http://localhost:8000';

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || defaultApiUrl).replace(/\/+$/, '');

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// ── Auth token injection ────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── 401 → clear session ────────────────────────────────────────────────────
let isRedirectingToLogin = false;

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Do not trigger page reload/redirect loop if user is already on public routes
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register' && path !== '/' && !isRedirectingToLogin) {
          isRedirectingToLogin = true;
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  updateMe: (data: object) => api.patch('/auth/me', data),
  logout: () => api.post('/auth/logout'),
};

// ── Farms ──────────────────────────────────────────────────────────────────
export const farmsApi = {
  list: () => api.get('/farms'),
  create: (data: object) => api.post('/farms', data),
  get: (id: string) => api.get(`/farms/${id}`),
  update: (id: string, data: object) => api.patch(`/farms/${id}`, data),
  delete: (id: string) => api.delete(`/farms/${id}`),
  getProfile: (farmId: string) => api.get(`/farms/${farmId}/profile`),
  updateProfile: (farmId: string, data: object) => api.put(`/farms/${farmId}/profile`, data),
};

// ── Soil ───────────────────────────────────────────────────────────────────
export const soilApi = {
  createSample: (data: object) => api.post('/soil-samples', data),
  getSamplesForFarm: (farmId: string) => api.get(`/farms/${farmId}/soil-samples`),
  getSample: (id: string) => api.get(`/soil-samples/${id}`),
  importCsv: (farmId: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/soil-samples/import?farm_id=${farmId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Satellite ───────────────────────────────────────────────────────────────
export const satelliteApi = {
  triggerAnalysis: (farmId: string, dateFrom?: string, dateTo?: string) =>
    api.post(`/farms/${farmId}/satellite-analyses`, null, {
      params: { date_from: dateFrom, date_to: dateTo },
    }),
  getAnalysis: (id: string) => api.get(`/satellite-analyses/${id}`),
};

// ── Recommendations ─────────────────────────────────────────────────────────
export const recommendationsApi = {
  getCropRecommendations: (farmId: string, params?: object) =>
    api.post(`/farms/${farmId}/crop-recommendations`, null, { params }),
  getFertilizerRecommendations: (farmId: string, params?: object) =>
    api.post(`/farms/${farmId}/fertilizer-recommendations`, null, { params }),
};

// ── Reports ─────────────────────────────────────────────────────────────────
export const reportsApi = {
  list: () => api.get('/reports'),
  create: (farmId: string, params?: object) =>
    api.post(`/farms/${farmId}/reports`, null, { params }),
  get: (id: string) => api.get(`/reports/${id}`),
  download: (id: string) =>
    api.get(`/reports/${id}/download`, { responseType: 'blob' }),
};

// ── Geospatial & Geocoding ──────────────────────────────────────────────────
export const geoApi = {
  search: (q: string, limit?: number) => api.get('/geo/search', { params: { q, limit } }),
  reverse: (lat: number, lon: number) => api.get('/geo/reverse', { params: { lat, lon } }),
  resolvePolygon: (geojson: any) => api.post('/geo/resolve-polygon', { geojson }),
  calculateArea: (coordinates: number[][]) => api.post('/geo/calculate-area', { coordinates }),
  status: () => api.get('/geo/providers/status'),
};

// ── ML Ops & Model Retraining ──────────────────────────────────────────────
export const mlOpsApi = {
  analyzeField: (data: {
    field_id?: string;
    farm_name?: string;
    geometry: any;
    crop?: string;
    season?: string;
    analysis_mode: 'demo' | 'trained';
  }) => api.post('/analyses', data),
  getAnalysis: (id: string) => api.get(`/analyses/${id}`),
  listModels: () => api.get('/models'),
  getModelMetrics: (id: string) => api.get(`/models/${id}/metrics`),
  approveModel: (id: string) => api.post(`/models/${id}/approve`),
  rollbackModel: (id: string) => api.post(`/models/${id}/rollback`),
  listDatasets: () => api.get('/datasets'),
  uploadDataset: (file: File, name: string, description?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', name);
    if (description) fd.append('description', description);
    return api.post('/datasets', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createTrainingJob: (datasetId: string, modelName?: string, algorithm?: string) =>
    api.post('/training-jobs', {
      dataset_id: datasetId,
      model_name: modelName || 'Candidate Model',
      algorithm: algorithm || 'Random Forest Regressor',
    }),
  getTrainingJob: (id: string) => api.get(`/training-jobs/${id}`),
};
