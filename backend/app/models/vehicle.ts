import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Reservation from '#models/reservation'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'brand' })
  declare brand: string

  @column({ columnName: 'model' })
  declare model: string

  @column({ columnName: 'plate_number' })
  declare plateNumber: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @hasMany(() => Reservation, {
    foreignKey: 'vehicle_id',
  })
  declare reservations: HasMany<typeof Reservation>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
