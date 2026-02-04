ALTER TABLE metric 
ADD CONSTRAINT unique_metric_reading 
UNIQUE (sensor_id, metric_type, mala_id, timestamp);

-- ALTER TABLE sensor
-- ADD CONSTRAINT unique_sensor_name
-- UNIQUE (name);

-- ALTER TABLE mala
-- ADD CONSTRAINT unique_mala_per_aina
-- UNIQUE (name, aina_id);

-- ALTER TABLE metric_type
-- ADD CONSTRAINT unique_metric_type_name
-- UNIQUE (type_name);
