import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Search, BarChart3, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, name: "Upload do arquivo", icon: FileText, threshold: 20 },
  { id: 2, name: "Extração de dados", icon: Search, threshold: 60 },
  { id: 3, name: "Análise financeira", icon: BarChart3, threshold: 90 },
  { id: 4, name: "Finalização", icon: CheckCircle, threshold: 100 },
];

export default function ProcessingStatus({ progress }) {
  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Processando Análise Financeira</h3>
          <p className="text-slate-600">Extraindo dados e gerando insights executivos...</p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Progresso</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {steps.map((step) => {
            const isActive = progress >= (step.threshold - 20) && progress < step.threshold;
            const isCompleted = progress >= step.threshold;
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-blue-50 border-l-4 border-blue-500" 
                    : isCompleted 
                    ? "bg-emerald-50" 
                    : "bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isCompleted 
                    ? "bg-emerald-500 text-white" 
                    : isActive 
                    ? "bg-blue-500 text-white" 
                    : "bg-slate-300 text-slate-600"
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isActive || isCompleted ? "text-slate-900" : "text-slate-600"
                  }`}>
                    {step.name}
                  </p>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
                {isActive && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}