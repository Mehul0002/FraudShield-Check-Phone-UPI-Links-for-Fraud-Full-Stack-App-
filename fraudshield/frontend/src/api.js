import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const searchEntity = async (type, value) => {
  const { data } = await api.get('/search', { params: { type, value } })
  return data
}

export const submitReport = async (reportData) => {
  const formData = new FormData()
  
  // Append all fields
  Object.keys(reportData).forEach(key => {
    if (key === 'evidence' && reportData[key]) {
      formData.append(key, reportData[key])
    } else if (reportData[key] !== undefined && reportData[key] !== '') {
      formData.append(key, reportData[key])
    }
  })

  const { data } = await api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const getRecentReports = async (page = 1) => {
  const { data } = await api.get('/reports/recent', { params: { page } })
  return data
}

export const getEntity = async (id) => {
  const { data } = await api.get(`/entities/${id}`)
  return data
}

// Admin API
export const adminLogin = async (credentials) => {
  const { data } = await api.post('/admin/login', credentials)
  if (data.token) {
    localStorage.setItem('adminToken', data.token)
  }
  return data
}

export const adminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard')
  return data
}

export const adminReports = async (params = {}) => {
  const { data } = await api.get('/admin/reports', { params })
  return data
}

export const adminApproveReport = async (id) => {
  const { data } = await api.patch(`/admin/reports/${id}/approve`)
  return data
}

export const adminRejectReport = async (id) => {
  const { data } = await api.patch(`/admin/reports/${id}/reject`)
  return data
}

export const adminDeleteReport = async (id) => {
  const { data } = await api.delete(`/admin/reports/${id}`)
  return data
}

export default api
