import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, BadgeInfo } from 'lucide-react';

interface Risk {
    id: string;
    name: string;
    impact: number;
    probability: number;
    esgMultiplier: number;
    category: 'Environmental' | 'Social' | 'Governance';
}

const mockRisks: Risk[] = [
    { id: '1', name: 'Vazamento de Óleo', category: 'Environmental', impact: 5, probability: 2, esgMultiplier: 1.5 },
    { id: '2', name: 'Greve de Caminhoneiros', category: 'Social', impact: 4, probability: 3, esgMultiplier: 1.2 },
    { id: '3', name: 'Corrupção em Licitações', category: 'Governance', impact: 5, probability: 1, esgMultiplier: 1.0 },
    { id: '4', name: 'Aumento do Nível do Mar', category: 'Environmental', impact: 5, probability: 4, esgMultiplier: 3.0 }, // Climate amplified
    { id: '5', name: 'Falha de Segurança Cibernética', category: 'Governance', impact: 3, probability: 3, esgMultiplier: 1.1 },
    { id: '6', name: 'Acidente de Trabalho', category: 'Social', impact: 4, probability: 2, esgMultiplier: 1.0 },
];

export const RiskHeatmap: React.FC = () => {
    const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

    const calculateRiskScore = (risk: Risk) => {
        return (risk.impact * risk.probability * risk.esgMultiplier).toFixed(1);
    };

    const getRiskColor = (score: number) => {
        if (score >= 15) return 'bg-red-500';
        if (score >= 8) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    // Matrix cells 5x5
    const matrix = [];
    for (let p = 5; p >= 1; p--) { // Probability Y-axis
        for (let i = 1; i <= 5; i++) { // Impact X-axis
            const risksInCell = mockRisks.filter(r => r.impact === i && r.probability === p);
            matrix.push({ impact: i, probability: p, risks: risksInCell });
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Matriz de Riscos ESG Integrada
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Impacto x Probabilidade (com Multiplicador Climático/Social)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Heatmap Visualization */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-gray-500" />
                        Heatmap de Riscos Corporativos
                    </h3>

                    <div className="relative p-6">
                        {/* Axes Labels */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 -rotate-90 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Probabilidade
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Impacto Financeiro/Operacional
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-5 gap-1 aspect-square max-w-[500px] mx-auto bg-gray-100 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 p-1">
                            {matrix.map((cell) => {
                                const baseScore = cell.impact * cell.probability;
                                let bgColorClass = 'bg-gray-50 dark:bg-white/5';
                                if (baseScore >= 15) bgColorClass = 'bg-red-50 dark:bg-red-900/10';
                                else if (baseScore >= 8) bgColorClass = 'bg-yellow-50 dark:bg-yellow-900/10';
                                else bgColorClass = 'bg-green-50 dark:bg-green-900/10';

                                return (
                                    <div
                                        key={`${cell.impact}-${cell.probability}`}
                                        className={`relative border border-gray-200 dark:border-white/5 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${bgColorClass}`}
                                    >
                                        {cell.risks.length > 0 && (
                                            <div className="flex gap-1 flex-wrap justify-center p-1">
                                                {cell.risks.map(r => (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => setSelectedRisk(r)}
                                                        className={`
                                                            w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#1C1C1C] cursor-pointer hover:scale-110 transition-transform
                                                            ${getRiskColor(parseFloat(calculateRiskScore(r)))}
                                                        `}
                                                        title={r.name}
                                                    >
                                                        {r.id}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Axis guides */}
                        <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1 max-w-[500px] mx-auto">
                            <span>Baixo (1)</span>
                            <span>Extremo (5)</span>
                        </div>
                    </div>
                </div>

                {/* Risk Details & List */}
                <div className="space-y-6">
                    {/* Selected Risk Info */}
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm min-h-[200px]">
                        {selectedRisk ? (
                            <div className="animate-in fade-in duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white ${selectedRisk.category === 'Environmental' ? 'bg-green-500' : selectedRisk.category === 'Social' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                        {selectedRisk.category}
                                    </span>
                                    <div className="text-right">
                                        <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-none">
                                            {calculateRiskScore(selectedRisk)}
                                        </h2>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Risk Score</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{selectedRisk.id}. {selectedRisk.name}</h3>

                                <div className="space-y-2 text-sm mt-4">
                                    <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-1">
                                        <span className="text-gray-500">Impacto</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{selectedRisk.impact}/5</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-1">
                                        <span className="text-gray-500">Probabilidade</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{selectedRisk.probability}/5</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-1">
                                        <span className="text-gray-500 flex items-center gap-1">
                                            Vuln. Climática/Social
                                            <BadgeInfo className="w-3 h-3 text-gray-400" />
                                        </span>
                                        <span className={`font-bold ${selectedRisk.esgMultiplier > 1 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                            {selectedRisk.esgMultiplier}x
                                        </span>
                                    </div>
                                </div>

                                {selectedRisk.esgMultiplier > 1 && (
                                    <div className="mt-4 bg-red-50 dark:bg-red-900/10 p-3 rounded-sm border border-red-100 dark:border-red-900/30 flex gap-2 items-start">
                                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-700 dark:text-red-400 leading-tight">
                                            Este risco é <strong>amplificado</strong> por fatores climáticos ou sociais externos. Requer mitigação prioritária.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <TrendingUp className="w-10 h-10 text-gray-200 dark:text-gray-700 mb-2" />
                                <p className="text-sm text-gray-400">Selecione um risco na matriz para ver detalhes e cálculo de impacto.</p>
                            </div>
                        )}
                    </div>

                    {/* Top Risks List */}
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-4">Top Risks (Prioridade)</h3>
                        <div className="space-y-3">
                            {mockRisks
                                .sort((a, b) => parseFloat(calculateRiskScore(b)) - parseFloat(calculateRiskScore(a)))
                                .slice(0, 4)
                                .map((risk) => (
                                    <div
                                        key={risk.id}
                                        onClick={() => setSelectedRisk(risk)}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-sm cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getRiskColor(parseFloat(calculateRiskScore(risk)))}`}>
                                                {risk.id}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{risk.name}</p>
                                                <p className="text-[10px] text-gray-400">{risk.category}</p>
                                            </div>
                                        </div>
                                        <span className="font-black text-sm text-gray-900 dark:text-white">{calculateRiskScore(risk)}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
