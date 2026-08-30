import React, { useState, useEffect } from "react";
import { Download, FileText, TrendingUp, Users, ShoppingCart, Eye, AlertCircle, Calendar, Plus, X } from "lucide-react";

const DEFAULT_REPORTS = [
  { id: 1, title: "Monthly Revenue Report",    date: "Aug 2024", size: "2.4 MB", iconType: "revenue",    color: "blue",   status: "Ready"   },
  { id: 2, title: "User Acquisition Summary",  date: "Aug 2024", size: "1.1 MB", iconType: "users",      color: "green",  status: "Ready"   },
  { id: 3, title: "Sales Performance Q2",      date: "Jun 2024", size: "3.8 MB", iconType: "sales",      color: "purple", status: "Ready" },
  { id: 4, title: "Traffic & Engagement",      date: "Aug 2024", size: "1.7 MB", iconType: "traffic",    color: "orange", status: "Ready"   },
  { id: 5, title: "Weekly Analytics Digest",   date: "Aug 2024", size: "0.8 MB", iconType: "reports",    color: "indigo", status: "Pending" },
  { id: 6, title: "Conversion Funnel Report",  date: "Jul 2024", size: "2.1 MB", iconType: "revenue",    color: "red",   status: "Ready"   },
];

const colorMap = {
  blue:   "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  green:  "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",
  purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400",
  indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
  red:    "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
};

const iconMap = {
  revenue: TrendingUp,
  users: Users,
  sales: ShoppingCart,
  traffic: Eye,
  reports: FileText,
};

const summaryCards = [
  { label: "Total Reports",    value: "24",    change: "+3 this month" },
  { label: "Downloads",        value: "1,284", change: "+18% vs last month" },
  { label: "Scheduled Reports", value: "6",   change: "Running weekly" },
  { label: "Avg. Report Size",  value: "2.1 MB", change: "Optimised" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [downloading, setDownloading] = useState(null);
  
  // Modal states for generating a new report
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", type: "revenue", period: "Last 30 Days" });
  const [genLoading, setGenLoading] = useState(false);

  // Sync reports with localStorage so they persist
  useEffect(() => {
    const saved = localStorage.getItem("generated_reports");
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      localStorage.setItem("generated_reports", JSON.stringify(DEFAULT_REPORTS));
      setReports(DEFAULT_REPORTS);
    }
  }, []);

  const handleDownload = (report) => {
    setDownloading(report.id);
    setTimeout(() => {
      setDownloading(null);

      // Create simulated CSV content matching the report type
      let csvContent = "";
      if (report.iconType === "revenue") {
        csvContent = "Month,Revenue,Expenses,Net Profit\nJanuary,$42000,$28000,$14000\nFebruary,$38500,$25000,$13500\nMarch,$51200,$31000,$20200\n";
      } else if (report.iconType === "users") {
        csvContent = "Metric,Total count,Growth rate,New users\nActive Users,24812,+8.2%,1850\nSession Length,4m 32s,+1.1%,-\n";
      } else {
        csvContent = "Category,Sales,Target,Achievement %\nElectronics,$42000,$45000,93%\nClothing,$28000,$30000,93%\nBooks,$15000,$18000,83%\n";
      }

      // Download file in browser
      const blob = new Blob([`Report: ${report.title}\nDate: ${report.date}\nSize: ${report.size}\n\n${csvContent}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${report.title.toLowerCase().replace(/\s+/g, "_")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    if (!newReport.title.trim()) return;

    setGenLoading(true);
    setTimeout(() => {
      const typeToDetails = {
        revenue: { icon: "revenue", color: "blue", size: "1.8 MB" },
        users: { icon: "users", color: "green", size: "1.2 MB" },
        sales: { icon: "sales", color: "purple", size: "2.6 MB" },
        traffic: { icon: "traffic", color: "orange", size: "1.5 MB" },
      };
      const details = typeToDetails[newReport.type] || typeToDetails.revenue;

      const createdReport = {
        id: Date.now(),
        title: newReport.title,
        date: newReport.period,
        size: details.size,
        iconType: details.icon,
        color: details.color,
        status: "Ready",
      };

      const updated = [createdReport, ...reports];
      setReports(updated);
      localStorage.setItem("generated_reports", JSON.stringify(updated));

      setGenLoading(false);
      setShowModal(false);
      setNewReport({ title: "", type: "revenue", period: "Last 30 Days" });
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Download and manage your analytics reports</p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{c.value}</p>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">{c.label}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{c.change}</p>
          </div>
        ))}
      </div>

      {/* Report Cards List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-colors">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-white">Available Reports</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm font-semibold"
          >
            <Plus size={16} /> Generate New
          </button>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {reports.map((r) => {
            const Icon = iconMap[r.iconType] || FileText;
            const isDl = downloading === r.id;
            return (
              <div key={r.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`${colorMap[r.color]} p-2.5 rounded-xl`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{r.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{r.date} &bull; {r.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold tracking-wide ${
                    r.status === "Ready" ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                  }`}>{r.status}</span>
                  {r.status === "Ready" && (
                    <button
                      onClick={() => handleDownload(r)}
                      disabled={isDl}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-950/30 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-60"
                    >
                      {isDl
                        ? <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin block" />
                        : <Download size={16} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Digests */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Scheduled Digests</h3>
        <div className="space-y-3">
          {[
            { name: "Weekly Analytics Digest", freq: "Every Monday, 9:00 AM",   next: "Sep 2, 2024"  },
            { name: "Monthly Revenue Summary",  freq: "1st of every month, 8:00 AM", next: "Sep 1, 2024" },
            { name: "Daily Traffic Snapshot",   freq: "Daily, 6:00 AM",          next: "Tomorrow"    },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">{s.freq}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 dark:text-slate-500">Next run</p>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{s.next}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GENERATE NEW REPORT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" />
                <h4 className="font-bold text-slate-800 dark:text-white">Generate Analytical Report</h4>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Summary Q3"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Report Type
                </label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="revenue">Financial Revenue Report</option>
                  <option value="users">User Growth & Acquisition</option>
                  <option value="sales">Product Sales Performance</option>
                  <option value="traffic">Traffic channels & pageviews</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Reporting Period
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Last 30 Days or Q2 2024"
                  value={newReport.period}
                  onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={genLoading}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  {genLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : "Compile Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}