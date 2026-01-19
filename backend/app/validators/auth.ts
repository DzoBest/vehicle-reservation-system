import vine from '@vinejs/vine'


/**
 * Inscription utilisateur
 */
export const registerValidator = vine.compile(
  vine.object({
    lastName: vine.string().trim().minLength(3).maxLength(255).optional(),
    firstName: vine.string().trim().minLength(3).maxLength(255).optional(),
    email: vine
      .string()
      .trim()
      .email()
      .toLowerCase()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),

    password: vine
      .string()
      .minLength(6)
      .maxLength(30)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^a-zA-Z0-9]/)
      .confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

/**
 * Connexion utilisateur
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    password: vine.string(),
  })
)