import User from '#models/user'
import { inject } from '@adonisjs/core/container'
import AuthenticationException from '../exceptions/authentication_exception.js'
import { LoggerService } from './logger_service.js'

@inject()
export class AuthService {
  constructor(private logger: LoggerService) {}

  /**
   * Inscription
   */
  async register(payload: {
    firstName?: string
    lastName?: string
    email: string
    password: string
  }) {
    const user = await User.create({
      firstName: payload.firstName ?? null,
      lastName: payload.lastName ?? null,
      email: payload.email.toLowerCase(),
      password: payload.password,
    })

    this.logger.info('User registered', { userId: user.id })

    return { user }
  }

  /**
   * Connexion
   */
  async login(email: string, password: string, auth: any) {
    const user = await User.verifyCredentials(email.toLowerCase(), password)

    if (!user) {
      throw new AuthenticationException('Identifiants invalides')
    }

    const accessToken = await auth.use('jwt').generate(user)

    this.logger.info('User logged in', { userId: user.id })

    return {
      user,
      accessToken: accessToken.token,
    }
  }

  /**
   * Utilisateur courant
   */
  async currentUser(user: User) {
    return user
  }

  /**
   * Mise à jour du compte
   */
  async updateAccount(
    user: User,
    currentPassword: string,
    updates: {
      firstName?: string
      lastName?: string
      newPassword?: string
    }
  ) {
    await User.verifyCredentials(user.email, currentPassword)

    if (updates.firstName) user.firstName = updates.firstName
    if (updates.lastName) user.lastName = updates.lastName
    if (updates.newPassword) user.password = updates.newPassword

    await user.save()

    this.logger.info('User account updated', { userId: user.id })

    return {
      user,
      message: 'Compte mis à jour avec succès',
    }
  }
}
