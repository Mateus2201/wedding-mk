CREATE TABLE public.gift_categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 2 AND 80));
GRANT ALL ON public.gift_categories TO service_role;
ALTER TABLE public.gift_categories ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.gifts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category_id uuid REFERENCES public.gift_categories(id) ON DELETE SET NULL, name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120), description text NOT NULL DEFAULT '' CHECK (char_length(description)<=1000), image_path text, price_cents integer NOT NULL CHECK (price_cents BETWEEN 100 AND 100000000), quantity integer NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 10000), purchased_quantity integer NOT NULL DEFAULT 0 CHECK (purchased_quantity>=0 AND purchased_quantity<=quantity), target_cents integer CHECK (target_cents BETWEEN 100 AND 100000000), funded_cents integer NOT NULL DEFAULT 0 CHECK (funded_cents>=0 AND (target_cents IS NULL OR funded_cents<=target_cents)), enabled boolean NOT NULL DEFAULT true, available boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order BETWEEN 0 AND 100000), created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.gifts TO service_role;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.gift_orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lookup_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(), guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 2 AND 120), email text NOT NULL CHECK (char_length(email)<=255), message text CHECK (char_length(message)<=2000), anonymous boolean NOT NULL DEFAULT false, method text NOT NULL CHECK (method IN ('pix','card')), amount_cents integer NOT NULL CHECK (amount_cents>0), status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','expired','refunded')), provider text NOT NULL DEFAULT 'asaas', provider_reference text UNIQUE, created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT (now()+interval '30 minutes'), paid_at timestamptz);
GRANT ALL ON public.gift_orders TO service_role;
ALTER TABLE public.gift_orders ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.gift_order_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES public.gift_orders(id), gift_id uuid NOT NULL REFERENCES public.gifts(id), name text NOT NULL, category text, quantity integer NOT NULL CHECK (quantity>0), amount_cents integer NOT NULL CHECK (amount_cents>0), UNIQUE(order_id,gift_id));
GRANT ALL ON public.gift_order_items TO service_role;
ALTER TABLE public.gift_order_items ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.payment_webhook_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider text NOT NULL, event_id text NOT NULL, order_id uuid NOT NULL REFERENCES public.gift_orders(id), status text NOT NULL CHECK (status IN ('pending','paid','failed','expired','refunded')), created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(provider,event_id));
GRANT ALL ON public.payment_webhook_events TO service_role;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.reserve_gifts(p_guest_name text, p_email text, p_message text, p_anonymous boolean, p_method text, p_items jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE g public.gifts; item jsonb; qty integer; held integer; held_amount integer; amount integer; total integer:=0; oid uuid; tok uuid;
BEGIN
IF jsonb_typeof(p_items)<>'array' OR jsonb_array_length(p_items) NOT BETWEEN 1 AND 30 THEN RAISE EXCEPTION 'Seleção inválida'; END IF;
IF (SELECT count(DISTINCT x->>'gift_id') FROM jsonb_array_elements(p_items) x)<>jsonb_array_length(p_items) THEN RAISE EXCEPTION 'Presentes duplicados'; END IF;
PERFORM id FROM public.gifts WHERE id IN (SELECT (x->>'gift_id')::uuid FROM jsonb_array_elements(p_items) x) ORDER BY id FOR UPDATE;
INSERT INTO public.gift_orders(guest_name,email,message,anonymous,method,amount_cents) VALUES(p_guest_name,p_email,p_message,p_anonymous,p_method,1) RETURNING id,lookup_token INTO oid,tok;
FOR item IN SELECT x FROM jsonb_array_elements(p_items) x LOOP
SELECT * INTO g FROM public.gifts WHERE id=(item->>'gift_id')::uuid;
qty:=(item->>'quantity')::integer;
IF g.id IS NULL OR NOT g.enabled OR NOT g.available OR qty NOT BETWEEN 1 AND 10000 THEN RAISE EXCEPTION 'Presente indisponível'; END IF;
SELECT coalesce(sum(i.quantity),0),coalesce(sum(i.amount_cents),0) INTO held,held_amount FROM public.gift_order_items i JOIN public.gift_orders o ON o.id=i.order_id WHERE i.gift_id=g.id AND o.status='pending';
IF g.purchased_quantity+held+qty>g.quantity THEN RAISE EXCEPTION 'Quantidade indisponível'; END IF;
amount:=g.price_cents*qty;
IF g.target_cents IS NOT NULL THEN
IF g.target_cents-g.funded_cents-held_amount<=0 THEN RAISE EXCEPTION 'Meta já reservada'; END IF;
amount:=least(amount,g.target_cents-g.funded_cents-held_amount);
END IF;
INSERT INTO public.gift_order_items(order_id,gift_id,name,category,quantity,amount_cents) SELECT oid,g.id,g.name,c.name,qty,amount FROM (SELECT 1) a LEFT JOIN public.gift_categories c ON c.id=g.category_id;
total:=total+amount;
END LOOP;
UPDATE public.gift_orders SET amount_cents=total WHERE id=oid;
RETURN jsonb_build_object('id',oid,'lookup_token',tok,'amount_cents',total);
END; $$;
REVOKE ALL ON FUNCTION public.reserve_gifts(text,text,text,boolean,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_gifts(text,text,text,boolean,text,jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.confirm_gift_payment(p_provider text,p_event_id text,p_reference text,p_status text,p_amount integer) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o public.gift_orders; i public.gift_order_items; g public.gifts; held integer; held_amount integer;
BEGIN
IF p_status NOT IN ('pending','paid','failed','expired','refunded') THEN RAISE EXCEPTION 'Status inválido'; END IF;
SELECT * INTO o FROM public.gift_orders WHERE provider=p_provider AND provider_reference=p_reference FOR UPDATE;
IF o.id IS NULL OR p_amount<>o.amount_cents THEN RAISE EXCEPTION 'Pagamento não corresponde ao pedido'; END IF;
IF EXISTS(SELECT 1 FROM public.payment_webhook_events WHERE provider=p_provider AND event_id=p_event_id) THEN RETURN false; END IF;
PERFORM g2.id FROM public.gifts g2 JOIN public.gift_order_items i2 ON i2.gift_id=g2.id WHERE i2.order_id=o.id ORDER BY g2.id FOR UPDATE OF g2;
INSERT INTO public.payment_webhook_events(provider,event_id,order_id,status) VALUES(p_provider,p_event_id,o.id,p_status);
IF o.status='refunded' OR (o.status='paid' AND p_status<>'refunded') OR o.status=p_status THEN RETURN false; END IF;
IF p_status='refunded' AND o.status<>'paid' THEN RAISE EXCEPTION 'Pedido não pago'; END IF;
IF p_status='paid' THEN
FOR i IN SELECT * FROM public.gift_order_items WHERE order_id=o.id LOOP
SELECT * INTO g FROM public.gifts WHERE id=i.gift_id;
SELECT coalesce(sum(ii.quantity),0),coalesce(sum(ii.amount_cents),0) INTO held,held_amount FROM public.gift_order_items ii JOIN public.gift_orders oo ON oo.id=ii.order_id WHERE ii.gift_id=i.gift_id AND oo.status='pending' AND oo.id<>o.id;
IF g.purchased_quantity+held+i.quantity>g.quantity OR (g.target_cents IS NOT NULL AND g.funded_cents+held_amount+i.amount_cents>g.target_cents) THEN RAISE EXCEPTION 'Pagamento tardio requer conciliação'; END IF;
UPDATE public.gifts SET purchased_quantity=purchased_quantity+i.quantity,funded_cents=funded_cents+i.amount_cents WHERE id=i.gift_id;
END LOOP;
ELSIF p_status='refunded' THEN
FOR i IN SELECT * FROM public.gift_order_items WHERE order_id=o.id LOOP
UPDATE public.gifts SET purchased_quantity=purchased_quantity-i.quantity,funded_cents=funded_cents-i.amount_cents WHERE id=i.gift_id;
END LOOP;
END IF;
UPDATE public.gift_orders SET status=p_status,paid_at=CASE WHEN p_status='paid' THEN now() ELSE paid_at END WHERE id=o.id;
RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.confirm_gift_payment(text,text,text,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_gift_payment(text,text,text,text,integer) TO service_role;