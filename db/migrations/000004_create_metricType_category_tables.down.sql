-- 1) Drop the foreign‐key on metric.metric_type
ALTER TABLE metric
  DROP CONSTRAINT IF EXISTS metric_metricType_fk;

-- 2) Drop the metric_type table (this also removes its SERIAL-backed sequence)
DROP TABLE IF EXISTS metric_type;

-- 3) Drop the enum type
DROP TYPE IF EXISTS category;

-- 4) Re-add the old category column to metric
--    (adjust the data type or nullability to match your pre-migration schema)
ALTER TABLE metric
  ADD COLUMN category text;
