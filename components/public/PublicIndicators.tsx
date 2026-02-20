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
                    <div className="mb-16">
                        <span className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-2 block">Framework: ESRS & GRI 3</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">Painel de Materialidade Dupla.</h1>
                        <p className="text-lg font-medium text-black/60 italic max-w-2xl">Acompanhe nossa performance através do impacto financeiro e socioambiental integrado.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Dual Materiality Matrix */}
                        <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 h-[500px] relative overflow-hidden flex flex-col justify-between group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-purple-600">
                                    <BarChart3 size={24} />
                                    <span className="text-xs font-black uppercase tracking-widest">Double Materiality Matrix</span>
                                </div>
                                <span className="text-[10px] font-bold text-black/30">Atualizado: Q1 2026</span>
                            </div>
                            
                            {/* Visual Matrix Component */}
                            <div className="flex-grow flex items-center justify-center relative p-8">
                                <div className="absolute left-10 top-1/2 -translate-y-1/2 h-[75%] w-0.5 bg-gray-300" />
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[75%] h-0.5 bg-gray-300" />
                                
                                {/* Axis Labels */}
                                <div className="text-[9px] font-black absolute bottom-4 left-1/2 -translate-x-1/2 uppercase tracking-widest text-black/40">Impacto Financeiro (Econômico)</div>
                                <div className="text-[9px] font-black absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 uppercase tracking-widest text-black/40">Impacto Socioambiental (ESG)</div>
                                
                                {/* Data Points (Animated Pulse) */}
                                <div className="w-5 h-5 rounded-full bg-green-500 absolute top-[15%] right-[25%] shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse cursor-pointer transition-transform hover:scale-125" title="Emissões GEE" />
                                <div className="w-5 h-5 rounded-full bg-orange-500 absolute top-[35%] right-[10%] shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-pulse cursor-pointer transition-transform hover:scale-125" title="Rel. Comunitário" />
                                <div className="w-5 h-5 rounded-full bg-blue-500 absolute top-[55%] right-[35%] shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-pulse cursor-pointer transition-transform hover:scale-125" title="Recursos Hídricos" />
                                <div className="w-5 h-5 rounded-full bg-purple-500 absolute top-[25%] right-[45%] shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse cursor-pointer transition-transform hover:scale-125" title="Ética e Compliance" />
                            </div>

                            <div className="mt-4 flex justify-center gap-6">
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-black/50"><div className="w-2 h-2 rounded-full bg-green-500" /> Ambiental</div>
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-black/50"><div className="w-2 h-2 rounded-full bg-orange-500" /> Social</div>
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-black/50"><div className="w-2 h-2 rounded-full bg-purple-500" /> Governança</div>
                            </div>
                        </div>

                        {/* Real Time KPI Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <KpiItem icon={<Zap />} value="85%" label="Energia Limpa (%)" color="text-yellow-500" sub="Meta: 100% até 2025" />
                            <KpiItem icon={<Activity />} value="0.22" label="Taxa TFA (Acidentes)" color="text-red-500" sub="Setor: Baixo Risco" />
                            <KpiItem icon={<Coins />} value="R$ 54M" label="Investimento Social" color="text-green-600" sub="Direto e Parcerias" />
                            <KpiItem icon={<Activity />} value="92%" label="Resíduos Monitorados" color="text-blue-500" sub="MTR/CDF Rastreáveis" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const KpiItem = ({ icon, value, label, color, sub }: any) => (
    <div className="bg-white p-10 rounded-[40px] border border-gray-100 flex flex-col items-center text-center shadow-lg shadow-gray-200/40 hover:shadow-xl hover:-translate-y-1 transition-all">
        <div className={`w-16 h-16 rounded-[20px] bg-gray-50 flex items-center justify-center mb-6 ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 32 })}
        </div>
        <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
        <p className="text-[10px] font-black uppercase tracking-widest text-black mb-2">{label}</p>
        <p className="text-[9px] font-bold text-black/40 italic">{sub}</p>
    </div>
);

const KpiItem = ({ icon, value, label, color }: any) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col items-center text-center shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform">
        <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <div className="text-3xl font-black tracking-tighter mb-1">{value}</div>
        <p className="text-[10px] font-black uppercase tracking-widest text-black/40">{label}</p>
    </div>
);
