import { useState } from "react";
import { Hotel, Mail, ArrowLeft, ArrowRight, CheckCircle2, Star, ShieldCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router";

const HOTEL_BG = "https://images.unsplash.com/photo-1768396855407-64587036bdcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGhhbGx3YXklMjBjb3JyaWRvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzczNDk2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  const handleResend = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left Panel: Hotel Image ── */}
      <div className="hidden lg:flex flex-col relative w-[58%] flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HOTEL_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-slate-900/40" />

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
              Account
              <br />
              <span className="text-amber-400">Recovery</span>
              <br />
              Made Simple
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Don't worry — it happens to the best of us. We'll help you get back
              into your dashboard in no time.
            </p>

            {/* Info cards */}
            <div className="mt-10 space-y-4">
              {[
                { icon: ShieldCheck, title: "Secure Process", desc: "256-bit encrypted password reset links" },
                { icon: Clock, title: "Quick Recovery", desc: "Reset link delivered within seconds" },
                { icon: Mail, title: "Email Verification", desc: "Sent only to your registered email address" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="border-l-2 border-amber-500/60 pl-4 max-w-xs">
            <p className="text-white/80 text-sm italic leading-relaxed">
              "Security is our top priority. Your data is always protected."
            </p>
            <p className="text-amber-400/80 text-xs mt-2 font-medium">— HotelSaaS Security Team</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Forgot Password Form ── */}
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
            {/* Back to login */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Sign In</span>
            </button>

            {!sent ? (
              <>
                {/* Heading */}
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.2)" }}
                  >
                    <Mail className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">Account Recovery</p>
                  <h2
                    className="text-white leading-tight"
                    style={{ fontSize: "1.9rem", fontWeight: 700 }}
                  >
                    Forgot your
                    <br />
                    <span className="text-amber-400">password?</span>
                  </h2>
                  <p className="text-white/50 text-sm mt-3 leading-relaxed">
                    No worries. Enter the email associated with your account and we'll send you a link to reset your password.
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
                        Sending Reset Link...
                      </div>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Help text */}
                <div className="mt-6 p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-white/30 text-xs leading-relaxed">
                    <span className="text-amber-400/60 font-semibold">Demo note:</span> This is a demonstration.
                    In production, a password reset email would be sent to your registered address. For demo access, use the login page credentials.
                  </p>
                </div>
              </>
            ) : (
              /* ── Success State ── */
              <div className="text-center">
                {/* Animated check */}
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "rgba(34,197,94,0.4)" }} />
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.3)" }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                </div>

                <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">Email Sent</p>
                <h2
                  className="text-white leading-tight mb-3"
                  style={{ fontSize: "1.7rem", fontWeight: 700 }}
                >
                  Check your
                  <br />
                  <span className="text-amber-400">inbox</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-2">
                  We've sent a password reset link to:
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6"
                  style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">{email}</span>
                </div>

                {/* Instructions */}
                <div className="text-left space-y-3 mb-8">
                  {[
                    { step: "1", text: "Open the email from HotelSaaS" },
                    { step: "2", text: "Click the \"Reset Password\" button" },
                    { step: "3", text: "Create your new password" },
                  ].map(item => (
                    <div key={item.step} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400 text-xs font-bold">{item.step}</span>
                      </div>
                      <span className="text-white/60 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all group"
                    style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #d97706 100%)" }}
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Sign In
                  </button>

                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-medium text-white/40 hover:text-amber-400 transition-all disabled:opacity-50"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {loading ? "Resending..." : "Didn't receive the email? Resend"}
                  </button>
                </div>

                {/* Expiry notice */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-white/25" />
                  <p className="text-white/25 text-xs">Reset link expires in 30 minutes</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-10 max-w-sm mx-auto w-full">
            <p className="text-white/20 text-xs text-center">
              &copy; 2026 HotelSaaS Management Suite &middot; All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
