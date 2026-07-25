"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api, setToken } from "../../lib/api";

declare global {
  interface Window {
    google?: any;
    googleSignIn?: (response: any) => void;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", inviteCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const invite = new URLSearchParams(window.location.search).get("invite");
    if (invite) {
      setMode("register");
      setForm((current) => ({ ...current, inviteCode: invite }));
    }
  }, []);

  const handleGoogleResponse = useCallback(async (response: any) => {
    setError("");
    setLoading(true);
    try {
      const data = await api<{ token: string }>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: response.credential })
      });
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error con Google");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    window.googleSignIn = handleGoogleResponse;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [handleGoogleResponse]);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const body: Record<string, string> = { username: form.username, password: form.password };
      if (mode === "register") {
        if (form.email) body.email = form.email;
        body.inviteCode = form.inviteCode;
      }
      const data = await api<{ token: string }>(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(body)
      });
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 bg-fex-bg">
      <section className="w-full max-w-md rounded-3xl border border-fex-border bg-fex-panel p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">{mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}</h1>
          <p className="mt-2 text-sm text-fex-muted">
            {mode === "login" ? "Inicia sesion para continuar" : "Necesitas un codigo de invitacion"}
          </p>
        </div>

        <div className="grid gap-3">
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <>
              <div id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                data-callback="googleSignIn"
                data-auto_prompt="false">
              </div>
              <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="sign_in_with"
                data-size="large"
                data-width="300"
                className="w-full">
              </div>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-fex-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-fex-panel px-2 text-fex-muted">o</span>
                </div>
              </div>
            </>
          )}

          <Input placeholder="Usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          {mode === "register" && (
            <>
              <Input placeholder="Email (opcional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Codigo de invitacion" value={form.inviteCode} onChange={(e) => setForm({ ...form, inviteCode: e.target.value })} />
            </>
          )}
          <Input type="password" placeholder="Contrasena" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && submit()} />
          {error && <div className="rounded-xl bg-fex-error/10 px-4 py-2 text-sm text-fex-error">{error}</div>}
          <Button onClick={submit} className="w-full mt-2">
            {loading ? "Cargando..." : mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
          </Button>
          <button className="mt-2 text-sm text-fex-accent transition hover:text-fex-accentHover" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "No tengo cuenta, registrarme" : "Ya tengo cuenta, iniciar sesion"}
          </button>
        </div>
      </section>
    </main>
  );
}
