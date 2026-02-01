-- Tipos de equipos
CREATE TABLE IF NOT EXISTS equipment_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE -- AGREGADO UNIQUE
);

-- Equipos
CREATE TABLE IF NOT EXISTS equipments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- AGREGADO UNIQUE
  type_id INT REFERENCES equipment_types(id),
  total_quantity INT NOT NULL,
  available_quantity INT NOT NULL
);

-- Préstamos
CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY,
  student_email VARCHAR(100) NOT NULL,
  equipment_id INT REFERENCES equipments(id),
  quantity INT NOT NULL,
  loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  return_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);