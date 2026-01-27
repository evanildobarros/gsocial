import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    Brain,
    Zap,
    AlertTriangle,
    Wind,
    PlayCircle,
    RefreshCw,
    Sliders
} from 'lucide-react';

export const PredictiveAnalysis: React.FC = () => {
    // Simulation Parameters State
    const [cargoGrowth, setCargoGrowth] = useState<number>(5);
    const [renewableAdoption, setRenewableAdoption] = useState<number>(20);
    const [socialInvestment, setSocialInvestment] = useState<number>(100); // % of budget

    // Mock Simulation Logic
    const simulationData = useMemo(() => {
        const baseEmission = 12000; // tCO2e
        const baseSocialRisk = 45; // Risk Index (0-100)

        // Calculate Future Scenario
        const projectedEmission = baseEmission * (1 + (cargoGrowth / 100)) * (1 - (renewableAdoption / 200));
        const projectedRisk = Math.max(0, baseSocialRisk - (socialInvestment * 0.2) + (cargoGrowth * 0.5));

        // Generate Chart Points (12 Months)
        const historyPoints = [10.5, 11.2, 10.8, 11.5, 12.0, 11.8]; // Last 6 months (k tons)
        const futurePoints = [];

        for (let i = 1; i <= 6; i++) {
            // Linear projection based on growth
            const lastVal = historyPoints[historyPoints.length - 1];
            const trend = (projectedEmission / 1000 - lastVal) / 6;
            futurePoints.push(lastVal + (trend * i) + (Math.random() * 0.5 - 0.25));
        }

        return {
            currentEmission: 12.4, // k tons
            projectedEmission: projectedEmission / 1000,
            currentRisk: 42,
            projectedRisk: projectedRisk,
            chartData: [...historyPoints, ...futurePoints]
        };
    }, [cargoGrowth, renewableAdoption, socialInvestment]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-600" />
                        Análise Preditiva & Simulação de Cenários
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Utilize IA para projetar impactos ESG baseados em variáveis operacionais.
                    </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/10 px-3 py-1.5 rounded-3xl border border-purple-200 dark:border-purple-900/30 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">IA Engine v4.2 Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Panel */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm h-full">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white font-bold border-b border-gray-100 dark:border-white/5 pb-4">
                        <Sliders className="w-5 h-5" />
                        Parâmetros de Simulação
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-300">Crescimento de Carga (%)</label>
                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{cargoGrowth}%</span>
                            </div>
                            <input
                                type="range"
                                min="-10"
                                max="30"
                                value={cargoGrowth}
                                onChange={(e) => setCargoGrowth(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Impacta emissões e risco social (tráfego).</p>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-300">Adoção Renovável (%)</label>
                                <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">{renewableAdoption}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={renewableAdoption}
                                onChange={(e) => setRenewableAdoption(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Fator de redução direta de Escopo 2.</p>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-300">Investimento Social (% Budget)</label>
                                <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{socialInvestment}%</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="200"
                                value={socialInvestment}
                                onChange={(e) => setSocialInvestment(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Mitiga riscos de conflito comunitário.</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                        <button
                            onClick={() => { setCargoGrowth(5); setRenewableAdoption(20); setSocialInvestment(100); }}
                            className="w-full py-2.5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-gray-400 font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Resetar Parâmetros
                        </button>
                    </div>
                </div>

                {/* Visualization Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Chart */}
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Projeção de Emissões (tCO2e)</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-1 bg-gray-400 rounded-full"></div>
                                        <span className="text-xs text-gray-500">Histórico (6 meses)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-1 bg-purple-500 rounded-full border border-dashed border-white"></div>
                                        <span className="text-xs text-purple-500 font-bold">IA Prediction (12 meses)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Forecast 2026</p>
                                <p className={`text-3xl font-black ${simulationData.projectedEmission > 13 ? 'text-red-500' : 'text-green-500'}`}>
                                    {(simulationData.projectedEmission).toFixed(1)}k
                                </p>
                                <p className="text-xs text-gray-400">tons CO2e</p>
                            </div>
                        </div>

                        {/* SVG Chart */}
                        <div className="h-64 w-full relative flex items-end justify-between gap-1 pt-8">
                            {/* Y-Axis Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                                <div className="border-t border-gray-900 dark:border-white w-full"></div>
                                <div className="border-t border-gray-900 dark:border-white w-full"></div>
                                <div className="border-t border-gray-900 dark:border-white w-full"></div>
                                <div className="border-t border-gray-900 dark:border-white w-full"></div>
                                <div className="border-t border-gray-900 dark:border-white w-full"></div>
                            </div>

                            {simulationData.chartData.map((val, idx) => {
                                const isProjected = idx >= 6;
                                const heightPct = Math.min(100, (val / 16) * 100); // Scale based on max ~16k
                                return (
                                    <div key={idx} className="w-full flex flex-col items-center group relative h-full justify-end">
                                        <div
                                            className={`
                                                w-full max-w-[30px] rounded-t-sm transition-all duration-500 relative
                                                ${isProjected ? 'bg-purple-500 opacity-80' : 'bg-gray-300 dark:bg-gray-700'}
                                                ${isProjected ? 'hover:bg-purple-400' : 'hover:bg-gray-400'}
                                            `}
                                            style={{ height: `${heightPct}%` }}
                                        >
                                            {isProjected && (
                                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoNHY0SDB6IiBmaWxsPSIjRkZGIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30"></div>
                                            )}
                                        </div>
                                        {/* Tooltip on Hover */}
                                        <div className="absolute -top-8 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {isProjected ? 'Prev: ' : 'Real: '}{val.toFixed(1)}k
                                        </div>
                                        {/* X-Axis Label */}
                                        <span className="text-[9px] text-gray-400 mt-2 font-mono">
                                            {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][idx]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Impact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-5 rounded-3xl border ${simulationData.projectedRisk > 50 ? 'bg-red-50 border-red-200 dark:bg-red-900/10' : 'bg-green-50 border-green-200 dark:bg-green-900/10'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-bold text-sm ${simulationData.projectedRisk > 50 ? 'text-red-800' : 'text-green-800'}`}>Risco Social Projetado</h4>
                                <AlertTriangle className={`w-4 h-4 ${simulationData.projectedRisk > 50 ? 'text-red-500' : 'text-green-500'}`} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-black ${simulationData.projectedRisk > 50 ? 'text-red-700' : 'text-green-700'}`}>
                                    {simulationData.projectedRisk.toFixed(0)}/100
                                </span>
                                <span className="text-xs text-gray-500">
                                    {(simulationData.projectedRisk - simulationData.currentRisk) > 0 ? '▲ Aumento previsto' : '▼ Redução prevista'}
                                </span>
                            </div>
                            <p className="text-xs mt-2 opacity-80 leading-tight">
                                {simulationData.projectedRisk > 50
                                    ? 'Atenção: Crescimento acelerado sem contrapartida social eleva risco de tickets e greves.'
                                    : 'Cenário Estável: Investimento social adequado para a demanda projetada.'}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#1C1C1C] p-5 rounded-3xl border border-gray-200 dark:border-white/5">
                            <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                Insights Automáticos
                            </h4>
                            <ul className="space-y-2">
                                {cargoGrowth > 10 && (
                                    <li className="text-xs text-gray-600 dark:text-gray-400 flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0"></div>
                                        Forte expansão de carga exigirá revisão do plano de gerenciamento de resíduos (PGRS) até Mar/2026.
                                    </li>
                                )}
                                {renewableAdoption < 30 && (
                                    <li className="text-xs text-gray-600 dark:text-gray-400 flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1 shrink-0"></div>
                                        Mix energético atual insuficiente para atingir meta NetZero 2030 neste cenário.
                                    </li>
                                )}
                                <li className="text-xs text-gray-600 dark:text-gray-400 flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                                    Sazonalidade de chuvas em Abril pode impactar dispersão de poluentes (+12% PM2.5).
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
