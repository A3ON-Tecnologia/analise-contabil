import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, GitCompareArrows, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const KPICard = ({ title, value, icon, gradient, subtitle, positive = true }) => (
  <Card className="relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 ${gradient} rounded-full transform translate-x-8 -translate-y-8`} />
      <CardHeader className="pb-2">
        <div className={`p-3 rounded-xl ${gradient} bg-opacity-15 inline-block`}>
          {React.createElement(icon, { className: 'w-6 h-6 text-white' })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={`text-2xl font-bold ${positive ? 'text-emerald-600' : 'text-red-600'}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
);

export default function ExecutiveKPIs({ kpis, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse"><CardHeader><Skeleton className="h-12 w-12 rounded-xl" /></CardHeader><CardContent><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-8 w-32" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Cresc. Médio de Receita"
        value={`${kpis.avgRevenueGrowth.toFixed(1)}%`}
        icon={kpis.avgRevenueGrowth >= 0 ? TrendingUp : TrendingDown}
        gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        subtitle="Média de todas as comparações"
        positive={kpis.avgRevenueGrowth >= 0}
      />
      <KPICard
        title="Cresc. Médio de Lucro"
        value={`${kpis.avgProfitGrowth.toFixed(1)}%`}
        icon={kpis.avgProfitGrowth >= 0 ? TrendingUp : TrendingDown}
        gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        subtitle="Média de todas as comparações"
        positive={kpis.avgProfitGrowth >= 0}
      />
      <KPICard
        title="Comparações Realizadas"
        value={kpis.totalComparisons}
        icon={GitCompareArrows}
        gradient="bg-gradient-to-br from-purple-500 to-pink-600"
        subtitle="Total de análises"
        positive={true}
      />
      <KPICard
        title="Comparações Positivas"
        value={kpis.positiveGrowthCount}
        icon={CheckCircle}
        gradient="bg-gradient-to-br from-orange-500 to-red-600"
        subtitle="Com crescimento de lucro"
        positive={true}
      />
    </div>
  );
}