import React from 'react';
import { ArrowLeft, Activity, BarChart3, Target, Zap, Users, Coins } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicIndicators: React.FC<PublicPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" />
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-sm font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                            <Activity size={16} /> Indicadores
                        </span>
                    </div>
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-wide"
                    >
                        <ArrowLeft size={14} /> Voltar
                    </button>
                </div>
            </header>

            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto">
                    <div className="mb-12">
                        <span className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-2 block">Framework: ESRS & GRI 3</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">Painel de Materialidade Dupla.</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Dual Materiality Matrix */}
                        <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 h-[450px] relative overflow-hidden flex flex-col justify-between group">
                            <div className="flex items-center gap-2 mb-4 text-purple-600">
                                <BarChart3 size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">Double Materiality Matrix</span>
                            </div>
                            
                            {/* Visual Matrix Component */}
                            <div className="flex-grow flex items-center justify-center relative p-8">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-[70%] w-0.5 bg-gray-300" />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-0.5 bg-gray-300" />
                                <div className="text-[10px] font-black absolute bottom-0 left-1/2 -translate-x-1/2 uppercase tracking-widest text-black/40">Impacto Financeiro</div>
                                <div className="text-[10px] font-black absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 uppercase tracking-widest text-black/40">Impacto Socioambiental</div>
                                
                                {/* Data Points */}
                                <div className="w-4 h-4 rounded-full bg-green-500 absolute top-[20%] right-[30%] shadow-lg shadow-green-500/20" />
                                <div className="w-4 h-4 rounded-full bg-orange-500 absolute top-[40%] right-[15%] shadow-lg shadow-orange-500/20" />
                                <div className="w-4 h-4 rounded-full bg-blue-500 absolute top-[60%] right-[40%] shadow-lg shadow-blue-500/20" />
                            </div>
                        </div>

                        {/* Real Time KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <KpiItem icon={<Zap />} value="85%" label="Energia Limpa (%)" color="text-yellow-500" />
                            <KpiItem icon={<Activity />} value="0.22" label="Taxa TFA (Acidentes)" color="text-red-500" />
                            <KpiItem icon={<Coins />} value="R$ 54M" label="Investimento Social" color="text-green-600" />
                            <KpiItem icon={<Activity />} value="92%" label="Resíduos Monitorados" color="text-blue-500" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const KpiItem = ({ icon, value, label, color }: any) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col items-center text-center shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform">
        <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <div className="text-3xl font-black tracking-tighter mb-1">{value}</div>
        <p className="text-[10px] font-black uppercase tracking-widest text-black/40">{label}</p>
    </div>
);
