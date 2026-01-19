import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'

export default class VehiclesController {
  /**
   * GET /vehicles
   * Liste de tous les véhicules
   */
  async index({ response }: HttpContext) {
    try {
      const vehicles = await Vehicle.query()
        .where('is_active', true)
        .orderBy('created_at', 'desc')

      return response.status(200).json({
        message: 'Liste des véhicules récupérée avec succès',
        data: vehicles,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message ?? 'Erreur lors de la récupération des véhicules',
      })
    }
  }

  /**
   * GET /vehicles/:id
   * Détails d’un véhicule + réservations
   */
  async show({ params, response }: HttpContext) {
    try {
      const vehicle = await Vehicle.query()
        .where('id', params.id)
        .preload('reservations', (query) => {
          query.orderBy('start_date', 'asc')
        })
        .first()

      if (!vehicle) {
        return response.status(404).json({
          message: 'Véhicule introuvable',
        })
      }

      return response.status(200).json({
        message: 'Véhicule récupéré avec succès',
        data: vehicle,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message ?? 'Erreur lors de la récupération du véhicule',
      })
    }
  }
}
