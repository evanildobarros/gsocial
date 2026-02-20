import React from 'react';
import { ArrowLeft, Leaf, Droplets, Zap, Wind } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicEnvironment: React.FC<PublicPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-10 w-auto object-contain" />
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                            <Leaf size={16} /> Meio Ambiente
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

            {/* Hero */}
            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                        EcoPorto: <br/>
                        <span className="text-green-600 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Sustentabilidade</span> em Ação.
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-black/70 max-w-2xl leading-relaxed mb-12">
                        O Porto do Itaqui é pioneiro na gestão ambiental portuária, com certificação ISO 14001 e um plano ambicioso de descarbonização até 2030.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard 
                            icon={<Wind className="w-6 h-6 text-green-600" />} 
                            value="189k"
                            label="tCO2eq Monitoradas"
                            desc="Inventário completo (Escopos 1, 2 e 3) com base em 2022."
                        />
                        <StatCard 
                            icon={<Zap className="w-6 h-6 text-yellow-500" />} 
                            value="100%"
                            label="Iluminação LED"
                            desc="Eficiência energética em todos os terminais e pátios."
                        />
                        <StatCard 
                            icon={<Droplets className="w-6 h-6 text-blue-500" />} 
                            value="98%"
                            label="Reuso de Água"
                            desc="Sistema de tratamento e reaproveitamento em operações."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ icon, value, label, desc }: any) => (
    <div className="p-8 rounded-[32px] border border-gray-100 bg-white shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-transform text-left">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
            {icon}
        </div>
        <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
        <div className="text-sm font-black uppercase tracking-wide mb-3">{label}</div>
        <p className="text-xs font-medium text-black/60 leading-relaxed">{desc}</p>
    </div>
);
