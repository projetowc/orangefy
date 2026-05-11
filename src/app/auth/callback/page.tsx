"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { ShoppingBag } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState("Verificando seu acesso...");

  useEffect(() => {
    async function handleCallback() {
      // Lê os parâmetros da URL (query string)
      const searchParams = new URLSearchParams(window.location.search);
      const token_hash = searchParams.get("token_hash");
      const code = searchParams.get("code");
      const type = (searchParams.get("type") || "invite") as
        | "invite"
        | "recovery"
        | "email"
        | "signup";

      // Lê o hash da URL (#access_token=...&refresh_token=...&type=...)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");
      const hashType = hashParams.get("type") || type;

      const isSetup = hashType === "invite" || hashType === "recovery";

      // Fluxo 1: Hash com access_token (e-mail padrão do Supabase)
      if (access_token && refresh_token) {
        setStatus("Autenticando...");
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (!error) {
          router.push(isSetup ? "/set-password" : "/dashboard");
        } else {
          router.push("/login?error=link_expirado");
        }
        return;
      }

      // Fluxo 2: token_hash (template customizado)
      if (token_hash) {
        setStatus("Verificando convite...");
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type === "invite" || type === "recovery" ? type : "email",
        });
        if (!error) {
          router.push(isSetup ? "/set-password" : "/dashboard");
        } else {
          router.push("/login?error=link_expirado");
        }
        return;
      }

      // Fluxo 3: code — PKCE
      if (code) {
        setStatus("Finalizando acesso...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.push("/dashboard");
        } else {
          router.push("/login?error=link_expirado");
        }
        return;
      }

      // Sem token — verifica se já tem sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login?error=link_expirado");
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-black text-dark">
          Orange<span className="text-brand">fy</span>
        </span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
        <p className="text-dark-muted font-medium text-sm">{status}</p>
      </div>
    </div>
  );
}
