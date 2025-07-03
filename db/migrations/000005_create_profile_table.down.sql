ALTER TABLE profile
    DROP CONSTRAINT IF EXISTS aina_profile_fk;

ALTER TABLE profile
    DROP CONSTRAINT IF EXISTS user_profile_fk;

DROP TABLE IF EXISTS profile