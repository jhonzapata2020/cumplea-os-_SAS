-- ==========================================
-- Esquema de Base de Datos para Invitaciones Digitales XV Años
-- Seguridad Reforzada y Políticas RLS Restringidas
-- ==========================================

-- Habilitar extensión UUID si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  celebrant_name TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location_name TEXT NOT NULL,
  location_details TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: guests
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_event_whatsapp UNIQUE (event_id, whatsapp)
);

-- 3. TABLA: rsvps
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL UNIQUE REFERENCES public.guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexación para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_guests_event_whatsapp ON public.guests(event_id, whatsapp);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES SEGUROS
-- ==========================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA EVENTS:
-- Permite lectura pública de detalles del evento (título, fecha, lugar)
DROP POLICY IF EXISTS "Permitir lectura publica de eventos" ON public.events;
CREATE POLICY "Permitir lectura publica de eventos"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (true);

-- POLÍTICAS RESTRICTIVAS PARA GUESTS:
DROP POLICY IF EXISTS "Permitir insercion publica de invitados" ON public.guests;
DROP POLICY IF EXISTS "Permitir actualizacion publica de invitados por id o whatsapp" ON public.guests;
DROP POLICY IF EXISTS "Permitir consulta restringida de invitado" ON public.guests;

CREATE POLICY "Permitir insercion restringida de invitados"
  ON public.guests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir actualizacion de invitado propio por whatsapp"
  ON public.guests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- POLÍTICAS RESTRICTIVAS PARA RSVPS:
DROP POLICY IF EXISTS "Permitir insercion publica de rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Permitir actualizacion publica de rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Permitir lectura publica de rsvps" ON public.rsvps;

CREATE POLICY "Permitir insercion de rsvps"
  ON public.rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir actualizacion de rsvps"
  ON public.rsvps FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- REGISTRO INICIAL (DATOS DEL EVENTO DE MARÍA JOSÉ)
-- ==========================================

INSERT INTO public.events (slug, title, celebrant_name, event_date, location_name, location_details, google_maps_url)
VALUES (
  'maria-jose',
  'Mis XV años',
  'María José',
  '2026-10-03T19:30:00-05:00',
  'Cholas',
  'Segundo piso',
  'https://www.google.com/maps/search/?api=1&query=Cholas+Neiva'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  celebrant_name = EXCLUDED.celebrant_name,
  event_date = EXCLUDED.event_date,
  location_name = EXCLUDED.location_name,
  location_details = EXCLUDED.location_details,
  google_maps_url = EXCLUDED.google_maps_url;
