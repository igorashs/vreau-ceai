import Joi from 'joi';
import { CategoryName } from 'types';

export const categoryMessages = {
  name: {
    required: 'numele este obligatoriu',
    max: 'numele este prea lung',
    type: 'numele trebuie sa fie de tip text',
    exists: 'Categoria cu acest nume deja există',
  },
};

export const categorySchema = Joi.object<CategoryName>({
  name: Joi.string().trim().max(30).required().messages({
    'string.base': categoryMessages.name.type,
    'string.max': categoryMessages.name.max,
    'string.empty': categoryMessages.name.required,
    'any.required': categoryMessages.name.required,
  }),
});
