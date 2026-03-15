import { useState } from "react";
import { Eye, EyeOff, Hotel, Lock, Mail, ArrowRight, ArrowLeft, Star, User, Building2, CheckCircle2, Shield, Zap, Globe } from "lucide-react";
import { useNavigate } from "react-router";

const HOTEL_BG = "https://images.unsplash.com/photo-1761926545961-252275b47a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2wlMjByZXNvcnQlMjBhZXJpYWx8ZW58MXx8fHwxNzczNDk3MTIyfDA&ixlib=rb-4.1.0&q=80&w=1080";

const plans = [
  { id: "starter", label: "Starter", desc: "Up to 20 rooms", price: "Free", color: "border-emerald-400 bg-emerald-500/10", accent: "text-emerald-400" },
  { id: "professional", label: "Professional", desc: "Up to 100 rooms", price: "$49/mo", color: "border-amber-400 bg-amber-500/10", accent: "text-amber-400", popular: true },
  { id: "enterprise", label: "Enterprise", desc: "Unlimited rooms", price: "$149/mo", color: "border-sky-400 bg-sky-500/10", accent: "text-sky-400" },
];

const passwordChecks = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Contains special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

type Step = 1 | 2 | 3;

export function SignUp() {
  const navigate = useNavigate();

  // Step 1 – Account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 2 – Hotel
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [totalRooms, setTotalRooms] = useState("");

  // Step 3 – Plan
  const [selectedPlan, setSelectedPlan] = useState("professional");

  // Meta
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const passStrength = passwordChecks.filter(c => c.test(password)).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passStrength];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-amber-400", "bg-green-500"][passStrength];

  const validateStep1 = () => {
    if (!fullName.trim()) return "Please enter your full name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
    if (passStrength < 3) return "Password is too weak. Please make it stronger.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!agreeTerms) return "You must agree to the terms and conditions.";
    return "";
  };

  const validateStep2 = () => {
    if (!hotelName.trim()) return "Please enter your hotel name.";
    return "";
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setDone(true);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = "1px solid rgba(251,191,36,0.5)";
    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col relative w-[58%] flex-shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HOTEL_BG})` }} />
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
            <h1 className="text-white mb-4" style={{ fontSize: "2.6rem", fontWeight: 700, lineHeight: 1.15 }}>
              Start Your
              <br />
              <span className="text-amber-400">Hospitality</span>
              <br />
              Journey Today
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Join hundreds of hotels worldwide already using HotelSaaS to streamline
              operations and deliver exceptional guest experiences.
            </p>

            {/* Feature cards */}
            <div className="mt-10 space-y-4">
              {[
                { icon: Shield, title: "Enterprise Security", desc: "SOC2 compliant with end-to-end encryption" },
                { icon: Zap, title: "Set Up in Minutes", desc: "Quick onboarding — no technical expertise needed" },
                { icon: Globe, title: "Multi-Property Support", desc: "Manage multiple locations from a single dashboard" },
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
              "We went live in under 24 hours. The onboarding was effortless."
            </p>
            <p className="text-amber-400/80 text-xs mt-2 font-medium">— Operations Director, Coastal Resorts</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col relative bg-[#0f1923]">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,191,36,0.6) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }} />
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

            {done ? (
              /* ── Success ── */
              <div className="text-center">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "rgba(34,197,94,0.4)" }} />
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.3)" }}>
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">Account Created</p>
                <h2 className="text-white mb-3" style={{ fontSize: "1.7rem", fontWeight: 700 }}>
                  Welcome to
                  <br />
                  <span className="text-amber-400">HotelSaaS!</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-2">
                  Your account has been created successfully. A verification email has been sent to:
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">{email}</span>
                </div>

                <div className="text-left space-y-3 mb-8">
                  {[
                    { s: "1", t: "Verify your email address" },
                    { s: "2", t: "Complete your hotel profile" },
                    { s: "3", t: "Start managing your property" },
                  ].map(item => (
                    <div key={item.s} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400 text-xs font-bold">{item.s}</span>
                      </div>
                      <span className="text-white/60 text-sm">{item.t}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all group"
                  style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #d97706 100%)" }}
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Go to Sign In
                </button>

                <p className="text-white/20 text-xs text-center mt-4">
                  Demo note: In production, you'd receive a real verification email.
                </p>
              </div>
            ) : (
              <>
                {/* Stepper */}
                <div className="flex items-center gap-2 mb-8">
                  {[
                    { n: 1 as Step, label: "Account" },
                    { n: 2 as Step, label: "Hotel" },
                    { n: 3 as Step, label: "Plan" },
                  ].map((s, i) => (
                    <div key={s.n} className="flex items-center gap-2 flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                        step > s.n ? "bg-green-500 text-white" :
                        step === s.n ? "bg-amber-500 text-white" :
                        "text-white/30"
                      }`} style={step < s.n ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" } : undefined}>
                        {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                      </div>
                      <span className={`text-xs font-medium hidden sm:inline ${step >= s.n ? "text-white/80" : "text-white/30"}`}>{s.label}</span>
                      {i < 2 && <div className={`flex-1 h-px ${step > s.n ? "bg-green-500/50" : "bg-white/10"}`} />}
                    </div>
                  ))}
                </div>

                {/* Heading */}
                <div className="mb-6">
                  <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">
                    {step === 1 ? "Create Account" : step === 2 ? "Hotel Details" : "Choose Plan"}
                  </p>
                  <h2 className="text-white leading-tight" style={{ fontSize: "1.9rem", fontWeight: 700 }}>
                    {step === 1 && (<>Set up your <span className="text-amber-400">account</span></>)}
                    {step === 2 && (<>Tell us about your <span className="text-amber-400">hotel</span></>)}
                    {step === 3 && (<>Select your <span className="text-amber-400">plan</span></>)}
                  </h2>
                  <p className="text-white/50 text-sm mt-2">
                    {step === 1 && "Enter your personal details to get started."}
                    {step === 2 && "Help us configure your property management."}
                    {step === 3 && "Pick the plan that fits your hotel's needs."}
                  </p>
                </div>

                {/* ── Step 1: Account ── */}
                {step === 1 && (
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                        <input type="text" value={fullName} onChange={e => { setFullName(e.target.value); setError(""); }} placeholder="John Smith" className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@hotel.com" className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-amber-400 transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength meter */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1.5">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= passStrength ? strengthColor : "bg-white/10"}`} />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {passwordChecks.map((c, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${c.test(password) ? "bg-green-500" : "bg-white/10"}`}>
                                  {c.test(password) && (
                                    <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  )}
                                </div>
                                <span className={`text-[10px] ${c.test(password) ? "text-green-400" : "text-white/30"}`}>{c.label}</span>
                              </div>
                            ))}
                          </div>
                          <p className={`text-[10px] mt-1 font-medium ${passStrength >= 3 ? "text-green-400" : passStrength >= 2 ? "text-yellow-400" : "text-red-400"}`}>
                            Password strength: {strengthLabel}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                        <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(""); }} placeholder="••••••••" className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-amber-400 transition-colors">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-red-400 text-[10px] mt-1.5">Passwords do not match</p>
                      )}
                      {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                        <p className="text-green-400 text-[10px] mt-1.5">Passwords match</p>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => setAgreeTerms(v => !v)}
                        className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-all ${agreeTerms ? "bg-amber-500 border-amber-500" : "border border-white/20"}`}
                      >
                        {agreeTerms && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </button>
                      <span className="text-white/50 text-sm leading-relaxed">
                        I agree to the <button type="button" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Terms of Service</button> and <button type="button" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Privacy Policy</button>
                      </span>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Hotel ── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Hotel Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                        <input type="text" value={hotelName} onChange={e => { setHotelName(e.target.value); setError(""); }} placeholder="Grand Palace Hotel" className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Address <span className="text-white/30 normal-case">(optional)</span></label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                        <input type="text" value={hotelAddress} onChange={e => setHotelAddress(e.target.value)} placeholder="123 Main Street, City" className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Phone <span className="text-white/30 normal-case">(opt.)</span></label>
                        <input type="tel" value={hotelPhone} onChange={e => setHotelPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                      </div>
                      <div>
                        <label className="block text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Total Rooms</label>
                        <input type="number" value={totalRooms} onChange={e => setTotalRooms(e.target.value)} placeholder="50" className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 rounded-xl mt-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3 font-semibold">Property Preview</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{hotelName || "Your Hotel Name"}</p>
                          <p className="text-white/40 text-xs mt-0.5">{hotelAddress || "Hotel address"}</p>
                          <p className="text-white/30 text-xs mt-0.5">{totalRooms ? `${totalRooms} rooms` : "—"} {hotelPhone ? `· ${hotelPhone}` : ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Plan ── */}
                {step === 3 && (
                  <div className="space-y-3">
                    {plans.map(plan => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all relative ${
                          selectedPlan === plan.id
                            ? `${plan.color} border`
                            : "border border-white/8 hover:border-white/15"
                        }`}
                        style={selectedPlan !== plan.id ? { background: "rgba(255,255,255,0.03)" } : undefined}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold uppercase tracking-wide">Popular</span>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-semibold text-sm ${selectedPlan === plan.id ? plan.accent : "text-white"}`}>{plan.label}</p>
                            <p className="text-white/40 text-xs mt-0.5">{plan.desc}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${selectedPlan === plan.id ? plan.accent : "text-white/70"}`}>{plan.price}</p>
                          </div>
                        </div>
                        {/* Radio indicator */}
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === plan.id ? "border-amber-400" : "border-white/20"
                        }`} style={{ left: "-8px", display: "none" }} />
                      </button>
                    ))}

                    {/* Plan features */}
                    <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3 font-semibold">All plans include</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Booking Management",
                          "Guest Database",
                          "Housekeeping Board",
                          "Invoice Generation",
                          "Staff Scheduling",
                          "Real-Time Dashboard",
                          "Role-Based Access",
                          "Email Support",
                        ].map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                            <span className="text-white/50 text-xs">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl mt-4" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 mt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => { setStep((step - 1) as Step); setError(""); }}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-all group"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={step < 3 ? handleNext : handleSubmit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white relative overflow-hidden group transition-all disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #d97706 100%)", backgroundSize: "200% 100%" }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        Creating Account...
                      </div>
                    ) : step < 3 ? (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Sign in link */}
                <p className="text-center text-white/40 text-sm mt-6">
                  Already have an account?{" "}
                  <button onClick={() => navigate("/login")} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                    Sign In
                  </button>
                </p>
              </>
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
