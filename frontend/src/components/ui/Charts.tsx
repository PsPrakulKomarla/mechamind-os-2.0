import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useThemeStore } from "@/store/theme";

const COLORS = ["#14F195", "#9945FF", "#3B82F6", "#F59E0B", "#EF4444"];

const CustomTooltip = ({ active, payload, label }: any) => {
  const isDark = useThemeStore((state) => state.theme) === "dark";
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-lg border shadow-lg ${isDark ? 'bg-secondary-bg border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
        <p className="font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface BaseChartProps {
  data: any[];
  xAxisKey?: string;
  series: { key: string; name: string; color?: string }[];
  height?: number;
}

export const BaseLineChart = ({ data, xAxisKey = "name", series, height = 300 }: BaseChartProps) => {
  const isDark = useThemeStore((state) => state.theme) === "dark";
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
          <XAxis dataKey={xAxisKey} stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {series.map((s, idx) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color || COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4, fill: s.color || COLORS[idx % COLORS.length] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BaseBarChart = ({ data, xAxisKey = "name", series, height = 300 }: BaseChartProps) => {
  const isDark = useThemeStore((state) => state.theme) === "dark";
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
          <XAxis dataKey={xAxisKey} stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {series.map((s, idx) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color || COLORS[idx % COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BaseAreaChart = ({ data, xAxisKey = "name", series, height = 300 }: BaseChartProps) => {
  const isDark = useThemeStore((state) => state.theme) === "dark";
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {series.map((s, idx) => {
              const color = s.color || COLORS[idx % COLORS.length];
              return (
                <linearGradient key={`colorUv-${s.key}`} id={`colorUv-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
          <XAxis dataKey={xAxisKey} stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {series.map((s, idx) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color || COLORS[idx % COLORS.length]}
              fillOpacity={1}
              fill={`url(#colorUv-${s.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PieChartProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
}

export const BasePieChart = ({ data, height = 300 }: PieChartProps) => {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
