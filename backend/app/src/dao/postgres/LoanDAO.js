const pool = require('../../config/postgres');

class LoanDAO {

  async getUserLoanHistory(email) {
    const result = await pool.query(
      'SELECT * FROM user_loan_history($1)',
      [email]
    );
    return result.rows.map(row => ({
      loan_id: row.loan_id,
      equipment: row.equipment_name,
      quantity: row.quantity,
      loan_date: row.loan_date,
      return_date: row.return_date,
      status: row.status
    }));
  }

  async hasActiveLoansByEquipment(equipmentId) {
    const query = "SELECT COUNT(*) FROM loans WHERE equipment_id = $1 AND status = 'ACTIVE'";
    const res = await pool.query(query, [equipmentId]);
    return parseInt(res.rows[0].count) > 0;
  }

  async getAllLoans() {
    const result = await pool.query(
      `SELECT l.id as loan_id, l.student_email as email, e.name as equipment_name, 
              l.quantity, l.loan_date, l.return_date, l.status 
       FROM loans l 
       JOIN equipments e ON l.equipment_id = e.id 
       ORDER BY l.loan_date DESC`
    );
    return result.rows.map(row => ({
      loan_id: row.loan_id,
      email: row.email,
      equipment: row.equipment_name,
      quantity: row.quantity,
      loan_date: row.loan_date,
      return_date: row.return_date,
      status: row.status
    }));
  }

  async getActiveLoans() {
    const result = await pool.query(
      `SELECT l.id as loan_id, l.student_email as email, e.name as equipment_name, 
              l.quantity, l.loan_date, l.status 
       FROM loans l 
       JOIN equipments e ON l.equipment_id = e.id 
       WHERE l.status = 'ACTIVE'
       ORDER BY l.loan_date ASC`
    );
    return result.rows.map(row => ({
      loan_id: row.loan_id,
      email: row.email,
      equipment: row.equipment_name,
      quantity: row.quantity,
      loan_date: row.loan_date,
      status: row.status
    }));
  }

  async hasActiveLoan(email) {
    const result = await pool.query(
      'SELECT has_active_loan($1)',
      [email]
    );
    return result.rows[0].has_active_loan;
  }

  async loanEquipment(email, equipmentId, quantity) {
    await pool.query(
      'CALL loan_equipment($1, $2, $3)',
      [email, equipmentId, quantity]
    );
  }

  async returnEquipment(loanId, email) {
    await pool.query(
      'CALL return_equipment($1::integer, $2::varchar)', 
      [loanId, email]
    );
  }
}

module.exports = LoanDAO;