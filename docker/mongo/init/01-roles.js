db = db.getSiblingDB("authdb");

db.roles.insertMany([
  { name: "ADMIN" },
  { name: "STUDENT" }
]);