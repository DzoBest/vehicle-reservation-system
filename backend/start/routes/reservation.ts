import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ReservationsController = () => import('#controllers/reservations_controller')

export default function reservationRoutes() {
  /**
   * Routes protégées (authentification requise)
   */
  router
    .group(() => {
      router.get('/', [ReservationsController, 'index'])
      router.get('/:id', [ReservationsController, 'show'])
      router.post('/', [ReservationsController, 'store'])
      router.put('/:id', [ReservationsController, 'update'])
      router.delete('/:id', [ReservationsController, 'destroy'])
    })
    .prefix('reservations')
    .use(middleware.auth())
}
