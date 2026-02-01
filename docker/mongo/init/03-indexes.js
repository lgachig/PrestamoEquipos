db = db.getSiblingDB("authdb");

db.users.createIndex({ email: 1 }, { unique: true });