const MongoFactory = require('../factories/MongoFactory');
const UserDTO = require('../dto/UserDTO');

class AuthService {
  constructor() {
    const factory = new MongoFactory();
    this.userDAO = factory.createUserDAO();
  }

  async login(email, password) {
    const userDoc = await this.userDAO.findByEmail(email);
    
    if (!userDoc || !userDoc.active) {
      throw new Error('Usuario no válido');
    }
  
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  
    if (user.password !== password) {
      throw new Error('Credenciales incorrectas');
    }
  
    return new UserDTO({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, 
      active: user.active,
      createdAt: user.createdAt
    });
  }
}

module.exports = AuthService;