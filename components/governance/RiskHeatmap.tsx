import React, { useState } from 'react';
import {
    AlertTriangle,
    TrendingUp,
    Shield,
    Info,
    Filter,
} from 'lucide-react';

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
    { id: '4', name: 'Aumento do Nível do Mar', category: 'Environmental', impact: 5, probability: 4, esgMultiplier: 3.0 },
    { id: '5', name: 'Falha de Segurança Cibernética', category: 'Governance', impact: 3, probability: 3, esgMultiplier: 1.1 },
    { id: '6', name: 'Acidente de Trabalho', category: 'Social', impact: 4, probability: 2, esgMultiplier: 1.0 },
];

const DetailRow = ({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) => (
    <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-500">{label}</span>
        <span className={`text-sm font-black ${highlight ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>{value}</span>
    </div>
);

export const RiskHeatmap: React.FC = () => {
    const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

    const calculateRiskScore = (risk: Risk) => (risk.impact * risk.probability * risk.esgMultiplier).toFixed(1);

    // Generate matrix flattened for grid rendering
    // Y Axis: Probability (5 to 1), X Axis: Impact (1 to 5)
    // Grid order is row by row (P=5, I=1..5), (P=4, I=1..5)...
    const gridCells = [];
    for (let p = 5; p >= 1; p--) {
        for (let i = 1; i <= 5; i++) {
            const risks = mockRisks.filter(r => r.impact === i && r.probability === p);
            const score = i * p;
            let bgColorClass = 'bg-green-500/5 hover:bg-green-500/10 border-green-500/10 hover:border-green-500';

            if (score >= 15) {
                bgColorClass = 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 hover:border-red-500';
            } else if (score >= 8) {
                bgColorClass = 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500';
            }

            gridCells.push({
                impact: i,
                probability: p,
                risks,
                bgColorClass,
                score
            });
        }
    }

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Environmental': return 'bg-green-500 text-white';
            case 'Social': return 'bg-blue-500 text-white';
            default: return 'bg-amber-500 text-white';
        }
    };

    const getCategoryPillColor = (cat: string) => {
        switch (cat) {
            case 'Environmental': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'Social': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            default: return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 text-gray-900 dark:text-white">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Matriz de Riscos ESG</h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
                        Integração Impacto x Probabilidade com Multiplicadores de Sustentabilidade.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* HEATMAP GRID */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 h-full relative">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black flex items-center gap-2">
                                <TrendingUp className="text-blue-500 w-5 h-5" />
                                Heatmap Corporativo
                            </h2>
                            <button className="flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50">
                                <Filter size={12} />
                                Visão Filtro Ativa
                            </button>
                        </div>

                        <div className="w-full max-w-[500px] mx-auto relative p-6">
                            {/* Y-Axis Label */}
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase whitespace-nowrap">
                                Probabilidade
                            </span>

                            <div className="grid grid-cols-5 gap-1 aspect-square">
                                {gridCells.map((cell) => (
                                    <div
                                        key={`${cell.impact}-${cell.probability}`}
                                        className={`rounded-xl border flex items-center justify-center transition-all cursor-pointer ${cell.bgColorClass}`}
                                        title={`Impacto: ${cell.impact}, Probabilidade: ${cell.probability}`}
                                    >
                                        <div className="flex flex-wrap gap-1 justify-center p-1">
                                            {cell.risks.map(r => (
                                                <div
                                                    key={r.id}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedRisk(r); }}
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm transition-transform hover:scale-125 hover:z-10 ${getCategoryColor(r.category)}`}
                                                    title={r.name}
                                                >
                                                    {r.id}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* X-Axis Label */}
                            <div className="text-center mt-4">
                                <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                    Impacto Operacional
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETAILS PANEL */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 min-h-[280px] relative overflow-hidden flex flex-col">
                        {selectedRisk ? (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getCategoryPillColor(selectedRisk.category)}`}>
                                        {selectedRisk.category === 'Environmental' ? 'Ambiental' : selectedRisk.category === 'Social' ? 'Social' : 'Governança'}
                                    </span>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-blue-600 leading-none">
                                            {calculateRiskScore(selectedRisk)}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fator ESG</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black mb-6 leading-tight">
                                    <span className="text-gray-400 mr-2">#{selectedRisk.id}</span>
                                    {selectedRisk.name}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <DetailRow label="Impacto Base" value={`${selectedRisk.impact}/5`} />
                                    <DetailRow label="Probabilidade" value={`${selectedRisk.probability}/5`} />
                                    <DetailRow label="Multiplicador ESG" value={`${selectedRisk.esgMultiplier}x`} highlight />
                                </div>

                                {selectedRisk.esgMultiplier > 1 && (
                                    <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 flex items-center gap-3">
                                        <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                                        <p className="text-xs font-bold text-red-600 dark:text-red-400 leading-tight">
                                            Risco amplificado por vulnerabilidades climáticas/sociais.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                <Info className="w-12 h-12 mb-2 text-gray-400" />
                                <p className="text-sm font-bold text-gray-500">Selecione um ponto na matriz para detalhamento.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Prioridade de Mitigação</h4>
                        <div className="space-y-2">
                            {mockRisks
                                .sort((a, b) => Number(calculateRiskScore(b)) - Number(calculateRiskScore(a)))
                                .slice(0, 3)
                                .map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => setSelectedRisk(r)}
                                        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-colors text-left ${selectedRisk?.id === r.id
                                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0 ${getCategoryColor(r.category)}`}>
                                            {r.id}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="block text-xs font-black text-gray-800 dark:text-gray-200 truncate">{r.name}</span>
                                            <span className="block text-[10px] font-medium text-gray-500">{r.category}</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900 dark:text-white">{calculateRiskScore(r)}</span>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
