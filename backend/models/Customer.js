const mongoose = require('mongoose');
const User = require('./User');

const Customer = User.discriminator('Customer', new mongoose.Schema({
    membershipId: {
      type: String,
      unique: true
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer'
    },
    subscriptions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription'
    }],
    healthInfo: {
      height: Number,
      weight: Number,
      medicalConditions: [String],
      emergencyContact: {
        name: String,
        relationship: String,
        phone: String
      }
    }
  }));

module.exports = Customer;