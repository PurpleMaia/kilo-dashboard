ALTER TABLE metric 
DROP COLUMN mala_id;

CREATE TABLE sensor_mala (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER REFERENCES sensor(id) ON DELETE CASCADE,
  mala_id INTEGER REFERENCES mala(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sensor_id, mala_id) -- Prevent duplicate relationships
);