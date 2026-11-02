import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Button from "../components/Button.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError("Please complete every field.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    try {
      setSubmitting(true);
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate(location.state?.from?.pathname || "/events", { replace: true });
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="min-h-[calc(100vh-72px)] bg-slate-100 px-4 py-12 sm:px-6"><section className="mx-auto max-w-md rounded-2xl bg-white p-7 shadow-lg sm:p-9">
    <h1 className="text-3xl font-extrabold text-slate-900">Create account</h1><p className="mt-2 text-slate-600">Join EventHub to register for events.</p>
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <div><label htmlFor="reg-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Name</label><input id="reg-name" name="name" autoComplete="name" value={form.name} onChange={handleChange} required maxLength={80} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Your name" /></div>
      <div><label htmlFor="reg-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label><input id="reg-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="you@example.com" /></div>
      <div><label htmlFor="reg-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label><input id="reg-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} minLength={6} maxLength={72} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="At least 6 characters" /><p className="mt-1 text-xs text-slate-500">Use at least 6 characters.</p></div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Creating account..." : "Create account"}</Button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-600">Already registered? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Log in</Link></p>
  </section></main>;
}
