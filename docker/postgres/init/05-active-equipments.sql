-- Delete lógico: columna active para no borrar físicamente
ALTER TABLE equipments ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
UPDATE equipments SET active = true WHERE active IS NULL;
