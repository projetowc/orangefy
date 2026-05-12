"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Award, RefreshCw, CheckCircle2 } from "lucide-react";
import Header from "@/components/dashboard/Header";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME = `Olá! Sou o Assistente Orangefy, especializado em ajudar você a conquistar o Vendedor Indicado da Shopee.

Para montar seu plano personalizado, preciso entender sua situação atual:

1. Há quantos dias sua loja está ativa na Shopee?
2. Você já tem CNPJ cadastrado na plataforma?
3. Participa do Programa de Frete Grátis?
4. Qual é seu tempo médio de envio atual?
5. Quantas avaliações tem e qual é sua nota média?

Me conte sua situação e vamos começar!`;

const QUICK_QUESTIONS = [
  "Quais são os critérios para o Vendedor Indicado?",
  "Como melhorar minha avaliação na Shopee?",
  "Como usar o Radar para encontrar produto sem risco?",
  "Quanto tempo demora para receber o selo?",
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
        {isUser
          ? <User className="w-4 h-4 text-dark-muted" />
          : <Bot className="w-4 h-4 text-white" />
        }
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
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-dark-muted/50 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
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
      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Ocorreu um erro. Tente novamente em instantes." },
        ]);
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro de conexão. Verifique sua internet e tente novamente." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function reset() {
    setMessages([{ role: "assistant", content: WELCOME }]);
    setStreamingText("");
    setInput("");
    inputRef.current?.focus();
  }

  const displayMessages = loading && streamingText
    ? [...messages, { role: "assistant" as const, content: streamingText }]
    : messages;

  return (
    <>
      <Header title="Assistente IA" subtitle="Especialista em Vendedor Indicado Shopee" />

      <div
        className="flex flex-col"
        style={{ height: "calc(100dvh - 57px)" }}
      >
        {/* Messages area */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4"
        >
          {/* Intro banner */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <Award className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <div className="font-bold text-dark text-sm">Assistente Vendedor Indicado</div>
              <div className="text-xs text-dark-muted">
                Guia especializado para conquistar o selo mais cobiçado da Shopee
              </div>
            </div>
            <button
              onClick={reset}
              className="ml-auto text-dark-muted hover:text-dark transition-colors flex-shrink-0"
              title="Nova conversa"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Criteria pills */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {[
                "CNPJ ativo",
                "+90 dias de loja",
                "Frete Grátis ativo",
                "Envio em 1 dia",
              ].map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-1.5 bg-white border border-surface-200 rounded-xl px-3 py-2 text-xs font-medium text-dark-muted"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  {c}
                </div>
              ))}
            </motion.div>
          )}

          {/* Messages */}
          {displayMessages.map((msg, i) => (
            <MessageBubble
              key={i}
              msg={msg}
              isStreaming={loading && i === displayMessages.length - 1 && msg.role === "assistant"}
            />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && !streamingText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick questions — show after first assistant message */}
          {!loading && messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <p className="text-xs text-dark-muted font-medium">Perguntas frequentes:</p>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full text-left text-sm text-dark px-4 py-2.5 bg-white border border-surface-200 rounded-xl hover:border-brand/40 hover:bg-orange-50/50 transition-all"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-surface-200 bg-white px-4 pt-3 pb-20 lg:pb-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta..."
              rows={1}
              disabled={loading}
              className="input-field flex-1 resize-none py-2.5 min-h-[44px] max-h-32 disabled:opacity-60"
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="btn-brand w-11 h-11 flex items-center justify-center flex-shrink-0 self-end disabled:opacity-40 disabled:cursor-not-allowed"
            >
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
