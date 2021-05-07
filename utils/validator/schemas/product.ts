import Joi from 'joi';
import { ProductFields, ProductName } from 'types';

export const productMessages = {
  name: {
    type: 'numele trebuie sa fie de tip text',
    max: 'numele este prea lung',
    required: 'numele este obligatoriu',
  },

  price: {
    type: 'prețul trebuie să fie valid',
    min: 'prețul nu poate fi negativ',
    invalid: 'valoarea introdusă este invalidă',
  },

  quantity: {
    type: 'cantitatea trebuie să fie validă',
    min: 'cantitatea nu poate fi negativă',
    invalid: 'valoarea introdusă este invalidă',
  },

  total_quantity: {
    type: 'cantitatea totală trebuie să fie validă',
    min: 'cantitatea totaă nu poate fi negativă',
    invalid: 'valoarea introdusă este invalidă',
  },

  description: {
    type: 'descrierea nu este validă',
    max: 'descrierea este prea lungă',
    required: 'descrierea este obligatorie',
  },

  category_id: {
    required: 'categoria este obligatorie',
  },
};

const name = Joi.string().trim().max(60).required().messages({
  'string.base': productMessages.name.type,
  'string.max': productMessages.name.max,
  'any.required': productMessages.name.required,
  'string.empty': productMessages.name.required,
});

export const nameSchema = Joi.object<ProductName>({ name });

export const productSchema = Joi.object<ProductFields>({
  name,

  src: Joi.any().default('placeholder.png'),

  price: Joi.number().min(0).default(0).messages({
    'number.base': productMessages.price.type,
    'number.min': productMessages.price.min,
    'number.unsafe': productMessages.price.invalid,
  }),

  quantity: Joi.number().min(0).default(0).messages({
    'number.base': productMessages.quantity.type,
    'number.min': productMessages.quantity.min,
    'number.unsafe': productMessages.quantity.invalid,
  }),

  total_quantity: Joi.number().min(0).default(0).messages({
    'number.base': productMessages.total_quantity.type,
    'number.min': productMessages.total_quantity.min,
    'number.unsafe': productMessages.total_quantity.invalid,
  }),

  description: Joi.string().trim().max(2000).required().messages({
    'string.base': productMessages.description.type,
    'string.max': productMessages.description.max,
    'string.empty': productMessages.description.required,
    'any.required': productMessages.description.required,
  }),

  recommend: Joi.boolean().default(false),

  category_id: Joi.string().required().messages({
    'any.required': productMessages.category_id.required,
  }),
});
