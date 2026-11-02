import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 inline-flex rounded-full border border-indigo-300/30 bg-indigo-300/10 px-4 py-2 text-sm font-semibold text-indigo-200">Discover · Connect · Experience</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Find your next <span className="text-indigo-400">experience.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Explore workshops, technology festivals and conferences. Find events that inspire you and keep your registrations in one place.</p>
          <Link to="/events" className="mt-9 inline-flex rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400">Explore Events <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[{ n: "01", title: "Discover events", description: "Search and filter events by title, location and date." }, { n: "02", title: "Register securely", description: "Sign in to register and prevent duplicate registrations." }, { n: "03", title: "Keep track", description: "Review your registrations and cancel when plans change." }].map((item) => <article key={item.n} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-sm font-bold text-indigo-600">{item.n}</p><h2 className="mt-3 text-xl font-bold text-slate-900">{item.title}</h2><p className="mt-3 leading-7 text-slate-600">{item.description}</p></article>)}
        </div>
      </section>
    </main>
  );
}
