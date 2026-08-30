import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KPICard from "./components/KPICard";
import RevenueLineChart from "./components/RevenueLineChart";
import SalesByCategory from "./components/SalesByCategory";
import TrafficPieChart from "./components/TrafficPieChart";
import DataTable from "./components/DataTable";
import AIAssistant from "./components/AIAssistant";
import LoginPage from "./pages/LoginPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { kpiData as initialKpiData, revenueData, salesByCategoryData, trafficData, tableData } from "./data/mockData";
import { LayoutDashboard, BarChart2, FileText, Settings as SettingsIcon, Radio } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState("30d");
  const [searchQuery, setSearchQuery] = useState("");

  // UI customization options
  const [theme, setTheme] = useState(() => localStorage.getItem("dash_theme") || "light");
  const [accent, setAccent] = useState(() => localStorage.getItem("dash_accent") || "blue");
  const [compact, setCompact] = useState(() => localStorage.getItem("dash_compact") === "true");

  // Real-time live data feed state
  const [isLiveFeed, setIsLiveFeed] = useState(true);
  const [kpis, setKpis] = useState(initialKpiData);

  // Apply Theme class at HTML level
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("dash_theme", theme);
  }, [theme]);

  // Apply Accent & Compact storage
  useEffect(() => {
    localStorage.setItem("dash_accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem("dash_compact", compact ? "true" : "false");
  }, [compact]);

  // Simulated Live Data Feed loop
  useEffect(() => {
    if (!isLiveFeed) return;

    const interval = setInterval(() => {
      setKpis((prevKpis) =>
        prevKpis.map((kpi) => {
          if (kpi.id === 1) {
            // Revenue increase
            const currentVal = parseInt(kpi.value.replace(/[$,]/g, ""), 10);
            const added = Math.floor(Math.random() * 80) + 10;
            return {
              ...kpi,
              value: `$${(currentVal + added).toLocaleString()}`,
              change: `+${((added / currentVal) * 100 + 12.5).toFixed(1)}%`,
            };
          }
          if (kpi.id === 2) {
            // Active users delta
            const currentUsers = parseInt(kpi.value.replace(/,/g, ""), 10);
            const changeVal = Math.floor(Math.random() * 30) - 13; // net gain/loss
            return {
              ...kpi,
              value: (currentUsers + changeVal).toLocaleString(),
              change: `${changeVal >= 0 ? "+" : ""}${((changeVal / currentUsers) * 100 + 8.2).toFixed(1)}%`,
              trend: changeVal >= 0 ? "up" : "down",
            };
          }
          if (kpi.id === 3) {
            // Conversion rate fluctuation
            const currentRate = parseFloat(kpi.value.replace("%", ""));
            const delta = (Math.random() * 0.1 - 0.05);
            return {
              ...kpi,
              value: `${Math.max(1, Math.min(10, currentRate + delta)).toFixed(2)}%`,
            };
          }
          return kpi;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveFeed]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("current_user");
    setUser(null);
  };

  // Handle Login success
  const handleLogin = (userData) => {
    localStorage.setItem("current_user", JSON.stringify(userData));
    setUser(userData);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ── Dashboard page content ───────────────────────────────────────
  const DashboardPage = () => (
    <div className={`space-y-6 ${compact ? "p-3 space-y-3" : "p-4 sm:p-6"}`}>
      {/* Live Feed Banner Control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700/50 rounded-2xl transition-colors shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3.5 w-3.5">
            {isLiveFeed && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isLiveFeed ? "bg-emerald-500" : "bg-slate-350 dark:bg-slate-600"}`}></span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
              {isLiveFeed ? "Real-Time Data Feed Active" : "Real-Time Data Feed Paused"}
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-400">KPI metrics update automatically every 4 seconds</p>
          </div>
        </div>
        <button
          onClick={() => setIsLiveFeed(!isLiveFeed)}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition shadow-sm
            ${
              isLiveFeed
                ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
        >
          <Radio size={14} />
          <span>{isLiveFeed ? "Pause Stream" : "Go Live"}</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <section className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 ${compact ? "gap-3" : "gap-4"}`}>
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </section>

      {/* Charts Row */}
      <section className={`grid grid-cols-1 lg:grid-cols-3 ${compact ? "gap-3" : "gap-4"}`}>
        <div className="lg:col-span-2">
          <RevenueLineChart data={revenueData[dateRange]} />
        </div>
        <div>
          <TrafficPieChart data={trafficData} />
        </div>
      </section>
      
      <section>
        <SalesByCategory data={salesByCategoryData} />
      </section>
      
      <section>
        <DataTable data={tableData} globalSearch={searchQuery} />
      </section>
    </div>
  );

  // ── Page router ──────────────────────────────────────────────────
  const renderPage = () => {
    switch (activeNav) {
      case "analytics":
        return <AnalyticsPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return (
          <SettingsPage
            user={user}
            onLogout={handleLogout}
            onUserUpdate={setUser}
            theme={theme}
            onThemeChange={setTheme}
            accent={accent}
            onAccentChange={setAccent}
            compact={compact}
            onCompactChange={setCompact}
          />
        );
      default:
        return <DashboardPage />;
    }
  };

  // Define Bottom Nav Accent highlight active indicator style
  const bottomNavAccents = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-500 dark:text-orange-400",
  };
  const activeColor = bottomNavAccents[accent] || bottomNavAccents.blue;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors text-slate-800 dark:text-slate-200">
      {/* Sidebar (Desktop & Tablet only) */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        accent={accent}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Header */}
        <Header
          dateRange={dateRange}
          setDateRange={setDateRange}
          user={user}
          onLogout={handleLogout}
          activeNav={activeNav}
          accent={accent}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        {/* Content body */}
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>

        {/* Enterprise status footer */}
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700/80 py-5 px-6 transition-colors">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="font-semibold text-slate-500 dark:text-slate-400">AnalyticsPro &copy; 2026</span>
              <span className="hidden sm:inline">&bull;</span>
              <a href="#docs" className="hover:underline">Documentation</a>
              <span className="hidden sm:inline">&bull;</span>
              <a href="#api" className="hover:underline">API Cluster</a>
              <span className="hidden sm:inline">&bull;</span>
              <a href="#status" className="hover:underline">Status Page</a>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                All cloud clusters operational (AP-South-1)
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating AI Support Copilot */}
      <AIAssistant kpiData={kpis} salesData={salesByCategoryData} trafficData={trafficData} />

      {/* Mobile Bottom Navigation (Visible only on mobile devices) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around py-2 z-40 transition-colors shadow-lg">
        {[
          { id: "dashboard", label: "Home", icon: LayoutDashboard },
          { id: "analytics", label: "Metrics", icon: BarChart2 },
          { id: "reports", label: "Reports", icon: FileText },
          { id: "settings", label: "Settings", icon: SettingsIcon },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveNav(id);
              setSearchQuery("");
            }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              activeNav === id ? activeColor : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}