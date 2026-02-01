class Loan {
    constructor(id, userEmail, equipmentId, quantity, status) {
      this.id = id;
      this.userEmail = userEmail;
      this.equipmentId = equipmentId;
      this.quantity = quantity;
      this.status = status;
    }
  }
  
  module.exports = Loan;