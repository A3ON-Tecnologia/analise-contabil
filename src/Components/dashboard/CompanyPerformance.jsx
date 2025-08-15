import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Building2 } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-900">{label}</p>
        <p style={{ color: payload[0].color }} className="text-sm">
          {`ROA: ${payload[0].value?.toFixed(2)}%`}
        </p>
      </div>
    );
  }
  return null;
};

export default function CompanyPerformance({ reports, isLoading }) {
  const getTopPerformers = () => {
    if (!reports.length) return [];
    
    const companyPerformance = reports.reduce((acc, report) => {
      const company = report.company_name;
      const roa = (report.financial_analysis?.return_on_assets || 0) * 100;
      
      if (!acc[company] || acc[company].roa < roa) {
        acc[company] = {
          company,
          roa,
          revenue: report.revenue || 0,
          period: report.period
        };
      }
      return acc;
    }, {});
    
    return Object.values(companyPerformance)
      .sort((a, b) => b.roa - a.roa)
      .slice(0, 6);
  };

  const topPerformers = getTopPerformers();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Building2 className="w-5 h-5 text-blue-600" />
          Performance das Empresas (ROA)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topPerformers.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            <p>Nenhum dado de performance disponível</p>
          </div>
        ) : (
          <>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPerformers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="company" 
                    stroke="#64748b"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="roa" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPerformers.slice(0, 4).map((company, index) => (
                <div key={company.company} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{company.company}</p>
                      <p className="text-xs text-slate-500">{company.period}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${
                    company.roa > 15 ? 'bg-emerald-100 text-emerald-800' : 
                    company.roa > 5 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {company.roa.toFixed(1)}% ROA
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}