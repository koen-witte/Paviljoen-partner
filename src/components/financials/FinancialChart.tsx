"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartDataItem {
  naam: string;
  omzet: number;
  ebitda: number;
}

interface FinancialChartProps {
  data: ChartDataItem[];
}

function formatEuro(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  return `€${value}`;
}

export default function FinancialChart({ data }: FinancialChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Geen data beschikbaar voor grafiek
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="naam"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          angle={-25}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          tickFormatter={formatEuro}
        />
        <Tooltip
          formatter={(value, name) => [
            new Intl.NumberFormat("nl-NL", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 0,
            }).format(Number(value)),
            name === "omzet" ? "Omzet" : "EBITDA",
          ]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        />
        <Bar dataKey="omzet" name="omzet" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
        <Bar dataKey="ebitda" name="ebitda" fill="#d4a843" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
