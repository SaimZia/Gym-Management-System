// models/MaintenanceLog.js
const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    maintenanceType: {
        type: String,
        required: true,
        enum: ['routine', 'repair', 'inspection', 'emergency']
    },
    description: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cost: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    parts: [{
        name: String,
        quantity: Number,
        cost: Number
    }],
    nextMaintenanceDate: Date,
    notes: String,
    attachments: [{
        name: String,
        url: String,
        type: String
    }]
}, {
    timestamps: true
});

// Indexes
maintenanceLogSchema.index({ equipment: 1, date: -1 });
maintenanceLogSchema.index({ status: 1 });
maintenanceLogSchema.index({ nextMaintenanceDate: 1 });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);