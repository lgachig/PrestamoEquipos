const bcrypt = require('bcrypt');
const MongoFactory = require('../factories/MongoFactory');
const UserDTO = require('../dto/UserDTO');

/**
 * Servicio de autenticación: login y registro.
 * Las contraseñas se almacenan hasheadas con bcrypt.
 */
class AuthService {
  constructor() {
    const factory = new MongoFactory();
    this.userDAO = factory.createUserDAO();
  }

  /**
   * Inicia sesión comparando la contraseña con el hash almacenado.
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<UserDTO>}
   */
  async login(email, password) {
    const userDoc = await this.userDAO.findByEmail(email);

    if (!userDoc || !userDoc.active) {
      throw new Error('Usuario no válido');
    }

    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
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

  /**
   * Registra un usuario hasheando la contraseña con bcrypt.
   * @param {Object} data - { name, email, password, role }
   * @returns {Promise<UserDTO>}
   */
  async register(data) {
    const { name, email, password, role = 'STUDENT' } = data;
    const existing = await this.userDAO.findByEmail(email);
    if (existing) {
      throw new Error('El email ya está registrado');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const created = await this.userDAO.create({
      name,
      email,
      password: hashedPassword,
      role,
      active: true
    });
    const user = created.toObject ? created.toObject() : created;
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