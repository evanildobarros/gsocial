import React from 'react';
import {
    Bot,
    Zap,
    Shield,
    Globe,
    ArrowRight,
    Code2,
    Cpu,
    BarChart3,
    CheckCircle2,
    Terminal,
    Layers,
    Play,
    MessageSquare,
    Menu,
    X
} from 'lucide-react';

export const KimiLandingPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-purple-500/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Bot className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">KimiAgents</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Funcionalidades</a>
                        <a href="#" className="hover:text-white transition-colors">Soluções</a>
                        <a href="#" className="hover:text-white transition-colors">Preços</a>
                        <a href="#" className="hover:text-white transition-colors">Contato</a>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                            Login
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                            Começar Agora
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-gray-950 p-6 space-y-4">
                        <a href="#" className="block text-gray-400 hover:text-white font-medium">Funcionalidades</a>
                        <a href="#" className="block text-gray-400 hover:text-white font-medium">Soluções</a>
                        <a href="#" className="block text-gray-400 hover:text-white font-medium">Preços</a>
                        <a href="#" className="block text-gray-400 hover:text-white font-medium">Contato</a>
                        <div className="pt-4 flex flex-col gap-3">
                            <button className="w-full py-3 bg-white/5 rounded-lg font-bold">Login</button>
                            <button className="w-full py-3 bg-purple-600 rounded-lg font-bold text-white">Começar Agora</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 rounded-[100%] blur-[100px] -z-10"></div>

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-8">
                                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                                Novo: Integração v2.0 lançada
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                                Implante Agentes de <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">IA Autônomos</span> em Minutos.
                            </h1>

                            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Orquestre, gerencie e escale sua força de trabalho digital sem infraestrutura complexa. Focado em eficiência, segurança e resultados reais.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                                <button className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-purple-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                                    Criar meu Agente
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                                    <Play className="w-5 h-5 fill-current" />
                                    Ver Demo
                                </button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-950 flex items-center justify-center text-xs text-white">
                                            <Globe size={12} />
                                        </div>
                                    ))}
                                </div>
                                <span>Mais de 500 empresas já utilizam</span>
                            </div>
                        </div>

                        {/* Visual / Mockup */}
                        <div className="flex-1 w-full max-w-2xl">
                            <div className="relative bg-gray-900 rounded-2xl border border-white/10 p-2 shadow-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Fake Browser Bar */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-gray-900/50 backdrop-blur">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                    </div>
                                    <div className="ml-4 h-6 w-full max-w-[200px] bg-white/5 rounded-md"></div>
                                </div>

                                {/* Content Grid (Mockup) */}
                                <div className="p-6 grid grid-cols-2 gap-4">
                                    <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Terminal size={18} /></div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">Agente de Vendas</div>
                                                    <div className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Ativo</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">ID: #88219</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                                            <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="text-xs text-gray-400 mb-2">Performance</div>
                                        <div className="text-2xl font-bold text-white mb-1">98.5%</div>
                                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[98.5%] bg-green-500"></div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="text-xs text-gray-400 mb-2">Tarefas/min</div>
                                        <div className="text-2xl font-bold text-white mb-1">1,240</div>
                                        <div className="flex gap-1 h-3 items-end">
                                            <div className="w-1 h-full bg-purple-500 opacity-20 rounded-sm"></div>
                                            <div className="w-1 h-2/3 bg-purple-500 opacity-40 rounded-sm"></div>
                                            <div className="w-1 h-4/5 bg-purple-500 opacity-60 rounded-sm"></div>
                                            <div className="w-1 h-full bg-purple-500 rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-widest">Confiado por equipes inovadoras</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50">
                        {['TechCorp', 'InnovateLabs', 'FutureNet', 'AlphaSystem', 'GlobalData'].map((name) => (
                            <div key={name} className="tex-xl font-bold text-white/40">{name}</div>
                        ))}
                        {/* Placeholder for logos */}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 bg-gray-950">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Por que escolher a KimiAgents?</h2>
                        <p className="text-gray-400 text-lg">Tecnologia de ponta para automatizar fluxos complexos com simplicidade.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <BenefitCard
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Implantação Instantânea"
                            desc="De zero a produção em menos de 5 minutos, com templates pré-configurados para diversos casos de uso."
                            color="bg-yellow-400/10"
                        />
                        <BenefitCard
                            icon={<Globe className="w-6 h-6 text-blue-400" />}
                            title="Escala Global"
                            desc="Infraestrutura distribuída que escala automaticamente para atender milhões de requisições sem latência."
                            color="bg-blue-400/10"
                        />
                        <BenefitCard
                            icon={<Shield className="w-6 h-6 text-green-400" />}
                            title="Segurança Enterprise"
                            desc="Criptografia ponta a ponta, conformidade SOC2 e controle granular de permissões para sua equipe."
                            color="bg-green-400/10"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gray-900 border-y border-white/5">
                <div className="container mx-auto px-6 space-y-24">
                    <Step
                        number="01"
                        title="Defina o Agente"
                        desc="Configure a personalidade, objetivos e restrições do seu agente através de uma interface intuitiva ou arquivo de configuração YAML."
                        icon={<Bot className="w-8 h-8 text-purple-400" />}
                        reverse={false}
                    />
                    <Step
                        number="02"
                        title="Conecte as Ferramentas"
                        desc="Integre com bancos de dados, APIs externas e ferramentas SaaS como Slack, Notion e Gmail com apenas alguns cliques."
                        icon={<Layers className="w-8 h-8 text-pink-400" />}
                        reverse={true}
                    />
                    <Step
                        number="03"
                        title="Implante e Monitore"
                        desc="Publique seu agente e acompanhe métricas de desempenho, custos e logs detalhados em tempo real no nosso dashboard."
                        icon={<BarChart3 className="w-8 h-8 text-cyan-400" />}
                        reverse={false}
                    />
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Pronto para automatizar o futuro?</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Junte-se a milhares de desenvolvedores que estão construindo a nova geração de software inteligente.
                    </p>
                    <button className="px-10 py-5 bg-white text-purple-900 rounded-xl font-black text-lg shadow-xl shadow-white/10 hover:scale-105 transition-transform">
                        Começar Teste Gratuito
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 border-t border-white/5 pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Bot className="text-purple-500" />
                                <span className="text-xl font-bold text-white">KimiAgents</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                Empowering developers to build autonomous AI workforce.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Produto</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-purple-400">Features</a></li>
                                <li><a href="#" className="hover:text-purple-400">Integrações</a></li>
                                <li><a href="#" className="hover:text-purple-400">Preços</a></li>
                                <li><a href="#" className="hover:text-purple-400">Changelog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-purple-400">Sobre</a></li>
                                <li><a href="#" className="hover:text-purple-400">Blog</a></li>
                                <li><a href="#" className="hover:text-purple-400">Carreiras</a></li>
                                <li><a href="#" className="hover:text-purple-400">Contato</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-purple-400">Privacidade</a></li>
                                <li><a href="#" className="hover:text-purple-400">Termos</a></li>
                                <li><a href="#" className="hover:text-purple-400">Segurança</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
                        © 2026 KimiAgents Inc. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Helpers ---

const BenefitCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
    <div className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all group">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

const Step: React.FC<{ number: string, title: string, desc: string, icon: React.ReactNode, reverse: boolean }> = ({ number, title, desc, icon, reverse }) => (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
        <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-block text-5xl font-black text-white/10">{number}</div>
            <h3 className="text-3xl font-bold text-white">{title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
        </div>
        <div className="flex-1 w-full flex justify-center">
            <div className="w-full max-w-md bg-gray-800 rounded-3xl p-8 border border-white/5 shadow-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-2 -translate-y-2">
                    {icon}
                </div>
                {/* Abstract Content Representation */}
                <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-white/20 rounded"></div>
                    <div className="h-32 w-full bg-black/50 rounded-xl border border-white/5 p-4 font-mono text-xs text-green-400">
                        $ agent init --name "SalesBot"<br />
                        <span className="text-gray-500">Initializing environment...</span><br />
                        <span className="text-blue-400">✔ Agent configuration loaded</span><br />
                        <span className="text-blue-400">✔ Tools connected</span><br />
                        <span className="text-white">Ready to deploy.</span>
                    </div>
                    <div className="h-10 w-full bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 font-bold text-sm">
                        Deploy Agent
                    </div>
                </div>
            </div>
        </div>
    </div>
);
