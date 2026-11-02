import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const linkClass = ({ isActive }) => `transition hover:text-indigo-300 ${isActive ? "text-indigo-300" : "text-white"}`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => { logout(); closeMenu(); };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="text-2xl font-extrabold tracking-tight">Event<span className="text-indigo-400">Hub</span></Link>
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          {user ? <>
            <NavLink to="/my-registrations" className={linkClass}>My Registrations</NavLink>
            {user.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin Dashboard</NavLink>}
            <span className="max-w-36 truncate text-sm text-slate-300">Hi, {user.name}</span>
            <button onClick={handleLogout} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700">Logout</button>
          </> : <>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <Link to="/register" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold transition hover:bg-indigo-700">Create Account</Link>
          </>}
        </div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="rounded-lg border border-slate-600 px-3 py-2 md:hidden">{menuOpen ? "✕" : "☰"}</button>
      </div>
      {menuOpen && <div className="border-t border-slate-700 px-5 py-4 md:hidden"><div className="flex flex-col gap-4">
        <NavLink onClick={closeMenu} to="/" className={linkClass}>Home</NavLink>
        <NavLink onClick={closeMenu} to="/events" className={linkClass}>Events</NavLink>
        {user ? <>
          <NavLink onClick={closeMenu} to="/my-registrations" className={linkClass}>My Registrations</NavLink>
          {user.role === "admin" && <NavLink onClick={closeMenu} to="/admin" className={linkClass}>Admin Dashboard</NavLink>}
          <span className="text-sm text-slate-300">Logged in as {user.name}</span>
          <button onClick={handleLogout} className="rounded-lg bg-red-600 px-4 py-2 text-left font-semibold">Logout</button>
        </> : <>
          <NavLink onClick={closeMenu} to="/login" className={linkClass}>Login</NavLink>
          <NavLink onClick={closeMenu} to="/register" className={linkClass}>Register</NavLink>
        </>}
      </div></div>}
    </nav>
  );
}
