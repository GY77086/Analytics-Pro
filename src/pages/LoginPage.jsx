import React, { useState, useEffect } from "react";
import { Activity, Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle, Smartphone } from "lucide-react";

const DEMO_USER = { name: "Govind", email: "govind@demo.com", password: "admin123" };

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 2FA Verification step
  const [showTfaVerify, setShowTfaVerify] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [tempUser, setTempUser] = useState(null);

  // Initialize simulated DB
  useEffect(() => {
    const existing = localStorage.getItem("users_db");
    if (!existing) {
      localStorage.setItem("users_db", JSON.stringify([DEMO_USER]));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 850)); // Simulating network lag

    const users = JSON.parse(localStorage.getItem("users_db") || JSON.stringify([DEMO_USER]));

    if (isSignUp) {
      // Sign Up validation
      if (!form.name.trim()) {
        setError("Name is required.");
        setLoading(false);
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const emailExists = users.some((u) => u.email.toLowerCase() === form.email.toLowerCase());
      if (emailExists) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      // Add to simulated db
      const newUser = { name: form.name, email: form.email, password: form.password };
      users.push(newUser);
      localStorage.setItem("users_db", JSON.stringify(users));

      setSuccess("Account created successfully! Please sign in.");
      setIsSignUp(false);
      setForm({ ...form, password: "", confirmPassword: "" });
    } else {
      // Sign In validation
      const userMatch = users.find(
        (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
      );

      if (userMatch) {
        // Check if 2FA is active for this email
        const is2faActive = localStorage.getItem(`tfa_enabled_${userMatch.email}`) === "true";
        if (is2faActive) {
          setTempUser(userMatch);
          setShowTfaVerify(true);
        } else {
          onLogin({ name: userMatch.name, email: userMatch.email });
        }
      } else {
        setError("Invalid email or password.");
      }
    }
    setLoading(false);
  };

  const handle2faSubmit = (e) => {
    e.preventDefault();
    if (tfaCode.length === 6 && /^\d+$/.test(tfaCode)) {
      onLogin({ name: tempUser.name, email: tempUser.email });
    } else {
      setError("Please enter a valid 6-digit code.");
    }
  };

  const fillDemo = () => {
    setIsSignUp(false);
    setShowTfaVerify(false);
    setForm({ name: "", email: DEMO_USER.email, password: DEMO_USER.password, confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Title / Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-3 shadow-xl">
            <Activity size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AnalyticsPro</h1>
          <p className="text-blue-200 mt-1 text-sm">
            {showTfaVerify ? "Two-Factor Verification Required" : isSignUp ? "Create a free account to get started" : "Sign in to access your analytics dashboard"}
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {showTfaVerify ? (
            // ── 2FA VERIFICATION CODE SCREEN ──
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <Smartphone className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800">Two-Factor Auth</h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Your account is protected by 2FA. Please open your authenticator app and enter the 6-digit code:
              </p>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-2 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handle2faSubmit} className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={tfaCode}
                  onChange={(e) => setTfaCode(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full text-center tracking-widest font-mono text-xl py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTfaVerify(false);
                      setTempUser(null);
                      setTfaCode("");
                      setError("");
                    }}
                    className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold shadow"
                  >
                    Verify & Login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // ── STANDARD SIGN IN / SIGN UP SCREEN ──
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </h2>
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold uppercase tracking-wider"
                >
                  {isSignUp ? "Have an account? Sign In" : "Need an account? Sign Up"}
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5 text-sm">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Sign Up only) */}
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Govind Singh"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPwd ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPwd ? "text" : "password"}
                        required
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Action button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Demo account */}
              <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Demo Access</span>
                  <button
                    onClick={fillDemo}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                  >
                    Autofill
                  </button>
                </div>
                <div className="mt-1 text-xs text-slate-600 font-mono">
                  Email: govind@demo.com | Pass: admin123
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}