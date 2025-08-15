import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, GitCompareArrows, Download } from "lucide-react";
import ComparisonCharts from './ComparisonCharts';

export default function ComparisonDetailView({ report, onBack }) {
  const { company_name, period_a_name, period_b_name } = report;

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="printable-area">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-break-before {
            page-break-before: always;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8 no-print">
              <Button variant="outline" size="icon" onClick={onBack} className="border-slate-300"><ArrowLeft className="w-4 h-4" /></Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900">{company_name}</h1>
                <p className="text-slate-600 flex items-center gap-2">
                  <GitCompareArrows className="w-4 h-4" />
                  Comparação: {period_a_name} vs. {period_b_name}
                </p>
              </div>
              <Button onClick={handleDownloadPdf}>
                <Download className="w-4 h-4 mr-2" />
                Baixar Relatório em PDF
              </Button>
            </div>
            
            <div className="print-header hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">{company_name}</h1>
              <h2 className="text-xl text-slate-600">Relatório Comparativo: {period_a_name} vs. {period_b_name}</h2>
            </div>
            
            <ComparisonCharts report={report} />
            
          </div>
        </div>
      </div>
    </div>
  );
}