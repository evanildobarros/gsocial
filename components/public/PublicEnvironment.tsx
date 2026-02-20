import React from 'react';
import { ArrowLeft, Leaf, Wind, Map, ShieldCheck, Waves, Zap, ChevronDown } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicEnvironment: React.FC<PublicPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-green-100">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Pilar Ambiental</span>
                </div>
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
                >
                    <ArrowLeft size={14} /> Voltar ao Portal
                </button>
            </nav>

            {/* Section 1: Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-50">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest mb-8 animate-bounce-slow">
                        <Leaf size={14} /> Resiliência Climática
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
                        PROTEGENDO O <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 text-black">NOSSO ECOSSISTEMA.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-black/60 max-w-3xl mx-auto leading-relaxed">
                        Compromisso com a descarbonização acelerada e a preservação da Baía de São Marcos.
                    </p>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <ChevronDown size={32} className="text-green-600" />
                    </div>
                </div>
            </section>

            {/* Section 2: TCFD & Adaptation */}
            <section className="py-32 px-6">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-xs font-black text-green-600 uppercase tracking-widest">Adaptação Costeira (TCFD)</span>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">Infraestrutura preparada para o futuro.</h2>
                            <p className="text-lg font-medium text-black/70 leading-relaxed">
                                Monitoramos em tempo real a elevação do nível do mar e os riscos físicos das operações. Nosso plano de adaptação garante a continuidade logística mesmo em cenários climáticos extremos.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                                    <h4 className="font-black text-3xl text-blue-600">100%</h4>
                                    <p className="text-[10px] font-bold uppercase text-black/40 mt-2 tracking-widest">Áreas Monitoradas</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                                    <h4 className="font-black text-3xl text-green-600">ISO</h4>
                                    <p className="text-[10px] font-bold uppercase text-black/40 mt-2 tracking-widest">14001 Certificada</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-100 rounded-[60px] overflow-hidden shadow-2xl relative group">
                                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-700" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Map size={120} className="text-black/10 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                {/* Floating Label */}
                                <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-black">Live Vulnerability Feed</span>
                                    </div>
                                    <p className="text-xs font-bold text-black/60 italic">Variação de maré e pressão atmosférica monitoradas.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Carbon Tracking (Dark Mode Contrast) */}
            <section className="py-32 bg-black text-white px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-green-600/10 skew-x-12 translate-x-32" />
                <div className="container mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-24">
                        <span className="text-xs font-black text-green-400 uppercase tracking-widest mb-4 block">Net Zero 2050</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">Rastreabilidade Total de Carbono.</h2>
                        <p className="text-xl text-white/60 font-medium leading-relaxed">
                            Controlamos cada tonelada de CO2eq emitida em nossa cadeia de valor, focando na redução agressiva do Escopo 3.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <EmissionMetric label="Escopo 1" value="601" unit="tCO2eq" desc="Emissões diretas e frota." />
                        <EmissionMetric label="Escopo 2" value="110" unit="tCO2eq" desc="Energia elétrica adquirida." />
                        <EmissionMetric label="Escopo 3" value="189k" unit="tCO2eq" desc="Cadeia de valor e navios." highlight />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-3xl font-black tracking-tight">Plano de Descarbonização</h3>
                            <p className="text-white/60 leading-relaxed">Nossas metas estão alinhadas ao Acordo de Paris e ao Plano Nacional de Transição Energética.</p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm font-bold"><ShieldCheck className="text-green-400" /> Metas Verificadas pela Big Four Audit</li>
                                <li className="flex items-center gap-3 text-sm font-bold"><Zap className="text-yellow-400" /> 100% Energia Renovável em 2025</li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full h-64 bg-green-500/10 rounded-3xl border border-green-500/20 flex items-center justify-center">
                            <Wind size={80} className="text-green-500 animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const EmissionMetric = ({ label, value, unit, desc, highlight }: any) => (
    <div className={`p-10 rounded-[32px] border ${highlight ? 'border-green-500 bg-green-500/5' : 'border-white/10 bg-white/5'} transition-all hover:scale-105`}>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 block">{label}</span>
        <div className="flex items-baseline gap-2 mb-4">
            <span className={`text-6xl font-black tracking-tighter ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</span>
            <span className="text-sm font-bold text-white/40">{unit}</span>
        </div>
        <p className="text-xs font-medium text-white/60">{desc}</p>
    </div>
);
