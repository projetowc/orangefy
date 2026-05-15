-- Spy de Concorrentes: histórico de análises por usuário
CREATE TABLE IF NOT EXISTS spy_historico (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  query text NOT NULL,
  resultado jsonb NOT NULL,
  criado_em timestamptz DEFAULT now()
);

ALTER TABLE spy_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seu histórico"
ON spy_historico FOR ALL
USING (auth.uid() = user_id);
