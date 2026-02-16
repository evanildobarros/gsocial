import React from 'react';
import { Leaf, Droplets, Trash2, ShieldAlert, TreePine } from 'lucide-react';

interface EnvironmentalSummaryCardProps {
    answers: Record<string, number>;
}

const getStatusLabel = (val: number) => {
    if (val >= 5) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' };
    if (val >= 3) return { label: 'Em Evolução', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-100' };
};

export const EnvironmentalSummaryCard: React.FC<EnvironmentalSummaryCardProps> = ({ answers }) => {
    const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / (Object.keys(answers).length || 1);
    const globalStatus = getStatusLabel(Math.round(avgScore));

    const indices = [
        {
            id: 'e_ghg',
            label: 'Descarbonização',
            icon: Leaf,
            value: answers['e_ghg'] || 1,
            color: 'text-green-500',
            bg: 'bg-green-50'
        },
        {
            id: 'e_waste',
            label: 'Circularidade',
            icon: Trash2,
            value: answers['e_waste'] || 1,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50'
        },
        {
            id: 'e_spill',
            label: 'Resiliência',
            icon: ShieldAlert,
            value: answers['e_spill'] || 1,
            color: 'text-red-500',
            bg: 'bg-red-50'
        },
        {
            id: 'e_water',
            label: 'Proteção Hídrica',
            icon: Droplets,
            value: answers['e_water'] || 1,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            id: 'e_biodiversity',
            label: 'Biodiversidade',
            icon: TreePine,
            value: answers['e_biodiversity'] || 1,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        }
    ];

    return (
        <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Resumo Ambiental ABNT
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
                    Maturidade Geral (E)
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
