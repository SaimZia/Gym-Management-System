// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'failed'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true
    },
    autoRenew: {
        type: Boolean,
        default: false
    },
    cancelReason: String,
    cancelDate: Date,
    renewalHistory: [{
        date: Date,
        status: String,
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        }
    }]
}, {
    timestamps: true
});

// Indexes
subscriptionSchema.index({ customer: 1, status: 1 });
subscriptionSchema.index({ gym: 1 });
subscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Subscription', subscriptionSchema);