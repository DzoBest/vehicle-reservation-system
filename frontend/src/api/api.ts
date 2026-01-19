import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
})
/**
 * intercepteurs pour ajouter le token d'authentification à chaque requête
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (token === '[object Object]') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalide ou expiré, déconnexion de l'utilisateur
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
