db = db.getSiblingDB("authdb");

db.users.insertMany([
  { name: "Luis", email: "luis@mail.com", password: "123", role: "ADMIN", active: true, createdAt: new Date() },
  { name: "Ana", email: "ana@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Carlos", email: "carlos@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Maria", email: "maria@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Jose", email: "jose@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Pedro", email: "pedro@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Lucia", email: "lucia@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Sofia", email: "sofia@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Diego", email: "diego@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Elena", email: "elena@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Jorge", email: "jorge@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Paula", email: "paula@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Raul", email: "raul@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Carmen", email: "carmen@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() },
  { name: "Miguel", email: "miguel@mail.com", password: "123", role: "STUDENT", active: true, createdAt: new Date() }
]);