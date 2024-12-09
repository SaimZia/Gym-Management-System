const mongoose = require('mongoose');
const User = require('./User');

const Trainer = User.discriminator('Trainer', new mongoose.Schema({
    specializations: [{
      type: String,
      enum: ['Yoga', 'Cardio', 'Weight Training', 'CrossFit', 'Zumba', 'Personal Training']
    }],
    certification: [{
      name: String,
      issuedBy: String,
      validUntil: Date
    }],
    workingHours: {
      start: String,
      end: String
    },
    assignedCustomers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    }],
    salary: {
      base: Number,
      commission: Number
    }
  }));

module.exports = Trainer;