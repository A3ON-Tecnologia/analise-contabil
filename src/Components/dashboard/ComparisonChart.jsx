import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { GitCompareArrows } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-900">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-sm">
            {`${p.name}: ${p.value.toFixed(1)}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ComparisonChart({ reports, isLoading }) {
  const chartData = reports.map(r => ({
    name: r.company_name,
    receita: (r.comparison_analysis?.revenue_growth || 0) * 100,
    lucro: (r.comparison_analysis?.net_income_growth || 0) * 100,
  })).slice(0, 10); // show top 10 recent

  if (isLoading) {
    return <Card className="border-0 shadow-xl"><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-80 w-full" /></CardContent></Card>;
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <GitCompareArrows className="w-5 h-5 text-blue-600" />
          Variação Percentual (Receita vs. Lucro)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-slate-500"><p>Nenhuma comparação para exibir no gráfico</p></div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="receita" name="Crescimento Receita" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lucro" name="Crescimento Lucro" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}