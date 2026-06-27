"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "In Progress", value: 8, color: "#C86544" },
  { name: "Completed", value: 14, color: "#22C55E" },
  { name: "Planning", value: 5, color: "#3B82F6" },
  { name: "On Hold", value: 3, color: "#F59E0B" },
]

export function ProjectStatusPieChart() {
  return (
    <div className="h-56 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#1E293B", border: "1px solid #475569", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            labelStyle={{ color: "#F1F5F9" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-admin-text-primary">30</span>
        <span className="text-[10px] text-admin-text-tertiary">Total Projects</span>
      </div>
    </div>
  )
}
