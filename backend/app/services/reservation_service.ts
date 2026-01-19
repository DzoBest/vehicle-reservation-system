import Reservation from '#models/reservation'
import { DateTime } from 'luxon'

export default class ReservationService {
  /**
   * Créer une réservation
   */
  public async create(
    userId: string,
    vehicleId: number,
    start: DateTime,
    end: DateTime
  ) {
    await this.checkConflict(vehicleId, start, end)

    return Reservation.create({
      userId,
      vehicleId,
      startDate: start,
      endDate: end,
    })
  }

  /**
   * Mes réservations
   */
  public async getUserReservations(userId: string) {
    return Reservation.query()
      .where('user_id', userId)
      .preload('vehicle')
      .orderBy('start_date', 'desc')
  }

  /**
   * Détails d’une réservation (sécurisée)
   */
  public async getById(reservationId: number, userId: string) {
    return Reservation.query()
      .where('id', reservationId)
      .where('user_id', userId)
      .preload('vehicle')
      .first()
  }

  /**
   * Modifier une réservation
   */
  public async update(
    reservationId: number,
    userId: string,
    vehicleId: number,
    start: DateTime,
    end: DateTime
  ) {
    const reservation = await Reservation.query()
      .where('id', reservationId)
      .where('user_id', userId)
      .first()

    if (!reservation) {
      throw new Error('Réservation introuvable')
    }

    await this.checkConflict(vehicleId, start, end, reservationId)

    reservation.vehicleId = vehicleId
    reservation.startDate = start
    reservation.endDate = end

    await reservation.save()
    return reservation
  }

  /**
   * Annuler une réservation
   */
  public async delete(reservationId: number, userId: string) {
    const reservation = await Reservation.query()
      .where('id', reservationId)
      .where('user_id', userId)
      .first()

    if (!reservation) {
      throw new Error('Réservation introuvable')
    }

    await reservation.delete()
  }

  /**
   * Vérifier les conflits de réservation
   */
  private async checkConflict(
    vehicleId: number,
    start: DateTime,
    end: DateTime,
    ignoreReservationId?: number
  ) {
    const query = Reservation.query()
      .where('vehicle_id', vehicleId)
      .where((q) => {
        q.whereBetween('start_date', [
          start.toSQL({ includeOffset: false })!,
          end.toSQL({ includeOffset: false })!,
        ])
          .orWhereBetween('end_date', [
            start.toSQL({ includeOffset: false })!,
            end.toSQL({ includeOffset: false })!,
          ])
          .orWhere((sub) => {
            sub
              .where('start_date', '<=', start.toSQL({ includeOffset: false })!)
              .where('end_date', '>=', end.toSQL({ includeOffset: false })!)
          })
      })

    if (ignoreReservationId) {
      query.whereNot('id', ignoreReservationId)
    }

    const conflict = await query.first()

    if (conflict) {
      // Récupérer tous les conflits pour information
      const allConflicts = await Reservation.query()
        .where('vehicle_id', vehicleId)
        .where('end_date', '>=', DateTime.now().toSQL()!)
        .orderBy('start_date', 'asc')

      const error: any = new Error('Ce véhicule est déjà réservé sur cette période')
      error.code = 'E_RESERVATION_CONFLICT'
      
      // returner le liste des conflits
      error.conflict = allConflicts.map(c => ({
        startDate: c.startDate,
        endDate: c.endDate
      }))
      
      throw error
    }
  }
}
