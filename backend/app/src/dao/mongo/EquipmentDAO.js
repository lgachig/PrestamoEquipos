const EquipmentDTO = require('../../dto/EquipmentDTO');
const { getDb } = require('../../config/mongo');

class EquipmentDAO {

  constructor() {
    this.collection = getDb().collection('equipments');
  }

  async findAll() {
    const equipments = await this.collection.find().toArray();
    return equipments.map(eq => new EquipmentDTO({
      id: eq._id,
      name: eq.name,
      type: eq.type,
      totalQuantity: eq.totalQuantity,
      availableQuantity: eq.availableQuantity
    }));
  }

}

module.exports = EquipmentDAO;