DROP POLICY IF EXISTS "Guests can submit an RSVP" ON public.rsvps;
CREATE POLICY "Guests can submit a valid RSVP" ON public.rsvps FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 2 AND 120
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(email) <= 255
  AND ((attending AND party_size BETWEEN 1 AND 5) OR (NOT attending AND party_size = 0))
  AND (dietary IS NULL OR char_length(dietary) <= 500)
  AND (message IS NULL OR char_length(message) <= 2000)
  AND created_at > now() - interval '5 minutes' AND created_at <= now() + interval '1 minute'
);