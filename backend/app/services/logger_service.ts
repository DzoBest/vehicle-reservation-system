import logger from '@adonisjs/core/services/logger'

type LogContext = Record<string, any>

/**
 * Service simple de logging
 * Utilisé pour le debug et les erreurs techniques
 */
export class LoggerService {
  /**
   * Nettoyage des données sensibles avant log
   */
  private sanitize(data?: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    const sensitiveKeys = ['password', 'token', 'secret']

    const sanitized: Record<string, any> = { ...data }

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]'
      }
    }

    return sanitized
  }

  private formatContext(context?: LogContext) {
    return {
      ...this.sanitize(context),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Logs informatifs
   */
  info(message: string, context?: LogContext) {
    logger.info(this.formatContext(context), message)
  }

  /**
   * Logs de warning
   */
  warn(message: string, context?: LogContext) {
    logger.warn(this.formatContext(context), message)
  }

  /**
   * Logs d’erreur
   */
  error(message: string, error?: Error, context?: LogContext) {
    logger.error(
      {
        ...this.formatContext(context),
        error: error
          ? {
              message: error.message,
              name: error.name,
            }
          : undefined,
      },
      message
    )
  }
}
