import Button from "./Button.jsx";

function formatDate(dateValue) {
  if (!dateValue) return "Date to be announced";
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? dateValue : date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric", timeZone: "UTC",
  });
}

export default function EventCard({ event, isRegistered = false, onRegister, registering = false, showRegister = true }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Event</span>
        {isRegistered && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Registered</span>}
      </div>
      <h2 className="text-xl font-bold text-slate-900">{event.title}</h2>
      <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-6 text-slate-600">{event.description}</p>
      <dl className="mt-5 space-y-2 text-sm text-slate-600">
        <div className="flex gap-2"><dt className="font-semibold text-slate-700">Date:</dt><dd>{formatDate(event.date)}</dd></div>
        <div className="flex gap-2"><dt className="font-semibold text-slate-700">Time:</dt><dd>{event.time}</dd></div>
        <div className="flex gap-2"><dt className="font-semibold text-slate-700">Location:</dt><dd>{event.location}</dd></div>
      </dl>
      {showRegister && (
        <Button className="mt-6 w-full" onClick={() => onRegister(event)} disabled={isRegistered || registering}>
          {registering ? "Registering..." : isRegistered ? "Already Registered" : "Register for Event"}
        </Button>
      )}
    </article>
  );
}
