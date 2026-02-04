
CREATE TABLE profile (
    aina_id int4,
    role text,
    user_id text
);

ALTER TABLE profile
ADD CONSTRAINT aina_profile_fk FOREIGN KEY (aina_id)
REFERENCES aina(id);

ALTER TABLE profile
ADD CONSTRAINT user_profile_fk FOREIGN KEY (user_id)
REFERENCES "user"(id);