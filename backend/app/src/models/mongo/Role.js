const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['ADMIN', 'STUDENT'],
    unique: true
  },
  description: String
});

module.exports = mongoose.model('Role', RoleSchema);