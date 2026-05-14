import React from 'react';
import { Globe, ShieldCheck, ExternalLink } from 'lucide-react';
import { AppMode } from '../../types';

interface CitizenPortalCardProps {
    onNavigate?: (mode: AppMode) => void;
}

export const CitizenPortalCard: React.FC<CitizenPortalCardProps> = ({ onNavigate }) => {
    const items = [
        { label: 'Emissões & Energia', time: 'Atualizado há 2h', status: 'green' },
        { label: 'Projetos Sociais', time: 'Atualizado há 1d', status: 'green' },
        { label: 'Estrutura de Governança', time: 'Atualizado há 5d', status: 'orange' },
    ];

    return (
        <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl p-8 border border-gray-100 dark:border-white/10 transition-all hover:shadow-rose-900/5 group">
            {/* Watermark Globe Background */}
            <div className="absolute right-0 top-0 w-48 h-48 opacity-10 dark:opacity-20 pointer-events-none">
                <Globe size={180} className="text-gray-400 dark:text-gray-600 -mr-10 -mt-10" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-black text-black dark:text-white">Portal do Cidadão</h3>
                </div>

                {/* Status Indicator */}
                <div className="flex items-start gap-4 mb-8">
                    <div className="relative">
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                            <ShieldCheck size={28} />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
                    </div>
                    <div>
                        <p className="text-lg font-black text-black dark:text-white leading-tight">Canal Operante</p>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            SISTEMA DE DIVULGAÇÃO EM TEMPO REAL
                        </p>
                    </div>
                </div>

                {/* Monitoring List */}
                <div className="space-y-4 mb-8">
                    {items.map((item, idx) => (
                        <div key={idx} className="group/item">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 transition-colors group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                                    {item.label}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                        {item.time}
                                    </span>
                                    <span className={`w-2 h-2 rounded-full ${item.status === 'green' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                </div>
                            </div>
                            <div className={`h-0.5 w-full transition-all duration-500 ${idx === items.length - 1 ? 'bg-transparent' : (item.status === 'green' ? 'bg-green-500' : 'bg-orange-500')}`} />
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <button 
                    onClick={() => onNavigate?.(AppMode.PUBLIC_COMPLIANCE)}
                    className="w-full py-4 px-6 bg-[#0084B4] hover:bg-[#00739E] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.98]"
                >
                    Acessar Visão Pública <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
};
