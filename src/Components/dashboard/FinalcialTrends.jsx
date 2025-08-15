import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: R$ ${entry.value?.toLocaleString('pt-BR')}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancialTrends({ reports, selectedMetric, onMetricChange, isLoading }) {
  const prepareChartData = () => {
    if (!reports.length) return [];
    
    const sortedReports = [...reports].sort((a, b) => new Date(a.report_date) - new Date(b.report_date));
    
    return sortedReports.map(report => ({
      period: report.period || format(new Date(report.report_date), 'MMM/yy', { locale: ptBR }),
      receita: report.revenue || 0,
      lucro: report.net_income || 0,
      ativos: report.total_assets || 0,
      patrimonio: report.equity || 0,
      company: report.company_name
    }));
  };

  const chartData = prepareChartData();

  const metrics = [
    { key: 'receita', label: 'Receita', color: '#3b82f6' },
    { key: 'lucro', label: 'Lucro Líquido', color: '#10b981' },
    { key: 'ativos', label: 'Ativos Totais', color: '#8b5cf6' },
    { key: 'patrimonio', label: 'Patrimônio', color: '#f59e0b' }
  ];

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="text-xl font-bold text-slate-900">Tendências Financeiras</CardTitle>
          <Tabs value={selectedMetric} onValueChange={onMetricChange} className="w-full lg:w-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto">
              {metrics.map(metric => (
                <TabsTrigger key={metric.key} value={metric.key} className="text-xs lg:text-sm">
                  {metric.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-slate-500">
            <p>Nenhum dado disponível para exibir gráficos</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metrics.find(m => m.key === selectedMetric)?.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={metrics.find(m => m.key === selectedMetric)?.color} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="period" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={metrics.find(m => m.key === selectedMetric)?.color}
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}