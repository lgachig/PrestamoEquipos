const DatabaseFactory = require('./DatabaseFactory');
const EquipmentDAO = require('../dao/postgres/EquipmentDAO');
const LoanDAO = require('../dao/postgres/LoanDAO');

class PostgresFactory extends DatabaseFactory {

  createEquipmentDAO() {
    return new EquipmentDAO();
  }

  createLoanDAO() {
    return new LoanDAO();
  }

  createUserDAO() {
    throw new Error('Postgres no maneja usuarios');
  }
}

module.exports = PostgresFactory;