import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, FileText, ArrowRight, GitCompareArrows } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientList({ clients }) {
  const clientNames = Object.keys(clients);

  if (clientNames.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-slate-600">Comece fazendo sua primeira análise comparativa para um cliente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clientNames.map(clientName => {
        const clientReports = clients[clientName];
        const lastReportDate = clientReports.length > 0 ? new Date(clientReports[0].created_date) : null;

        return (
          <Link key={clientName} to={createPageUrl(`ClientDetail?name=${encodeURIComponent(clientName)}`)}>
            <Card className="group h-full flex flex-col justify-between border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-slate-900 group-hover:text-blue-600 transition-colors">
                    {clientName}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <GitCompareArrows className="w-4 h-4" />
                    <span>{clientReports.length} Comparações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                {lastReportDate && (
                  <p className="text-xs text-slate-500 mt-4 pt-4 border-t">
                    Última análise: {format(lastReportDate, "d 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}