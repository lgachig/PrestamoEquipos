const pool = require('../../config/postgres');
const EquipmentDTO = require('../../dto/EquipmentDTO');

class EquipmentDAO {

  async findAll() {
    const result = await pool.query('SELECT * FROM get_all_equipments()');

    return result.rows.map(row => new EquipmentDTO({
      id: row.id,
      name: row.name,
      type: row.type,
      totalQuantity: row.total_quantity,
      availableQuantity: row.available_quantity
    }));
  }

  /** Obtiene un equipo por ID. */
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM get_equipment_by_id($1)',
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new EquipmentDTO({
      id: row.id,
      name: row.name,
      type: row.type,
      totalQuantity: row.total_quantity,
      availableQuantity: row.available_quantity
    });
  }

  /** Crea o incrementa stock de un equipo (Create del CRUD). */
  async addEquipment(name, typeName, quantity) {
    try {
      // Primero aseguramos que el tipo existe y obtenemos su ID
      const typeRes = await pool.query(
        `INSERT INTO equipment_types (name) 
         VALUES ($1) 
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
         RETURNING id`,
        [typeName]
      );
      const typeId = typeRes.rows[0].id;

      // Insertamos o actualizamos el equipo
      const query = `
        INSERT INTO equipments (name, type_id, total_quantity, available_quantity)
        VALUES ($1, $2, $3, $3)
        ON CONFLICT (name) 
        DO UPDATE SET 
          total_quantity = equipments.total_quantity + EXCLUDED.total_quantity,
          available_quantity = equipments.available_quantity + EXCLUDED.total_quantity;
      `;
      return await pool.query(query, [name, typeId, quantity]);
    } catch (error) {
      console.error("Error al insertar equipo:", error);
      throw error;
    }
  }

  /** Delete lógico: marca el equipo como inactivo en lugar de borrarlo. */
  async deleteEquipment(id) {
    const query = 'UPDATE equipments SET active = false WHERE id = $1';
    return await pool.query(query, [id]);
  }

  async getAllInventory() {
    const query = `
      SELECT e.id, e.name, t.name as type, e.total_quantity, e.available_quantity
      FROM equipments e
      JOIN equipment_types t ON e.type_id = t.id
      WHERE (e.active IS NULL OR e.active = true)
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      totalQuantity: row.total_quantity,
      availableQuantity: row.available_quantity
    }));
  }

  /**
   * Actualiza un equipo por ID (nombre, tipo, cantidad total).
   * @param {number} id
   * @param {Object} data - { name?, type?, totalQuantity? }
   */
  async updateEquipment(id, data) {
    const { name, type: typeName, totalQuantity } = data;
    const updates = [];
    const values = [];
    let pos = 1;
    if (name !== undefined) {
      updates.push(`name = $${pos++}`);
      values.push(name);
    }
    if (typeName !== undefined) {
      const typeRes = await pool.query(
        `INSERT INTO equipment_types (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
        [typeName]
      );
      updates.push(`type_id = $${pos++}`);
      values.push(typeRes.rows[0].id);
    }
    if (totalQuantity !== undefined) {
      updates.push(`total_quantity = $${pos++}`);
      values.push(totalQuantity);
    }
    if (updates.length === 0) return { rowCount: 0 };
    values.push(id);
    const query = `UPDATE equipments SET ${updates.join(', ')} WHERE id = $${pos}`;
    const result = await pool.query(query, values);
    return result;
  }
}

module.exports = EquipmentDAO;