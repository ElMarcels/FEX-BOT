import Link from "next/link";
import { Bot, Folder, MessageSquare, Settings } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-fex-border bg-fex-panel p-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md bg-fex-accent text-slate-950">
            <Bot size={20} />
          </div>
          <div>
            <div className="font-semibold">Fex</div>
            <div className="text-xs text-fex-muted">Programming assistant</div>
          </div>
        </div>
        <nav className="grid gap-1 text-sm">
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/5" href="/dashboard">
            <MessageSquare size={16} /> Chats
          </Link>
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/5" href="/chats">
            <Folder size={16} /> Carpetas
          </Link>
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/5" href="/settings">
            <Settings size={16} /> Memoria
          </Link>
        </nav>
      </aside>
      <section>{children}</section>
    </main>
  );
}

