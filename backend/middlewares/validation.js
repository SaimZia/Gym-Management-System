// middlewares/validation.js
const Joi = require('joi');

const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        message: 'Validation Error',
        errors
      });
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  userRegistration: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    contactNumber: Joi.string().pattern(/^\+?[\d\s-]+$/).required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    })
  }),

  packageCreation: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().required(),
    price: Joi.number().required(),
    features: Joi.array().items(Joi.string()),
    maxMembers: Joi.number()
  }),

  trainerRegistration: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    contactNumber: Joi.string().pattern(/^\+?[\d\s-]+$/).required(),
    assignedGym: Joi.string().required()
  })
};

module.exports = {
  validation,
  schemas
};