import React, { useState } from "react";
import { Bell, Search, User, LogOut, ChevronDown, Check, Trash } from "lucide-react";

const ranges = [
  { value: "7d",  label: "Last 7 Days"  },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y",  label: "Last Year"    },
];

const pageTitles = {
  dashboard: "Analytics Dashboard",
  analytics: "Analytics Overview",
  reports:   "Reports",
  settings:  "Settings",
};

const ACCENT_BG = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  purple: "bg-purple-600",
  orange: "bg-orange-500",
};

const ACCENT_RING = {
  blue: "focus:ring-blue-500",
  green: "focus:ring-green-500",
  purple: "focus:ring-purple-500",
  orange: "focus:ring-orange-500",
};

export default function Header({
  dateRange,
  setDateRange,
  user,
  onLogout,
  activeNav,
  accent = "blue",
  searchQuery = "",
  setSearchQuery,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  // Simulated notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🎯 Daily revenue target reached!", read: false, time: "5m ago" },
    { id: 2, text: "🚀 Metric spike detected in Electronics category", read: false, time: "1h ago" },
    { id: 3, text: "🛡️ Account security configurations updated", read: true, time: "2h ago" },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const avatarBg = ACCENT_BG[accent] || ACCENT_BG.blue;
  const selectRing = ACCENT_RING[accent] || ACCENT_RING.blue;

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white truncate max-w-[180px] sm:max-w-none">
          {pageTitles[activeNav] || "Dashboard"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name || "User"} 👋</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search bar — only shown on Dashboard & Analytics tabs */}
        {(activeNav === "dashboard" || activeNav === "analytics") && (
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data..."
              className={`pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 ${selectRing} w-48 transition`}
            />
          </div>
        )}

        {/* Date range dropdown — only on Dashboard */}
        {activeNav === "dashboard" && (
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-2 sm:px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 ${selectRing} cursor-pointer transition`}
          >
            {ranges.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowMenu(false);
            }}
            className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 transition-colors text-slate-850">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-white">Notifications</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <Check size={12} /> Mark Read
                  </button>
                  <button
                    onClick={handleClearNotifications}
                    title="Clear all"
                    className="text-xs text-red-500 hover:underline flex items-center gap-0.5"
                  >
                    <Trash size={12} /> Clear
                  </button>
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/50">
                {notifications.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleToggleRead(n.id)}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-750/30 transition cursor-pointer flex flex-col gap-1 ${
                        !n.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <p className={`text-xs ${!n.read ? "font-semibold text-slate-800 dark:text-white" : "text-slate-650 dark:text-slate-400"}`}>
                        {n.text}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMenu(!showMenu);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center transition-colors shadow-sm`}>
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="hidden lg:block text-sm font-semibold text-slate-750 dark:text-slate-200">
              {user?.name}
            </span>
            <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50 transition-colors">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left font-semibold"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}