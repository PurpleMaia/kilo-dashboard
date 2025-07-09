-- 1. Re-add the `mala_id` column back onto sensor (nullable, with the same FK)
ALTER TABLE sensor
ADD COLUMN mala_id INTEGER REFERENCES mala(id) ON DELETE CASCADE;

-- 2. Drop the join table
DROP TABLE IF EXISTS sensor_mala;
