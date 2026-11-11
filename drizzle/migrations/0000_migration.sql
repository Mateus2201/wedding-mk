CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) <= 255),
  attending boolean NOT NULL,
  party_size integer NOT NULL DEFAULT 1 CHECK (party_size BETWEEN 0 AND 10),
  dietary text CHECK (dietary IS NULL OR char_length(dietary) <= 500),
  message text CHECK (message IS NULL OR char_length(message) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.rsvps TO anon, authenticated;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can submit an RSVP" ON public.rsvps FOR INSERT TO anon, authenticated WITH CHECK (true);