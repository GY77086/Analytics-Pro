import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const categories = ["All", "Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys"];
const statusColors = {
  Active:   "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400",
  Inactive: "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  Pending:  "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
};

function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) return <ChevronsUpDown size={14} className="text-slate-300 dark:text-slate-600" />;
  return sortConfig.direction === "asc"
    ? <ChevronUp size={14} className="text-blue-500" />
    : <ChevronDown size={14} className="text-blue-500" />;
}

const columns = [
  { key: "id",       label: "#"        },
  { key: "name",     label: "Name"     },
  { key: "email",    label: "Email"    },
  { key: "category", label: "Category" },
  { key: "revenue",  label: "Revenue"  },
  { key: "status",   label: "Status"   },
  { key: "date",     label: "Date"     },
];

export default function DataTable({ data, globalSearch = "" }) {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Reset local search & return to page 1 when global search changes
  useEffect(() => {
    if (globalSearch) {
      setSearch("");
    }
    setCurrentPage(1);
  }, [globalSearch, category]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const filtered = useMemo(() => {
    let rows = [...data];
    if (category !== "All") rows = rows.filter((r) => r.category === category);
    
    const activeSearch = (globalSearch || search).trim().toLowerCase();
    if (activeSearch) {
      rows = rows.filter((r) => r.name.toLowerCase().includes(activeSearch) || r.email.toLowerCase().includes(activeSearch));
    }
    
    rows.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === "number") return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return rows;
  }, [data, category, search, globalSearch, sortConfig]);

  // Paginated rows selection
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;

  // Export Transactions CSV
  const handleExportCSV = () => {
    let csv = "ID,Name,Email,Category,Revenue,Status,Date\n";
    filtered.forEach((r) => {
      csv += `${r.id},"${r.name}",${r.email},${r.category},${r.revenue},${r.status},${r.date}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-colors">
      {/* Filters Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Customer Transactions</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{filtered.length} records found</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center">
          {!globalSearch && (
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search table..."
                className="pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-52" />
            </div>
          )}
          
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              {columns.map(({ key, label }) => (
                <th key={key} onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-750 select-none">
                  <div className="flex items-center gap-1">{label}<SortIcon column={key} sortConfig={sortConfig} /></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {paginatedData.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400 dark:text-slate-500">No records found.</td></tr>
            ) : paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/10 transition-colors">
                <td className="px-4 py-3 text-slate-400 dark:text-slate-500 font-mono text-xs">{row.id}</td>
                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{row.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.email}</td>
                <td className="px-4 py-3"><span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md font-medium">{row.category}</span></td>
                <td className="px-4 py-3 font-bold text-slate-805 dark:text-white">${row.revenue.toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusColors[row.status]}`}>{row.status}</span></td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer (Large scale component) */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/10 transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            className="border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-250 cursor-pointer focus:outline-none"
          >
            {[5, 10, 20].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <span>rows per page</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-slate-505 dark:text-slate-400">
            Page <strong className="font-bold text-slate-700 dark:text-white">{currentPage}</strong> of <strong className="font-bold text-slate-750 dark:text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}