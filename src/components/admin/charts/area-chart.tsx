"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 4000, previous: 2400 },
  { name: "Feb", value: 3000, previous: 1398 },
  { name: "Mar", value: 6000, previous: 9800 },
  { name: "Apr", value: 8000, previous: 3908 },
  { name: "May", value: 7000, previous: 4800 },
  { name: "Jun", value: 9000, previous: 3800 },
  { name: "Jul", value: 11000, previous: 4300 },
  { name: "Aug", value: 9500, previous: 5300 },
  { name: "Sep", value: 12000, previous: 6500 },
  { name: "Oct", value: 15000, previous: 7800 },
  { name: "Nov", value: 13500, previous: 8200 },
  { name: "Dec", value: 18000, previous: 9400 },
]

export function RevenueAreaChart() {
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
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#1E293B", border: "1px solid #475569", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            labelStyle={{ color: "#F1F5F9" }}
          />
          <Area type="monotone" dataKey="previous" stroke="#C86544" strokeOpacity={0.3} fill="url(#colorPrevious)" strokeWidth={1} />
          <Area type="monotone" dataKey="value" stroke="#C86544" fill="url(#colorValue)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TrafficLineChart() {
  const trafficData = [
    { name: "Mon", value: 1200 },
    { name: "Tue", value: 1800 },
    { name: "Wed", value: 1600 },
    { name: "Thu", value: 2400 },
    { name: "Fri", value: 2100 },
    { name: "Sat", value: 1400 },
    { name: "Sun", value: 1900 },
  ]

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trafficData}>
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C86544" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#C86544" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
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
