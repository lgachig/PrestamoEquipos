const User = require('../../models/mongo/User');

class UserDAO {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userDTO) {
    return await User.create(userDTO);
  }

  async findAll() {
    return await User.find();
  }
}

module.exports = UserDAO;