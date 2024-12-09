const User = require('./User');

const Admin = User.discriminator('Admin', new mongoose.Schema({
  permissions: [String],
  isSuper: {
    type: Boolean,
    default: false
  }
}));

module.exports = Admin;