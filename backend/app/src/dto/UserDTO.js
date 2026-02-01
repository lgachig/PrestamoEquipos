class UserDTO {
  constructor({ id, name, email, role, active, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;  
    this.active = active;
    this.createdAt = createdAt;
  }
}

module.exports = UserDTO;