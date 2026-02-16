import React from 'react';
import { Shield, Scale, Eye, Users, Gavel } from 'lucide-react';

interface GovernanceSummaryCardProps {
    answers: Record<string, number>;
}

const getStatusLabel = (val: number) => {
    if (val >= 5) return { label: 'Conforme', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (val >= 3) return { label: 'Em Processo', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { label: 'Incipiente', color: 'text-red-600', bg: 'bg-red-100' };
};

export const GovernanceSummaryCard: React.FC<GovernanceSummaryCardProps> = ({ answers }) => {
    const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / (Object.keys(answers).length || 1);
    const globalStatus = getStatusLabel(Math.round(avgScore));

    const indices = [
        {
            id: 'g_compliance',
            label: 'Compliance',
            icon: Shield,
            value: answers['g_compliance'] || 1,
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            id: 'g_risks',
            label: 'Gestão de Riscos',
            icon: Scale,
            value: answers['g_risks'] || 1,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            id: 'g_transparency',
            label: 'Transparência',
            icon: Eye,
            value: answers['g_transparency'] || 1,
            color: 'text-cyan-500',
            bg: 'bg-cyan-50'
        },
        {
            id: 'g_board',
            label: 'Governança',
            icon: Users,
            value: answers['g_board'] || 1,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50'
        },
        {
            id: 'g_ethics',
            label: 'Ética & Conduta',
            icon: Gavel,
            value: answers['g_ethics'] || 1,
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        }
    ];

    return (
        <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Resumo de Governança
                </span>
            </div>

            <div className="space-y-5">
                {indices.map((idx) => {
                    const status = getStatusLabel(idx.value);
                    const Icon = idx.icon;
                    return (
                        <div key={idx.id}>
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                    <Icon className={`w-3.5 h-3.5 ${idx.color}`} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                        {idx.label}
                                    </span>
                                </div>
                                <span className={`text-[10px] font-black uppercase ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${idx.value >= 5 ? 'bg-purple-500' :
                                                idx.value >= 3 ? 'bg-blue-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${(idx.value / 5) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 w-6">
                                    L{idx.value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`mt-6 p-4 rounded-2xl border border-dashed ${globalStatus.bg} dark:bg-opacity-10 border-current`}>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    Maturidade (G)
                </p>
                <div className="flex justify-between items-center">
                    <span className={`text-sm font-black uppercase ${globalStatus.color}`}>
                        Nível {Math.round(avgScore)} — {globalStatus.label}
                    </span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">
                        {avgScore.toFixed(1)} <span className="text-xs text-gray-400">/ 5.0</span>
                    </span>
                </div>
            </div>
        </div>
    );
};
