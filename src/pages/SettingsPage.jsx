import React, { useState } from "react";
import { User, Bell, Shield, Palette, Globe, Save, Check, Key, QrCode, Copy, Trash2, Smartphone } from "lucide-react";

const tabs = [
  { id: "profile",        label: "Profile",       icon: User     },
  { id: "notifications",  label: "Notifications", icon: Bell     },
  { id: "security",       label: "Security",      icon: Shield   },
  { id: "appearance",     label: "Appearance",    icon: Palette  },
  { id: "regional",       label: "Regional",      icon: Globe    },
];

const ACCENT_COLORS = {
  blue: {
    bg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    lightBg: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
    border: "border-blue-600",
  },
  green: {
    bg: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    text: "text-green-600 dark:text-green-400",
    lightBg: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
    border: "border-green-600",
  },
  purple: {
    bg: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    text: "text-purple-600 dark:text-purple-400",
    lightBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
    border: "border-purple-600",
  },
  orange: {
    bg: "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500",
    text: "text-orange-500 dark:text-orange-400",
    lightBg: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
    border: "border-orange-500",
  },
};

function Toggle({ checked, onChange, accent = "blue" }) {
  const accentCls = accent === "green" ? "bg-green-600" : accent === "purple" ? "bg-purple-600" : accent === "orange" ? "bg-orange-500" : "bg-blue-600";
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${
        checked ? accentCls : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function SettingsPage({
  user,
  onLogout,
  onUserUpdate,
  theme,
  onThemeChange,
  accent = "blue",
  onAccentChange,
  compact,
  onCompactChange,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Load state from localStorage or user context
  const [profile, setProfile] = useState({
    name: user?.name || "Govind",
    email: user?.email || "govind@demo.com",
    bio: localStorage.getItem(`profile_bio_${user?.email}`) || "Frontend Developer & Data Enthusiast",
  });

  const [notifs, setNotifs] = useState(() => {
    const savedNotifs = localStorage.getItem(`notifs_${user?.email}`);
    return savedNotifs
      ? JSON.parse(savedNotifs)
      : { email: true, push: true, weekly: false, security: true };
  });

  // 2FA Setup Flow State
  const [tfaEnabled, setTfaEnabled] = useState(() => {
    return localStorage.getItem(`tfa_enabled_${user?.email}`) === "true";
  });
  const [showTfaModal, setShowTfaModal] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [tfaError, setTfaError] = useState("");

  const activeAccent = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;

  const handleProfileSave = (e) => {
    e.preventDefault();
    // Update local simulated DB
    const users = JSON.parse(localStorage.getItem("users_db") || "[]");
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, name: profile.name, email: profile.email };
      }
      return u;
    });
    localStorage.setItem("users_db", JSON.stringify(updatedUsers));
    localStorage.setItem(`profile_bio_${user.email}`, profile.bio);

    // Tell app state
    onUserUpdate({ ...user, name: profile.name, email: profile.email });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNotificationSave = () => {
    localStorage.setItem(`notifs_${user.email}`, JSON.stringify(notifs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 2FA Activation Simulation
  const handleTfaVerify = (e) => {
    e.preventDefault();
    if (tfaCode.length === 6 && /^\d+$/.test(tfaCode)) {
      setTfaEnabled(true);
      localStorage.setItem(`tfa_enabled_${user.email}`, "true");
      setShowTfaModal(false);
      setTfaCode("");
      setTfaError("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setTfaError("Verification code must be 6 digits.");
    }
  };

  const handleDisableTfa = () => {
    if (window.confirm("Are you sure you want to disable Two-Factor Authentication?")) {
      setTfaEnabled(false);
      localStorage.setItem(`tfa_enabled_${user.email}`, "false");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Customize your account preferences, system appearance and security options
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar / Horizontal Tab bar for Mobile */}
        <div className="w-full lg:w-56 flex-shrink-0">
          {/* Responsive nav layout */}
          <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-2 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 no-scrollbar scroll-smooth">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setTfaError("");
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all
                  ${
                    activeTab === id
                      ? `${activeAccent.lightBg} font-bold`
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
            <div className="hidden lg:block border-t border-slate-100 dark:border-slate-700 my-2" />
            <button
              onClick={onLogout}
              className="lg:w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              Sign Out
            </button>
          </nav>
        </div>

        {/* Setting Card Panels */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 sm:p-6 transition-all min-w-0">
          
          {/* ── PROFILE PANEL ── */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Profile Information</h3>
                <p className="text-xs text-slate-400">Update your account name, email and biography</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${accent === "orange" ? "bg-orange-500" : accent === "green" ? "bg-green-600" : accent === "purple" ? "bg-purple-600" : "bg-blue-600"} flex items-center justify-center text-white text-2xl font-bold`}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center sm:text-left">
                  <button type="button" className={`text-sm font-bold ${activeAccent.text} hover:underline`}>
                    Upload Profile Picture
                  </button>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setFormProfile("name", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setFormProfile("email", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    About / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setFormProfile("bio", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  type="submit"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    saved ? "bg-green-600 text-white" : `${activeAccent.bg} text-white`
                  }`}
                >
                  {saved ? <><Check size={16} />Saved!</> : <><Save size={16} />Save Changes</>}
                </button>
              </div>
            </form>
          )}

          {/* Helper to update profile state */}
          {(() => {
            window.setFormProfile = (key, val) => setProfile((prev) => ({ ...prev, [key]: val }));
          })()}

          {/* ── NOTIFICATIONS PANEL ── */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Notification Preferences</h3>
                <p className="text-xs text-slate-400">Choose when and how you want to be notified</p>
              </div>

              <div className="space-y-1">
                {[
                  { key: "email",    label: "Email Notifications",   desc: "Receive account and billing updates via email"        },
                  { key: "push",     label: "Push Notifications",    desc: "Get notified of live metric spikes directly in browser" },
                  { key: "weekly",   label: "Weekly Analytics Digest",desc: "Receive a compiled weekly report PDF every Monday"     },
                  { key: "security", label: "Security & Login Alerts",desc: "Instant warning emails for new device sign-ins"       },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-4 border-b border-slate-50 dark:border-slate-700/50">
                    <div className="pr-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      checked={notifs[key]}
                      onChange={(val) => setNotifs({ ...notifs, [key]: val })}
                      accent={accent}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNotificationSave}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    saved ? "bg-green-600 text-white" : `${activeAccent.bg} text-white`
                  }`}
                >
                  {saved ? <><Check size={16} />Preferences Saved!</> : <><Save size={16} />Save Preferences</>}
                </button>
              </div>
            </div>
          )}

          {/* ── SECURITY PANEL (Interactive 2FA) ── */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Security Settings</h3>
                <p className="text-xs text-slate-400">Manage password options and configure two-factor authentication</p>
              </div>

              {/* Password update section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Change Password</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* 2FA Section */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Smartphone size={20} className={activeAccent.text} />
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Two-Factor Authentication (2FA)</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      Secures your account using authentication codes from apps like Google Authenticator or Authy.
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    tfaEnabled ? "bg-green-100 text-green-700" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}>
                    {tfaEnabled ? "Active" : "Disabled"}
                  </span>
                </div>

                {tfaEnabled ? (
                  <div className="pt-2">
                    <button
                      onClick={handleDisableTfa}
                      className="px-4 py-2 text-xs font-semibold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-xl transition"
                    >
                      Disable Two-Factor Authentication
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowTfaModal(true);
                        setTfaError("");
                      }}
                      className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow transition ${activeAccent.bg}`}
                    >
                      Enable 2FA Protection
                    </button>
                  </div>
                )}
              </div>

              {/* simulated 2FA verification Setup Modal */}
              {showTfaModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <QrCode className={activeAccent.text} />
                      <h4 className="font-bold text-slate-800 dark:text-white">Setup Authenticator App</h4>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        1. Scan this simulated QR code inside your Authenticator App (Google Authenticator, Authy, etc.):
                      </p>
                      
                      {/* Fake QR code */}
                      <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                            <rect x="10" y="10" width="20" height="20" />
                            <rect x="70" y="10" width="20" height="20" />
                            <rect x="10" y="70" width="20" height="20" />
                            <rect x="40" y="30" width="20" height="40" fillOpacity={0.8} />
                            <rect x="70" y="50" width="10" height="20" />
                            <rect x="50" y="10" width="10" height="10" />
                            <rect x="15" y="45" width="15" height="15" />
                            <rect x="75" y="75" width="15" height="15" />
                          </svg>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="font-mono select-all">JBSWY3DPEHPK3PXP</span>
                        <button
                          onClick={() => alert("Copied setup key!")}
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                        >
                          <Copy size={12} /> Copy Key
                        </button>
                      </div>

                      <form onSubmit={handleTfaVerify} className="space-y-3 pt-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          2. Enter the 6-digit code generated by your app:
                        </p>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={tfaCode}
                          onChange={(e) => setTfaCode(e.target.value)}
                          placeholder="e.g. 123456"
                          className="w-full text-center tracking-widest font-mono text-lg py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {tfaError && (
                          <p className="text-xs text-red-600 font-medium">{tfaError}</p>
                        )}
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowTfaModal(false)}
                            className="flex-1 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className={`flex-1 py-2 text-xs font-bold text-white rounded-xl shadow ${activeAccent.bg}`}
                          >
                            Verify & Activate
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── APPEARANCE PANEL ── */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Appearance & Branding</h3>
                <p className="text-xs text-slate-400">Configure theme preferences, color palettes and sizing options</p>
              </div>

              {/* Theme Swapper */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">System Theme</p>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {[
                    { id: "light", label: "Light" },
                    { id: "dark",  label: "Dark"  },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onThemeChange(t.id)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold border-2 transition-all capitalize
                        ${
                          theme === t.id
                            ? `${activeAccent.border} ${activeAccent.text} ${activeAccent.lightBg} border-2`
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Palette Swapper */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Accent Theme Color</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: "blue",   name: "Royal Blue", cls: "bg-blue-600"   },
                    { id: "green",  name: "Emerald",    cls: "bg-green-600"  },
                    { id: "purple", name: "Purple Rain",cls: "bg-purple-600" },
                    { id: "orange", name: "Amber Rose", cls: "bg-orange-500" },
                  ].map(({ id, name, cls }) => (
                    <button
                      key={id}
                      onClick={() => onAccentChange(id)}
                      className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <span className={`w-4 h-4 rounded-full ${cls} border border-white/20`} />
                      <span className={`text-xs font-bold ${accent === id ? "text-slate-800 dark:text-white underline decoration-2" : "text-slate-500 dark:text-slate-400"}`}>
                        {name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing Compact settings */}
              <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Compact Dash Mode</p>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                    Shrinks padding and margins for data-heavy viewports
                  </p>
                </div>
                <Toggle
                  checked={compact}
                  onChange={onCompactChange}
                  accent={accent}
                />
              </div>
            </div>
          )}

          {/* ── REGIONAL PANEL ── */}
          {activeTab === "regional" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Regional Settings</h3>
                <p className="text-xs text-slate-400">Configure language, timestamps, base currency formats</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Display Language",  options: ["English (US)", "Hindi (India)", "French (France)", "German (Germany)"] },
                  { label: "Dashboard Timezone",options: ["Asia/Kolkata (IST)", "UTC", "America/New_York (EST)", "Europe/London (GMT)"] },
                  { label: "Currency format",   options: ["USD ($)", "INR (₹)", "EUR (€)", "GBP (£)"] },
                  { label: "Date format",       options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
                ].map(({ label, options }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}