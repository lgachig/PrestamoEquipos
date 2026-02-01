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

  async deleteEquipment(id) {
    const query = 'DELETE FROM equipments WHERE id = $1';
    return await pool.query(query, [id]);
  }

  async getAllInventory() {
    const query = `
      SELECT e.id, e.name, t.name as type, e.total_quantity, e.available_quantity
      FROM equipments e
      JOIN equipment_types t ON e.type_id = t.id
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type, // Aquí devolvemos el nombre del tipo como "type" para el frontend
      totalQuantity: row.total_quantity,
      availableQuantity: row.available_quantity
    }));
  }
}

module.exports = EquipmentDAO;