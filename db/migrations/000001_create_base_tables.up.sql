CREATE TABLE aina (
  id SERIAL PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP
);

CREATE TABLE mala (
  id SERIAL PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP,
  aina_id INT
);

ALTER TABLE mala
ADD CONSTRAINT mala_ainaid_fk FOREIGN KEY (aina_id)
REFERENCES aina(id)
ON DELETE CASCADE;

CREATE TABLE sensor (
  id SERIAL PRIMARY KEY,
  name TEXT,
  serial TEXT,
  mala_id INT
);

ALTER TABLE sensor
ADD CONSTRAINT sensor_malaid_fk FOREIGN KEY (mala_id)
REFERENCES mala(id);

CREATE TABLE metric (
  id SERIAL PRIMARY KEY,
  value FLOAT,
  timestamp TIMESTAMP,
  metric_type INT,
  category INT,
  sensor_id INT
);

ALTER TABLE metric
ADD CONSTRAINT metric_sensorid_fk FOREIGN KEY (sensor_id)
REFERENCES sensor(id);
