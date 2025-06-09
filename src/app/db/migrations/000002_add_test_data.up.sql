INSERT INTO aina (name, created_at)
VALUES ('Puʻuhonua O Waimanālo', NOW());

INSERT INTO mala (name, created_at, aina_id)
VALUES 
  ('Top Bed', NOW(), 1),
  ('Stream', NOW(), 1),
  ('Māla', NOW(), 1);

INSERT INTO sensor (name, serial, mala_id)
VALUES 
  ('TDS', 'TDS-001', 1),
  ('Water Level', 'WL-001', 1),
  ('VOC', 'VOC-001', 2),
  ('Temperature', 'TEMP-001', 3),
  ('pH', 'PH-001', 3);

-- TDS Sensor (sensor_id = 1)
INSERT INTO metric (value, timestamp, metric_type, category, sensor_id) VALUES
  (500.2, NOW() - INTERVAL '3 days', 1, 1, 1),
  (495.8, NOW() - INTERVAL '2 days', 1, 1, 1),
  (510.6, NOW() - INTERVAL '1 day', 1, 1, 1);

-- Water Level Sensor (sensor_id = 2)
INSERT INTO metric (value, timestamp, metric_type, category, sensor_id) VALUES
  (3.1, NOW() - INTERVAL '3 days', 2, 1, 2),
  (3.3, NOW() - INTERVAL '2 days', 2, 1, 2),
  (3.0, NOW() - INTERVAL '1 day', 2, 1, 2);

-- VOC Sensor (sensor_id = 3)
INSERT INTO metric (value, timestamp, metric_type, category, sensor_id) VALUES
  (0.02, NOW() - INTERVAL '3 days', 3, 2, 3),
  (0.03, NOW() - INTERVAL '2 days', 3, 2, 3),
  (0.01, NOW() - INTERVAL '1 day', 3, 2, 3);

-- Temperature Sensor (sensor_id = 4)
INSERT INTO metric (value, timestamp, metric_type, category, sensor_id) VALUES
  (24.5, NOW() - INTERVAL '3 days', 4, 2, 4),
  (25.1, NOW() - INTERVAL '2 days', 4, 2, 4),
  (24.9, NOW() - INTERVAL '1 day', 4, 2, 4);

-- pH Sensor (sensor_id = 5)
INSERT INTO metric (value, timestamp, metric_type, category, sensor_id) VALUES
  (6.8, NOW() - INTERVAL '3 days', 5, 3, 5),
  (6.9, NOW() - INTERVAL '2 days', 5, 3, 5),
  (7.0, NOW() - INTERVAL '1 day', 5, 3, 5);