const MongoFactory = require('../factories/MongoFactory');
const PostgresFactory = require('../factories/PostgresFactory');
const UserDTO = require('../dto/UserDTO');
const LoanDTO = require('../dto/LoanDTO');

class ReportService {
  constructor() {
    const mongoFactory = new MongoFactory();
    const postgresFactory = new PostgresFactory();

    this.userDAO = mongoFactory.createUserDAO();
    this.loanDAO = postgresFactory.createLoanDAO();
  }

  async getUserFullReport(email) {
    const user = await this.userDAO.findByEmail(email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const loans = await this.loanDAO.getUserLoanHistory(email);

    return {
      user: new UserDTO({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt
      }),
      loans: loans.map(l => new LoanDTO({
        loanId: l.loan_id,
        email,
        equipment: l.equipment,
        quantity: l.quantity,
        loanDate: l.loan_date,
        returnDate: l.return_date,
        status: l.status
      }))
    };
  }
}

module.exports = ReportService;