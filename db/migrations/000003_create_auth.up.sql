
CREATE TABLE public.user (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NULL,
    email TEXT NULL,
    email_verified BOOLEAN NULL default false,
    created_at TIMESTAMPTZ NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE public.usersession (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id TEXT NOT NULL
);

CREATE INDEX usersession_userid_idx ON public.usersession USING btree (user_id);

ALTER TABLE public.usersession ADD CONSTRAINT fk_usersession_user FOREIGN KEY (user_id) REFERENCES public.user (id) ON UPDATE CASCADE ON DELETE CASCADE;


CREATE TABLE public.user_oauth (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL, -- 'github' | 'google' | etc...
    provider_user_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL default CURRENT_TIMESTAMP
);

CREATE INDEX useroauth_provider_idx ON public.user_oauth USING btree (provider_id, provider_user_id);
CREATE INDEX useroauth_user_idx ON public.user_oauth USING btree (user_id);

ALTER TABLE public.user_oauth ADD CONSTRAINT fk_useroauth_user FOREIGN KEY (user_id) REFERENCES public.user (id) ON UPDATE CASCADE ON DELETE CASCADE;


-- useraccesstoken 
CREATE SEQUENCE public.useraccesstoken_id_seq
    AS integer
    START WITH 101
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.useraccesstoken (
    id integer PRIMARY KEY DEFAULT nextval('public.useraccesstoken_id_seq'::regclass),
    token_type text NOT NULL, -- 'verify-email' | 'recover-username' | 'reset-password' | 'magic-link'
    code text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour',
    user_id TEXT NOT NULL REFERENCES public.user(id)
);

CREATE INDEX useraccesstoken_userid_idx ON public.useraccesstoken USING btree (user_id);

ALTER TABLE public.useraccesstoken ADD CONSTRAINT fk_useraccesstoken_user FOREIGN KEY (user_id) REFERENCES public.user (id) ON UPDATE CASCADE ON DELETE CASCADE;
