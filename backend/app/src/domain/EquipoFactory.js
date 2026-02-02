const Computadora = require('./Computadora');
const Periferico = require('./Periferico');

/** Tipos considerados computadora (resto = periférico). */
const TIPOS_COMPUTADORA = ['Laptop', 'laptop', 'PC', 'pc', 'LAPTOP'];

/**
 * Crea una instancia polimórfica de Equipo según el tipo.
 * @param {Object} raw - { id, name, type, totalQuantity, availableQuantity }
 * @returns {Equipo} - Computadora o Periferico
 */
function createEquipo(raw) {
  const typeName = (raw.type || '').toString().trim();
  if (TIPOS_COMPUTADORA.includes(typeName)) {
    return new Computadora(raw);
  }
  return new Periferico(raw);
}

module.exports = { createEquipo, Computadora, Periferico };
