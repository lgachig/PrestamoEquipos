const DatabaseFactory = require('./DatabaseFactory');
const UserDAO = require('../dao/mongo/UserDAO');

class MongoFactory extends DatabaseFactory {
  createUserDAO() {
    return new UserDAO();
  }

  createLoanDAO() {
    throw new Error('Mongo no maneja préstamos');
  }
}

module.exports = MongoFactory;