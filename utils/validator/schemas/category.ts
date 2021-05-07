import Joi from 'joi';
import { CategoryName } from 'types';

export const categoryMessages = {
  required: 'numele este obligatoriu',
  max: 'numele este prea lung',
  type: 'numele trebuie sa fie de tip text',
  exists: 'Categoria cu acest nume deja există',
};

// eslint-disable-next-line import/prefer-default-export
export const categorySchema = Joi.object<CategoryName>({
  name: Joi.string().trim().max(30).required().messages({
    'string.base': categoryMessages.type,
    'string.max': categoryMessages.max,
    'string.empty': categoryMessages.required,
    'any.required': categoryMessages.required,
  }),
});
