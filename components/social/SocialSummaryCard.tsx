import React from 'react';
import { Users, Heart, ShieldCheck, Briefcase } from 'lucide-react';

interface SocialSummaryCardProps {
    answers: Record<string, number>;
}

const getStatusLabel = (val: number) => {
    if (val >= 5) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' };
    if (val >= 3) return { label: 'Em Evolução', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-100' };
};

export const SocialSummaryCard: React.FC<SocialSummaryCardProps> = ({ answers }) => {
    const relevantAnswers = Object.entries(answers)
        .filter(([key]) => key.startsWith('s_'))
        .map(([, value]) => value);
    
    const avgScore = relevantAnswers.length > 0 
        ? relevantAnswers.reduce((a, b) => a + b, 0) / relevantAnswers.length 
        : 1;
        
    const globalStatus = getStatusLabel(Math.round(avgScore));

    const indices = [
        {
            id: 's_diversity',
            label: 'Diversidade & Inclusão',
            icon: Users,
            value: answers['s_diversity'] || 1,
            color: 'text-orange-500',
        },
        {
            id: 's_community',
            label: 'Relação Porto-Cidade',
            icon: Heart,
            value: answers['s_community'] || 1,
            color: 'text-pink-500',
        },
        {
            id: 's_human_rights',
            label: 'Direitos Humanos',
            icon: ShieldCheck,
            value: answers['s_human_rights'] || 1,
            color: 'text-red-500',
        },
        {
            id: 's_safety',
            label: 'Saúde & Segurança (SSO)',
            icon: Briefcase,
            value: answers['s_safety'] || 1,
            color: 'text-emerald-500',
        }
    ];

    return (
        <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Resumo Social ABNT
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
                                        className={`h-full rounded-full transition-all duration-500 ${idx.value >= 5 ? 'bg-green-500' :
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
                    Maturidade Geral (S)
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
