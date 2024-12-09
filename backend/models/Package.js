// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Package description is required']
  },
  duration: {
    value: {
      type: Number,
      required: [true, 'Duration value is required']
    },
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      required: [true, 'Duration unit is required']
    }
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price amount is required']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  features: [{
    type: String,
    required: true
  }],
  maxMembers: {
    type: Number,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: [true, 'Gym reference is required']
  },
  availability: {
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date
  }
});

// Indexes for efficient querying
packageSchema.index({ gym: 1, isActive: 1 });
packageSchema.index({ 'price.amount': 1 });
packageSchema.index({ name: 1 });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;