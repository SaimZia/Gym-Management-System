const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Specialization name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        enum: ['Fitness', 'Yoga', 'Cardio', 'Strength', 'Other'],
        default: 'Other'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    requiresCertification: {
        type: Boolean,
        default: false
    },
    certificationDetails: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Specialization', specializationSchema);