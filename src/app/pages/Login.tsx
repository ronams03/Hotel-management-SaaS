import { useState } from "react";
import { Eye, EyeOff, Hotel, Lock, Mail, ArrowRight, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const HOTEL_BG = "https://images.unsplash.com/photo-1758714919725-d2740fc99f14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwZWxlZ2FudCUyMGludGVyaW9yfGVufDF8fHx8MTc3MzQ5MzgwOHww&ixlib=rb-4.1.0&q=80&w=1080";

const demoAccounts = [
  { email: "admin@hotel.com", password: "admin123", label: "Super Admin", color: "bg-amber-500" },
  { email: "manager@hotel.com", password: "manager123", label: "Manager", color: "bg-sky-500" },
  { email: "staff@hotel.com", password: "staff123", label: "Receptionist", color: "bg-emerald-500" },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@hotel.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    if (!ok) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const fillDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left Panel: Hotel Image ── */}
      <div className="hidden lg:flex flex-col relative w-[58%] flex-shrink-0">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HOTEL_BG})` }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-slate-900/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold tracking-wide">HotelSaaS</p>
              <p className="text-amber-300/80 text-xs tracking-widest uppercase">Management Suite</p>
            </div>
          </div>

          {/* Center copy */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h1
              className="text-white mb-4 leading-tight"
              style={{ fontSize: "2.6rem", fontWeight: 700, lineHeight: 1.15 }}
            >
              Elevate Your
              <br />
              <span className="text-amber-400">Hospitality</span>
              <br />
              Experience
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              A complete hotel management platform designed for modern hoteliers.
              Manage bookings, staff, housekeeping and billing — all in one place.
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mt-10">
              {[
                { val: "10+", label: "Modules" },
                { val: "99.9%", label: "Uptime" },
                { val: "5★", label: "Rated" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-amber-400 font-bold text-2xl">{s.val}</p>
                  <p className="text-white/60 text-xs mt-0.5 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="border-l-2 border-amber-500/60 pl-4 max-w-xs">
            <p className="text-white/80 text-sm italic leading-relaxed">
              "HotelSaaS transformed how we manage our property. Everything is now seamless."
            </p>
            <p className="text-amber-400/80 text-xs mt-2 font-medium">— General Manager, Grand Palace Hotel</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex flex-col relative bg-[#0f1923]">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,191,36,0.6) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full px-8 py-10 sm:px-14 overflow-y-auto justify-center">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">HotelSaaS</p>
              <p className="text-amber-400/70 text-xs tracking-widest uppercase">Management Suite</p>
            </div>
          </div>

          <div className="max-w-sm w-full mx-auto">
            {/* Heading */}
            <div className="mb-8">
              <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">Welcome back</p>
              <h2
                className="text-white leading-tight"
                style={{ fontSize: "1.9rem", fontWeight: 700 }}
              >
                Sign in to your
                <br />
                <span className="text-amber-400">dashboard</span>
              </h2>
              <p className="text-white/50 text-sm mt-3">
                Enter your credentials to access the management system.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@hotel.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.border = "1px solid rgba(251,191,36,0.5)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    }}
                    onBlur={e => {
                      e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide">
                    Password
                  </label>
                  <button type="button" onClick={() => navigate("/forgot-password")} className="text-amber-400/70 text-xs hover:text-amber-400 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.border = "1px solid rgba(251,191,36,0.5)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    }}
                    onBlur={e => {
                      e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-amber-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRememberMe(v => !v)}
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${rememberMe ? "bg-amber-500 border-amber-500" : "border border-white/20"}`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-white/50 text-sm">Keep me signed in</span>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white relative overflow-hidden group transition-all disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #d97706 100%)", backgroundSize: "200% 100%" }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Authenticating...
                  </div>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <p className="text-white/30 text-xs">Quick Access Demo</p>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Demo accounts */}
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all group"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(251,191,36,0.3)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.08)";
                  }}
                >
                  <div className={`w-7 h-7 ${acc.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {acc.label[0]}
                  </div>
                  <span className="text-white/60 text-xs text-center group-hover:text-white/90 transition-colors leading-tight">{acc.label}</span>
                </button>
              ))}
            </div>
            <p className="text-white/25 text-xs text-center mt-3">Click a role to auto-fill credentials</p>

            {/* Sign up link */}
            <p className="text-center text-white/40 text-sm mt-6">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                Sign Up
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-10 max-w-sm mx-auto w-full">
            <p className="text-white/20 text-xs text-center">
              © 2026 HotelSaaS Management Suite · All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}