import React from "react";
import { DollarSign, Users, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

const iconMap = { DollarSign, Users, TrendingUp, Clock };
const colorMap = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20 border-white dark:border-slate-800",   icon: "bg-blue-600"   },
  green:  { bg: "bg-green-50 dark:bg-green-950/20 border-white dark:border-slate-800",  icon: "bg-green-600"  },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/20 border-white dark:border-slate-800", icon: "bg-purple-600" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20 border-white dark:border-slate-800", icon: "bg-orange-500" },
};

export default function KPICard({ title, value, change, trend, icon, color }) {
  const Icon = iconMap[icon] || DollarSign;
  const colors = colorMap[color] || colorMap.blue;
  const isUp = trend === "up";
  return (
    <div className={`${colors.bg} rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors.icon} p-2.5 rounded-xl`}>
          <Icon size={22} className="text-white" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isUp ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400"}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{title}</p>
    </div>
  );
}