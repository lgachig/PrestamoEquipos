class LoanDTO {
  constructor({
    loanId,
    email,
    equipment,
    quantity,
    loanDate,
    returnDate,
    status
  }) {
    this.loanId = loanId;
    this.email = email;
    this.equipment = equipment;
    this.quantity = quantity;
    this.loanDate = loanDate;
    this.returnDate = returnDate;
    this.status = status;
  }
}

module.exports = LoanDTO;