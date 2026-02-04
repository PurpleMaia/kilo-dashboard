-- 1) Drop the foreign‐key on metric.metric_type
ALTER TABLE metric
  DROP CONSTRAINT IF EXISTS metric_metricType_fk;

-- 2) Drop the metric_type table (this also removes its SERIAL-backed sequence)
DROP TABLE IF EXISTS metric_type;

-- 3) Drop the enum type
DROP TYPE IF EXISTS category;