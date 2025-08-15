import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, X, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

const ValueCard = ({ title, value, isCurrency = true }) => (
  <div className="p-3 bg-slate-50 rounded-lg text-center">
    <p className="text-sm text-slate-600">{title}</p>
    <p className="font-bold text-lg text-slate-900">
      {isCurrency ? `R$ ${value.toLocaleString('pt-BR')}` : value}
    </p>
  </div>
);

const GrowthIndicator = ({ value }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  if (isNeutral) {
    return (
      <span className="flex items-center text-slate-600">
        <ArrowRight className="w-4 h-4 mr-1" />
        {value.toFixed(1)}%
      </span>
    );
  }

  return (
    <span className={`flex items-center font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
      {value.toFixed(1)}%
    </span>
  );
};

export default function ComparisonPreview({ data, onSave, onCancel }) {
  const { period_a_name, period_b_name, period_a_data, period_b_data, comparison_analysis } = data;

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-slate-900">{data.company_name}: Análise Comparativa</CardTitle>
          <Badge className="bg-emerald-100 text-emerald-800">Análise Concluída</Badge>
        </div>
        <p className="text-slate-600">{period_a_name} vs. {period_b_name}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-slate-900 mb-3">Dados Gerais</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ValueCard title={`Receita (${period_a_name})`} value={period_a_data.revenue} />
            <ValueCard title={`Receita (${period_b_name})`} value={period_b_data.revenue} />
            <ValueCard title={`Lucro (${period_a_name})`} value={period_a_data.net_income} />
            <ValueCard title={`Lucro (${period_b_name})`} value={period_b_data.net_income} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-slate-900 mb-3">Variações Chave</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Variação (%)</TableHead>
                  <TableHead>Comentário da Análise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison_analysis.key_variations?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.metric}</TableCell>
                    <TableCell>
                      <GrowthIndicator value={item.change_percentage} />
                    </TableCell>
                    <TableCell>{item.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-slate-900">Resumo Executivo</h3>
            <div className="bg-slate-50 p-4 rounded-lg text-slate-700 leading-relaxed">
              {comparison_analysis.executive_summary}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-slate-900">Recomendações Estratégicas</h3>
            <ul className="space-y-2">
              {comparison_analysis.strategic_recommendations?.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-700">
                  <ArrowRight className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <Button variant="outline" onClick={onCancel} className="border-slate-300">
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={onSave} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Save className="w-4 h-4 mr-2" />
          Salvar Comparação
        </Button>
      </CardFooter>
    </Card>
  );
}