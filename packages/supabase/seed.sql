WITH inserted_users AS (
    INSERT INTO
        auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
    VALUES
        (
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            'test@test.com',
            crypt('test123', gen_salt('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        ) RETURNING id,
        email
),
inserted_identities AS (
    INSERT INTO
        auth.identities (
            id,
            user_id,
            provider_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        )
    SELECT
        uuid_generate_v4(),
        iu.id,
        iu.id,
        format(
            '{"sub":"%s","email":"%s"}',
            iu.id :: text,
            iu.email
        ) :: jsonb,
        'email',
        current_timestamp,
        current_timestamp,
        current_timestamp
    FROM
        inserted_users iu RETURNING user_id
)
SELECT
    *
FROM
    inserted_identities;

ALTER TABLE
    storage.objects DISABLE ROW LEVEL SECURITY;

INSERT INTO
    storage.buckets (id, name, public, avif_autodetection)
VALUES
    ('storage', 'storage', TRUE, FALSE);