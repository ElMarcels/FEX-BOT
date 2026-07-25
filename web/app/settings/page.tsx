"use client";

import { useEffect, useState } from "react";
import { Brain, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Shell } from "../../components/Shell";
import { api, getToken } from "../../lib/api";
import { useRouter } from "next/navigation";

type Memory = { id: string; key: string; value: string; source: string };

export default function SettingsPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    load();
  }, []);

  async function load() {
    try {
      const data = await api<{ memories: Memory[] }>("/api/memory");
      setMemories(data.memories);
    } catch { router.push("/login"); }
  }

  async function save() {
    if (!key.trim() || !value.trim()) return;
    await api("/api/memory", { method: "PUT", body: JSON.stringify({ key, value }) });
    setKey("");
    setValue("");
    load();
  }

  async function remove(id: string) {
    await api(`/api/memory/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <Shell>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold">Memoria de Fex</h1>
        <p className="mt-1 text-sm text-fex-muted">Fex recuerda estas preferencias para personalizar sus respuestas.</p>
        <div className="mt-6 grid gap-3 rounded-2xl border border-fex-border bg-fex-panel p-6">
          <Input placeholder="Clave (ej: framework, idioma, proyecto)" value={key} onChange={(e) => setKey(e.target.value)} />
          <Input placeholder="Valor (ej: Next.js, espanol, mi app web)" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} />
          <Button onClick={save} className="flex items-center justify-center gap-2"><Plus size={16} /> Guardar memoria</Button>
        </div>
        <div className="mt-6 grid gap-3">
          {memories.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center">
              <Brain size={32} className="text-fex-muted mb-2" />
              <p className="text-sm text-fex-muted">No hay memorias guardadas aun</p>
            </div>
          )}
          {memories.map((memory) => (
            <div className="flex items-center justify-between rounded-2xl border border-fex-border bg-fex-panel p-4" key={memory.id}>
              <div>
                <div className="font-medium text-sm">{memory.key}</div>
                <div className="text-sm text-fex-muted">{memory.value}</div>
              </div>
              <button className="text-fex-muted hover:text-fex-error transition" onClick={() => remove(memory.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
