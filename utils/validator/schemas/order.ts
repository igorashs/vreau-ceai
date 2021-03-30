/* eslint-disable camelcase */
import Joi from 'joi';

export interface OrderSubmit {
  tel: string;
  address: string;
}

export const orderSubmitSchema = Joi.object<OrderSubmit>({
  tel: Joi.string()
    .pattern(/^0\d{8}$/)
    .required()
    .messages({
      'string.empty': 'telefonul este obligatoriu',
      'any.required': 'telefonul este obligatoriu',
      'string.pattern.base': 'telefonul este invalid',
    }),
  address: Joi.string().trim().max(200).messages({
    'string.empty': 'adresa este obligatorie',
    'any.required': 'adresa este obligatorie',
    'string.max': 'adresa este prea lungă',
  }),
});

export interface OrderItem {
  product_id: string;
  count: number;
}

export const orderItemsSchema = Joi.array().items(
  Joi.object<OrderItem>({
    product_id: Joi.string().required(),
    count: Joi.number().min(1).required(),
  }),
);

export interface OrderNumber {
  number: string;
}

export const orderNumberSchema = Joi.object<OrderNumber>({
  number: Joi.string().length(16).required().messages({
    'string.length': 'numărul trebuie să aibă exact 16 caractere',
    'string.empty': 'numărul este obligatoriu',
    'any.required': 'numărul este obligatoriu',
  }),
});

export interface OrderStatus {
  status: 'processing' | 'inDelivery' | 'canceled' | 'completed';
}

export const orderStatusSchema = Joi.object<OrderStatus>({
  status: Joi.string()
    .valid('processing', 'inDelivery', 'canceled', 'completed')
    .required()
    .messages({
      'string.empty': 'statusul este obligatoriu',
      'any.required': 'statusul este obligatoriu',
      'any.only': 'status greșit',
    }),
});
