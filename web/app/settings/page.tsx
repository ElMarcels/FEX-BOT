"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Shell } from "../../components/Shell";
import { api } from "../../lib/api";

export default function SettingsPage() {
  const [memories, setMemories] = useState<{ id: string; key: string; value: string }[]>([]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  async function load() {
    const data = await api<{ memories: { id: string; key: string; value: string }[] }>("/api/memory");
    setMemories(data.memories);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    await api("/api/memory", { method: "PUT", body: JSON.stringify({ key, value }) });
    setKey("");
    setValue("");
    load();
  }

  return (
    <Shell>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">Memoria de Fex</h1>
        <p className="mt-1 text-sm text-fex-muted">Fex usa estos datos para personalizar sus respuestas.</p>
        <div className="mt-6 grid gap-3 rounded-md border border-fex-border bg-fex-panel p-5">
          <Input placeholder="Clave, por ejemplo framework" value={key} onChange={(e) => setKey(e.target.value)} />
          <Input placeholder="Valor, por ejemplo Next.js" value={value} onChange={(e) => setValue(e.target.value)} />
          <Button onClick={save}>Guardar memoria</Button>
        </div>
        <div className="mt-6 grid gap-2">
          {memories.map((memory) => (
            <div className="rounded-md border border-fex-border bg-fex-panel p-4" key={memory.id}>
              <div className="font-medium">{memory.key}</div>
              <div className="text-sm text-fex-muted">{memory.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

