import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jan", sessions: 12400, pageviews: 38200, bounceRate: 42 },
  { month: "Feb", sessions: 11200, pageviews: 34100, bounceRate: 45 },
  { month: "Mar", sessions: 15600, pageviews: 47300, bounceRate: 39 },
  { month: "Apr", sessions: 14200, pageviews: 43800, bounceRate: 41 },
  { month: "May", sessions: 18900, pageviews: 56700, bounceRate: 36 },
  { month: "Jun", sessions: 17400, pageviews: 52100, bounceRate: 38 },
  { month: "Jul", sessions: 21200, pageviews: 63400, bounceRate: 34 },
  { month: "Aug", sessions: 19800, pageviews: 59300, bounceRate: 37 },
];

const deviceData = [
  { device: "Desktop", users: 48 },
  { device: "Mobile",  users: 38 },
  { device: "Tablet",  users: 14 },
];

const radarData = [
  { subject: "SEO",         A: 86 },
  { subject: "Performance", A: 72 },
  { subject: "Accessibility", A: 91 },
  { subject: "Best Practices", A: 78 },
  { subject: "UX",          A: 83 },
];

const Stat = ({ label, value, sub, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>
  </div>
);

export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Analytics Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Detailed performance metrics for your platform</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Sessions"  value="151,600" sub="+14% vs last period" color="text-blue-600 dark:text-blue-400"   />
        <Stat label="Total Pageviews" value="395,800" sub="+11% vs last period" color="text-indigo-600 dark:text-indigo-400" />
        <Stat label="Avg. Bounce Rate" value="39.0%"  sub="-3% improvement"     color="text-green-600 dark:text-green-400"  />
        <Stat label="New Visitors"    value="62.4%"   sub="+5% vs last period"  color="text-purple-600 dark:text-purple-400" />
      </div>

      {/* Sessions & Pageviews Line Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Sessions vs Pageviews</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="sessions"  stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} name="Sessions"  />
            <Line type="monotone" dataKey="pageviews" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} name="Pageviews" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Device split + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Device Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Traffic by Device</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deviceData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="device" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="users" name="Share" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Site Health Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
              <Tooltip contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '12px', color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bounce Rate Trend */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Bounce Rate Trend</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Lower is better</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Line type="monotone" dataKey="bounceRate" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} name="Bounce Rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}