import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import Loading from "../components/Loading.jsx";
import Button from "../components/Button.jsx";
import useAuth from "../hooks/useAuth.js";
import { getEvents, getMyRegistrations, registerForEvent } from "../services/api.js";

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formFilters, setFormFilters] = useState({ search: "", location: "", dateFrom: "", dateTo: "" });
  const [filters, setFilters] = useState({});
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const eventData = await getEvents(filters);
      setEvents(eventData);
      if (user) {
        const registrationData = await getMyRegistrations();
        setRegisteredIds(new Set(registrationData.registrations.map((registration) => registration.event?._id).filter(Boolean)));
      } else {
        setRegisteredIds(new Set());
      }
    } catch (err) {
      setError(err.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  useEffect(() => { loadData(); }, [loadData]);

  const locations = useMemo(() => [...new Set(events.map((event) => event.location).filter(Boolean))].sort(), [events]);

  function updateFilter(event) {
    setFormFilters((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  function submitFilters(event) {
    event.preventDefault();
    setFilters({ ...formFilters });
  }

  function clearFilters() {
    const cleared = { search: "", location: "", dateFrom: "", dateTo: "" };
    setFormFilters(cleared);
    setFilters({});
  }

  async function handleRegister(eventItem) {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/events" } } });
      return;
    }
    setRegisteringId(eventItem._id);
    setNotice("");
    setError("");
    try {
      await registerForEvent(eventItem._id);
      setRegisteredIds((previous) => new Set([...previous, eventItem._id]));
      setNotice(`You have registered for ${eventItem.title}.`);
    } catch (err) {
      setError(err.message || "Could not register for this event.");
    } finally {
      setRegisteringId("");
    }
  }

  return <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Explore</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Upcoming events</h1><p className="mt-2 text-slate-600">Find an event, then register in a few clicks.</p></div>{user && <Link to="/my-registrations" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View my registrations →</Link>}</div>
    <form onSubmit={submitFilters} className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
      <div className="sm:col-span-2 lg:col-span-2"><label htmlFor="event-search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Search by title or description</label><input id="event-search" name="search" value={formFilters.search} onChange={updateFilter} placeholder="e.g. React, technology..." className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
      <div><label htmlFor="event-location" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Location</label><input id="event-location" name="location" list="event-locations" value={formFilters.location} onChange={updateFilter} placeholder="Any location" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /><datalist id="event-locations">{locations.map((location) => <option key={location} value={location} />)}</datalist></div>
      <div><label htmlFor="date-from" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">From date</label><input id="date-from" type="date" name="dateFrom" value={formFilters.dateFrom} onChange={updateFilter} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
      <div><label htmlFor="date-to" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">To date</label><input id="date-to" type="date" name="dateTo" min={formFilters.dateFrom || undefined} value={formFilters.dateTo} onChange={updateFilter} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
      <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-5"><Button type="submit">Apply filters</Button><Button type="button" variant="secondary" onClick={clearFilters}>Clear filters</Button></div>
    </form>
    {notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{notice}</p>}
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {loading ? <Loading message="Loading events..." /> : events.length === 0 ? <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-lg font-bold text-slate-900">No events found</h2><p className="mt-2 text-slate-600">Try changing your search or filters.</p><Button variant="secondary" className="mt-4" onClick={clearFilters}>Clear filters</Button></div> : <><p className="mt-7 text-sm text-slate-500">Showing {events.length} event{events.length === 1 ? "" : "s"}</p><div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{events.map((event) => <EventCard key={event._id} event={event} isRegistered={registeredIds.has(event._id)} registering={registeringId === event._id} onRegister={handleRegister} />)}</div></>}
  </div></main>;
}
