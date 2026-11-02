import { useCallback, useEffect, useState } from "react";
import { createEvent, deleteEvent, getAllRegistrations, getEvents, updateEvent } from "../services/api.js";
import Button from "../components/Button.jsx";
import Loading from "../components/Loading.jsx";
import Modal from "../components/Modal.jsx";

const emptyForm = { title: "", description: "", date: "", time: "", location: "" };

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

function getDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true); setError("");
    try { setEvents(await getEvents()); }
    catch (err) { setError(err.message || "Unable to load events."); }
    finally { setLoading(false); }
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await getAllRegistrations(); setRegistrations(data.registrations); }
    catch (err) { setError(err.message || "Unable to load registrations."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (tab === "events") loadEvents(); else loadRegistrations(); }, [tab, loadEvents, loadRegistrations]);

  function changeForm(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  function beginEdit(event) {
    setEditingId(event._id);
    setForm({ title: event.title, description: event.description, date: getDateInputValue(event.date), time: event.time, location: event.location });
    setNotice(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() { setEditingId(""); setForm(emptyForm); }

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setNotice("");
    if (!form.title.trim() || !form.description.trim() || !form.date || !form.time.trim() || !form.location.trim()) {
      setError("Please fill in all event fields."); return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateEvent(editingId, form);
        setNotice("Event updated successfully.");
      } else {
        await createEvent(form);
        setNotice("Event created successfully.");
      }
      resetForm(); await loadEvents();
    } catch (err) { setError(err.message || "Could not save event."); }
    finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true); setError(""); setNotice("");
    try {
      await deleteEvent(deleteTarget._id);
      setNotice(`“${deleteTarget.title}” was deleted. Related registrations were also removed by the server.`);
      if (editingId === deleteTarget._id) resetForm();
      setDeleteTarget(null); await loadEvents();
    } catch (err) { setError(err.message || "Could not delete event."); }
    finally { setDeleting(false); }
  }

  return <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Administration</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Admin dashboard</h1><p className="mt-2 text-slate-600">Manage events and review attendee registrations.</p>
    <div className="mt-7 flex flex-wrap gap-2 border-b border-slate-200 pb-4"><Button variant={tab === "events" ? "primary" : "secondary"} onClick={() => { setTab("events"); setError(""); setNotice(""); }}>Manage events</Button><Button variant={tab === "registrations" ? "primary" : "secondary"} onClick={() => { setTab("registrations"); setError(""); setNotice(""); }}>All registrations</Button></div>
    {notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {tab === "events" ? <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-xl font-bold text-slate-900">{editingId ? "Edit event" : "Create event"}</h2><p className="mt-1 text-sm text-slate-600">All fields are required.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div><label htmlFor="event-title" className="mb-1 block text-sm font-semibold">Title</label><input id="event-title" name="title" value={form.title} onChange={changeForm} maxLength={150} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
          <div><label htmlFor="event-description" className="mb-1 block text-sm font-semibold">Description</label><textarea id="event-description" name="description" value={form.description} onChange={changeForm} rows={4} maxLength={3000} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label htmlFor="event-date" className="mb-1 block text-sm font-semibold">Date</label><input id="event-date" type="date" name="date" value={form.date} onChange={changeForm} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div><div><label htmlFor="event-time" className="mb-1 block text-sm font-semibold">Time</label><input id="event-time" type="time" name="time" value={form.time} onChange={changeForm} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div></div>
          <div><label htmlFor="event-location" className="mb-1 block text-sm font-semibold">Location</label><input id="event-location" name="location" value={form.location} onChange={changeForm} maxLength={200} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
          <div className="flex flex-wrap gap-2"><Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Create event"}</Button>{editingId && <Button type="button" variant="secondary" onClick={resetForm} disabled={saving}>Cancel edit</Button>}</div>
        </form>
      </section>
      <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Events ({events.length})</h2><Button variant="secondary" onClick={loadEvents} disabled={loading}>Refresh</Button></div>
        {loading ? <Loading message="Loading events..." /> : events.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No events created yet.</div> : <div className="space-y-4">{events.map((event) => <article key={event._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h3 className="text-lg font-bold text-slate-900">{event.title}</h3><p className="mt-1 whitespace-pre-line text-sm text-slate-600">{event.description}</p><p className="mt-3 text-sm text-slate-500">{formatDate(event.date)} · {event.time} · {event.location}</p></div><div className="flex shrink-0 gap-2"><Button variant="secondary" onClick={() => beginEdit(event)}>Edit</Button><Button variant="danger" onClick={() => setDeleteTarget(event)}>Delete</Button></div></div></article>)}</div>}
      </section>
    </div> : <section className="mt-7"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Registrations ({registrations.length})</h2><Button variant="secondary" onClick={loadRegistrations} disabled={loading}>Refresh</Button></div>
      {loading ? <Loading message="Loading registrations..." /> : registrations.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No registrations found.</div> : <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full divide-y divide-slate-200 text-left text-sm"><thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Event date</th><th className="px-4 py-3">Registered on</th></tr></thead><tbody className="divide-y divide-slate-100">{registrations.map((registration) => <tr key={registration._id} className="align-top hover:bg-slate-50"><td className="px-4 py-4"><p className="font-semibold text-slate-900">{registration.user?.name || "Deleted user"}</p><p className="mt-1 text-slate-500">{registration.user?.email || "—"}</p></td><td className="px-4 py-4 font-medium text-slate-800">{registration.event?.title || "Deleted event"}</td><td className="px-4 py-4 text-slate-600">{formatDate(registration.event?.date)}</td><td className="px-4 py-4 text-slate-600">{formatDate(registration.createdAt)}</td></tr>)}</tbody></table></div>}
    </section>}
  </div>
  <Modal open={Boolean(deleteTarget)} title="Delete this event?" onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} confirmText="Delete event" busy={deleting}>
    Deleting <strong>{deleteTarget?.title}</strong> will also delete registrations associated with this event. This action cannot be undone.
  </Modal>
  </main>;
}
