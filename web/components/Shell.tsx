import Link from "next/link";
import { Bot, Folder, MessageSquare, Settings, LogOut } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-fex-border bg-fex-panel p-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-fex-accent text-white">
            <Bot size={22} />
          </div>
          <div>
            <div className="font-bold">Fex</div>
            <div className="text-xs text-fex-muted">AI Assistant</div>
          </div>
        </div>
        <nav className="grid gap-1 text-sm">
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5" href="/dashboard">
            <MessageSquare size={18} /> Chats
          </Link>
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5" href="/chats">
            <Folder size={18} /> Carpetas
          </Link>
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5" href="/settings">
            <Settings size={18} /> Memoria
          </Link>
        </nav>
        <div className="mt-auto pt-6">
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fex-muted transition hover:bg-white/5 hover:text-fex-text" href="/login">
            <LogOut size={18} /> Cerrar sesion
          </Link>
        </div>
      </aside>
      <section>{children}</section>
    </main>
  );
}
