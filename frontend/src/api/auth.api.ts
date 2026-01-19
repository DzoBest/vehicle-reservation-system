import api from './api'

export const loginApi = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

export const registerApi = (data: any) =>
  api.post('/auth/register', data)

export const logoutApi = () => api.post('/auth/logout')

export const meApi = () => api.get('/auth/me')
