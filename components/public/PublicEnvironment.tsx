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
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all shadow-lg"
                >
                    <ArrowLeft size={14} /> Voltar ao Portal
                </button>
            </nav>

            {/* Section 1: Hero with Background */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/news-mangrove.jpg"
                        alt="Manguezais da Baía de São Marcos"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest mb-8">
                        <Leaf size={14} /> Resiliência Climática
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8 animate-fade-in-up">
                        PROTEGENDO O <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">NOSSO ECOSSISTEMA.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-white/70 max-w-3xl mx-auto leading-relaxed mb-12">
                        Compromisso com a descarbonização acelerada e a preservação da Baía de São Marcos.
                    </p>
                </div>
            </section>

            {/* Section 2: TCFD & Adaptation */}
            <section className="py-32 px-6 bg-white">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-xs font-black text-green-600 uppercase tracking-widest">Adaptação Costeira (TCFD)</span>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">Infraestrutura preparada para o futuro.</h2>
                            <p className="text-lg font-medium text-black/70 leading-relaxed">
                                Monitoramos em tempo real a elevação do nível do mar e os riscos físicos das operações. Nosso plano de adaptação garante a continuidade logística mesmo em cenários climáticos extremos.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-8 rounded-[40px] bg-slate-50 border border-gray-100 group hover:border-blue-400 transition-all">
                                    <h4 className="font-black text-4xl text-blue-600">100%</h4>
                                    <p className="text-[10px] font-bold uppercase text-black/40 mt-2 tracking-widest">Áreas Monitoradas</p>
                                </div>
                                <div className="p-8 rounded-[40px] bg-slate-50 border border-gray-100 group hover:border-green-400 transition-all">
                                    <h4 className="font-black text-4xl text-green-600">ISO</h4>
                                    <p className="text-[10px] font-bold uppercase text-black/40 mt-2 tracking-widest">14001 Certificada</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-100 rounded-[80px] overflow-hidden shadow-2xl relative group">
                                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-700" />
                                <img src="/images/hero-port.jpg" alt="Monitoramento" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-100 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-black">Live Vulnerability Feed</span>
                                    </div>
                                    <p className="text-sm font-bold text-black italic">Variação de maré e pressão atmosférica monitoradas 24/7.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Energy Transition with Background */}
            <section className="relative py-40 px-6 bg-black text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/news-solar.jpg" alt="Energia Solar" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                </div>
                <div className="container mx-auto relative z-10">
                    <div className="max-w-2xl space-y-8">
                        <span className="text-xs font-black text-green-400 uppercase tracking-widest">Transição Energética</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Matriz 100% Limpa até 2025.</h2>
                        <p className="text-xl text-white/70 font-medium leading-relaxed">
                            Estamos substituindo toda a nossa matriz de consumo por fontes renováveis e atingindo a meta de iluminação LED em 100% das áreas operacionais.
                        </p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><Zap className="text-yellow-400" /></div>
                                <span className="font-bold">Eficiência Energética</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><ShieldCheck className="text-green-400" /></div>
                                <span className="font-bold">Selo Ouro GHG Protocol</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Operational Badges */}
            <section className="py-32 bg-slate-50 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="p-12 rounded-[50px] bg-white border border-gray-100 shadow-xl hover:-translate-y-2 transition-all group text-left">
                            <Waves size={48} className="text-blue-600 mb-8 group-hover:scale-110 transition-transform" />
                            <h3 className="text-3xl font-black mb-4">Água de Lastro Controlada</h3>
                            <p className="text-lg text-black/60 font-medium leading-relaxed">Controle rigoroso de espécies exóticas e salinidade para proteger a biodiversidade marinha da Baía de São Marcos.</p>
                        </div>
                        <div className="p-12 rounded-[50px] bg-white border border-gray-100 shadow-xl hover:-translate-y-2 transition-all group text-left">
                            <Wind size={48} className="text-green-600 mb-8 group-hover:scale-110 transition-transform" />
                            <h3 className="text-3xl font-black mb-4">Economia Circular</h3>
                            <p className="text-lg text-black/60 font-medium leading-relaxed">Programa Aterro Zero e rastreabilidade total de resíduos através dos certificados MTR e CDF.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
