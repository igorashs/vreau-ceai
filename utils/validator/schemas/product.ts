import Joi from 'joi';
import { ProductFields, ProductName } from 'types';

const name = Joi.string().trim().max(60).required().messages({
  'string.base': 'numele trebuie sa fie de tip text',
  'string.max': 'numele este prea lung',
  'string.empty': 'numele este obligatoriu',
  'any.required': 'numele este obligatoriu',
});

export const nameSchema = Joi.object<ProductName>({ name });

export const productSchema = Joi.object<ProductFields>({
  name,

  src: Joi.any().default('placeholder.png'),

  price: Joi.number().min(0).default(0).messages({
    'number.base': 'prețul trebuie să fie valid',
    'number.min': 'prețul nu poate fi negativ',
    'number.unsafe': 'valoarea introdusă este invalidă',
  }),

  quantity: Joi.number().min(0).default(0).messages({
    'number.base': 'cantitatea trebuie să fie validă',
    'number.min': 'cantitatea nu poate fi negativă',
    'number.unsafe': 'valoarea introdusă este invalidă',
  }),

  total_quantity: Joi.number().min(0).default(0).messages({
    'number.base': 'cantitatea totală trebuie să fie validă',
    'number.min': 'cantitatea totaă nu poate fi negativă',
    'number.unsafe': 'valoarea introdusă este invalidă',
  }),

  description: Joi.string().trim().max(2000).required().messages({
    'string.base': 'descrierea nu este validă',
    'string.max': 'descrierea este prea lungă',
    'string.empty': 'descrierea este obligatorie',
    'any.required': 'descrierea este obligatorie',
  }),

  recommend: Joi.boolean().default(false),

  category_id: Joi.string().required().messages({
    'any.required': 'categoria este obligatorie',
  }),
});
