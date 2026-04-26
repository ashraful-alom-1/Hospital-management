"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircleHeart, Send, Sparkles, User, X } from "lucide-react";
import { quickPrompts } from "@/lib/hospital-chat";

export default function HospitalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const nextMessageId = useRef(2);
  const lastTopicRef = useRef("contact");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Welcome to Abhayapuri Care. Ask me about doctors, services, booking, emergency contact, or location.",
      actionLabel: "Book appointment",
      actionTarget: "contact",
    },
  ]);
  const canSend = input.trim().length > 0;

  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);

    if (!section) return;

    const y = section.getBoundingClientRect().top + window.pageYOffset - 90;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const sendMessage = async (messageText = input) => {
    const trimmed = messageText.trim();

    if (!trimmed || isTyping) return;

    const userMessageId = nextMessageId.current++;
    const assistantMessageId = nextMessageId.current++;

    setMessages((current) => [
      ...current,
      {
        id: userMessageId,
        role: "user",
        text: trimmed,
      },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const [response] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmed,
            lastTopic: lastTopicRef.current,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const assistantReply = await response.json();
      lastTopicRef.current = assistantReply.nextTopic || assistantReply.actionTarget || lastTopicRef.current;

      setMessages((current) => [
        ...current,
        {
          id: assistantMessageId,
          role: "assistant",
          text: assistantReply.text,
          actionLabel: assistantReply.actionLabel,
          actionTarget: assistantReply.actionTarget,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: assistantMessageId,
          role: "assistant",
          text: "I could not load a reply just now. You can still ask about doctors, services, booking, or location.",
          actionLabel: "Book appointment",
          actionTarget: "contact",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[140]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="mb-4 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-blue-100">
                    <Sparkles className="h-4 w-4" />
                    AI Health Assistant
                  </p>
                  <h3 className="text-xl font-black">Abhayapuri Care Chat</h3>
                  <p className="mt-1 text-sm text-blue-50">
                    Free project chatbot for common hospital questions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[26rem] space-y-4 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.4rem] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {message.role === "user" ? (
                        <>
                          <User className="h-3.5 w-3.5" />
                          You
                        </>
                      ) : (
                        <>
                          <Bot className="h-3.5 w-3.5" />
                          Assistant
                        </>
                      )}
                    </div>
                    <p>{message.text}</p>
                    {message.role === "assistant" && message.actionLabel && message.actionTarget ? (
                      <button
                        type="button"
                        onClick={() => scrollToSection(message.actionTarget)}
                        className="mt-3 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        {message.actionLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}

              {isTyping ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-[1.4rem] bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-70">
                      <Bot className="h-3.5 w-3.5" />
                      Assistant
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.15s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-400" />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-blue-200 bg-white px-3 py-2 text-left text-xs font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="mb-3 rounded-2xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
                This chatbot provides website guidance only and should not be used for medical diagnosis.
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey && !isTyping) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask about doctors, booking, services..."
                  className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!canSend || isTyping}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-full bg-slate-950 px-5 py-4 text-white shadow-2xl ring-4 ring-blue-100 transition hover:bg-blue-700"
      >
        <div className="rounded-full bg-blue-500 p-2">
          <MessageCircleHeart className="h-5 w-5" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">
            Free AI Chat
          </p>
          <p className="text-sm font-bold">Ask Hospital Assistant</p>
        </div>
      </motion.button>
    </div>
  );
}
