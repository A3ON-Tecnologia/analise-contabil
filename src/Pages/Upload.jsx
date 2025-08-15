
import React, { useState } from "react";
import { ComparisonReport } from "@/entities/ComparisonReport";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Upload, FileText, TrendingUp, GitCompareArrows } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ComparisonUpload from "../components/upload/ComparisonUpload";
import ProcessingStatus from "../components/upload/ProcessingStatus";
import ComparisonPreview from "../components/upload/ComparisonPreview";

export default function UploadPage() {
  const navigate = useNavigate();
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [periodA, setPeriodA] = useState("");
  const [periodB, setPeriodB] = useState("");
  const [clientName, setClientName] = useState(""); // New state for client name
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [comparisonData, setComparisonData] = useState(null);
  const [currentStep, setCurrentStep] = useState("upload");

  const processComparison = async () => {
    if (!fileA || !fileB || !periodA || !periodB || !clientName) { // Added clientName to validation
      setError("Por favor, preencha o nome do cliente, envie os dois arquivos e preencha os nomes dos períodos.");
      return;
    }

    setProgress(0);
    setCurrentStep("processing");

    try {
      // Step 1: Upload files
      setProgress(10);
      const { file_url: file_a_url } = await UploadFile({ file: fileA });
      setProgress(25);
      const { file_url: file_b_url } = await UploadFile({ file: fileB });

      // Step 2: Extract data from both files
      setProgress(40);
      const schemaForExtraction = {
        type: "object",
        properties: {
            company_name: { type: "string" },
            revenue: { type: "number" },
            net_income: { type: "number" },
            total_assets: { type: "number" },
            equity: { type: "number" },
            current_assets: { "type": "number" }, // New field
            current_liabilities: { "type": "number" } // New field
        }
      }
      const [resultA, resultB] = await Promise.all([
          InvokeLLM({ prompt: "Extraia os seguintes dados financeiros deste documento:", file_urls: [file_a_url], response_json_schema: schemaForExtraction }),
          InvokeLLM({ prompt: "Extraia os seguintes dados financeiros deste documento:", file_urls: [file_b_url], response_json_schema: schemaForExtraction })
      ]);
      
      setProgress(60);

      const period_a_data = resultA;
      const period_b_data = resultB;

      // Step 3: Perform comparison analysis
      setProgress(80);
      const analysisPrompt = `
Realize uma análise financeira comparativa detalhada entre dois períodos para a empresa ${period_a_data.company_name} (Cliente: ${clientName}).

**Dados do Período A (${periodA}):**
- Receita: R$ ${period_a_data.revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Lucro Líquido: R$ ${period_a_data.net_income?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Ativos Totais: R$ ${period_a_data.total_assets?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Patrimônio Líquido: R$ ${period_a_data.equity?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Ativos Circulantes: R$ ${period_a_data.current_assets?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Passivos Circulantes: R$ ${period_a_data.current_liabilities?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

**Dados do Período B (${periodB}):**
- Receita: R$ ${period_b_data.revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Lucro Líquido: R$ ${period_b_data.net_income?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Ativos Totais: R$ ${period_b_data.total_assets?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Patrimônio Líquido: R$ ${period_b_data.equity?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Ativos Circulantes: R$ ${period_b_data.current_assets?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Passivos Circulantes: R$ ${period_b_data.current_liabilities?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Calcule e forneça o seguinte, em formato JSON:
1.  **revenue_growth**: Crescimento percentual da receita (de A para B).
2.  **net_income_growth**: Crescimento percentual do lucro líquido (de A para B).
3.  **profit_margin_a**: Margem de lucro para o período A (Lucro Líquido / Receita).
4.  **profit_margin_b**: Margem de lucro para o período B (Lucro Líquido / Receita).
5.  **liquidity_ratio_a**: Índice de liquidez corrente para o período A (Ativos Circulantes / Passivos Circulantes).
6.  **liquidity_ratio_b**: Índice de liquidez corrente para o período B (Ativos Circulantes / Passivos Circulantes).
7.  **executive_summary**: Um parágrafo de resumo executivo sobre a performance da empresa, comparando os dois períodos.
8.  **key_variations**: Uma lista de variações chave (receita, lucro, ativos, patrimônio, ativos circulantes, passivos circulantes, margem de lucro, liquidez corrente), cada uma com a métrica, a variação percentual (se aplicável para métricas de crescimento) ou a diferença (para índices), e um breve comentário sobre o significado.
9.  **strategic_recommendations**: Uma lista de 2-3 recomendações estratégicas baseadas na análise comparativa.
`;

      const analysis = await InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: ComparisonReport.schema().properties.comparison_analysis
      });

      setComparisonData({
        client_name: clientName, // Added client_name
        company_name: period_a_data.company_name,
        period_a_name: periodA,
        period_b_name: periodB,
        file_a_url,
        file_b_url,
        period_a_data,
        period_b_data,
        comparison_analysis: analysis
      });
      
      setProgress(100);
      setCurrentStep("preview");

    } catch (err) {
      setError("Erro ao processar a comparação: " + err.message);
      setCurrentStep("upload");
    } finally {
      // no-op
    }
  };
  
  const saveReport = async () => {
    if (!comparisonData) return;
    await ComparisonReport.create(comparisonData);
    navigate(createPageUrl("Dashboard"));
  };

  const resetUpload = () => {
    setFileA(null);
    setFileB(null);
    setPeriodA("");
    setPeriodB("");
    setClientName(""); // Reset client name
    setComparisonData(null);
    setCurrentStep("upload");
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Análise Comparativa</h1>
              <p className="text-slate-600 mt-1">Envie dois balancetes para comparar a performance</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {currentStep === "upload" && (
              <ComparisonUpload
                fileA={fileA}
                setFileA={setFileA}
                fileB={fileB}
                setFileB={setFileB}
                periodA={periodA}
                setPeriodA={setPeriodA}
                periodB={periodB}
                setPeriodB={setPeriodB}
                clientName={clientName} // Pass clientName
                setClientName={setClientName} // Pass setClientName
                onProcess={processComparison}
              />
            )}

            {currentStep === "processing" && (
              <ProcessingStatus progress={progress} />
            )}

            {currentStep === "preview" && comparisonData && (
              <ComparisonPreview
                data={comparisonData}
                onSave={saveReport}
                onCancel={resetUpload}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
