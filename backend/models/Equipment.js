// models/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Equipment name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Equipment type is required']
    },
    serialNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    manufacturer: String,
    purchaseDate: Date,
    warrantyExpiry: Date,
    lastMaintenance: Date,
    nextMaintenanceDue: Date,
    status: {
        type: String,
        enum: ['active', 'under_maintenance', 'out_of_order', 'retired'],
        default: 'active'
    },
    cost: Number,
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    },
    maintenanceHistory: [{
        date: Date,
        type: String,
        description: String,
        cost: Number,
        performedBy: String
    }],
    specifications: {
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: {
                type: String,
                default: 'cm'
            }
        },
        weight: {
            value: Number,
            unit: {
                type: String,
                default: 'kg'
            }
        },
        powerRequirements: String
    },
    location: {
        area: String,
        position: String
    },
    notes: String,
    documents: [{
        type: String,
        url: String,
        name: String,
        uploadDate: Date
    }]
}, {
    timestamps: true
});

// Indexes for efficient querying
equipmentSchema.index({ gym: 1, status: 1 });
equipmentSchema.index({ serialNumber: 1 });
equipmentSchema.index({ nextMaintenanceDue: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);