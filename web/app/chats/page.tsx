"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Shell } from "../../components/Shell";
import { api } from "../../lib/api";

export default function ChatsPage() {
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; color: string }[]>([]);
  const [folderName, setFolderName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  async function load() {
    const [f, c] = await Promise.all([
      api<{ folders: { id: string; name: string }[] }>("/api/folders"),
      api<{ categories: { id: string; name: string; color: string }[] }>("/api/categories")
    ]);
    setFolders(f.folders);
    setCategories(c.categories);
  }

  useEffect(() => {
    load();
  }, []);

  async function createFolder() {
    await api("/api/folders", { method: "POST", body: JSON.stringify({ name: folderName }) });
    setFolderName("");
    load();
  }

  async function createCategory() {
    await api("/api/categories", { method: "POST", body: JSON.stringify({ name: categoryName }) });
    setCategoryName("");
    load();
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Organizacion</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-md border border-fex-border bg-fex-panel p-5">
            <h2 className="font-semibold">Carpetas</h2>
            <div className="mt-4 flex gap-2">
              <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Nueva carpeta" />
              <Button onClick={createFolder}>Crear</Button>
            </div>
            <div className="mt-4 grid gap-2">{folders.map((f) => <div className="rounded-md border border-fex-border p-3" key={f.id}>{f.name}</div>)}</div>
          </section>
          <section className="rounded-md border border-fex-border bg-fex-panel p-5">
            <h2 className="font-semibold">Categorias</h2>
            <div className="mt-4 flex gap-2">
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nueva categoria" />
              <Button onClick={createCategory}>Crear</Button>
            </div>
            <div className="mt-4 grid gap-2">{categories.map((c) => <div className="rounded-md border border-fex-border p-3" key={c.id}>{c.name}</div>)}</div>
          </section>
        </div>
      </div>
    </Shell>
  );
}

