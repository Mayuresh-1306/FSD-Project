import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Button from "../components/Button.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) return setError("Enter your email and password.");
    try {
      setSubmitting(true);
      const data = await login(form.email.trim(), form.password);
      const destination = location.state?.from?.pathname;
      navigate(destination || (data.user.role === "admin" ? "/admin" : "/events"), { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="min-h-[calc(100vh-72px)] bg-slate-100 px-4 py-12 sm:px-6"><section className="mx-auto max-w-md rounded-2xl bg-white p-7 shadow-lg sm:p-9">
    <h1 className="text-3xl font-extrabold text-slate-900">Welcome back</h1><p className="mt-2 text-slate-600">Log in to manage your registrations.</p>
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <div><label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label><input id="login-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="you@example.com" /></div>
      <div><label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Your password" /></div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Signing in..." : "Log in"}</Button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-600">New to EventHub? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link></p>
  </section></main>;
}
