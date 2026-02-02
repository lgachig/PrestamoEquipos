const pool = require('../../config/postgres');

/**
 * DAO de préstamos (PostgreSQL). Encapsula todas las queries SQL de préstamos.
 */
class LoanDAO {

  /** Historial de préstamos de un usuario (función user_loan_history). */
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

  /** Indica si el equipo tiene préstamos activos. */
  async hasActiveLoansByEquipment(equipmentId) {
    const query = "SELECT COUNT(*) FROM loans WHERE equipment_id = $1 AND status = 'ACTIVE'";
    const res = await pool.query(query, [equipmentId]);
    return parseInt(res.rows[0].count) > 0;
  }

  /** Lista todos los préstamos. */
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

  /** Lista préstamos activos. */
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

  /** Indica si el usuario tiene un préstamo activo (función has_active_loan). */
  async hasActiveLoan(email) {
    const result = await pool.query(
      'SELECT has_active_loan($1)',
      [email]
    );
    return result.rows[0].has_active_loan;
  }

  /** Registra un préstamo (CALL loan_equipment). */
  async loanEquipment(email, equipmentId, quantity) {
    await pool.query(
      'CALL loan_equipment($1, $2, $3)',
      [email, equipmentId, quantity]
    );
  }

  /** Registra la devolución (CALL return_equipment). */
  async returnEquipment(loanId, email) {
    await pool.query(
      'CALL return_equipment($1::integer, $2::varchar)',
      [loanId, email]
    );
  }

  /**
   * Obtiene un préstamo activo por ID (para aplicar lógica polimórfica de devolución).
   * @param {number} loanId
   * @param {string} email
   * @returns {Promise<{equipment_id: number, quantity: number, equipment_name: string, type_name: string}|null>}
   */
  async getActiveLoanById(loanId, email) {
    const result = await pool.query(
      `SELECT l.equipment_id, l.quantity, e.name AS equipment_name, t.name AS type_name
       FROM loans l
       JOIN equipments e ON e.id = l.equipment_id
       JOIN equipment_types t ON t.id = e.type_id
       WHERE l.id = $1 AND l.student_email = $2 AND l.status = 'ACTIVE'`,
      [loanId, email]
    );
    if (result.rows.length === 0) return null;
    const r = result.rows[0];
    return {
      equipment_id: r.equipment_id,
      quantity: r.quantity,
      equipment_name: r.equipment_name,
      type_name: r.type_name
    };
  }
}

module.exports = LoanDAO;