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
    // Ne pas rediriger si l'erreur 401 vient de la tentative de connexion elle-même
    if (error.response && error.response.status === 401 && !error.config.url?.includes('/auth/login')) {
      // Token invalide ou expiré (sur une autre route), déconnexion
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
