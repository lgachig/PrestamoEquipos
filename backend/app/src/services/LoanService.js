const PostgresFactory = require('../factories/PostgresFactory');
const LoanDTO = require('../dto/LoanDTO');
const { createEquipo } = require('../domain/EquipoFactory');

/**
 * Servicio de préstamos y equipos.
 * Incluye sobrecarga de realizarPrestamo (por IDs o por objetos) y polimorfismo en devolución.
 */
class LoanService {
  constructor() {
    const factory = new PostgresFactory();
    this.loanDAO = factory.createLoanDAO();
    this.equipmentDAO = factory.createEquipmentDAO();
    this.THRESHOLD = 50; 
  }

    /**
   * Realiza un préstamo. Sobrecarga:
   * - realizarPrestamo(idEquipo, idUsuario, quantity?) con quantity por defecto 1
   * - realizarPrestamo(objetoEquipo, objetoUsuario, quantity?) con quantity por defecto 1
   * @param {number|Object} idEquipoOrObj - ID del equipo o objeto { id, name, type, ... }
   * @param {string|Object} idUsuarioOrObj - Email del usuario o objeto { email, name, ... }
   * @param {number} [quantity=1]
   */
  async realizarPrestamo(idEquipoOrObj, idUsuarioOrObj, quantity = 1) {
    let email;
    let equipmentId;
    let qty = quantity;

    if (typeof idEquipoOrObj === 'number' && (typeof idUsuarioOrObj === 'string' || typeof idUsuarioOrObj === 'number')) {
      equipmentId = idEquipoOrObj;
      email = String(idUsuarioOrObj);
    } else if (typeof idEquipoOrObj === 'object' && idEquipoOrObj !== null && typeof idUsuarioOrObj === 'object' && idUsuarioOrObj !== null) {
      const objEquipo = idEquipoOrObj;
      const objUsuario = idUsuarioOrObj;
      equipmentId = objEquipo.id;
      email = objUsuario.email || objUsuario.id;
      if (quantity === 1 && typeof objEquipo.quantity === 'number') qty = objEquipo.quantity;
    } else {
      throw new Error('Formato de préstamo no válido');
    }

    return this.loanEquipment(email, equipmentId, qty);
  }

  async loanEquipment(email, equipmentId, quantity) {
    const QUEUE_KEY = 'cola_prestamos_pendientes';
    const COUNT_KEY = 'available_request_count';
    const instanceId = os.hostname(); // Evidencia de qué instancia del clúster responde

    // 1. Verificar saturación causada por el tráfico del frontend
    const count = await redisClient.get(COUNT_KEY);
    const isSaturated = parseInt(count || '0', 10) > this.THRESHOLD;

    if (isSaturated) {
      // --- LÓGICA DE SATURACIÓN: PERSISTENCIA DIFERIDA EN REDIS ---
      const loanRequest = JSON.stringify({ 
        email, 
        equipmentId, 
        quantity, 
        timestamp: new Date(),
        node: instanceId 
      });
      
      await redisClient.lPush(QUEUE_KEY, loanRequest);
      
      console.log(`⚠️ INSTANCIA ${instanceId} SATURADA: Préstamo de ${email} encolado.`);
      return { 
        status: 'QUEUED', 
        message: 'Sistema saturado. Su solicitud será procesada automáticamente al bajar la carga.',
        instancia: instanceId,
        fuente: 'Caché Redis (Saturación)' 
      };
    }

    // 2. Proceso normal en Postgres (Sin saturación)
    const hasLoan = await this.loanDAO.hasActiveLoan(email);
    if (hasLoan) {
      throw new Error('El usuario ya tiene un préstamo activo');
    }
    
    await this.loanDAO.loanEquipment(email, equipmentId, quantity);
    
    return { 
      status: 'SUCCESS', 
      message: 'Préstamo realizado correctamente',
      instancia: instanceId,
      fuente: 'Base de Datos (Normal)'
    };
  }

  /**
   * Devuelve un equipo. La lógica varía según tipo (computadora vs periférico) por polimorfismo.
   * @param {number} loanId
   * @param {string} email
   * @returns {Promise<{message: string, devolucion?: Object}>}
   */
  async returnEquipment(loanId, email) {
    const loanData = await this.loanDAO.getActiveLoanById(loanId, email);
    if (!loanData) {
      throw new Error('Préstamo no encontrado o no activo');
    }
    const equipo = createEquipo({
      id: loanData.equipment_id,
      name: loanData.equipment_name,
      type: loanData.type_name,
      totalQuantity: 0,
      availableQuantity: 0
    });
    const devolucion = equipo.procesarDevolucion({ loanId, quantity: loanData.quantity });
    await this.loanDAO.returnEquipment(loanId, email);
    return { message: 'Equipo devuelto correctamente', devolucion };
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

  /** Obtiene un equipo por ID (Read del CRUD). */
  async getEquipmentById(id) {
    return await this.equipmentDAO.findById(id);
  }

  async addEquipment(name, type, quantity) {
    return await this.equipmentDAO.addEquipment(name, type, quantity);
  }

  /** Actualiza un equipo por ID (Update del CRUD). */
  async updateEquipment(id, data) {
    return await this.equipmentDAO.updateEquipment(id, data);
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