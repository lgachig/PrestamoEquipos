const Equipo = require('./Equipo');

/**
 * Equipo tipo computadora (laptop, PC).
 * En devolución se aplica lógica específica: revisión de checklist.
 */
class Computadora extends Equipo {
  procesarDevolucion(context) {
    return {
      mensaje: 'Devolución de computadora: se registra revisión de checklist (estado, accesorios).',
      requiereRevision: true,
      tipo: 'COMPUTADORA'
    };
  }
}

module.exports = Computadora;
