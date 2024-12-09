// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  type: {
    type: String,
    enum: ['subscription', 'salary', 'maintenance', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'bank_transfer']
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  transactionId: String,
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  note: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Ensure all payment fields are properly indexed
paymentSchema.index({ payer: 1, type: 1 });
paymentSchema.index({ recipient: 1, type: 1 });
paymentSchema.index({ gym: 1, type: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);