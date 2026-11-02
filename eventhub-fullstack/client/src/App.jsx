import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyRegistrations from "./pages/MyRegistrations.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function NotFound() {
  return <main className="mx-auto max-w-3xl px-6 py-20 text-center"><h1 className="text-3xl font-bold text-slate-900">Page not found</h1><p className="mt-3 text-slate-600">The page you requested does not exist.</p><a href="/" className="mt-5 inline-block font-semibold text-indigo-600">Return home</a></main>;
}

export default function App() {
  return <BrowserRouter><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/events" element={<Events />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes></BrowserRouter>;
}
