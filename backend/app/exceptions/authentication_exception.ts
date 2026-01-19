import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

/**
 * Exception personnalisée pour les erreurs d'authentification
 * Retourne automatiquement un statut HTTP 401
 */
export default class AuthenticationException extends Exception {
  static status = 401
  static code = 'E_AUTHENTICATION_FAILED'

  constructor(message: string = 'Authentication failed') {
    super(message, { status: 401, code: 'E_AUTHENTICATION_FAILED' })
  }

  /**
   * Gère l'exception et retourne une réponse HTTP appropriée
   */
  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).json({
      code: error.status,
      status: 'error',
      message: error.message,
      details: {
        error: error.code,
      },
    })
  }
}
