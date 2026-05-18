"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CheckoutSucessoPage() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/orangefy-logo-dark.png"
            alt="Orangefy"
            width={160}
            height={46}
            className="h-10 w-auto"
          />
        </div>

        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>

        <h1 className="text-2xl font-black text-dark mb-2">Pagamento confirmado!</h1>
        <p className="text-dark-muted mb-6 leading-relaxed">
          Seu acesso foi liberado. Agora crie sua conta usando o <strong>mesmo e-mail</strong> usado no pagamento.
        </p>

        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 mb-6 text-left space-y-2">
          <p className="text-sm font-semibold text-dark">Próximos passos:</p>
          <div className="flex items-start gap-2 text-sm text-dark-muted">
            <span className="font-bold text-brand mt-0.5">1.</span>
            <span>Clique em "Criar minha conta" abaixo</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-dark-muted">
            <span className="font-bold text-brand mt-0.5">2.</span>
            <span>Use o mesmo e-mail do pagamento</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-dark-muted">
            <span className="font-bold text-brand mt-0.5">3.</span>
            <span>Defina sua senha e acesse a plataforma</span>
          </div>
        </div>

        <Link
          href="/login?tab=register"
          className="btn-brand w-full flex items-center justify-center gap-2 text-base py-3.5"
        >
          Criar minha conta
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-xs text-dark-muted mt-4">
          Dúvidas? Entre em contato:{" "}
          <a href="mailto:suporte@orangefy.com.br" className="text-brand hover:underline">
            suporte@orangefy.com.br
          </a>
        </p>
      </div>
    </div>
  );
}
