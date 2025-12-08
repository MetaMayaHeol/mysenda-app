-- Seed Data for RutaLink
-- Creates 3 Verified Guides with Services

-- Helper to create auth user (Password: "password123")

-- Ensure verified column exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '8d0fd2b3-9ca3-4d6e-bd9d-0c0309478441',
    'authenticated',
    'authenticated',
    'elena.guide@rutalink.com',
    '$2a$10$2/g./L.c/g./L.c/g./L.c/g./L.c/g./L.c/g./L.c/g./L.c.', -- Dummy hash
    now(),
    now(),
    now(),
    '{"name": "Elena Rodriguez"}'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '9e1fe3c4-0db4-5e7f-ce0e-1d1410589552',
    'authenticated',
    'authenticated',
    'carlos.maya@rutalink.com',
    '$2a$10$2/g./L.c/g./L.c/g./L.c/g./L.c/g./L.c/g./L.c/g./L.c.',
    now(),
    now(),
    now(),
    '{"name": "Carlos Chan"}'
  )
ON CONFLICT (id) DO NOTHING;

-- Public Profiles
INSERT INTO public.users (id, email, name, city, country, bio, whatsapp, languages, verified)
VALUES
  (
    '8d0fd2b3-9ca3-4d6e-bd9d-0c0309478441',
    'elena.guide@rutalink.com',
    'Elena Rodriguez',
    'Mérida',
    'México',
    'Guía certificada con 10 años de experiencia en la ruta Puuc y cenotes. Apasionada por la historia y la fotografía.',
    '+529991234567',
    ARRAY['Español', 'English', 'Français'],
    true
  ),
  (
    '9e1fe3c4-0db4-5e7f-ce0e-1d1410589552',
    'carlos.maya@rutalink.com',
    'Carlos Chan',
    'Valladolid',
    'México',
    'Hablante nativo de Maya. Experto en arqueología y gastronomía local. Te muestro el Yucatán auténtico.',
    '+529851234567',
    ARRAY['Español', 'Maya', 'English'],
    true
  )
ON CONFLICT (id) DO UPDATE SET verified = true;

-- Public Links (Slugs)
INSERT INTO public.public_links (user_id, slug, active)
VALUES
  ('8d0fd2b3-9ca3-4d6e-bd9d-0c0309478441', 'elena-merida', true),
  ('9e1fe3c4-0db4-5e7f-ce0e-1d1410589552', 'carlos-valladolid', true)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO public.services (id, user_id, title, description, price, duration, locations, categories, created_at)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    '8d0fd2b3-9ca3-4d6e-bd9d-0c0309478441',
    'Ruta Puuc y Cenote Secreto',
    'Explora Uxmal, Kabah y termina refrescándote en un cenote virgen de acceso exclusivo. Incluye transporte y entradas.',
    2500,
    8,
    ARRAY['Uxmal', 'Mérida'],
    ARRAY['Arqueología', 'Naturaleza'],
    now()
  ),
  (
    'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    '8d0fd2b3-9ca3-4d6e-bd9d-0c0309478441',
    'Tour Fotográfico Mérida Centro',
    'Camina por el Paseo de Montejo y el centro histórico en la luz dorada. Te enseño los mejores ángulos.',
    800,
    3,
    ARRAY['Mérida'],
    ARRAY['Fotografía', 'Cultura'],
    now()
  ),
  (
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    '9e1fe3c4-0db4-5e7f-ce0e-1d1410589552',
    'Amanecer en Chichén Itzá',
    'Entra antes que las multitudes. Explicación profunda de la cosmovisión maya.',
    3000,
    6,
    ARRAY['Chichén Itzá', 'Valladolid'],
    ARRAY['Arqueología'],
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Images (Mock)
INSERT INTO public.service_photos (service_id, url, "order")
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'https://images.unsplash.com/photo-1518182170546-0766ce6f563a?auto=format&fit=crop&w=800&q=80', 1),
  ('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?auto=format&fit=crop&w=800&q=80', 1),
  ('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'https://images.unsplash.com/photo-1518638151313-9821918bc416?auto=format&fit=crop&w=800&q=80', 1)
ON CONFLICT DO NOTHING;
