# Orangefy

Plataforma SaaS para iniciantes aprenderem a vender na Shopee.

## Stack

- **Next.js 15** + React 19
- **TailwindCSS** + Framer Motion
- **Supabase** (Auth + DB)
- **Vercel** (Deploy)

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.local.example .env.local
   ```
4. Preencha as variáveis no `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
   CAKTO_WEBHOOK_SECRET=seu-segredo-cakto
   ```
5. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Deploy no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o migration em `supabase/migrations/001_initial.sql` no SQL Editor
3. Configure o webhook de convite de e-mail no painel

## Deploy na Vercel

1. Conecte este repositório à Vercel
2. Configure as variáveis de ambiente
3. Configure o webhook da Cakto apontando para:
   `https://seu-dominio.vercel.app/api/webhooks/cakto`

## Fluxo de Acesso

1. Usuário compra na **Cakto**
2. Webhook notifica `/api/webhooks/cakto`
3. Sistema cria conta no **Supabase Auth** e envia convite por e-mail
4. Usuário define senha e faz login

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Login + recuperação de senha |
| `/dashboard` | Dashboard principal |
| `/dashboard/missoes` | Sistema de missões gamificado |
| `/dashboard/radar` | Radar de produtos |
| `/dashboard/calculadora` | Calculadora de lucro |
| `/dashboard/gerador` | Gerador de anúncios |
| `/dashboard/minha-loja` | Performance da loja |
| `/dashboard/ranking` | Ranking de usuários |
| `/dashboard/comunidade` | Comunidade |
| `/dashboard/configuracoes` | Configurações da conta |
