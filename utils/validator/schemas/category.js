import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().trim().max(30).required().messages({
    'string.base': 'numele trebuie sa fie de tip text',
    'string.max': 'numele este prea lung',
    'string.empty': 'numele este obligatoriu',
    'any.required': 'numele este obligatoriu'
  })
});
