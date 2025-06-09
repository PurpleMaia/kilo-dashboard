-- Delete metrics for each sensor
DELETE FROM metric WHERE sensor_id IN (1, 2, 3, 4, 5);

-- Delete sensors
DELETE FROM sensor WHERE serial IN ('TDS-001', 'WL-001', 'VOC-001', 'TEMP-001', 'PH-001');

-- Delete malas
DELETE FROM mala WHERE name IN ('Top Bed', 'Stream', 'Māla') AND aina_id = 1;

-- Delete aina
DELETE FROM aina WHERE name = 'Puʻuhonua O Waimanālo';