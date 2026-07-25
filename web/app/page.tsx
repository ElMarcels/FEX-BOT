import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-fex-bg px-6 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-between">
        <div className="pt-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-fex-accent">AI Assistant</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">Fex</h1>
          <p className="mt-5 max-w-2xl text-lg text-fex-muted">
            Tu asistente de IA personal. Responde sobre cualquier tema: programacion, ciencia, idiomas, creatividad y mas.
          </p>
          <div className="mt-8 flex gap-3">
            <Link className="rounded-2xl bg-fex-accent px-6 py-3 font-semibold text-white transition hover:bg-fex-accentHover" href="/login">
              Comenzar
            </Link>
          </div>
        </div>
        <div className="grid gap-4 pb-8 md:grid-cols-3">
          {[
            { title: "Multi-plataforma", desc: "Telegram + Web" },
            { title: "Memoria persistente", desc: "Recuerda tus preferencias" },
            { title: "Chats organizados", desc: "Carpetas y categorias" }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-fex-border bg-fex-panel p-6 transition hover:border-fex-accent/50">
              <div className="font-semibold text-fex-text">{item.title}</div>
              <div className="mt-1 text-sm text-fex-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
