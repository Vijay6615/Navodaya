"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";

/*
  pages/index.js
  - Booking app (improved)
  - Responsive Navbar with Login/Profile/Logout + "More"
  - Client-side session stored in sessionStorage under key 'pandit_user'
  - Profile modal shows user's details and their bookings
*/

export default function Home() {
  /* ---------- Session (simple client-side login) ---------- */
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem("pandit_user");
        return raw ? JSON.parse(raw) : null;
      }
    } catch { /* ignore */ }
    return null;
  });

  function saveUserToSession(user) {
    try {
      sessionStorage.setItem("pandit_user", JSON.stringify(user));
    } catch {}
    setCurrentUser(user);
  }
  function clearUserSession() {
    try {
      sessionStorage.removeItem("pandit_user");
    } catch {}
    setCurrentUser(null);
  }

  /* ---------- UI state ---------- */
  const [showBooking, setShowBooking] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const bookingsRef = useRef(null);

  /* ---------- Booking data & server ---------- */
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", puja: "", date: "" });

  const pujas = useMemo(
    () => [
      { name: "Satyanarayan Puja", desc: "For prosperity, happiness and peace.", img: "/puja1.jpg" },
      { name: "Griha Pravesh", desc: "Before entering a new home.", img: "/puja2.jpg" },
      { name: "Vivah Puja", desc: "Marriage ceremony with divine blessings.", img: "/puja3.jpg" },
      { name: "Navagraha Shanti", desc: "Balance planetary influences.", img: "/puja4.jpg" },
      { name: "Rudrabhishek", desc: "For peace & prosperity.", img: "/puja5.jpg" },
      { name: "Mundan Ceremony", desc: "Child's first haircut ritual.", img: "/puja6.jpg" },
    ],
    []
  );

  const idOf = (b) => b._id || b.id;

  /* ---------- Fetch bookings ---------- */
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoadingBookings(true);
      setFetchError(null);
      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to load");
        if (mounted) setBookings(data.bookings || []);
      } catch (err) {
        console.error("Fetch bookings failed:", err);
        if (mounted) {
          setFetchError("Unable to load bookings. Using cached entries (if any).");
          try {
            const saved = typeof window !== "undefined" && localStorage.getItem("pujaBookings");
            if (saved) setBookings(JSON.parse(saved));
          } catch (e) {}
        }
      } finally {
        if (mounted) setLoadingBookings(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem("pujaBookings", JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  /* ---------- Validation ---------- */
  function validateForm() {
    if (!form.name.trim()) return "Enter your name";
    if (!/^\d{10}$/.test(form.phone.trim())) return "Enter a valid 10-digit phone number";
    if (!form.puja) return "Choose a Puja";
    if (!form.date) return "Pick a date";
    const selected = new Date(form.date);
    const today = new Date(); today.setHours(0,0,0,0);
    if (selected < today) return "Choose a present or future date";
    return null;
  }

  /* ---------- Submit booking (POST) ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateForm();
    if (err) { alert(err); return; }

    setSubmitted(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || `Failed: ${res.status}`);
      setBookings((prev) => [data.booking, ...prev]);
      // save user to session so navbar/profile works
      saveUserToSession({ name: form.name, phone: form.phone });
      alert(`🙏 Thank you ${form.name}! Your ${form.puja} Puja is booked.`);
      setForm({ name: "", phone: "", puja: "", date: "" });
      setShowBooking(false);
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.message || "Server error while booking");
    } finally {
      setSubmitted(false);
    }
  }

  /* ---------- Cancel booking (PUT) ---------- */
  async function cancelBooking(id) {
    if (!confirm("Cancel this Puja?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to cancel");
      setBookings((prev) => prev.map((b) => (idOf(b) === id ? data.booking : b)));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  }

  /* ---------- Utilities for navbar links ---------- */
  function goToBookings() {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }
    // scroll bookings into view
    setTimeout(() => {
      bookingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  /* ---------- Sanskrit background words ---------- */
  const sanskritWords = useMemo(() => ["ॐ", "शान्ति", "धर्म", "कर्म", "मोक्ष", "सत्य", "शक्ति"], []);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 overflow-hidden">
      <SanskritBackground words={sanskritWords} />
      <NavBar
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        currentUser={currentUser}
        onLogin={() => setShowLogin(true)}
        onLogout={() => { clearUserSession(); alert("Logged out"); }}
        onProfile={() => setShowProfile(true)}
        onBookings={() => goToBookings()}
      />

      <Header onBook={() => setShowBooking(true)} />

      <ProfileTop setForm={setForm} setShowBooking={setShowBooking} />

      <PujaGrid pujas={pujas} setForm={setForm} setShowBooking={setShowBooking} />

      <div className="max-w-6xl mx-auto px-4" ref={bookingsRef}>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">🪔 My Bookings</h2>
          {loadingBookings ? (
            <div className="p-4 bg-white rounded-lg shadow text-center">Loading bookings…</div>
          ) : fetchError ? (
            <div className="p-3 bg-yellow-100 rounded-md text-sm text-yellow-900 mb-3">{fetchError}</div>
          ) : null}
          <BookingsTable bookings={bookings} onCancel={(b) => cancelBooking(idOf(b))} currentUser={currentUser} />
        </div>
      </div>

      {showBooking && (
        <BookingModal
          form={form}
          setForm={setForm}
          onClose={() => setShowBooking(false)}
          onSubmit={handleSubmit}
          submitting={submitted}
          pujas={pujas}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={(user) => { saveUserToSession(user); setShowLogin(false); }}
        />
      )}

      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          user={currentUser}
          bookings={bookings}
          onCancel={(id) => cancelBooking(id)}
          onLogout={() => { clearUserSession(); setShowProfile(false); }}
        />
      )}
    </main>
  );
}

/* -------------------- Navbar (responsive) -------------------- */
function NavBar({ mobileNavOpen, setMobileNavOpen, currentUser, onLogin, onLogout, onProfile, onBookings }) {
  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-30 shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>

            <a href="#" className="font-bold text-lg">Pandit Profile</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-sm" onClick={(e)=>{ e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }}>Home</a>
            <button className="text-sm" onClick={onBookings}>My Bookings</button>
            <a href="#services" className="text-sm">Services</a>

            <div className="relative">
              {currentUser ? (
                <ProfileDropdown user={currentUser} onProfile={onProfile} onLogout={onLogout} />
              ) : (
                <button className="px-3 py-1 bg-orange-600 text-white rounded" onClick={onLogin}>Login</button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileNavOpen && (
          <div className="md:hidden py-2 flex flex-col gap-2 pb-4">
            <a href="#" className="px-3 py-2 rounded hover:bg-gray-100" onClick={(e)=>{ e.preventDefault(); document.documentElement.scrollTo({top:0, behavior:'smooth'}); setMobileNavOpen(false); }}>Home</a>
            <button className="text-left px-3 py-2 rounded hover:bg-gray-100" onClick={() => { setMobileNavOpen(false); onBookings(); }}>My Bookings</button>
            <a href="#services" className="px-3 py-2 rounded hover:bg-gray-100" onClick={()=>setMobileNavOpen(false)}>Services</a>

            <div className="px-3">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xl">{(currentUser.name||"U")[0].toUpperCase()}</div>
                  <div>
                    <div className="font-medium">{currentUser.name}</div>
                    <div className="text-sm text-gray-600">{currentUser.phone}</div>
                    <div className="mt-2 flex gap-2">
                      <button className="px-3 py-1 border rounded" onClick={()=>{ setMobileNavOpen(false); onProfile(); }}>Profile</button>
                      <button className="px-3 py-1 border rounded text-red-600" onClick={()=>{ setMobileNavOpen(false); onLogout(); }}>Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button className="w-full px-3 py-2 bg-orange-600 text-white rounded" onClick={() => { setMobileNavOpen(false); onLogin(); }}>Login</button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function ProfileDropdown({ user, onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">{(user.name||"U")[0].toUpperCase()}</div>
        <div className="text-sm hidden sm:block">{user.name}</div>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-40" role="menu" aria-label="Profile menu">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setOpen(false); onProfile(); }}>My Profile</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setOpen(false); onLogout(); }}>Logout</button>
          <div className="border-t mt-1" />
          <a className="block px-4 py-2 text-sm text-gray-600" href="#more" onClick={() => setOpen(false)}>More</a>
        </div>
      )}
    </div>
  );
}

/* ------------------- Other UI components (unchanged mostly) ------------------- */

function SanskritBackground({ words }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {words.map((word, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute text-orange-300 text-6xl font-bold opacity-20 select-none"
          initial={{ x: Math.random() * 900, y: Math.random() * 700 }}
          animate={{ y: [Math.random() * 700, Math.random() * 700 - 350], opacity: [0.08, 0.36, 0.08] }}
          transition={{ repeat: Infinity, duration: 12 + Math.random() * 10, delay: i * 1.5 }}
        >
          {word}
        </motion.div>
      ))}
    </div>
  );
}

function Header({ onBook }) {
  return (
    <header className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white text-center py-8 shadow-xl relative z-10">
      <h1 className="text-4xl font-extrabold">🔱 ॐ गण गणपतये नमः 🔱</h1>
      <p className="text-sm mt-2">Book your Puja & Spiritual Services Online</p>
      <div className="mt-4">
        <button onClick={onBook} className="bg-orange-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-800">📿 Book a Puja</button>
      </div>
    </header>
  );
}

function ProfileTop({ setForm, setShowBooking }) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-10 p-10 relative z-10">
      <Image src="/panditji.jpg" alt="Pandit Ji" width={220} height={220} className="rounded-full shadow-2xl border-4 border-orange-400" />
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-orange-700">जयप्रकाश शुक्ला जी</h2>
        <p className="text-gray-700 mt-2 max-w-md">Experienced Vedic Pandit with 15+ years in spiritual ceremonies.</p>
        <div className="mt-6">
          <button onClick={() => { setForm(f => ({...f, puja: ""})); setShowBooking(true); }} className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition-all">📿 Book a Puja</button>
        </div>
      </div>
    </section>
  );
}

function PujaGrid({ pujas, setForm, setShowBooking }) {
  return (
    <section id="services" className="px-6 pb-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10 max-w-6xl mx-auto">
      {pujas.map((p, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden">
          <Image src={p.img} alt={p.name} width={400} height={250} className="rounded-t-2xl w-full h-52 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-orange-700">{p.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{p.desc}</p>
            <button onClick={() => { setForm(f => ({...f, puja: p.name})); setShowBooking(true); }} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full">Book Now</button>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

function BookingsTable({ bookings = [], onCancel, currentUser }) {
  // If user is logged in show only their bookings by default, else show all bookings.
  const filtered = currentUser ? bookings.filter(b => (b.phone === currentUser.phone || b.name === currentUser.name)) : bookings;
  if (!filtered || filtered.length === 0) {
    return <div className="p-4 bg-white rounded-lg shadow">No bookings yet.</div>;
  }
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-orange-100 text-orange-800">
            <th className="py-2 px-3 text-left">Puja</th>
            <th className="py-2 px-3 text-left">Date</th>
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => {
            const id = b._id || b.id;
            return (
              <tr key={id} className="border-b hover:bg-orange-50">
                <td className="py-2 px-3">{b.puja}</td>
                <td className="py-2 px-3">{b.date}</td>
                <td className="py-2 px-3">{b.name}</td>
                <td className={`py-2 px-3 font-semibold ${b.status === "Cancelled" ? "text-red-500" : b.status === "Completed" ? "text-green-600" : "text-orange-600"}`}>{b.status}</td>
                <td className="py-2 px-3 text-center">
                  {b.status !== "Cancelled" && (currentUser && (b.phone === currentUser.phone || b.name === currentUser.name)) && (
                    <button onClick={() => onCancel(id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600">Cancel</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------- Booking modal ------------------- */
function BookingModal({ form, setForm, onClose, onSubmit, submitting, pujas }) {
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <motion.form onSubmit={onSubmit} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }} className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative">
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">✕</button>
        <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center">📿 Book a Puja</h2>

        <input type="text" placeholder="Your Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-orange-400" />
        <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} required className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-orange-400" />

        <select value={form.puja} onChange={(e)=>setForm({...form, puja: e.target.value})} required className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-orange-400">
          <option value="">Select Puja</option>
          {pujas.map((p)=> <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>

        <label className="block text-gray-600 mb-1 font-medium">Select Puja Date:</label>
        <input type="date" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} required min={minDate} className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-orange-400" />

        <button type="submit" disabled={submitting} className="bg-orange-600 text-white w-full py-3 rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <Spinner/> : null}
          {submitting ? "Booking..." : "Submit Booking"}
        </button>
      </motion.form>
    </div>
  );
}

/* ------------------- Login modal ------------------- */
function LoginModal({ onClose, onLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Enter name");
    if (!/^\d{10}$/.test(phone.trim())) return alert("Enter valid 10-digit phone");
    onLogin({ name: name.trim(), phone: phone.trim() });
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <motion.form onSubmit={handleLogin} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative">
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">✕</button>
        <h3 className="text-xl font-semibold mb-3">Login (for profile & quick booking)</h3>
        <input type="text" placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full border p-3 rounded-lg mb-3" required />
        <input type="tel" placeholder="Phone (10 digits)" value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border p-3 rounded-lg mb-3" required />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg">Login</button>
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
        </div>
      </motion.form>
    </div>
  );
}

/* ------------------- Profile modal ------------------- */
function ProfileModal({ user, bookings = [], onClose, onCancel, onLogout }) {
  const myBookings = (user && bookings) ? bookings.filter(b => b.phone === user.phone || b.name === user.name) : [];
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative">
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">✕</button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl">{(user?.name||"U")[0].toUpperCase()}</div>
          <div>
            <div className="text-lg font-semibold">{user?.name}</div>
            <div className="text-sm text-gray-600">{user?.phone}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => { onClose(); }}>Close</button>
              <button className="px-3 py-1 border rounded text-red-600" onClick={() => { onLogout(); }}>Logout</button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold">Your Bookings</h4>
          {myBookings.length === 0 ? (
            <div className="p-3 text-sm text-gray-600">No bookings found for your account.</div>
          ) : (
            <div className="mt-3 space-y-2">
              {myBookings.map((b) => {
                const id = b._id || b.id;
                return (
                  <div key={id} className="border rounded p-3 flex items-start justify-between">
                    <div>
                      <div className="font-medium">{b.puja}</div>
                      <div className="text-sm text-gray-600">{b.date}</div>
                      <div className={`mt-2 text-xs font-medium ${b.status === 'Cancelled' ? 'text-red-600' : 'text-green-700'}`}>{b.status}</div>
                    </div>
                    <div>
                      {b.status !== "Cancelled" && <button onClick={() => onCancel(id)} className="px-3 py-1 border rounded text-sm text-red-600">Cancel</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}
