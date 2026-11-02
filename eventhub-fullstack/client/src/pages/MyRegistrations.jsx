import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelRegistration, getMyRegistrations } from "../services/api.js";
import Loading from "../components/Loading.jsx";
import Button from "../components/Button.jsx";

function formatDate(value) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRegistrations = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await getMyRegistrations();
      setRegistrations(data.registrations);
    } catch (err) {
      setError(err.message || "Unable to load registrations.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRegistrations(); }, [loadRegistrations]);

  async function handleCancel(registration) {
    const eventTitle = registration.event?.title || "this event";
    if (!window.confirm(`Cancel your registration for ${eventTitle}?`)) return;
    setBusyId(registration._id); setError(""); setNotice("");
    try {
      await cancelRegistration(registration._id);
      setRegistrations((current) => current.filter((item) => item._id !== registration._id));
      setNotice(`Your registration for ${eventTitle} was cancelled.`);
    } catch (err) { setError(err.message || "Could not cancel registration."); }
    finally { setBusyId(""); }
  }

  return <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl">
    <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Your account</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">My registrations</h1><p className="mt-2 text-slate-600">View or cancel the events you have registered for.</p>
    {notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {loading ? <Loading message="Loading your registrations..." /> : registrations.length === 0 ? <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-lg font-bold text-slate-900">No registrations yet</h2><p className="mt-2 text-slate-600">Browse events and register for something interesting.</p><Link to="/events" className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700">Explore events</Link></section> : <div className="mt-7 space-y-4">{registrations.map((registration) => { const event = registration.event; return <article key={registration._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h2 className="text-lg font-bold text-slate-900">{event?.title || "Event unavailable"}</h2>{event ? <p className="mt-1 text-sm text-slate-600">{formatDate(event.date)} · {event.time} · {event.location}</p> : <p className="mt-1 text-sm text-slate-500">This event may have been deleted.</p>}<p className="mt-2 text-xs text-slate-500">Registered on {formatDate(registration.createdAt)}</p></div><Button variant="danger" disabled={busyId === registration._id} onClick={() => handleCancel(registration)}>{busyId === registration._id ? "Cancelling..." : "Cancel registration"}</Button></article>; })}</div>}
  </div></main>;
}
