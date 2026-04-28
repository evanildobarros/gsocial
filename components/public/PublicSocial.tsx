import React from 'react';
import { ArrowLeft, Users, ShieldAlert, Coins, MapPin, Heart, Handshake, ChevronRight, GraduationCap } from 'lucide-react';
import { Footer } from '../esg/Footer';
import { AppMode } from '../../types';

interface PublicPageProps {
    onBack: () => void;
    onNavigate?: (mode: AppMode) => void;
}

export const PublicSocial: React.FC<PublicPageProps> = ({ onBack, onNavigate }) => {
    return (
        <div className="h-screen overflow-y-auto bg-white text-black font-sans selection:bg-orange-100 scroll-smooth">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Pilar Social</span>
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
                        src="/images/news-community.jpg"
                        alt="Comunidade Itaqui-Bacanga"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-8">
                        <Heart size={14} /> Impacto Humano
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8 animate-fade-in-up">
                        CRESCER JUNTO <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 text-white">COM A CIDADE.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-white/70 max-w-3xl mx-auto leading-relaxed mb-12">
                        Transformando a força logística do Porto do Itaqui em desenvolvimento para 155 mil pessoas do Itaqui-Bacanga.
                    </p>
                </div>
            </section>

            {/* Section 2: S-ROI & Value Sharing */}
            <section className="py-32 px-6 bg-white">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                         <div className="relative order-2 lg:order-1">
                            <div className="aspect-[4/5] bg-orange-500 rounded-[40px] md:rounded-[60px] p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group text-left">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Coins size={200} />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Social Return (S-ROI)</span>
                                    <h3 className="text-5xl font-black mt-4 mb-6 leading-tight">Valor além do dinheiro.</h3>
                                    <p className="text-lg font-medium opacity-80 leading-relaxed">
                                        Para cada R$ 1 investido em nossos programas sociais, geramos R$ 3,40 em benefícios mensuráveis para a sociedade civil.
                                    </p>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-8xl font-black tracking-tighter mb-2">3.4x</div>
                                    <p className="text-sm font-black uppercase tracking-widest">Índice de Impacto 2025</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-10 order-1 lg:order-2 text-left text-black">
                            <div className="space-y-4">
                                <span className="text-xs font-black text-orange-600 uppercase tracking-widest">GRI 400 Standards</span>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight text-black">Um compromisso com a dignidade.</h2>
                                <p className="text-lg font-medium text-black/70 leading-relaxed">
                                    Nossa estratégia social é baseada no respeito às populações tradicionais e no combate severo a qualquer forma de trabalho escravo ou infantil em nossa cadeia de suprimentos.
                                </p>
                            </div>
                            
                            <div className="space-y-6">
                                <SocialFeature icon={<Handshake />} title="Engajamento Comunitário" desc="Parceria direta com a ACIB para gestão de demandas e conflitos territoriais." />
                                <SocialFeature icon={<ShieldAlert />} title="Due Diligence Ativa" desc="Monitoramento constante de direitos humanos em 1.248 parceiros e fornecedores." />
                                <SocialFeature icon={<GraduationCap />} title="Educação & Futuro" desc="Combate aos desertos educacionais através de bolsas de pesquisa e capacitação técnica." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Territory Map (Mobile-First Layout) */}
            <section className="py-32 bg-slate-900 text-white px-6 overflow-hidden">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-end mb-20 text-left">
                        <div className="max-w-2xl">
                            <span className="text-xs font-black text-orange-400 uppercase tracking-widest mb-4 block">Mapeamento Territorial</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Onde o impacto acontece.</h2>
                        </div>
                        <p className="text-white/60 font-medium italic text-lg lg:mb-4">
                            Focamos nossos esforços nas áreas de maior vulnerabilidade, garantindo segurança alimentar e educação.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ImpactArea title="Tauá-Mirim" population="8.4k" risk="Crítico" color="bg-red-500" />
                        <ImpactArea title="Vila Maranhão" population="12.1k" risk="Moderado" color="bg-amber-500" />
                        <ImpactArea title="Anjo da Guarda" population="54.8k" risk="Gerenciado" color="bg-emerald-500" />
                        <ImpactArea title="Res. Resende" population="15.2k" risk="Gerenciado" color="bg-emerald-500" />
                    </div>
                </div>
            </section>

            <Footer onNavigate={onNavigate} />
        </div>
    );
};

const SocialFeature = ({ icon, title, desc }: any) => (
    <div className="flex gap-6 items-start group text-left">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {React.cloneElement(icon as React.ReactElement, { size: 28 })}
        </div>
        <div>
            <h4 className="text-xl font-black mb-1 text-black">{title}</h4>
            <p className="text-sm font-medium text-black/60 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const ImpactArea = ({ title, population, risk, color }: any) => (
    <div className="p-8 rounded-[32px] border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group text-left">
        <div className="flex justify-between items-start mb-12">
            <div className={`w-3 h-3 rounded-full ${color} animate-pulse`} />
            <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
        </div>
        <h4 className="text-2xl font-black mb-1">{title}</h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">{population} Habitantes</p>
        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/60">Status de Risco:</span>
            <span className="text-[10px] font-black uppercase tracking-tighter text-white">{risk}</span>
        </div>
    </div>
);
