import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

export default function authRoutes() {

    /**
     * Routes publiques (sans authentification)
     */
    router
    .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
    }).prefix('auth')


    /**
     * Routes protégées (authentification requise)
     */
    router
    .group(() => {
        router.post('/logout', [AuthController, 'logout'])
        router.get('/me', [AuthController, 'me'])
    })
    .prefix('auth')
    .use(middleware.auth())
}
