import Joi from 'joi';
import { UserEmail, UserLogin, UserSignup } from 'types';

export const userMessages = {
  email: {
    type: 'e-mailul trebuie sa fie de tip text',
    invalid: 'e-mailul nu este valid',
    max: 'e-mailul este prea lung',
    required: 'e-mailul este obligatoriu',
  },

  name: {
    type: 'numele trebuie sa fie de tip text',
    max: 'numele este prea lung',
    required: 'numele este obligatoriu',
  },

  password: {
    type: 'parola trebuie sa fie de tip text',
    min: 'parola trebuie să fie cel puțin din 8 caractere',
    max: 'parola este prea lungă',
    required: 'parola este obligatorie',
    invalid:
      "parola este invalidă, sunt permise caractere alfanumerice și '.', '_'",
  },

  repeat_password: {
    match: 'parola nu coincide',
  },
};

const email = Joi.string()
  .email({ tlds: { allow: false } })
  .trim()
  .max(60)
  .lowercase()
  .required()
  .messages({
    'string.base': userMessages.email.type,
    'string.email': userMessages.email.invalid,
    'string.max': userMessages.email.max,
    'string.empty': userMessages.email.required,
    'any.required': userMessages.email.required,
  });

export const emailSchema = Joi.object<UserEmail>({ email });

export const signupSchema = Joi.object<UserSignup>({
  name: Joi.string().trim().max(60).required().messages({
    'string.base': userMessages.name.type,
    'string.max': userMessages.name.max,
    'string.empty': userMessages.name.required,
    'any.required': userMessages.name.required,
  }),

  email,

  password: Joi.string()
    .pattern(/^[\w\d.]+$/u)
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.base': userMessages.password.type,
      'string.min': userMessages.password.min,
      'string.max': userMessages.password.max,
      'string.empty': userMessages.password.required,
      'any.required': userMessages.password.required,
      'string.pattern.base': userMessages.password.invalid,
    }),

  repeat_password: Joi.any().valid(Joi.ref('password')).messages({
    'any.only': userMessages.repeat_password.match,
  }),
});

export const loginSchema = Joi.object<UserLogin>({
  email,

  password: Joi.string().required().messages({
    'string.base': userMessages.password.type,
    'string.empty': userMessages.password.required,
    'any.required': userMessages.password.required,
  }),
});
