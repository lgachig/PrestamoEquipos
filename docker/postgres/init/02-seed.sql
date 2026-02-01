INSERT INTO equipment_types (name) VALUES
('Laptop'),
('Proyector'),
('Cámara');

INSERT INTO equipments (name, type_id, total_quantity, available_quantity) VALUES
('Laptop Dell Latitude', 1, 30, 20),
('Proyector Epson X200', 2, 10, 7),
('Cámara Canon EOS', 3, 5, 3);


INSERT INTO loans (student_email, equipment_id, quantity, loan_date, status) VALUES
('luis@mail.com', 1, 1, '2026-01-05', 'ACTIVE'),
('ana@mail.com', 1, 1, '2026-01-06', 'ACTIVE'),
('carlos@mail.com', 1, 1, '2026-01-07', 'ACTIVE'),
('maria@mail.com', 1, 1, '2026-01-08', 'ACTIVE'),
('jose@mail.com', 1, 1, '2026-01-08', 'ACTIVE'),
('pedro@mail.com', 1, 1, '2026-01-09', 'ACTIVE'),
('lucia@mail.com', 1, 1, '2026-01-09', 'ACTIVE'),
('sofia@mail.com', 1, 1, '2026-01-10', 'ACTIVE'),
('diego@mail.com', 1, 1, '2026-01-10', 'ACTIVE'),
('elena@mail.com', 1, 1, '2026-01-11', 'ACTIVE'),

('jorge@mail.com', 2, 1, '2026-01-05', 'ACTIVE'),
('paula@mail.com', 2, 1, '2026-01-06', 'ACTIVE'),
('raul@mail.com', 2, 1, '2026-01-07', 'ACTIVE'),

('carmen@mail.com', 3, 1, '2026-01-06', 'ACTIVE'),
('miguel@mail.com', 3, 1, '2026-01-07', 'ACTIVE');


INSERT INTO loans (student_email, equipment_id, quantity, loan_date, return_date, status) VALUES
('ana@mail.com', 2, 1, '2025-12-01', '2025-12-05', 'RETURNED'),
('carlos@mail.com', 1, 1, '2025-12-03', '2025-12-08', 'RETURNED'),
('lucia@mail.com', 3, 1, '2025-11-20', '2025-11-25', 'RETURNED'),
('jorge@mail.com', 1, 1, '2025-12-02', '2025-12-06', 'RETURNED'),
('paula@mail.com', 2, 1, '2025-12-04', '2025-12-09', 'RETURNED');