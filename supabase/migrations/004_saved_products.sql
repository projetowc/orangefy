-- Radar de Produtos: produtos salvos pelo usuário
CREATE TABLE IF NOT EXISTS saved_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product jsonb NOT NULL,
  criado_em timestamptz DEFAULT now()
);

ALTER TABLE saved_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seus produtos salvos"
ON saved_products FOR ALL
USING (auth.uid() = user_id);
