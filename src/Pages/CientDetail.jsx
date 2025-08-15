import React, { useState, useEffect } from "react";
import { ComparisonReport } from "@/entities/ComparisonReport";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, GitCompareArrows } from "lucide-react";
import ReportCard from "../components/reports/ReportCard";
import ComparisonDetailView from "../components/reports/ComparisonDetailView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientName, setClientName] = useState("");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get("name");
    if (name) {
      const decodedName = decodeURIComponent(name);
      setClientName(decodedName);
      loadReports(decodedName);
    }
  }, [location.search]);

  const loadReports = async (name) => {
    setIsLoading(true);
    const data = await ComparisonReport.filter({ client_name: name }, "-created_date");
    setReports(data);
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
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Cliente</p>
                <h1 className="text-3xl font-bold text-slate-900">{clientName}</h1>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-4">Análises Comparativas</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
            </div>
          ) : reports.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <GitCompareArrows className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Nenhuma comparação encontrada para este cliente.</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
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