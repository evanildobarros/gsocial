import React from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Activity, Zap, Coins, Info, ShieldCheck } from 'lucide-react';

interface PublicPageProps {
    onBack: () => void;
}

export const PublicIndicators: React.FC<PublicPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-100">
            {/* Nav */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo_itaqui.png" alt="Porto do Itaqui" className="h-8 w-auto" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">Métricas ESG</span>
                </div>
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white text-xs font-bold hover:scale-105 transition-all"
                >
                    <ArrowLeft size={14} /> Voltar ao Portal
                </button>
            </nav>

            {/* Hero */}
            <section className="relative h-screen flex items-center justify-center bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-8">
                        <BarChart3 size={14} /> Performance Estratégica
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
                        DADOS QUE <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 text-white">GERAM IMPACTO.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-white/60 max-w-3xl mx-auto leading-relaxed">
                        Acompanhe em tempo real os indicadores que definem o futuro sustentável do Porto do Itaqui.
                    </p>
                </div>
            </section>

            {/* Section 2: Dual Materiality Matrix (Full Page Focus) */}
            <section className="py-32 px-6 bg-white">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-2/5 space-y-8">
                            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Metodologia ESRS</span>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">Dupla Materialidade.</h2>
                            <p className="text-lg font-medium text-black/70 leading-relaxed">
                                Avaliamos não apenas como as questões ESG impactam o financeiro da empresa, mas como nossas operações transformam o ambiente e a sociedade.
                            </p>
                            <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 flex items-start gap-4">
                                <Info className="text-purple-600 shrink-0" size={20} />
                                <p className="text-xs font-bold text-purple-900 italic leading-relaxed">
                                    "O cruzamento desses dados permite priorizar investimentos em áreas de alto impacto socioambiental e baixa resiliência financeira."
                                </p>
                            </div>
                        </div>

                        <div className="lg:w-3/5 w-full h-[600px] bg-gray-50 rounded-[60px] border border-gray-100 relative p-12 overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {/* Matrix Grid */}
                            <div className="h-full w-full relative">
                                <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-300" />
                                <div className="absolute bottom-10 left-0 right-0 h-0.5 bg-gray-300" />
                                
                                <div className="text-[10px] font-black absolute bottom-4 left-1/2 -translate-x-1/2 uppercase tracking-widest text-black/30">Impacto Financeiro (Econômico)</div>
                                <div className="text-[10px] font-black absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 uppercase tracking-widest text-black/30">Impacto Socioambiental (ESG)</div>

                                {/* Animated Data Nodes */}
                                <Node x="80%" y="20%" color="bg-green-500" label="Emissões GEE" delay="0s" />
                                <Node x="90%" y="40%" color="bg-orange-500" label="Rel. Comunitário" delay="0.5s" />
                                <Node x="70%" y="60%" color="bg-blue-500" label="Recursos Hídricos" delay="1s" />
                                <Node x="60%" y="30%" color="bg-purple-500" label="Governança" delay="1.5s" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Real Time KPIs */}
            <section className="py-32 bg-slate-50 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <KpiDetail icon={<Zap />} value="85%" label="Energia Limpa" trend="+15%" color="text-yellow-600" />
                        <KpiDetail icon={<Activity />} value="0.22" label="Taxa TFA (Acidentes)" trend="-5%" color="text-red-500" />
                        <KpiDetail icon={<Coins />} value="R$ 54M" label="Investimento Social" trend="+12%" color="text-green-600" />
                        <KpiDetail icon={<ShieldCheck />} value="Nível 5" label="Maturidade ABNT" trend="Líder" color="text-purple-600" />
                    </div>
                </div>
            </section>
        </div>
    );
};

const Node = ({ x, y, color, label, delay }: any) => (
    <div className={`absolute flex flex-col items-center gap-2 group cursor-pointer animate-in zoom-in-50 duration-700`} style={{ left: x, top: y, animationDelay: delay }}>
        <div className={`w-6 h-6 rounded-full ${color} shadow-lg ring-4 ring-white animate-pulse group-hover:scale-125 transition-transform`} />
        <span className="px-3 py-1 bg-white shadow-xl rounded-full text-[9px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{label}</span>
    </div>
);

const KpiDetail = ({ icon, value, label, trend, color }: any) => (
    <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl hover:-translate-y-2 transition-all text-center">
        <div className={`w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-8 ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 32 })}
        </div>
        <div className="text-5xl font-black tracking-tighter mb-2">{value}</div>
        <p className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-4">{label}</p>
        <div className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black">{trend}</div>
    </div>
);
