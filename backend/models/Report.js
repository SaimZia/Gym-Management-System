const mongoose = require('mongoose'); // Add this line

const reportSchema = new mongoose.Schema({
    category: { // Fix the schema definition
      type: String,
      enum: ['equipment', 'incident', 'attendance', 'performance'],
      required: true
    },
    title: String,
    description: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'closed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    attachments: [{
      type: String
    }],
    resolution: {
      action: String,
      date: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  }, {
    timestamps: true
  });
  
  const Report = mongoose.model('Report', reportSchema);
    
module.exports = Report;