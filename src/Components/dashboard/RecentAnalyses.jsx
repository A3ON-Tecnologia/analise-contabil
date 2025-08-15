import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, GitCompareArrows, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RecentAnalyses({ reports, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl"><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><div className="space-y-4">{Array(5).fill(0).map((_, i) => (<div key={i} className="animate-pulse"><Skeleton className="h-16 w-full rounded-lg" /></div>))}</div></CardContent></Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <GitCompareArrows className="w-5 h-5 text-blue-600" />
          Comparações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <GitCompareArrows className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Nenhuma comparação realizada</p>
            <Link to={createPageUrl("Upload")}>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">Fazer primeira comparação</Button>
            </Link>
          </div>
        ) : (
          <>
            {reports.map((report) => (
              <div key={report.id} className="group p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 group-hover:text-blue-600">{report.company_name}</h4>
                    <p className="text-sm text-slate-500">{report.period_a_name} vs. {report.period_b_name}</p>
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${(report.comparison_analysis?.revenue_growth || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {(report.comparison_analysis?.revenue_growth || 0) >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {((report.comparison_analysis?.revenue_growth || 0) * 100).toFixed(1)}%
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Analisado em {format(new Date(report.created_date), "d 'de' MMM", { locale: ptBR })}
                </p>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-200">
              <Link to={createPageUrl("Reports")}><Button variant="outline" className="w-full border-slate-300">Ver todas as comparações</Button></Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}