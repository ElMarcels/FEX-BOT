"use client";

import { useEffect, useState } from "react";
import { Folder, FolderPlus, Tag, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Shell } from "../../components/Shell";
import { api, getToken } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const router = useRouter();
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; color: string }[]>([]);
  const [folderName, setFolderName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    load();
  }, []);

  async function load() {
    try {
      const [f, c] = await Promise.all([
        api<{ folders: { id: string; name: string }[] }>("/api/folders"),
        api<{ categories: { id: string; name: string; color: string }[] }>("/api/categories")
      ]);
      setFolders(f.folders);
      setCategories(c.categories);
    } catch { router.push("/login"); }
  }

  async function createFolder() {
    if (!folderName.trim()) return;
    await api("/api/folders", { method: "POST", body: JSON.stringify({ name: folderName }) });
    setFolderName("");
    load();
  }

  async function createCategory() {
    if (!categoryName.trim()) return;
    await api("/api/categories", { method: "POST", body: JSON.stringify({ name: categoryName }) });
    setCategoryName("");
    load();
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold">Organizacion</h1>
        <p className="mt-1 text-sm text-fex-muted">Organiza tus chats en carpetas y categorias.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-fex-border bg-fex-panel p-6">
            <div className="flex items-center gap-2 font-semibold">
              <Folder size={18} /> Carpetas
            </div>
            <div className="mt-4 flex gap-2">
              <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Nueva carpeta" onKeyDown={(e) => e.key === "Enter" && createFolder()} />
              <Button onClick={createFolder} className="px-3"><FolderPlus size={18} /></Button>
            </div>
            <div className="mt-4 grid gap-2">
              {folders.length === 0 && <div className="text-sm text-fex-muted">No hay carpetas aun</div>}
              {folders.map((f) => (
                <div className="flex items-center justify-between rounded-xl border border-fex-border bg-fex-bg p-3" key={f.id}>
                  <span className="text-sm">{f.name}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-fex-border bg-fex-panel p-6">
            <div className="flex items-center gap-2 font-semibold">
              <Tag size={18} /> Categorias
            </div>
            <div className="mt-4 flex gap-2">
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nueva categoria" onKeyDown={(e) => e.key === "Enter" && createCategory()} />
              <Button onClick={createCategory} className="px-3"><Plus size={18} /></Button>
            </div>
            <div className="mt-4 grid gap-2">
              {categories.length === 0 && <div className="text-sm text-fex-muted">No hay categorias aun</div>}
              {categories.map((c) => (
                <div className="flex items-center gap-3 rounded-xl border border-fex-border bg-fex-bg p-3" key={c.id}>
                  <div className="size-3 rounded-full" style={{ background: c.color }} />
                  <span className="text-sm">{c.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
