
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, GitCompareArrows, User } from "lucide-react";

const UploadSlot = ({ file, setFile, period, setPeriod, title, id, dragActive, onDragEnter, onDragLeave, onDrop }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {file ? (
        <div className="space-y-3">
          <FileText className="w-10 h-10 mx-auto text-blue-600" />
          <p className="font-semibold text-slate-900 truncate">{file.name}</p>
          <Input 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="Nome do Período (ex: Q1 2023)"
            className="text-center"
          />
          <Button onClick={() => setFile(null)} variant="outline" size="sm">Trocar Arquivo</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Upload className="w-10 h-10 mx-auto text-slate-500" />
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-500">Arraste e solte o PDF aqui</p>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            Ou selecione o arquivo
          </Button>
        </div>
      )}
    </div>
  );
};

export default function ComparisonUpload({ fileA, setFileA, fileB, setFileB, periodA, setPeriodA, periodB, setPeriodB, clientName, setClientName, onProcess }) {
  const [dragA, setDragA] = useState(false);
  const [dragB, setDragB] = useState(false);

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <GitCompareArrows className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-slate-900">Comparação de Balancetes</CardTitle>
        <p className="text-slate-600">Envie os dois balancetes em PDF para iniciar a análise</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome do Cliente"
            className="pl-10 text-lg"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <UploadSlot 
            file={fileA} setFile={setFileA} period={periodA} setPeriod={setPeriodA} title="Período A (Base)" id="A"
            dragActive={dragA} onDragEnter={() => setDragA(true)} onDragLeave={() => setDragA(false)} onDrop={(e) => { e.preventDefault(); setDragA(false); if(e.dataTransfer.files[0]) setFileA(e.dataTransfer.files[0]) }}
          />
          <UploadSlot 
            file={fileB} setFile={setFileB} period={periodB} setPeriod={setPeriodB} title="Período B (Comparação)" id="B"
            dragActive={dragB} onDragEnter={() => setDragB(true)} onDragLeave={() => setDragB(false)} onDrop={(e) => { e.preventDefault(); setDragB(false); if(e.dataTransfer.files[0]) setFileB(e.dataTransfer.files[0]) }}
          />
        </div>
        <Button 
          onClick={onProcess}
          disabled={!fileA || !fileB || !periodA || !periodB || !clientName}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          size="lg"
        >
          <GitCompareArrows className="w-5 h-5 mr-2" />
          Iniciar Análise Comparativa
        </Button>
      </CardContent>
    </Card>
  );
}
