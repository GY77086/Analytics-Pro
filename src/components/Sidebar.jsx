import React from "react";
import { LayoutDashboard, BarChart2, FileText, Settings, ChevronLeft, ChevronRight, Activity } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BarChart2,       label: "Analytics",  id: "analytics"  },
  { icon: FileText,        label: "Reports",    id: "reports"    },
  { icon: Settings,        label: "Settings",   id: "settings"   },
];

const ACCENT_COLORS = {
  blue: "bg-blue-600 hover:bg-blue-700",
  green: "bg-green-600 hover:bg-green-700",
  purple: "bg-purple-600 hover:bg-purple-700",
  orange: "bg-orange-500 hover:bg-orange-600",
};

const SIDEBAR_GRADIENTS = {
  blue: "from-blue-900 to-blue-800 border-blue-700",
  green: "from-emerald-900 to-emerald-800 border-emerald-700",
  purple: "from-purple-900 to-purple-800 border-purple-700",
  orange: "from-orange-900 to-orange-800 border-orange-700",
};

export default function Sidebar({ activeNav, setActiveNav, collapsed, setCollapsed, accent = "blue" }) {
  const activeBg = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;
  const sidebarGrad = SIDEBAR_GRADIENTS[accent] || SIDEBAR_GRADIENTS.blue;

  return (
    <aside
      className={`hidden md:flex flex-col min-h-screen bg-gradient-to-b ${sidebarGrad} text-white transition-all duration-300 shadow-xl flex-shrink-0
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Brand logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${collapsed ? "justify-center" : ""}`}>
        <Activity size={28} className="text-white flex-shrink-0" />
        {!collapsed && (
          <span className="font-bold text-lg tracking-wide whitespace-nowrap">
            AnalyticsPro
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-6 space-y-1 px-2">
        {navItems.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
              ${
                activeNav === id
                  ? `${activeBg} text-white shadow-md`
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-3 flex items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}