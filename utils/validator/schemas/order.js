import Joi from 'joi';

export const orderSubmitSchema = Joi.object({
  tel: Joi.string()
    .pattern(/^0\d{8}$/)
    .required()
    .messages({
      'string.empty': 'telefonul este obligatoriu',
      'any.required': 'telefonul este obligatoriu',
      'string.pattern.base': 'telefonul este invalid'
    }),
  address: Joi.string().trim().max(200).messages({
    'string.empty': 'adresa este obligatorie',
    'any.required': 'adresa este obligatorie',
    'string.max': 'adresa este prea lungă'
  })
});

export const orderItemsSchema = Joi.array().items(
  Joi.object({
    product_id: Joi.string().required(),
    count: Joi.number().min(1).required()
  })
);
