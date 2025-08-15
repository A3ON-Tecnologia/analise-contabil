
import React, { useState, useEffect } from "react";
import { ComparisonReport } from "@/entities/ComparisonReport";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GitCompareArrows, TrendingUp, FileText, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

import ExecutiveKPIs from "../components/dashboard/ExecutiveKPIs";
import ClientList from "../components/dashboard/ClientList";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState({});

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    // Fetch all reports, as per outline not limiting to 50
    const data = await ComparisonReport.list("-created_date"); 
    setReports(data);
    
    // Process clients data for the new ClientList component
    const clientsData = data.reduce((acc, report) => {
      const client = report.client_name;
      if (!acc[client]) {
        acc[client] = [];
      }
      acc[client].push(report);
      return acc;
    }, {});
    setClients(clientsData);

    setIsLoading(false);
  };

  const calculateKPIs = () => {
    if (!reports.length) return {
      avgRevenueGrowth: 0,
      avgProfitGrowth: 0,
      positiveGrowthCount: 0,
      totalComparisons: 0
    };

    const avgRevenueGrowth = reports.reduce((sum, r) => sum + (r.comparison_analysis?.revenue_growth || 0), 0) / reports.length;
    const avgProfitGrowth = reports.reduce((sum, r) => sum + (r.comparison_analysis?.net_income_growth || 0), 0) / reports.length;
    const positiveGrowthCount = reports.filter(r => (r.comparison_analysis?.net_income_growth || 0) > 0).length;

    return { 
      avgRevenueGrowth: avgRevenueGrowth * 100,
      avgProfitGrowth: avgProfitGrowth * 100,
      positiveGrowthCount,
      totalComparisons: reports.length
    };
  };

  const kpis = calculateKPIs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard Comparativo</h1>
              <p className="text-slate-600 text-lg">Visão geral das comparações financeiras</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link to={createPageUrl("Reports")} className="flex-1 lg:flex-none">
                <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Comparações
                </Button>
              </Link>
              <Link to={createPageUrl("Upload")} className="flex-1 lg:flex-none">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <GitCompareArrows className="w-4 h-4 mr-2" />
                  Nova Comparação
                </Button>
              </Link>
            </div>
          </div>

          <ExecutiveKPIs 
            kpis={kpis}
            isLoading={isLoading}
          />

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Clientes</h2>
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
              </div>
            ) : (
              <ClientList clients={clients} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
