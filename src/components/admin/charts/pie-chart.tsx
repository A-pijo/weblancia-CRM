"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "#C86544",
  "Completed": "#22C55E",
  "Planning": "#3B82F6",
  "On Hold": "#F59E0B",
  "Cancelled": "#EF4444",
  "Draft": "#64748B",
}

function getColor(name: string): string {
  return STATUS_COLORS[name] || "#C86544"
}

export function ProjectStatusPieChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return <div className="h-56 flex items-center justify-center text-admin-text-tertiary text-sm">No data yet</div>
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)

  const coloredData = data.map(d => ({ ...d, color: getColor(d.name) }))

  return (
    <div className="h-56 flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={coloredData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {coloredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#1E293B", border: "1px solid #475569", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            labelStyle={{ color: "#F1F5F9" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center pointer-events-none">
        <span className="text-2xl font-bold text-admin-text-primary">{total}</span>
        <span className="text-[10px] text-admin-text-tertiary">Total Projects</span>
      </div>
    </div>
  )
}
