const mongoose = require('mongoose'); // Add this line
const User = require('./User'); // Add this line

const Management = User.discriminator('Management', new mongoose.Schema({
    employeeId: {
      type: String,
      required: true,
      unique: true
    },
    department: String,
    joiningDate: Date
  }));

module.exports = Management;