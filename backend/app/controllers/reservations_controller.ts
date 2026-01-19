import type { HttpContext } from '@adonisjs/core/http'
import { reservationValidator } from '#validators/reservation'
import ReservationService from '#services/reservation_service'
import { DateTime } from 'luxon'

export default class ReservationsController {
  private reservationService = new ReservationService()

  /**
   * GET /reservations
   * Mes réservations
   */
  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()

      const reservations = await this.reservationService.getUserReservations(
        user.id
      )

      return response.status(200).json({
        message: 'Réservations récupérées avec succès',
        data: reservations,
      })
    } catch (error) {
      return response.status(500).json({
        message:
          error.message ?? 'Erreur lors de la récupération des réservations',
      })
    }
  }

  /**
   * GET /reservations/:id
   * Détails d’une réservation
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()

      const reservation = await this.reservationService.getById(
        params.id,
        user.id
      )

      if (!reservation) {
        return response.status(404).json({
          message: 'Réservation introuvable',
        })
      }

      return response.status(200).json({
        message: 'Réservation récupérée avec succès',
        data: reservation,
      })
    } catch (error) {
      return response.status(500).json({
        message:
          error.message ?? 'Erreur lors de la récupération de la réservation',
      })
    }
  }

  /**
   * POST /reservations
   * Créer une réservation
   */
  async store({ request, auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const payload = await request.validateUsing(reservationValidator)

      const reservation = await this.reservationService.create(
        user.id,
        payload.vehicleId,
        DateTime.fromJSDate(payload.startDate),
        DateTime.fromJSDate(payload.endDate)
      )

      return response.status(201).json({
        message: 'Réservation créée avec succès',
        data: reservation,
      })
    } catch (error: any) {
      if (error.code === 'E_RESERVATION_CONFLICT') {
        return response.status(409).json({
          message: error.message,
          conflict: error.conflict
        })
      }
      return response.status(400).json({
        message:
          error.message ?? 'Erreur lors de la création de la réservation',
      })
    }
  }

  /**
   * PUT /reservations/:id
   * Modifier une réservation
   */
  async update({ request, auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const payload = await request.validateUsing(reservationValidator)

      const reservation = await this.reservationService.update(
        params.id,
        user.id,
        payload.vehicleId,
        DateTime.fromJSDate(payload.startDate),
        DateTime.fromJSDate(payload.endDate)
      )

      return response.status(200).json({
        message: 'Réservation modifiée avec succès',
        data: reservation,
      })
    } catch (error: any) {
      if (error.code === 'E_RESERVATION_CONFLICT') {
        return response.status(409).json({
          message: error.message,
          conflict: error.conflict
        })
      }
      return response.status(400).json({
        message:
          error.message ?? 'Erreur lors de la modification de la réservation',
      })
    }
  }

  /**
   * DELETE /reservations/:id
   * Annuler une réservation
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()

      await this.reservationService.delete(params.id, user.id)

      return response.status(200).json({
        message: 'Réservation annulée avec succès',
      })
    } catch (error) {
      return response.status(400).json({
        message:
          error.message ?? 'Erreur lors de l’annulation de la réservation',
      })
    }
  }
}
