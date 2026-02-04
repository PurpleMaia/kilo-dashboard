ALTER TABLE metric
DROP COLUMN category;

CREATE TYPE category as ENUM ('soil', 'water', 'stream', 'air', 'sensor');

CREATE TABLE metric_type (
    id SERIAL PRIMARY KEY,
    type_name text,
    unit text,
    category category
);

-- seed the metric type data for the test data in it
WITH distinct_types AS (
  SELECT DISTINCT metric_type AS id
  FROM metric
)
INSERT INTO metric_type(id, type_name, unit, category)
SELECT
  id,
  'unknown'    AS type_name,  -- or map to real names if you have them
  'n/a'        AS unit,
  'soil'       AS category
FROM distinct_types
ON CONFLICT (id) DO NOTHING;  -- in case some IDs already exist

SELECT setval(
  pg_get_serial_sequence('metric_type','id'),
  (SELECT MAX(id) FROM metric_type)
);

ALTER TABLE metric
ADD CONSTRAINT metric_metricType_fk FOREIGN KEY (metric_type)
REFERENCES metric_type(id)
ON DELETE CASCADE;