"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Shell } from "../../components/Shell";
import { api, getToken } from "../../lib/api";
import { useRouter } from "next/navigation";

type Chat = { id: string; title: string; messages?: { content: string }[] };
type Message = { id: string; sender: "USER" | "ASSISTANT" | "SYSTEM"; content: string };

export default function DashboardPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    loadChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadChats() {
    try {
      const data = await api<{ chats: Chat[] }>("/api/chats");
      setChats(data.chats);
    } catch {
      router.push("/login");
    }
  }

  async function openChat(id: string) {
    setActiveChat(id);
    const data = await api<{ chat: { messages: Message[] } }>(`/api/chats/${id}`);
    setMessages(data.chat.messages);
  }

  function newChat() {
    setActiveChat("");
    setMessages([]);
  }

  async function deleteChat(id: string) {
    await api(`/api/chats/${id}`, { method: "DELETE" });
    if (activeChat === id) newChat();
    loadChats();
  }

  async function send() {
    if (!input.trim() || loading) return;
    const content = input;
    setInput("");
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "USER", content }]);
    setLoading(true);
    try {
      const path = activeChat ? `/api/chats/${activeChat}/messages` : "/api/chats/messages";
      const data = await api<{ chatId: string; message: Message }>(path, {
        method: "POST",
        body: JSON.stringify({ content, chatId: activeChat || undefined })
      });
      setActiveChat(data.chatId);
      setMessages((prev) => [...prev, data.message]);
      loadChats();
    } catch (err) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "ASSISTANT", content: "Error: no pude generar una respuesta." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="grid h-screen grid-cols-1 md:grid-cols-[300px_1fr]">
        <aside className="border-r border-fex-border p-4 flex flex-col">
          <Button className="mb-4 flex items-center justify-center gap-2 rounded-xl w-full" onClick={newChat}>
            <Plus size={16} /> Nuevo chat
          </Button>
          <div className="grid gap-2 flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div key={chat.id} className={`group relative flex items-center rounded-xl border p-3 text-left text-sm transition cursor-pointer ${activeChat === chat.id ? "border-fex-accent bg-fex-accent/10" : "border-fex-border bg-fex-panel hover:border-fex-accent/50"}`} onClick={() => openChat(chat.id)}>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className="truncate text-xs text-fex-muted">{chat.messages?.[0]?.content || "Sin mensajes"}</div>
                </div>
                <button className="ml-2 hidden group-hover:block text-fex-muted hover:text-fex-error transition" onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </aside>
        <section className="flex min-h-0 flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto grid max-w-3xl gap-4">
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h2 className="text-xl font-semibold">Empieza a chatear</h2>
                  <p className="mt-2 text-sm text-fex-muted">Escribe algo, Fex puede ayudarte con cualquier cosa.</p>
                </div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`rounded-2xl p-4 ${message.sender === "USER" ? "ml-12 bg-fex-accent text-white" : "mr-12 border border-fex-border bg-fex-panel"}`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              {loading && (
                <div className="mr-12 rounded-2xl border border-fex-border bg-fex-panel p-4">
                  <div className="flex items-center gap-2 text-sm text-fex-muted">
                    <div className="flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                    </div>
                    Fex esta pensando...
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-fex-border p-4">
            <div className="mx-auto flex max-w-3xl gap-2">
              <Input placeholder="Escribe tu mensaje..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()} />
              <Button onClick={send} className="px-4 rounded-xl">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
