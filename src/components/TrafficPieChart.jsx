import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3">
        <p className="text-slate-700 dark:text-slate-300 font-semibold text-xs">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }} className="text-sm font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.07) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

export default function TrafficPieChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Traffic Sources</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Where your visitors originate</p>
        </div>
        <span className="text-xs bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 font-bold px-3 py-1 rounded-full">
          Traffic
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}
            dataKey="value" labelLine={false} label={renderLabel}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}