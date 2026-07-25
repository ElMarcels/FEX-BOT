"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api, setToken } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [form, setForm] = useState({ username: "", email: "", password: "", inviteCode: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const invite = new URLSearchParams(window.location.search).get("invite");
    if (invite) setForm((current) => ({ ...current, inviteCode: invite }));
  }, []);

  async function submit() {
    setError("");
    try {
      const data = await api<{ token: string }>(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(form)
      });
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-md rounded-md border border-fex-border bg-fex-panel p-6">
        <h1 className="text-2xl font-semibold">Entrar a Fex</h1>
        <p className="mt-1 text-sm text-fex-muted">Necesitas una invitacion para crear cuenta.</p>
        <div className="mt-6 grid gap-3">
          <Input placeholder="Usuario o email" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          {mode === "register" && (
            <>
              <Input placeholder="Email opcional" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Codigo de invitacion" value={form.inviteCode} onChange={(e) => setForm({ ...form, inviteCode: e.target.value })} />
            </>
          )}
          <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div className="text-sm text-red-300">{error}</div>}
          <Button onClick={submit}>{mode === "register" ? "Crear cuenta" : "Iniciar sesion"}</Button>
          <button className="text-sm text-fex-accent" onClick={() => setMode(mode === "register" ? "login" : "register")}>
            {mode === "register" ? "Ya tengo cuenta" : "Necesito registrarme"}
          </button>
        </div>
      </section>
    </main>
  );
}
