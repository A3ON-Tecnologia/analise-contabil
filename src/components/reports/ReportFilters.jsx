import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export default function ReportFilters({ reports, onFilter }) {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedPerformance, setSelectedPerformance] = useState("all");

  const periods = [...new Set(reports.map(r => r.period))].filter(Boolean);

  const applyFilters = () => {
    let filtered = reports;

    if (selectedPeriod !== "all") {
      filtered = filtered.filter(r => r.period === selectedPeriod);
    }

    if (selectedPerformance !== "all") {
      filtered = filtered.filter(r => {
        const roa = (r.financial_analysis?.return_on_assets || 0) * 100;
        if (selectedPerformance === "high") return roa > 10;
        if (selectedPerformance === "medium") return roa >= 5 && roa <= 10;
        if (selectedPerformance === "low") return roa < 5;
        return true;
      });
    }

    onFilter(filtered);
  };

  const clearFilters = () => {
    setSelectedPeriod("all");
    setSelectedPerformance("all");
    onFilter(reports);
  };

  React.useEffect(() => {
    applyFilters();
  }, [selectedPeriod, selectedPerformance, reports]);

  return (
    <div className="flex gap-3 flex-wrap">
      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <SelectTrigger className="w-40 border-slate-300">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os períodos</SelectItem>
          {periods.map(period => (
            <SelectItem key={period} value={period}>{period}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
        <SelectTrigger className="w-40 border-slate-300">
          <SelectValue placeholder="Performance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="high">Alta (ROA &gt; 10%)</SelectItem>
          <SelectItem value="medium">Média (ROA 5-10%)</SelectItem>
          <SelectItem value="low">Baixa (ROA &lt; 5%)</SelectItem>
        </SelectContent>
      </Select>

      {(selectedPeriod !== "all" || selectedPerformance !== "all") && (
        <Button variant="outline" onClick={clearFilters} className="border-slate-300">
          <X className="w-4 h-4 mr-2" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}