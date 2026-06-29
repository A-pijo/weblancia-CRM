"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AreaDataPoint {
  name: string
  value: number
  previous?: number
}

export function RevenueAreaChart({ data }: { data: AreaDataPoint[] }) {
  if (!data || data.length === 0) {
    return <div className="h-72 flex items-center justify-center text-admin-text-tertiary text-sm">No data yet</div>
  }

  const hasPrevious = data.some(d => d.previous !== undefined)

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C86544" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C86544" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C86544" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#C86544" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#1E293B", border: "1px solid #475569", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            labelStyle={{ color: "#F1F5F9" }}
          />
          {hasPrevious && <Area type="monotone" dataKey="previous" stroke="#C86544" strokeOpacity={0.3} fill="url(#colorPrevious)" strokeWidth={1} />}
          <Area type="monotone" dataKey="value" stroke="#C86544" fill="url(#colorValue)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TrafficLineChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-admin-text-tertiary text-sm">No data yet</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C86544" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#C86544" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#1E293B", border: "1px solid #475569", borderRadius: "8px" }}
            labelStyle={{ color: "#F1F5F9" }}
          />
          <Area type="monotone" dataKey="value" stroke="#C86544" fill="url(#trafficGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
