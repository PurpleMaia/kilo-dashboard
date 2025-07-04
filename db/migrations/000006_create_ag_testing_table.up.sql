
CREATE TABLE ag_test_files (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  aina_id INTEGER NOT NULL,
  test_type TEXT NOT NULL, -- 'soil', 'water', 'ecoli'
  file_name TEXT NOT NULL,
  file_content BYTEA NOT NULL, -- Store the actual file bytes
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  
  FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
  FOREIGN KEY (aina_id) REFERENCES aina(id) ON DELETE CASCADE
);