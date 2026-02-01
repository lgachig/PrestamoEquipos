-- PRESTAR
CREATE OR REPLACE PROCEDURE loan_equipment(
  p_student_email VARCHAR,
  p_equipment_id INT,
  p_quantity INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT available_quantity FROM equipments WHERE id = p_equipment_id) < p_quantity THEN
    RAISE EXCEPTION 'No hay equipos disponibles';
  END IF;

  INSERT INTO loans (student_email, equipment_id, quantity, loan_date, status)
  VALUES (p_student_email, p_equipment_id, p_quantity, CURRENT_DATE, 'ACTIVE');

  UPDATE equipments
  SET available_quantity = available_quantity - p_quantity
  WHERE id = p_equipment_id;
END;
$$;

-- DEVOLVER
CREATE OR REPLACE PROCEDURE return_equipment(
  p_loan_id INT,
  p_student_email VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_equipment_id INT;
  v_quantity INT;
BEGIN
  SELECT equipment_id, quantity
  INTO v_equipment_id, v_quantity
  FROM loans
  WHERE id = p_loan_id
    AND student_email = p_student_email
    AND status = 'ACTIVE';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Préstamo no válido';
  END IF;

  UPDATE loans
  SET status = 'RETURNED',
      return_date = CURRENT_DATE
  WHERE id = p_loan_id;

  UPDATE equipments
  SET available_quantity = available_quantity + v_quantity
  WHERE id = v_equipment_id;
END;
$$;
--listar 
CREATE OR REPLACE FUNCTION get_all_equipments()
RETURNS TABLE (
  id INT,
  name VARCHAR,
  type VARCHAR,
  total_quantity INT,
  available_quantity INT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT e.id,
         e.name,
         t.name,
         e.total_quantity,
         e.available_quantity
  FROM equipments e
  JOIN equipment_types t ON e.type_id = t.id;
END;
$$ LANGUAGE plpgsql;

--Obtener un equipo por ID
CREATE OR REPLACE FUNCTION get_equipment_by_id(p_equipment_id INT)
RETURNS TABLE (
  id INT,
  name VARCHAR,
  type VARCHAR,
  total_quantity INT,
  available_quantity INT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT e.id,
         e.name,
         t.name,
         e.total_quantity,
         e.available_quantity
  FROM equipments e
  JOIN equipment_types t ON e.type_id = t.id
  WHERE e.id = p_equipment_id;
END;
$$ LANGUAGE plpgsql;
