"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Truck, RefreshCw, ExternalLink } from "lucide-react";
import Header from "@/components/dashboard/Header";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME = `Olá! Sou o assistente de Radar de Fornecedores da Orangefy.

Vou te ajudar a encontrar os melhores fornecedores para vender na Shopee — seja por dropshipping (sem estoque) ou comprando no atacado nacional.

Para montar seu plano, me responda:

1. Qual produto ou nicho quer vender? (ex: eletrônicos, moda, pets, casa)
2. Quer trabalhar com ou sem estoque?
3. Tem CNPJ ou ainda é pessoa física?
4. Qual capital disponível para o primeiro pedido? (R$ 0 / até R$ 500 / R$ 500–2000 / acima de R$ 2000)
5. Prefere produto nacional ou aceita importado?

Me conte e vou indicar os melhores fornecedores!`;

const QUICK_QUESTIONS = [
  "Fornecedores de dropshipping sem estoque no Brasil",
  "Onde comprar no atacado em São Paulo?",
  "Como validar se um fornecedor é confiável?",
  "Diferença entre dropshipping e atacado nacional",
];

function MessageBubble({ msg, isStreaming }: { msg: Message; isStreaming?: boolean }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isUser ? "bg-surface-200" : "bg-gradient-brand shadow-brand"
      }`}>
        {isUser ? <User className="w-4 h-4 text-dark-muted" /> : <Bot className="w-4 h-4 text-white" />}
      </div>
      <div className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? "bg-brand text-white rounded-tr-sm"
          : "bg-white border border-surface-200 text-dark rounded-tl-sm shadow-sm"
      }`}>
        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
        {isStreaming && (
          <span className="inline-block w-0.5 h-4 bg-current align-middle ml-0.5 animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-brand">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-dark-muted/50 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FornecedoresPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function send(text?: string) {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Ocorreu um erro. Tente novamente." }]);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setStreamingText(fullText);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
      setStreamingText("");
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Erro de conexão. Tente novamente." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function reset() {
    setMessages([{ role: "assistant", content: WELCOME }]);
    setStreamingText(""); setInput("");
    inputRef.current?.focus();
  }

  const displayMessages = loading && streamingText
    ? [...messages, { role: "assistant" as const, content: streamingText }]
    : messages;

  return (
    <>
      <Header title="Radar de Fornecedores" subtitle="Encontre fornecedores reais para vender na Shopee" />

      <div className="flex flex-col" style={{ height: "calc(100dvh - 57px)" }}>
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          {/* Banner */}
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <Truck className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-dark text-sm">Radar de Fornecedores</div>
              <div className="text-xs text-dark-muted">Dropshipping e atacado nacional — indicações baseadas no seu perfil</div>
            </div>
            <button onClick={reset} className="text-dark-muted hover:text-dark transition-colors flex-shrink-0">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Plataformas rápidas */}
          {messages.length === 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: "AliExpress", url: "aliexpress.com", tipo: "Drop • Importado" },
                { name: "CJ Dropshipping", url: "cjdropshipping.com", tipo: "Drop • BR/China" },
                { name: "Dropi", url: "dropi.com.br", tipo: "Drop • Nacional" },
                { name: "Atacado.net", url: "atacado.net", tipo: "Atacado • Nacional" },
                { name: "Brás Online", url: "brasonline.com.br", tipo: "Atacado • Moda" },
                { name: "Alibaba", url: "alibaba.com", tipo: "Atacado • Importado" },
              ].map((p) => (
                <div key={p.name} className="bg-white border border-surface-200 rounded-xl px-3 py-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-dark">{p.name}</span>
                    <ExternalLink className="w-3 h-3 text-dark-muted" />
                  </div>
                  <div className="text-xs text-dark-muted">{p.tipo}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Messages */}
          {displayMessages.map((msg, i) => (
            <MessageBubble key={i} msg={msg}
              isStreaming={loading && i === displayMessages.length - 1 && msg.role === "assistant"} />
          ))}

          <AnimatePresence>
            {loading && !streamingText && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick questions */}
          {!loading && messages.length === 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="space-y-2">
              <p className="text-xs text-dark-muted font-medium">Perguntas frequentes:</p>
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} onClick={() => send(q)}
                  className="w-full text-left text-sm text-dark px-4 py-2.5 bg-white border border-surface-200 rounded-xl hover:border-brand/40 hover:bg-orange-50/50 transition-all">
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-surface-200 bg-white px-4 pt-3 pb-20 lg:pb-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="Digite o produto ou nicho que quer vender..."
              rows={1} disabled={loading}
              className="input-field flex-1 resize-none py-2.5 min-h-[44px] max-h-32 disabled:opacity-60"
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 128) + "px";
              }}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              className="btn-brand w-11 h-11 flex items-center justify-center flex-shrink-0 self-end disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs text-dark-muted mt-2 hidden sm:block">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </>
  );
}
