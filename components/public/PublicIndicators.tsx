import React from 'react';
import { ArrowLeft, BarChart3, Activity } from 'lucide-react';

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
                            <Activity size={16} /> Painel de Indicadores
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
                <div className="container mx-auto text-center md:text-left">
                    <div className="max-w-3xl mb-16 mx-auto md:mx-0">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">Performance em <span className="text-purple-600">Tempo Real</span>.</h1>
                        <p className="text-lg font-medium text-black/60 italic">
                            Acompanhe nossos KPIs estratégicos de sustentabilidade e eficiência operacional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <KpiCard 
                            title="Emissões (Escopo 3)"
                            value="189k"
                            unit="tCO2eq"
                            trend="-2.4%"
                            color="text-green-600"
                        />
                        <KpiCard 
                            title="Eficiência Hídrica"
                            value="1.81"
                            unit="m³/h"
                            trend="-5.0%"
                            color="text-blue-600"
                        />
                        <KpiCard 
                            title="Investimento Social"
                            value="R$ 54"
                            unit="milhões"
                            trend="+12%"
                            color="text-orange-500"
                        />
                        <KpiCard 
                            title="Maturidade ESG"
                            value="Nível 5"
                            unit="ABNT"
                            trend="Top"
                            color="text-purple-600"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const KpiCard = ({ title, value, unit, trend, color }: any) => (
    <div className="p-6 rounded-[32px] border border-gray-100 bg-white shadow-lg shadow-gray-200/50 flex flex-col items-center text-center hover:border-gray-200 transition-colors">
        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">{title}</p>
        <div className={`text-5xl font-black tracking-tighter mb-1 ${color}`}>{value}</div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-black">{unit}</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">{trend}</span>
        </div>
    </div>
);
