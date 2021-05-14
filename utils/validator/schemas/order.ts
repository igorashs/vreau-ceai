import Joi from 'joi';
import { OrderItem, OrderNumber, OrderStatus, OrderSubmit } from 'types';

export const orderMessages = {
  tel: {
    invalid: 'telefonul este invalid',
    required: 'telefonul este obligatoriu',
  },

  address: {
    max: 'adresa este prea lungă',
    required: 'adresa este obligatorie',
  },

  number: {
    length: 'numărul trebuie să aibă exact 16 caractere',
    required: 'numărul este obligatoriu',
    wrong: 'numărul este greșit',
  },

  status: {
    invalid: 'status greșit',
    required: 'statusul este obligatoriu',
  },
};

export const orderSubmitSchema = Joi.object<OrderSubmit>({
  tel: Joi.string()
    .pattern(/^0\d{8}$/)
    .required()
    .messages({
      'string.empty': orderMessages.tel.required,
      'any.required': orderMessages.tel.required,
      'string.pattern.base': orderMessages.tel.invalid,
    }),
  address: Joi.string().trim().max(200).messages({
    'string.empty': orderMessages.address.required,
    'any.required': orderMessages.address.required,
    'string.max': orderMessages.address.max,
  }),
});

export const orderItemsSchema = Joi.array().items(
  Joi.object<OrderItem>({
    product_id: Joi.string().required(),
    count: Joi.number().min(1).required(),
  }),
);

export const orderNumberSchema = Joi.object<OrderNumber>({
  number: Joi.string().length(16).required().messages({
    'string.length': orderMessages.number.length,
    'string.empty': orderMessages.number.required,
    'any.required': orderMessages.number.required,
  }),
});

export const orderStatusSchema = Joi.object<OrderStatus>({
  status: Joi.string()
    .valid('processing', 'inDelivery', 'canceled', 'completed')
    .required()
    .messages({
      'string.empty': orderMessages.status.required,
      'any.required': orderMessages.status.required,
      'any.only': orderMessages.status.invalid,
    }),
});
