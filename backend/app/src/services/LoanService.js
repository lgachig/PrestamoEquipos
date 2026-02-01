const PostgresFactory = require('../factories/PostgresFactory');
const LoanDTO = require('../dto/LoanDTO');

class LoanService {
  constructor() {
    const factory = new PostgresFactory();
    this.loanDAO = factory.createLoanDAO();
    this.equipmentDAO = factory.createEquipmentDAO();
  }

  async loanEquipment(email, equipmentId, quantity) {
    const hasLoan = await this.loanDAO.hasActiveLoan(email);

    if (hasLoan) {
      throw new Error('El usuario ya tiene un préstamo activo');
    }

    await this.loanDAO.loanEquipment(email, equipmentId, quantity);
  }

  async returnEquipment(loanId, email) {
    return await this.loanDAO.returnEquipment(loanId, email);
  }

  async getUserLoanHistory(email) {
    const rows = await this.loanDAO.getUserLoanHistory(email);

    return rows.map(row => new LoanDTO({
      loanId: row.loan_id,
      email,
      equipment: row.equipment,
      quantity: row.quantity,
      loanDate: row.loan_date,
      returnDate: row.return_date,
      status: row.status
    }));
  }
  async getActiveLoans() {
    const rows = await this.loanDAO.getActiveLoans(); 
    return rows.map(row => new LoanDTO({
      loanId: row.loan_id,
      email: row.email,
      equipment: row.equipment,
      quantity: row.quantity,
      loanDate: row.loan_date,
      returnDate: row.return_date,
      status: row.status
    }));
  }

  async getAllLoans() {
    const rows = await this.loanDAO.getAllLoans(); 
    return rows.map(row => new LoanDTO({
      loanId: row.loan_id,
      email: row.email,
      equipment: row.equipment,
      quantity: row.quantity,
      loanDate: row.loan_date,
      returnDate: row.return_date,
      status: row.status
    }));
  }

  async getAllInventory() {
    return await this.equipmentDAO.getAllInventory();
  }

  async addEquipment(name, type, quantity) {
    return await this.equipmentDAO.addEquipment(name, type, quantity);
  }

  async deleteEquipment(equipmentId) {
    // 1. Verificar si hay préstamos activos para este equipo en Postgres
    const hasActiveLoans = await this.loanDAO.hasActiveLoansByEquipment(equipmentId);
    
    if (hasActiveLoans) {
      throw new Error('No se puede eliminar: el equipo tiene préstamos pendientes de devolución');
    }
  
    // 2. Si está limpio, proceder a borrar
    return await this.equipmentDAO.deleteEquipment(equipmentId);
  }
  
}

module.exports = LoanService;