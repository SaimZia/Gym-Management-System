const Joi = require('joi');

const schemas = {
  // User related schemas
  userRegistration: Joi.object({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')),
    contactNumber: Joi.string().pattern(/^\+?[\d\s-]{10,}$/),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    })
  }),

  // Gym related schemas
  gymCreation: Joi.object({
    name: Joi.string().required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
      })
    }),
    contactNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    facilities: Joi.array().items(Joi.string()),
    workingHours: Joi.object({
      weekday: Joi.object({
        open: Joi.string().required(),
        close: Joi.string().required()
      }),
      weekend: Joi.object({
        open: Joi.string().required(),
        close: Joi.string().required()
      })
    })
  }),

  // Package related schemas
  packageCreation: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.object({
      value: Joi.number().required(),
      unit: Joi.string().valid('days', 'months', 'years').required()
    }),
    price: Joi.object({
      amount: Joi.number().required(),
      currency: Joi.string().default('USD')
    }),
    features: Joi.array().items(Joi.string()),
    maxMembers: Joi.number()
  }),

  // Payment related schemas
  payment: Joi.object({
    amount: Joi.number().required().positive(),
    currency: Joi.string().default('USD'),
    type: Joi.string().valid('subscription', 'salary', 'maintenance', 'other'),
    paymentMethod: Joi.string().valid('card', 'cash', 'bank_transfer'),
    description: Joi.string()
  }),

  // Diet related schemas
  dietPlan: Joi.object({
    customerID: Joi.string().required(),
    planName: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    goals: Joi.array().items(Joi.string()),
    dailyCalories: Joi.number().required(),
    meals: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack'),
        time: Joi.string().required(),
        items: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            quantity: Joi.string().required(),
            calories: Joi.number(),
            proteins: Joi.number(),
            carbs: Joi.number(),
            fats: Joi.number()
          })
        )
      })
    )
  })
};

module.exports = schemas;