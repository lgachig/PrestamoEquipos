-- HISTORIAL
CREATE OR REPLACE FUNCTION user_loan_history(p_student_email VARCHAR)
RETURNS TABLE (
  loan_id INT,
  equipment_name VARCHAR,
  quantity INT,
  loan_date DATE,
  return_date DATE,
  status VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    e.name,
    l.quantity,
    l.loan_date,
    l.return_date,
    l.status
  FROM loans l
  JOIN equipments e ON e.id = l.equipment_id
  WHERE l.student_email = p_student_email
  ORDER BY l.loan_date DESC;
END;
$$;

-- ¿TIENE ACTIVO?
CREATE OR REPLACE FUNCTION has_active_loan(p_student_email VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM loans
    WHERE student_email = p_student_email
      AND status = 'ACTIVE'
  );
END;
$$;