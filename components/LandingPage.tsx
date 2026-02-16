import React, { useState, useEffect } from 'react';
import {
    Anchor,
    BarChart3,
    Leaf,
    ShieldCheck,
    Users,
    TrendingUp,
    AlertTriangle,
    Globe2,
    ChevronRight,
    CheckCircle2,
    LineChart,
    Target,
    FileText,
    Building2,
    BadgeCheck,
    ArrowRight,
    Download,
    Ship,
    Truck,
    Zap,
    Droplets,
    Calendar,
    MapPin
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface LandingPageProps {
    onLogin: () => void;
}

const CARBON_DATA = [
    { name: 'Escopo 3 (Cadeia de Valor)', value: 99.6, color: '#10b981' }, // Emerald-500
    { name: 'Escopo 1 (Direto)', value: 0.3, color: '#06b6d4' }, // Cyan-500
    { name: 'Escopo 2 (Energia)', value: 0.1, color: '#3b82f6' }, // Blue-500
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-gray-900 dark:text-white selection:bg-cyan-500 selection:text-white">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/logo_itaqui.png" alt="ESGporto" className="h-10 w-auto brightness-0 invert dark:invert-0 lg:brightness-100" />
                        <div className="hidden lg:block">
                            <span className={`text-xl font-black tracking-tighter ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>ESGporto</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={onLogin} className="hidden lg:block text-sm font-bold opacity-90 hover:opacity-100 transition-opacity text-white dark:text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                            Área do Cliente
                        </button>
                        <button
                            onClick={onLogin}
                            className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2"
                        >
                            Acessar Diagnóstico
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION (PRESERVED) --- */}
            <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-bg.png"
                        alt="Futuristic Port"
                        className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-md mb-6 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="text-xs font-bold text-cyan-300 tracking-wider uppercase">Plataforma de Gestão Integrada</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                            A bússola definitiva para a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Gestão ESG Portuária</span>.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl font-light">
                            Do diagnóstico à transformação: monitore indicadores, mitigue riscos climáticos e fortaleça a licença social para operar com base na ABNT PR 2030 e padrões globais (GRI).
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={onLogin} className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-full font-bold text-lg shadow-xl shadow-cyan-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                                Começar Agora
                                <ChevronRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
                                <Building2 size={20} />
                                Solicitar Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-sm font-medium text-gray-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span>Compliance ABNT 2030</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span>SBTi Aligned</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* --- END HERO SECTION --- */}

            {/* --- NEW CONTENT STARTS HERE --- */}

            {/* Stats Section */}
            <section className="relative -mt-20 z-20 pb-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={<Zap className="w-6 h-6 text-white" />}
                            value="189.225"
                            label="tCO₂eq emitidos em 2022"
                        />
                        <StatCard
                            icon={<BarChart3 className="w-6 h-6 text-white" />}
                            value="34M"
                            label="toneladas movimentadas"
                        />
                        <StatCard
                            icon={<Target className="w-6 h-6 text-white" />}
                            value="2050"
                            label="Ano-meta de neutralidade"
                        />
                        <StatCard
                            icon={<TrendingUp className="w-6 h-6 text-white" />}
                            value="96%"
                            label="Meta de redução SBTi"
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        {/* Text Content */}
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                                <Globe2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Sobre o Porto</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                                Um dos Principais Portos do <span className="text-blue-600 dark:text-blue-400">Brasil</span>
                            </h2>

                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                Localizado em São Luís, Maranhão, o Porto do Itaqui é um dos principais hubs logísticos do país para movimentação de granéis sólidos e líquidos. Sua posição estratégica na costa atlântica facilita a conexão com mercados nacionais e internacionais.
                            </p>

                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                Com nove berços operacionais e capacidade para receber embarcações de grande porte, o porto movimentou cerca de 34 milhões de toneladas em 2022, sendo referência em eficiência operacional e compromisso ambiental.
                            </p>
                        </div>

                        {/* Blue Card Image Area */}
                        <div className="flex-1 w-full relative">
                            {/* Floating Berths Card */}
                            <div className="absolute -top-6 -right-6 md:right-10 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-xl z-10 flex items-center gap-4 animate-bounce-slow">
                                <div className="bg-blue-500 p-2 rounded-lg text-white">
                                    <Droplets className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">9</div>
                                    <div className="text-xs text-gray-500 font-medium">Berços operacionais</div>
                                </div>
                            </div>

                            {/* Main Blue Card */}
                            <div className="w-full bg-[#0070f3] rounded-3xl p-12 md:p-16 flex flex-col items-center text-center justify-center relative overflow-hidden shadow-2xl skew-y-0 transform hover:scale-[1.02] transition-transform duration-500">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                                <Anchor className="w-24 h-24 text-white mb-8 opacity-90" />

                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                                    Complexo Portuário do Itaqui
                                </h3>
                                <p className="text-blue-100 font-medium max-w-sm">
                                    Conectando o Brasil ao mundo com responsabilidade ambiental
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decarbonization Section */}
            <section className="py-24 bg-gray-50 dark:bg-zinc-900 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-xs mb-2 block">Plano de Descarbonização</span>
                        <h2 className="text-3xl md:text-5xl font-black dark:text-white mb-6">Rumo ao Porto Verde</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Nossas iniciativas para reduzir emissões nos principais focos de impacto operacional.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={<Ship className="w-8 h-8 text-blue-500" />}
                            title="Navios"
                            desc="Implementação de OPS (Onshore Power Supply) e incentivo a combustíveis alternativos."
                            color="border-blue-500"
                        />
                        <FeatureCard
                            icon={<Anchor className="w-8 h-8 text-cyan-500" />}
                            title="Rebocadores"
                            desc="Estudo para hibridização de sistemas e uso de tintas 'antifouling' de alta performance."
                            color="border-cyan-500"
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-yellow-500" />}
                            title="Terminais"
                            desc="Eletrificação de portainers e RTGs, com migração para fontes 100% renováveis."
                            color="border-yellow-500"
                        />
                        <FeatureCard
                            icon={<Truck className="w-8 h-8 text-emerald-500" />}
                            title="Logística"
                            desc="Renovação de frota de caminhões para elétricos e uso de biometano/GNL nos processos internos."
                            color="border-emerald-500"
                        />
                    </div>
                </div>
            </section>

            {/* Roadmap / Targets */}
            <section className="py-24 bg-zinc-900 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs mb-2 block">Roadmap SBTi</span>
                            <h2 className="text-4xl font-black text-white mb-6">Neutralidade de Carbono</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Estamos comprometidos com a Science Based Targets initiative (SBTi) para garantir que nosso crescimento seja dissociado das emissões de carbono.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                                        <div className="w-0.5 h-full bg-cyan-500/30 my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white">2040</h4>
                                        <p className="text-cyan-400 font-bold mb-2">Meta Intermediária</p>
                                        <p className="text-gray-400">Redução de 96% nas emissões de Escopo 1 e 2.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white">2050</h4>
                                        <p className="text-emerald-400 font-bold mb-2">Net Zero</p>
                                        <p className="text-gray-400">Neutralidade total alinhada às metas da IMO e Acordo de Paris.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onLogin}
                                className="mt-12 px-8 py-3 border border-white/20 hover:bg-white/5 text-white rounded-full font-bold transition-all flex items-center gap-2"
                            >
                                Ver Inventário Detalhado
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="flex-1 w-full max-w-md mx-auto">
                            <div className="bg-zinc-800/50 p-8 rounded-3xl border border-white/5 shadow-2xl">
                                <h4 className="text-lg font-bold text-white mb-6 text-center">Distribuição da Pegada (tCO₂eq)</h4>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={CARBON_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {CARBON_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                itemStyle={{ color: '#fff' }}
                                                contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #333' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3 mt-4">
                                    {CARBON_DATA.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-gray-300">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-white">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                                    <div className="text-3xl font-black text-white">189.225</div>
                                    <div className="text-xs text-gray-500 uppercase">Toneladas Totais (2022)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Downloads / Resources */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-black mb-12 dark:text-white text-center">Transparência & Relatórios</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <DownloadCard
                            title="Inventário ESG - Vol. III"
                            subtitle="Mapeamento de Stakeholders e Dupla Materialidade."
                            tag="PDF"
                        />
                        <DownloadCard
                            title="Relatório de Carbono 2024"
                            subtitle="Detalhamento completo das emissões base 2023."
                            tag="PDF"
                        />
                        <DownloadCard
                            title="Plano de Desenvolvimento (PDZ)"
                            subtitle="Estratégia de infraestrutura e expansão sustentável."
                            tag="PDF"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#009966] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
                        <Globe2 size={14} className="text-white" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Junte-se a Nós</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Construindo um Futuro <br className="hidden md:block" /> Sustentável</h2>
                    <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-10">
                        Junte-se a nós nesta jornada de transformação. Monitore, gerencie e evolua seus indicadores ESG em uma única plataforma.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onLogin}
                            className="px-8 py-4 bg-white text-[#009966] hover:bg-emerald-50 rounded-full font-bold shadow-xl transition-all hover:scale-105"
                        >
                            Começar Agora
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 text-white rounded-full font-bold transition-all">
                            Fale Conosco
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0b1121] text-white pt-20 pb-10 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        {/* Column 1: Institutional */}
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Anchor className="text-white h-5 w-5" />
                                </div>
                                <span className="text-2xl font-black tracking-tight text-white">Porto do Itaqui</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-7 max-w-md font-medium">
                                Administrado pela Empresa Maranhense de Administração Portuária (EMAP), o Porto do Itaqui é referência em sustentabilidade e eficiência operacional na América Latina.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-gray-400 hover:text-white">
                                    <Globe2 size={18} />
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-gray-400 hover:text-white">
                                    <FileText size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h4 className="font-bold mb-6 text-white">Links Rápidos</h4>
                            <ul className="space-y-4 text-gray-400 text-sm font-medium">
                                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Sobre o Porto</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Pilares ESG</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Descarbonização</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Relatórios</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Contact */}
                        <div>
                            <h4 className="font-bold mb-6 text-white">Contato</h4>
                            <div className="space-y-4 text-gray-400 text-sm font-medium">
                                <p>São Luís, Maranhão</p>
                                <p>Av. dos Portugueses, s/n</p>
                                <p>CEP: 65085-370</p>
                                <a href="https://www.portodoitaqui.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 block pt-2">
                                    www.portodoitaqui.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-500 text-xs font-medium">
                            © 2025 Porto do Itaqui - EMAP. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                                <Leaf size={14} />
                                <span>Compromisso ESG</span>
                            </div>
                            <div className="h-4 w-px bg-white/10"></div>
                            <div className="flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wider">
                                <BadgeCheck size={14} />
                                <span>ISO 14001</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Helper Components ---

const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group">
        <div className="mb-6 p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">{value}</div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-[150px] leading-relaxed">{label}</div>
    </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string }> = ({ icon, title, desc, color }) => (
    <div className={`p-8 bg-white dark:bg-zinc-800 rounded-2xl border-l-4 ${color} shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

const DownloadCard: React.FC<{ title: string; subtitle: string; tag: string }> = ({ title, subtitle, tag }) => (
    <div className="group p-6 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 cursor-pointer hover:border-cyan-500/50 transition-all">
        <div className="flex justify-between items-start mb-4">
            <FileText className="text-gray-400 group-hover:text-cyan-500 transition-colors" />
            <div className="px-2 py-1 rounded text-[10px] font-bold bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 uppercase">{tag}</div>
        </div>
        <h4 className="font-bold text-lg dark:text-white mb-2 group-hover:text-cyan-500 transition-colors">{title}</h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{subtitle}</p>
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Download size={14} />
            Baixar Arquivo
        </div>
    </div>
);
