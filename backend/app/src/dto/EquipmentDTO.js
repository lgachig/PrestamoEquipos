class EquipmentDTO {
  constructor({ id, name, type, totalQuantity, availableQuantity }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.totalQuantity = totalQuantity;
    this.availableQuantity = availableQuantity;
  }
}

module.exports = EquipmentDTO;