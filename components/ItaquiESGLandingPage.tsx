import React, { useState, useEffect } from 'react';
import {
    Award,
    Leaf,
    Wind,
    Users,
    ChevronRight,
    Map,
    Globe,
    ShieldCheck,
    Droplets,
    LayoutDashboard,
    ArrowRight,
    Anchor,
    FileText,
    Menu,
    X,
    BarChart3,
    Zap,
    Ship,
    Download,
    ExternalLink
} from 'lucide-react';

interface ItaquiESGLandingPageProps {
    onLoginClick?: () => void;
}

export const ItaquiESGLandingPage: React.FC<ItaquiESGLandingPageProps> = ({ onLoginClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setScrolled(container.scrollTop > 50);

            // Determine active section
            const sections = ['home', 'sobre', 'pilares', 'indicadores', 'relatórios', 'territorio', 'contato'];
            for (const id of sections) {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if section is roughly in view (top portion)
                    // With boundingClientRect relative to viewport, and container filling viewport
                    if (rect.top <= 300 && rect.bottom >= 300) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div ref={containerRef} className="h-screen overflow-y-auto snap-y snap-mandatory bg-white font-sans text-slate-900 selection:bg-emerald-500/30 scroll-smooth">

            {/* Active Section Tracker */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
                {['home', 'sobre', 'pilares', 'indicadores', 'relatórios', 'territorio', 'contato'].map((id) => (
                    <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === id ? 'bg-emerald-500 scale-125 ring-4 ring-emerald-500/20' : 'bg-slate-300 hover:bg-emerald-400'
                            }`}
                        title={id.charAt(0).toUpperCase() + id.slice(1)}
                    />
                ))}
            </div>

            {/* Header / Navbar */}
            <header
                className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
                        <div className={`p-2 rounded-lg transition-colors ${scrolled ? 'bg-sky-900' : 'bg-white/10 backdrop-blur-sm'}`}>
                            <Anchor className={`w-6 h-6 ${scrolled ? 'text-white' : 'text-white'}`} />
                        </div>
                        <div>
                            <h1 className={`font-bold text-lg leading-tight tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                                Porto do Itaqui
                            </h1>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${scrolled ? 'text-slate-500' : 'text-emerald-400'}`}>
                                ESG Platform
                            </p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {['Sobre', 'Pilares', 'Indicadores', 'Relatórios'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${scrolled ? 'text-slate-600' : 'text-slate-200'
                                    } ${activeSection === item.toLowerCase() ? 'text-emerald-500 font-bold' : ''}`}
                            >
                                {item}
                            </button>
                        ))}
                        <button
                            onClick={onLoginClick}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/20 hover:scale-105 active:scale-95"
                        >
                            Acessar Diagnóstico
                        </button>
                    </nav>

                    <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-full shadow-lg py-4 px-6 flex flex-col gap-4 animate-fade-in-down">
                        {['Sobre', 'Pilares', 'Indicadores', 'Relatórios'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className="text-left text-slate-600 font-medium py-3 border-b border-slate-50 hover:text-emerald-600 transition-colors"
                            >
                                {item}
                            </button>
                        ))}
                        <button
                            onClick={onLoginClick}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg mt-2"
                        >
                            Acessar Diagnóstico
                        </button>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-sky-950 snap-start">
                {/* Background Video/Image Placeholder */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-bg.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-sky-900/90 to-sky-950"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
                            <Award className="w-3.5 h-3.5" />
                            Maturidade ESG Nível 5
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up delay-[100ms] tracking-tight">
                            Liderança <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sustentável</span> <br />
                            para o Futuro.
                        </h1>

                        <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-[200ms]">
                            O Porto do Itaqui é referência nacional em gestão portuária sustentável, integrando eficiência logística, responsabilidade social e governança ética.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-[300ms]">
                            <button onClick={() => scrollToSection('relatórios')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 hover:-translate-y-1">
                                Ver Relatório 2024
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button onClick={() => scrollToSection('indicadores')} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-bold transition-all hover:border-white/30 hover:-translate-y-1 backdrop-blur-sm">
                                Nossos Indicadores
                            </button>
                        </div>
                    </div>

                    {/* Stats/Image Showcase */}
                    <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in-right delay-[400ms]">
                        <div className="space-y-4 mt-8">
                            <StatBox icon={<BarChart3 />} value="R$ 54 mi" label="Investimento Ambiental" color="bg-emerald-500" delay="0" />
                            <StatBox icon={<Users />} value="+500 mil" label="Pessoas Impactadas" color="bg-sky-500" delay="100" />
                        </div>
                        <div className="space-y-4">
                            <StatBox icon={<ShieldCheck />} value="100%" label="Compliance Ético" color="bg-indigo-500" delay="200" />
                            <StatBox icon={<Ship />} value="ISO 14001" label="Certificação Global" color="bg-orange-500" delay="300" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Strip - Floating */}
            <div className="relative -mt-16 z-20 container mx-auto px-6 mb-24">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border border-slate-100">
                    <ImpactMetric value="1.2 mi" label="tCO2eq Evitadas" sub="Emissões compensadas em 2024" trend="+12%" />
                    <ImpactMetric value="45" label="Projetos Sociais" sub="Ativos na comunidade Itaqui-Bacanga" trend="New" />
                    <ImpactMetric value="98%" label="Reuso de Água" sub="Eficiência hídrica nas operações" trend="+5%" />
                    <ImpactMetric value="100%" label="Transparência" sub="Índice de governança corporativa" trend="Top" />
                </div>
            </div>

            {/* About / Strategic Section */}
            <section id="sobre" className="scroll-mt-28 py-20 pb-32 snap-start">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 relative">
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                                <img src="/hero-bg.png" alt="Port Operations" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                                <div className="absolute inset-0 bg-sky-900/20 mix-blend-multiply"></div>
                            </div>
                            {/* Decorative Card */}
                            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden md:block animate-bounce-slow">
                                <div className="flex items-start gap-4">
                                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                                        <Leaf className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-lg">Prêmio Portos</div>
                                        <div className="text-sm text-slate-500">Reconhecido como o porto mais sustentável do Brasil em 2024.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <SectionBadge text="Sobre o Porto" />
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Impulsionando o desenvolvimento com <span className="text-emerald-600">responsabilidade.</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                O Porto do Itaqui não é apenas um hub logístico; é um motor de transformação. Nossa estratégia ESG está alinhada aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU, garantindo que cada tonelada movimentada gere valor compartilhado.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <CheckItem text="Signatário do Pacto Global da ONU" />
                                <CheckItem text="Certificação ISO 14001 e ISO 9001" />
                                <CheckItem text="Programa de Descarbonização (NetZero 2030)" />
                            </ul>

                            <button className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-2 group">
                                Conheça nossa História
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <section id="pilares" className="scroll-mt-28 py-24 bg-slate-50 relative overflow-hidden snap-start">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100/50 skew-x-12 translate-x-32 z-0"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <SectionBadge text="Nossos Pilares" />
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">A base da nossa estratégia.</h2>
                        <p className="text-slate-600 text-lg">
                            Nossa atuação é guiada por três eixos fundamentais que se interconectam para criar um ecossistema portuário resiliente e inclusivo.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <PillarCard
                            icon={<Leaf />}
                            title="Ambiental"
                            desc="Foco na ecoeficiência, preservação da biodiversidade e transição energética para uma economia de baixo carbono."
                            color="bg-emerald-500"
                            features={['Monitoramento Ambiental', 'Gestão de Resíduos', 'Eficiência Energética']}
                        />
                        <PillarCard
                            icon={<Users />}
                            title="Social"
                            desc="Compromisso com o bem-estar das comunidades, segurança do trabalho e desenvolvimento humano."
                            color="bg-sky-500"
                            features={['Relação Porto-Cidade', 'Saúde e Segurança', 'Direitos Humanos']}
                        />
                        <PillarCard
                            icon={<ShieldCheck />}
                            title="Governança"
                            desc="Gestão transparente, ética e responsável, assegurando conformidade e sustentabilidade do negócio."
                            color="bg-indigo-500"
                            features={['Compliance e Integridade', 'Gestão de Riscos', 'Transparência']}
                        />
                    </div>
                </div>
            </section>

            {/* Decarbonization / Data Section */}
            <section id="indicadores" className="scroll-mt-28 py-24 bg-sky-950 text-white relative snap-start">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Zap className="w-3 h-3" />
                                Descarbonização
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Inventário de Emissões</h2>
                            <p className="text-sky-200/80 max-w-xl">
                                Monitoramos em tempo real nossa pegada de carbono para atingir metas ambiciosas.
                            </p>
                        </div>
                        <button className="bg-white text-sky-950 hover:bg-sky-50 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                            Ver Dashboard Completo
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Big Card */}
                        <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-sky-900 to-sky-800 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 bg-white/10 rounded-bl-3xl">
                                <BarChart3 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Redução de GEE</h3>
                            <div className="text-5xl font-bold text-white mb-4 tracking-tighter">-24% <span className="text-lg font-medium text-emerald-400">vs 2023</span></div>
                            <div className="h-32 w-full bg-sky-950/50 rounded-xl mt-auto relative overflow-hidden flex items-end px-4 gap-2 pb-4">
                                {/* Fake Bars */}
                                <div className="w-1/6 h-[40%] bg-emerald-500/30 rounded-t-sm"></div>
                                <div className="w-1/6 h-[60%] bg-emerald-500/50 rounded-t-sm"></div>
                                <div className="w-1/6 h-[50%] bg-emerald-500/40 rounded-t-sm"></div>
                                <div className="w-1/6 h-[70%] bg-emerald-500/60 rounded-t-sm"></div>
                                <div className="w-1/6 h-[85%] bg-emerald-500/80 rounded-t-sm"></div>
                                <div className="w-1/6 h-[100%] bg-emerald-500 rounded-t-sm shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                            </div>
                            <p className="text-sm text-sky-300 mt-4">Meta de redução de 50% até 2030 (Escopos 1 e 2).</p>
                        </div>

                        {/* Small Cards */}
                        <BentoCard
                            title="Energia Renovável"
                            value="85%"
                            sub="Matriz Energética Limpa"
                            icon={<Zap className="w-5 h-5" />}
                            bg="bg-sky-800"
                        />
                        <BentoCard
                            title="Resíduos Reciclados"
                            value="920 t"
                            sub="Destinação correta em 2024"
                            icon={<Leaf className="w-5 h-5" />}
                            bg="bg-sky-800"
                        />
                        <BentoCard
                            title="Água Reutilizada"
                            value="45.000 m³"
                            sub="Economia equivalente a 18 piscinas olímpicas"
                            icon={<Droplets className="w-5 h-5" />}
                            bg="bg-sky-800 md:col-span-2"
                        />
                    </div>
                </div>
            </section>

            {/* Downloads / Reports */}
            <section id="relatórios" className="scroll-mt-28 py-24 bg-white snap-start">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <SectionBadge text="Transparência" />
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Central de Relatórios</h2>
                        <p className="text-slate-600">Acesse nossos documentos oficiais, relatórios de sustentabilidade e políticas corporativas.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ReportCard year="2024" title="Relatório de Sustentabilidade" size="PDF • 12MB" />
                        <ReportCard year="2024" title="Demonstrações Financeiras" size="PDF • 4.5MB" />
                        <ReportCard year="2023" title="Inventário de Emissões GEE" size="PDF • 8MB" />
                        <ReportCard year="2024" title="Código de Conduta e Ética" size="PDF • 2MB" />
                        <ReportCard year="2023" title="Plano de Gestão Ambiental" size="PDF • 15MB" />
                        <ReportCard year="Vigente" title="Política de Sustentabilidade" size="PDF • 1MB" />
                    </div>

                    <div className="mt-12 text-center">
                        <button className="text-emerald-600 font-bold hover:text-emerald-700 underline decoration-2 underline-offset-4">
                            Ver arquivo completo de documentos
                        </button>
                    </div>
                </div>
            </section>

            {/* Territory CTA */}
            <section id="territorio" className="py-24 bg-blue-900 relative overflow-hidden snap-start">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <Map className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-white mb-6">Desenvolvimento Territorial Integrado</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Conheça as iniciativas que impactam positivamente os bairros da área de influência direta, incluindo Vila Bacanga, Alto da Esperança e adjacências.
                    </p>
                    <button className="px-10 py-4 bg-white text-blue-900 rounded-full font-black text-lg shadow-2xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 mx-auto">
                        <Globe className="w-5 h-5" />
                        Explorar Mapa Interativo
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer id="contato" className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-sm snap-start">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 text-white font-bold text-xl mb-6">
                                <div className="bg-emerald-500 p-1.5 rounded-lg">
                                    <Anchor className="w-5 h-5 text-white" />
                                </div>
                                Porto do Itaqui
                            </div>
                            <p className="mb-6">
                                Empresa Maranhense de Administração Portuária (EMAP).<br />
                                Conectando o Maranhão ao mundo.
                            </p>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer"><Globe className="w-4 h-4" /></div>
                                <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer"><ShieldCheck className="w-4 h-4" /></div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Institucional</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Sobre Nós</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Governança</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Compliance</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Trabalhe Conosco</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">ESG</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Meio Ambiente</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Responsabilidade Social</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Relatórios</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Indicadores</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Contato</h4>
                            <ul className="space-y-3">
                                <li>São Luís, MA - Brasil</li>
                                <li>comunicacao@emap.ma.gov.br</li>
                                <li>+55 (98) 3216-6000</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>&copy; 2024 EMAP - Todos os direitos reservados.</div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

/* --- Sub-components for better organization --- */

const StatBox = ({ icon, value, label, color, delay }: { icon: React.ReactNode, value: string, label: string, color: string, delay: string }) => (
    <div className={`bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/15 transition-colors animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
        <div className={`p-3 rounded-xl text-white shadow-lg ${color}`}>
            {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-6 h-6' } as any) : icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-white leading-none mb-1">{value}</div>
            <div className="text-xs font-medium text-slate-300 uppercase tracking-wide">{label}</div>
        </div>
    </div>
);

const SectionBadge = ({ text }: { text: string }) => (
    <span className="inline-block text-emerald-600 font-bold tracking-widest uppercase text-xs mb-3 pl-3 border-l-4 border-emerald-500">
        {text}
    </span>
);

const ImpactMetric = ({ value, label, sub, trend }: { value: string, label: string, sub: string, trend: string }) => (
    <div className="flex flex-col relative group">
        <div className="absolute top-0 right-0 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            {trend}
        </div>
        <div className="text-4xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{value}</div>
        <div className="text-sm font-bold text-slate-700 mb-1">{label}</div>
        <div className="text-xs text-slate-500 leading-snug">{sub}</div>
    </div>
);

const CheckItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-3">
        <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
        </div>
        <span className="text-slate-700 font-medium">{text}</span>
    </li>
);

const PillarCard = ({ icon, title, desc, color, features }: { icon: React.ReactNode, title: string, desc: string, color: string, features: string[] }) => (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 border border-slate-100 group">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
            {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-7 h-7' } as any) : icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">{desc}</p>
        <div className="space-y-3">
            {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
                    {f}
                </div>
            ))}
        </div>
    </div>
);

const BentoCard = ({ title, value, sub, icon, bg }: { title: string, value: string, sub: string, icon: React.ReactNode, bg: string }) => (
    <div className={`${bg} rounded-3xl p-6 border border-white/5 flex flex-col justify-between group hover:brightness-110 transition-all`}>
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg text-emerald-300">
                {icon}
            </div>
        </div>
        <div>
            <div className="text-slate-300 text-sm font-medium mb-1">{title}</div>
            <div className="text-3xl font-bold text-white mb-2">{value}</div>
            <div className="text-xs text-slate-400">{sub}</div>
        </div>
    </div>
);

const ReportCard = ({ year, title, size }: { year: string, title: string, size: string }) => (
    <div className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-100 p-6 rounded-2xl transition-all hover:shadow-lg cursor-pointer flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
            </div>
            <div>
                <div className="text-xs font-bold text-emerald-600 uppercase mb-1">{year}</div>
                <div className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{title}</div>
                <div className="text-xs text-slate-500 mt-1">{size}</div>
            </div>
        </div>
        <Download className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
    </div>
);
