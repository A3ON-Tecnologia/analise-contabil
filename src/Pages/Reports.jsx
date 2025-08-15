import React, { useState, useEffect } from "react";
import { ComparisonReport } from "@/entities/ComparisonReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, FileText, TrendingUp, Download, Calendar, GitCompareArrows } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ReportCard from "../Components/reports/ReportCard";
import ComparisonDetailView from "../Components/reports/ComparisonDetailView";

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter(report => 
      report.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.period_a_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.period_b_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [reports, searchTerm]);

  const loadReports = async () => {
    setIsLoading(true);
    const data = await ComparisonReport.list("-created_date");
    setReports(data);
    setFilteredReports(data);
    setIsLoading(false);
  };

  if (selectedReport) {
    return (
      <ComparisonDetailView 
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">Relatórios Comparativos</h1>
              <p className="text-slate-600 mt-1">Visualize e analise todas as comparações</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por empresa ou período..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-200 rounded w-1/2"></div></CardHeader>
                  <CardContent><div className="space-y-3"><div className="h-3 bg-slate-200 rounded"></div><div className="h-3 bg-slate-200 rounded w-5/6"></div></div></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <GitCompareArrows className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Nenhuma comparação encontrada
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm ? "Tente ajustar sua busca" : "Comece fazendo sua primeira comparação"}
                </p>
                <Button 
                  onClick={() => navigate(createPageUrl("Upload"))}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Comparar Balancetes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}