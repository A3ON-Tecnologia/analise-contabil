
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight, CheckCircle } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const GrowthIndicator = ({ value }) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const isNeutral = value === 0;

    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-500' : (isNegative ? 'text-red-500' : 'text-gray-500');

    if (isNaN(value) || !isFinite(value)) {
        return <span className="text-gray-500">-</span>;
    }

    return (
        <span className={`inline-flex items-center ${colorClass} font-semibold`}>
            {isNeutral ? (
                <>
                    <ArrowRight className="h-4 w-4 mr-1" />
                    <span>0.0%</span>
                </>
            ) : (
                <>
                    <Icon className="h-4 w-4 mr-1" />
                    <span>{value.toFixed(1)}%</span>
                </>
            )}
        </span>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-lg shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>{`${p.name}: ${p.value.toLocaleString('pt-BR', { style: p.payload.isPercentage ? 'percent' : 'currency', currency: 'BRL', minimumFractionDigits: 1 })}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

export default function ComparisonCharts({ report }) {
    const { period_a_name, period_b_name, period_a_data, period_b_data, comparison_analysis } = report;

    const barChartData = [
        { name: 'Receita', [period_a_name]: period_a_data.revenue, [period_b_name]: period_b_data.revenue },
        { name: 'Lucro Líq.', [period_a_name]: period_a_data.net_income, [period_b_name]: period_b_data.net_income },
        { name: 'Ativos Totais', [period_a_name]: period_a_data.total_assets, [period_b_name]: period_b_data.total_assets },
        { name: 'Patrimônio', [period_a_name]: period_a_data.equity, [period_b_name]: period_b_data.equity },
    ];

    const radarChartData = [
        { metric: 'Receita', A: period_a_data.revenue, B: period_b_data.revenue, fullMark: Math.max(period_a_data.revenue, period_b_data.revenue) * 1.1 },
        { metric: 'Lucro', A: period_a_data.net_income, B: period_b_data.net_income, fullMark: Math.max(period_a_data.net_income, period_b_data.net_income) * 1.1 },
        { metric: 'Margem %', A: comparison_analysis.profit_margin_a * 100, B: comparison_analysis.profit_margin_b * 100, fullMark: Math.max(comparison_analysis.profit_margin_a, comparison_analysis.profit_margin_b) * 110 },
        { metric: 'Liquidez', A: comparison_analysis.liquidity_ratio_a, B: comparison_analysis.liquidity_ratio_b, fullMark: Math.max(comparison_analysis.liquidity_ratio_a, comparison_analysis.liquidity_ratio_b) * 1.1 },
    ];

    const pieDataA = [
        { name: 'Passivos Circ.', value: period_a_data.current_liabilities },
        { name: 'Patrimônio', value: period_a_data.equity }
    ];
    const pieDataB = [
        { name: 'Passivos Circ.', value: period_b_data.current_liabilities },
        { name: 'Patrimônio', value: period_b_data.equity }
    ];

    const comparisonTableData = [
        { metric: "Receita", valueA: period_a_data.revenue, valueB: period_b_data.revenue, growth: comparison_analysis.revenue_growth },
        { metric: "Lucro Líquido", valueA: period_a_data.net_income, valueB: period_b_data.net_income, growth: comparison_analysis.net_income_growth },
        { metric: "Ativos Totais", valueA: period_a_data.total_assets, valueB: period_b_data.total_assets, growth: (period_b_data.total_assets / period_a_data.total_assets - 1) },
        { metric: "Patrimônio Líquido", valueA: period_a_data.equity, valueB: period_b_data.equity, growth: (period_b_data.equity / period_a_data.equity - 1) },
        { metric: "Margem de Lucro", valueA: comparison_analysis.profit_margin_a, valueB: comparison_analysis.profit_margin_b, isPercentage: true, growth: (comparison_analysis.profit_margin_b - comparison_analysis.profit_margin_a) / comparison_analysis.profit_margin_a },
        { metric: "Liquidez Corrente", valueA: comparison_analysis.liquidity_ratio_a, valueB: comparison_analysis.liquidity_ratio_b, isPercentage: false, growth: (comparison_analysis.liquidity_ratio_b - comparison_analysis.liquidity_ratio_a) / comparison_analysis.liquidity_ratio_a },
    ];
    
    return (
        <div className="space-y-8">
            <Card className="border-0 shadow-xl">
                <CardHeader><CardTitle>Visão Geral da Comparação</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Métrica</TableHead>
                                <TableHead className="text-right">{period_a_name}</TableHead>
                                <TableHead className="text-right">{period_b_name}</TableHead>
                                <TableHead className="text-right">Variação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparisonTableData.map((row) => (
                                <TableRow key={row.metric}>
                                    <TableCell className="font-medium">{row.metric}</TableCell>
                                    <TableCell className="text-right">{row.isPercentage ? `${(row.valueA * 100).toFixed(1)}%` : `R$ ${row.valueA.toLocaleString('pt-BR')}`}</TableCell>
                                    <TableCell className="text-right">{row.isPercentage ? `${(row.valueB * 100).toFixed(1)}%` : `R$ ${row.valueB.toLocaleString('pt-BR')}`}</TableCell>
                                    <TableCell className="text-right"><GrowthIndicator value={row.growth * 100} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8 print-break-before">
                <Card className="border-0 shadow-xl">
                    <CardHeader><CardTitle>Comparativo de Indicadores</CardTitle></CardHeader>
                    <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(val) => `R$${(val/1000).toLocaleString()}K`}/>
                                <Tooltip formatter={(val) => `R$ ${val.toLocaleString('pt-BR')}`} />
                                <Legend />
                                <Bar dataKey={period_a_name} fill="#8884d8" />
                                <Bar dataKey={period_b_name} fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card className="border-0 shadow-xl">
                    <CardHeader><CardTitle>Análise de Performance (Radar)</CardTitle></CardHeader>
                    <CardContent className="h-96">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="metric" />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']}/>
                                <Tooltip formatter={(val) => val.toLocaleString('pt-BR')} />
                                <Legend />
                                <Radar name={period_a_name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name={period_b_name} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-xl">
                    <CardHeader><CardTitle>Composição de Ativos vs. Passivos ({period_a_name})</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieDataA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" label>
                                    {pieDataA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(val) => `R$ ${val.toLocaleString('pt-BR')}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-xl">
                    <CardHeader><CardTitle>Composição de Ativos vs. Passivos ({period_b_name})</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                                <Pie data={pieDataB} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label>
                                   {pieDataB.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(val) => `R$ ${val.toLocaleString('pt-BR')}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 print-break-before">
                <Card className="border-0 shadow-xl">
                    <CardHeader><CardTitle>Análise Executiva</CardTitle></CardHeader>
                    <CardContent className="prose max-w-none text-slate-700 leading-relaxed">
                        <p>{comparison_analysis.executive_summary}</p>
                        <h4 className="font-semibold text-slate-900 mt-6 mb-3">Principais Variações Comentadas</h4>
                        <div className="space-y-3">
                        {comparison_analysis.key_variations.map((item, index) => (
                            <div key={index} className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex justify-between items-center font-semibold">
                                <span>{item.metric}</span>
                                <GrowthIndicator value={item.change_percentage} />
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{item.comment}</p>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                    <CardHeader><CardTitle>Recomendações Estratégicas</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                        {comparison_analysis.strategic_recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full text-white flex items-center justify-center flex-shrink-0 mt-1">
                                <CheckCircle className="w-3 h-3" />
                            </div>
                            <span className="text-slate-700">{rec}</span>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
