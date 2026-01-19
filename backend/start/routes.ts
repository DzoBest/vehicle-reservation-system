import router from '@adonisjs/core/services/router'
import authRoutes from '#start/routes/auth'
import reservationRoutes from './routes/reservation.js'
import vehicleRoutes from './routes/vehicle.js'

router
  .group(() => {
    
    // auth routes
    authRoutes()

    reservationRoutes()

    vehicleRoutes()

  })
  .prefix('api/v1')
