import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Reservation from '#models/reservation'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

/**
 * Configuration de l'authentification
 * - Login par email
 * - Mot de passe hashé avec scrypt
 */

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  /**
   * Clé primaire
   */
  @column({ isPrimary: true })
  declare id: string

  /**
   * Informations utilisateur
   */
  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  /**
   * Mot de passe (jamais sérialisé)
   */
  @column({ serializeAs: null })
  declare password: string

  /**
   * Dates
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>

  /**
   * Tokens d'accès (JWT / API tokens)
   */
  static accessTokens = DbAccessTokensProvider.forModel(User)
  serializePublic: any
}
