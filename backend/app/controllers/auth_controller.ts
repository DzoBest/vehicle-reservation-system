import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core/container'
import { AuthService } from '#services/auth_service'
import hash from '@adonisjs/core/services/hash'
import { registerValidator, loginValidator } from '#validators/auth'
import User from '#models/user'

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Inscription
   */
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const { user } = await this.authService.register(payload)

      return response.status(201).json({
        message: 'Compte créé avec succès',
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstName,
          lastname: user.lastName,
        },
      })
    } catch (error: any) {
      if (error.messages) {
        return response.status(422).json({
          message: 'Erreur de validation',
          messages: error.messages,
        })
      }
      return response.status(400).json({
        message: error.message ?? "Erreur lors de l'inscription",
      })
    }
  }

  /**
   * Connexion
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await User.findBy('email', email.toLowerCase())

      if (!user) {
        return response.status(404).json({ message: 'Aucun compte associé à cet email' })
      }

      const isPasswordValid = await hash.verify(user.password, password)

      if (!isPasswordValid) {
        return response.status(401).json({ message: 'Mot de passe incorrect' })
      }

      // Générer le token (DB Access Token)
      const token = await User.accessTokens.create(user)

      return response.status(200).json({
        message: 'Connexion réussie',
        token: token,
        expiresAt: token.expiresAt,
        user: user.serializePublic ? user.serializePublic() : user,
      })
    } catch {
      return response.status(400).json({ message: 'Données invalides' })
    }
  }

  /**
   * Déconnexion
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      return response.json({ message: 'Déconnexion réussie' })
    } catch {
      return response.status(401).json({ message: 'Non authentifié' })
    }
  }

  /**
   * Utilisateur connecté
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      return response.json(user)
    } catch {
      return response.status(401).json({ message: 'Non authentifié' })
    }
  }
}
