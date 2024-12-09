// models/Diet.js
const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    planName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: Date,
    goals: [{
        type: String,
        required: true
    }],
    dailyCalories: {
        type: Number,
        required: true
    },
    meals: [{
        type: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
            required: true
        },
        time: {
            type: String,
            required: true
        },
        items: [{
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            },
            calories: Number,
            proteins: Number,
            carbs: Number,
            fats: Number
        }]
    }],
    restrictions: [{
        type: String
    }],
    notes: String,
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    progress: [{
        date: {
            type: Date,
            default: Date.now
        },
        weight: Number,
        notes: String,
        adherence: {
            type: Number,
            min: 0,
            max: 100
        }
    }]
}, {
    timestamps: true
});

// Indexes for efficient querying
dietSchema.index({ customer: 1, status: 1 });
dietSchema.index({ trainer: 1 });
dietSchema.index({ startDate: -1 });

module.exports = mongoose.model('Diet', dietSchema);