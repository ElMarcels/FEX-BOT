import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-fex-bg px-6 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-between">
        <div className="pt-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-fex-accent">Invite-only AI</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">Fex</h1>
          <p className="mt-5 max-w-2xl text-lg text-fex-muted">
            Un asistente de programacion con chats organizados, memoria persistente y acceso por invitacion.
          </p>
          <div className="mt-8 flex gap-3">
            <Link className="rounded-md bg-fex-accent px-5 py-3 font-semibold text-slate-950" href="/login">
              Entrar con invitacion
            </Link>
            <Link className="rounded-md border border-fex-border px-5 py-3 font-semibold" href="/dashboard">
              Abrir chat
            </Link>
          </div>
        </div>
        <div className="grid gap-3 pb-8 md:grid-cols-3">
          {["Telegram + web", "Carpetas y categorias", "Memoria por usuario"].map((item) => (
            <div key={item} className="rounded-md border border-fex-border bg-fex-panel p-5">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

