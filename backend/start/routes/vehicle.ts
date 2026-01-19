import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const VehiclesController = () => import('#controllers/vehicles_controller')

export default function vehicleRoutes() {
  /**
   * Routes publiques
   */
  router
    .group(() => {
      router.get('/', [VehiclesController, 'index'])
      router.get('/:id', [VehiclesController, 'show'])
    })
    .prefix('vehicles')
    .use(middleware.auth()) 

}
