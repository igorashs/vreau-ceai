import Joi from 'joi';

export interface Category {
  name: string;
}

export const categorySchema = Joi.object<Category>({
  name: Joi.string().trim().max(30).required().messages({
    'string.base': 'numele trebuie sa fie de tip text',
    'string.max': 'numele este prea lung',
    'string.empty': 'numele este obligatoriu',
    'any.required': 'numele este obligatoriu',
  }),
});
