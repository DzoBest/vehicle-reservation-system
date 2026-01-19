import vine, { SimpleMessagesProvider } from '@vinejs/vine'


/**
 * Inscription utilisateur
 */
export const registerValidator = vine.compile(
  vine.object({
    lastName: vine.string().trim().minLength(3).maxLength(255),
    firstName: vine.string().trim().minLength(3).maxLength(255),
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
      .use(
        vine.createRule((value, _options, field) => {
          if (typeof value !== 'string') return
          
          if (!/[A-Z]/.test(value)) {
            field.report('Le mot de passe doit contenir au moins une majuscule', 'password_uppercase', field)
          } else if (!/[a-z]/.test(value)) {
            field.report('Le mot de passe doit contenir au moins une minuscule', 'password_lowercase', field)
          } else if (!/[0-9]/.test(value)) {
            field.report('Le mot de passe doit contenir au moins un chiffre', 'password_number', field)
          } else if (!/[^a-zA-Z0-9]/.test(value)) {
            field.report('Le mot de passe doit contenir au moins un caractère spécial', 'password_special', field)
          }
        })()
      )
      .confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

registerValidator.messagesProvider = new SimpleMessagesProvider({
  'required': 'Le champ {{ field }} est obligatoire',
  'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
  'maxLength': 'Le champ {{ field }} ne doit pas dépasser {{ max }} caractères',
  'email': "L'adresse email n'est pas valide",
  'confirmed': 'Les mots de passe ne correspondent pas',
  'password.minLength': 'Le mot de passe doit contenir au moins 6 caractères',
  
  // champs obligatoires
  'firstName.required': 'Le prénom est obligatoire',
  'lastName.required': 'Le nom est obligatoire',
  'firstName.minLength': 'Le prénom doit contenir au moins 3 caractères',
  'lastName.minLength': 'Le nom doit contenir au moins 3 caractères',
  'database.unique': 'Cet email est déjà utilisé',
})

/**
 * Connexion utilisateur
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    password: vine.string(),
  })
)