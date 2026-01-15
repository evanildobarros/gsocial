import React from 'react';
import { Users, Scale, TrendingUp, AlertTriangle } from 'lucide-react';

export const DiversityDashboard: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Diversidade, Equidade e Inclusão (DE&I)</h1>
                    <p className="text-sm text-gray-500 mt-1">Censo em tempo real e monitoramento de equidade</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-sm font-bold text-sm border border-purple-200 dark:border-purple-800">
                    Dados Anonimizados (K-anonymity)
                </div>
            </div>

            {/* Wage Gap Alert */}
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 p-4 rounded-r-sm flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                <div>
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-400 text-sm">Alerta de Monitoramento Salarial</h3>
                    <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                        Foi detectado um <strong>gap de 5.2%</strong> na média salarial entre gêneros no nível "Coordenação". Ação Justificativa pendente.
                    </p>
                </div>
                <button className="ml-auto text-xs font-bold text-yellow-700 underline hover:text-yellow-900">Ver Detalhes</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Liderança Feminina */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Liderança Feminina</h3>
                        <Users className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="relative w-40 h-40 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-gray-100 dark:text-white/5"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-happiness-1"
                                strokeDasharray="35, 100" // 35%
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">35%</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Meta: 40%</span>
                        </div>
                    </div>
                </div>

                {/* Raça/Etnia - Stacked Bar Placeholder */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Raça/Etnia por Nível</h3>
                        <Scale className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {['Diretoria', 'Gerência', 'Operacional'].map((level) => (
                            <div key={level}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500">{level}</span>
                                </div>
                                <div className="flex h-3 rounded-full overflow-hidden">
                                    <div className="flex-1 bg-blue-500" />
                                    <div className="w-[30%] bg-green-500" />
                                    <div className="w-[10%] bg-purple-500" />
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4 justify-center mt-4">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" /> <span className="text-[10px] text-gray-500">Brancos</span></div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> <span className="text-[10px] text-gray-500">Pardos</span></div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full" /> <span className="text-[10px] text-gray-500">Pretos</span></div>
                        </div>
                    </div>
                </div>

                {/* PCDs Gauge */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm flex flex-col items-center justify-center">
                    <div className="flex justify-between items-start w-full mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Cota PCDs</h3>
                        <Users className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="relative w-full max-w-[180px] aspect-[2/1] overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[200%] rounded-full border-[20px] border-gray-100 dark:border-white/5" />
                        <div className="absolute top-0 left-0 w-full h-[200%] rounded-full border-[20px] border-transparent border-t-green-500 rotate-[-45deg]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
                    </div>
                    <div className="-mt-10 text-center">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">5.2%</span>
                        <p className="text-xs text-green-600 font-bold">Acima da Cota Legal</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
