"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Shell } from "../../components/Shell";
import { api } from "../../lib/api";

type Chat = { id: string; title: string; messages?: { content: string }[] };
type Message = { id: string; sender: "USER" | "ASSISTANT" | "SYSTEM"; content: string };

export default function DashboardPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    const data = await api<{ chats: Chat[] }>("/api/chats");
    setChats(data.chats);
    if (data.chats[0]) openChat(data.chats[0].id);
  }

  async function openChat(id: string) {
    setActiveChat(id);
    const data = await api<{ chat: { messages: Message[] } }>(`/api/chats/${id}`);
    setMessages(data.chat.messages);
  }

  async function send() {
    if (!input.trim()) return;
    const content = input;
    setInput("");
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "USER", content }]);
    setLoading(true);
    const path = activeChat ? `/api/chats/${activeChat}/messages` : "/api/chats/messages";
    const data = await api<{ chatId: string; message: Message }>(path, {
      method: "POST",
      body: JSON.stringify({ content, chatId: activeChat || undefined })
    });
    setActiveChat(data.chatId);
    setMessages((prev) => [...prev, data.message]);
    setLoading(false);
    loadChats();
  }

  return (
    <Shell>
      <div className="grid h-screen grid-cols-1 md:grid-cols-[320px_1fr]">
        <aside className="border-r border-fex-border p-4">
          <Button className="mb-4 w-full" onClick={() => setActiveChat("")}>Nuevo chat</Button>
          <div className="grid gap-2">
            {chats.map((chat) => (
              <button key={chat.id} onClick={() => openChat(chat.id)} className="rounded-md border border-fex-border bg-fex-panel p-3 text-left text-sm hover:border-fex-accent">
                <div className="font-medium">{chat.title}</div>
                <div className="truncate text-xs text-fex-muted">{chat.messages?.[0]?.content || "Sin mensajes"}</div>
              </button>
            ))}
          </div>
        </aside>
        <section className="flex min-h-0 flex-col">
          <div className="border-b border-fex-border p-4">
            <h1 className="font-semibold">Fex</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto grid max-w-3xl gap-4">
              {messages.map((message) => (
                <div key={message.id} className={`rounded-md p-4 ${message.sender === "USER" ? "ml-8 bg-fex-accent text-slate-950" : "mr-8 border border-fex-border bg-fex-panel"}`}>
                  <pre className="whitespace-pre-wrap font-sans text-sm">{message.content}</pre>
                </div>
              ))}
              {loading && <div className="text-sm text-fex-muted">Fex esta pensando...</div>}
            </div>
          </div>
          <div className="border-t border-fex-border p-4">
            <div className="mx-auto flex max-w-3xl gap-2">
              <Input placeholder="Pregunta algo de programacion..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
              <Button onClick={send}><Send size={16} /></Button>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
