import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, TrendingUp, TrendingDown, GitCompareArrows } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ReportCard({ report, onClick }) {
  const revenueGrowth = (report.comparison_analysis?.revenue_growth || 0) * 100;
  
  return (
    <Card 
      className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-105 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{report.company_name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <GitCompareArrows className="w-3 h-3" />
              {report.period_a_name} vs. {report.period_b_name}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-600">Crescimento da Receita</p>
          <div className={`flex items-center text-2xl font-bold ${revenueGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {revenueGrowth >= 0 ? <TrendingUp className="w-6 h-6 mr-2" /> : <TrendingDown className="w-6 h-6 mr-2" />}
            {revenueGrowth.toFixed(1)}%
          </div>
        </div>
        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Analisado em {format(new Date(report.created_date), "d 'de' MMM", { locale: ptBR })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}