import Joi from 'joi';

export const alreadyExistsDescription = {
  message: 'utilizatorul cu acest e-mail deja există',
  key: 'email'
};

export const unauthorizedEmailDescription = {
  message: 'e-mail greșit',
  key: 'email'
};

export const unauthorizedPasswordDescription = {
  message: 'parolă greșită',
  key: 'password'
};

export const signupSchema = Joi.object({
  name: Joi.string().trim().max(60).required().messages({
    'string.base': 'numele trebuie sa fie de tip text',
    'string.max': 'numele este prea lung',
    'any.required': 'numele este obligatoriu'
  }),

  email: Joi.string().email().lowercase().required().messages({
    'string.base': 'e-mailul trebuie sa fie de tip text',
    'string.email': 'e-mailul nu este valid',
    'any.required': 'e-mailul este obligatoriu'
  }),

  password: Joi.string()
    .pattern(/^[\w\d\.]+$/u)
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.base': 'parola trebuie sa fie de tip text',
      'string.min': 'parola trebuie să fie cel puțin din 8 caractere',
      'string.max': 'parola este prea lungă',
      'any.required': 'parola este obligatorie',
      'string.pattern.base':
        "parola este invalidă, sunt permise caractere alfanumerice și '.', '_'"
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.base': 'e-mailul trebuie sa fie de tip text',
    'string.email': 'e-mailul nu este valid',
    'any.required': 'e-mailul este obligatoriu'
  }),

  password: Joi.string().required().messages({
    'string.base': 'parola trebuie sa fie de tip text',
    'any.required': 'parola este obligatorie'
  })
});