"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircleHeart, Send, Sparkles, User, X } from "lucide-react";
import { quickPrompts } from "@/lib/hospital-chat";

export default function HospitalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadForms, setLeadForms] = useState({});
  const nextMessageId = useRef(2);
  const lastTopicRef = useRef("contact");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Welcome to Abhayapuri Care. Describe the patient symptoms, and I will suggest the correct doctor and duty time. You can also ask about timings, booking, emergency contact, location, fees, and services.",
    },
  ]);
  const canSend = input.trim().length > 0;

  const scrollToSection = (targetId, recommendedDoctor = "") => {
    if (recommendedDoctor) {
      localStorage.setItem("recommendedDoctor", recommendedDoctor);
      window.dispatchEvent(
        new CustomEvent("doctor-recommended", {
          detail: { doctor: recommendedDoctor },
        })
      );
    }

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
          recommendedDoctor: assistantReply.recommendedDoctor,
          leadForm: assistantReply.leadForm,
          sourceQuestion: trimmed,
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

  const updateLeadForm = (messageId, field, value) => {
    setLeadForms((current) => ({
      ...current,
      [messageId]: {
        name: "",
        email: "",
        phone: "",
        status: "idle",
        ...(current[messageId] || {}),
        [field]: value,
      },
    }));
  };

  const submitLeadForm = async (message) => {
    const form = leadForms[message.id] || {};
    const name = form.name?.trim() || "";
    const email = form.email?.trim() || "";
    const phone = form.phone?.trim() || "";

    if (!name || !email || !phone) {
      setLeadForms((current) => ({
        ...current,
        [message.id]: {
          name,
          email,
          phone,
          status: "error",
          error: "Please add your name, email, and phone number.",
        },
      }));
      return;
    }

    setLeadForms((current) => ({
      ...current,
      [message.id]: { ...current[message.id], status: "sending", error: "" },
    }));

    try {
      const response = await fetch("/api/contact-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          question: message.sourceQuestion || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      setLeadForms((current) => ({
        ...current,
        [message.id]: { name, email, phone, status: "sent", error: "" },
      }));
    } catch {
      setLeadForms((current) => ({
        ...current,
        [message.id]: {
          ...current[message.id],
          status: "error",
          error: "Could not send your details. Please call +91 8822141629.",
        },
      }));
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
            className="mb-3 flex max-h-[calc(100vh-7.5rem)] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-2xl sm:mb-4 sm:max-h-[calc(100vh-8.5rem)] sm:w-[24rem]"
          >
            <div className="shrink-0 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 p-4 text-white sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-blue-100">
                    <Sparkles className="h-4 w-4" />
                    AI Health Assistant
                  </p>
                  <h3 className="text-lg font-black sm:text-xl">Abhayapuri Care Chat</h3>
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

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
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
                        onClick={() => scrollToSection(message.actionTarget, message.recommendedDoctor)}
                        className="mt-3 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        {message.actionLabel}
                      </button>
                    ) : null}
                    {message.role === "assistant" && message.leadForm ? (
                      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
                        <p className="text-sm font-black text-slate-900">
                          Hey there, please leave your details so we can contact you even if you are no longer on the site.
                        </p>
                        <div className="mt-3 space-y-2">
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Name
                            </span>
                            <input
                              type="text"
                              value={leadForms[message.id]?.name || ""}
                              onChange={(event) => updateLeadForm(message.id, "name", event.target.value)}
                              placeholder="Make sure to add your name."
                              disabled={leadForms[message.id]?.status === "sent"}
                              className="h-10 w-full rounded-xl border border-blue-100 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 disabled:bg-slate-100"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Email
                            </span>
                            <input
                              type="email"
                              value={leadForms[message.id]?.email || ""}
                              onChange={(event) => updateLeadForm(message.id, "email", event.target.value)}
                              placeholder="Add your email address."
                              disabled={leadForms[message.id]?.status === "sent"}
                              className="h-10 w-full rounded-xl border border-blue-100 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 disabled:bg-slate-100"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Phone
                            </span>
                            <input
                              type="tel"
                              value={leadForms[message.id]?.phone || ""}
                              onChange={(event) => updateLeadForm(message.id, "phone", event.target.value)}
                              placeholder="Add your phone number."
                              disabled={leadForms[message.id]?.status === "sent"}
                              className="h-10 w-full rounded-xl border border-blue-100 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 disabled:bg-slate-100"
                            />
                          </label>
                        </div>
                        {leadForms[message.id]?.error ? (
                          <p className="mt-2 text-xs font-bold text-red-600">{leadForms[message.id].error}</p>
                        ) : null}
                        {leadForms[message.id]?.status === "sent" ? (
                          <p className="mt-3 rounded-xl bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
                            Thank you. Your details have been sent to the hospital team.
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => submitLeadForm(message)}
                            disabled={leadForms[message.id]?.status === "sending"}
                            className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                          >
                            {leadForms[message.id]?.status === "sending" ? "Sending..." : "Submit Details"}
                          </button>
                        )}
                      </div>
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

            <div className="shrink-0 border-t border-slate-200 bg-white p-4">
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
                  placeholder="Example: heart problem, child fever, hospital timing..."
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
