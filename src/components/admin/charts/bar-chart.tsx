"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Web Dev", value: 12 },
  { name: "SEO", value: 8 },
  { name: "Design", value: 6 },
  { name: "Marketing", value: 5 },
  { name: "E-commerce", value: 4 },
  { name: "Branding", value: 3 },
]

export function ProjectsBarChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} width={80} />
          <Tooltip
            contentStyle={{ background: "#1E293B", border: "1px solid #475569", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            labelStyle={{ color: "#F1F5F9" }}
          />
          <Bar dataKey="value" fill="#C86544" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
