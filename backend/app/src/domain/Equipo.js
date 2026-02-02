/**
 * Clase base para equipos (patrón polimórfico).
 * La lógica de devolución se sobrescribe en Computadora y Periferico.
 */
class Equipo {
  constructor({ id, name, type, totalQuantity, availableQuantity }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.totalQuantity = totalQuantity;
    this.availableQuantity = availableQuantity;
  }

  /**
   * Lógica base de devolución. Las subclases sobrescriben este método.
   * @param {Object} context - { loanId, quantity }
   * @returns {Object} - Datos adicionales para el proceso de devolución
   */
  procesarDevolucion(context) {
    return { mensaje: 'Devolución estándar', requiereRevision: false };
  }
}

module.exports = Equipo;
