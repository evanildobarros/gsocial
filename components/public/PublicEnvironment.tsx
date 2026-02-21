import React from 'react';
import { ArrowLeft, Leaf, Wind, Map, ShieldCheck, Waves, Zap, ChevronDown, CheckCircle2, Shield, Users, Target } from 'lucide-react';

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

            {/* NEW STRATEGIC BLOCK (JSON Architecture) */}
            <section className="py-32 px-6 bg-slate-50">
                <div className="container mx-auto">
                    <div className="max-w-4xl mb-24 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-6">
                            ESGporto - Consultor Especialista
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8">
                            Sustentabilidade Portuária e Gestão ESG Baseada em Dados.
                        </h2>
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="flex-1 space-y-4">
                                <h4 className="text-lg font-black uppercase text-green-600">Transformação rumo ao Estágio 5</h4>
                                <p className="text-lg font-medium text-black/70 leading-relaxed italic border-l-4 border-green-500 pl-6">
                                    "O nosso aplicativo eleva a gestão do ecossistema portuário ao focar no que realmente importa através da dupla materialidade."
                                </p>
                            </div>
                            <div className="flex-1 text-sm font-medium text-black/60 leading-relaxed">
                                Medimos o impacto das operações no ambiente e na sociedade (Materialidade de Impacto) e como os fatores ESG afetam o valor e a continuidade do negócio (Materialidade Financeira).
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {["GRI", "SASB", "TCFD", "ABNT PR 2030"].map(f => (
                                        <span key={f} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[9px] font-black text-black/40">{f}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Pilar G */}
                        <StrategicPillarCard 
                            letter="G"
                            title="Governança: Transparência e Gestão de Riscos"
                            color="text-blue-600"
                            items={[
                                { t: "Transparência e Prestação de Contas", d: "Geração automatizada de dados para relatórios nos padrões globais." },
                                { t: "Compliance e Ética", d: "Canais seguros para inibir corrupção, discriminação e assédio." },
                                { t: "Gestão de Riscos Integrada", d: "Riscos climáticos, sociais e LGPD na matriz de risco corporativo." }
                            ]}
                            recommendation="Utilize os dados gerados pela plataforma para fundamentar a criação de uma Diretoria de Sustentabilidade independente."
                        />

                        {/* Pilar E */}
                        <StrategicPillarCard 
                            letter="E"
                            title="Ambiental: Descarbonização e Adaptação Climática"
                            color="text-green-600"
                            items={[
                                { t: "Descarbonização Inteligente", d: "Dados para transição energética e eletrificação da frota." },
                                { t: "Adaptação e Resiliência", d: "Avaliação contínua da vulnerabilidade da infraestrutura portuária." },
                                { t: "Gestão de Recursos", d: "Monitorização em tempo real da qualidade da água e sedimentos." }
                            ]}
                        />

                        {/* Pilar S */}
                        <StrategicPillarCard 
                            letter="S"
                            title="Social: Impacto Real e Relação Porto-Cidade"
                            color="text-orange-600"
                            items={[
                                { t: "Combate ao Social Washing", d: "Métricas rigorosas que exigem dados demográficos reais." },
                                { t: "Relação Porto-Cidade", d: "Monitorização do impacto em comunidades tradicionais e quilombolas." },
                                { t: "Direitos Humanos", d: "Rastreabilidade completa para erradicação do trabalho infantil na cadeia." }
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: TCFD & Adaptation */}
            <section className="py-32 px-6 bg-white">
                <div className="container mx-auto text-left">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8 text-left">
                            <span className="text-xs font-black text-green-600 uppercase tracking-widest">Adaptação Costeira (TCFD)</span>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">Infraestrutura preparada para o futuro.</h2>
                            <p className="text-lg font-medium text-black/70 leading-relaxed">
                                Monitoramos em tempo real a elevação do nível do mar e os riscos físicos das operações. Nosso plano de adaptação garante a continuidade logística mesmo em cenários climáticos extremos.
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-left">
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
                                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-100 shadow-2xl text-left">
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
            <section className="relative py-40 px-6 bg-black text-white overflow-hidden text-left">
                <div className="absolute inset-0 z-0">
                    <img src="/images/news-solar.jpg" alt="Energia Solar" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                </div>
                <div className="container mx-auto relative z-10 text-left">
                    <div className="max-w-2xl space-y-8">
                        <span className="text-xs font-black text-green-400 uppercase tracking-widest">Transição Energética</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white">Matriz 100% Limpa até 2025.</h2>
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
            <section className="py-32 bg-slate-50 px-6 text-left">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
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

const StrategicPillarCard = ({ letter, title, color, items, recommendation }: any) => (
    <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl flex flex-col h-full relative overflow-hidden group hover:shadow-2xl transition-all">
        <div className={`absolute top-[-20px] right-[-20px] text-[120px] font-black opacity-[0.03] select-none ${color}`}>{letter}</div>
        <div className="relative z-10 space-y-10 flex flex-col h-full">
            <div>
                <h3 className={`text-xl font-black uppercase tracking-tight mb-8 leading-tight ${color}`}>{title}</h3>
                <div className="space-y-6">
                    {items.map((item: any, i: number) => (
                        <div key={i} className="space-y-1">
                            <h5 className="text-sm font-black text-black uppercase tracking-widest">{item.t}</h5>
                            <p className="text-xs font-medium text-black/60 leading-relaxed">{item.d}</p>
                        </div>
                    ))}
                </div>
            </div>

            {recommendation && (
                <div className="mt-auto pt-8 border-t border-gray-100">
                    <div className="flex gap-4 items-start p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <Target className="text-blue-600 shrink-0" size={18} />
                        <div>
                            <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest block mb-1">Recomendação do Consultor</span>
                            <p className="text-xs font-bold text-blue-900 italic leading-relaxed">"{recommendation}"</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);
