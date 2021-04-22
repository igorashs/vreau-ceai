import Joi from 'joi';
import { UserEmail, UserLogin, UserSignup } from 'types';

const email = Joi.string()
  .email({ tlds: { allow: false } })
  .trim()
  .max(60)
  .lowercase()
  .required()
  .messages({
    'string.base': 'e-mailul trebuie sa fie de tip text',
    'string.email': 'e-mailul nu este valid',
    'string.max': 'e-mailul este prea lung',
    'string.empty': 'e-mailul este obligatoriu',
    'any.required': 'e-mailul este obligatoriu',
  });

export const emailSchema = Joi.object<UserEmail>({ email });

export const signupSchema = Joi.object<UserSignup>({
  name: Joi.string().trim().max(60).required().messages({
    'string.base': 'numele trebuie sa fie de tip text',
    'string.max': 'numele este prea lung',
    'string.empty': 'numele este obligatoriu',
    'any.required': 'numele este obligatoriu',
  }),

  email,

  password: Joi.string()
    .pattern(/^[\w\d.]+$/u)
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.base': 'parola trebuie sa fie de tip text',
      'string.min': 'parola trebuie să fie cel puțin din 8 caractere',
      'string.max': 'parola este prea lungă',
      'string.empty': 'parola este obligatorie',
      'any.required': 'parola este obligatorie',
      'string.pattern.base':
        "parola este invalidă, sunt permise caractere alfanumerice și '.', '_'",
    }),

  repeat_password: Joi.any().valid(Joi.ref('password')).messages({
    'any.only': 'parola nu coincide',
  }),
});

export const loginSchema = Joi.object<UserLogin>({
  email,

  password: Joi.string().required().messages({
    'string.base': 'parola trebuie sa fie de tip text',
    'string.empty': 'parola este obligatorie',
    'any.required': 'parola este obligatorie',
  }),
});