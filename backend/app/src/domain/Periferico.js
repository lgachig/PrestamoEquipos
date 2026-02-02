const Equipo = require('./Equipo');

/**
 * Equipo tipo periférico (proyector, cámara, etc.).
 * En devolución se aplica lógica simplificada.
 */
class Periferico extends Equipo {
  procesarDevolucion(context) {
    return {
      mensaje: 'Devolución de periférico: registro estándar sin checklist.',
      requiereRevision: false,
      tipo: 'PERIFERICO'
    };
  }
}

module.exports = Periferico;
