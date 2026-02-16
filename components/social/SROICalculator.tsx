import React, { useState, useEffect, useMemo } from 'react';
import {
    Calculator,
    TrendingUp,
    Users,
    Save,
    RotateCw,
    History,
    FileBarChart,
    ArrowRight,
    DollarSign,
    Loader2,
    Coins,
    ShieldCheck,
    Info,
    ArrowUpRight,
    ExternalLink,
    Lightbulb
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';

// Dicionário de Proxies Financeiras (Baseado na Metodologia ESGporto)
export const IMPACT_PROXIES = {
    empregabilidade: {
        label: 'Empregabilidade Portuária',
        rendaFamiliar: 20000,
        economiaEstado: 7200,
        reducaoViolencia: 12000,
        retornoFiscal: 4000,
        totalPorPessoa: 43200 // Soma das proxies
    },
    saneamento_basico: {
        label: 'Saneamento / Infraestrutura',
        economiaSaudePublica: 1500, // Menos idas ao posto de saúde
        valorizacaoImovel: 5000,
        totalPorFamilia: 6500
    }
};

// Função para calcular o S-ROI Projetado
export const calculateProjectSROI = (
    investmentAmount: number,
    beneficiariesCount: number,
    projectType: 'empregabilidade' | 'saneamento_basico'
) => {
    if (!investmentAmount || investmentAmount <= 0) return { socialValue: 0, ratio: "0.00", message: "" };
    
    const proxy = IMPACT_PROXIES[projectType];
    const valuePerBeneficiary = 'totalPorPessoa' in proxy ? proxy.totalPorPessoa : proxy.totalPorFamilia;
    
    const totalSocialValueCreated = beneficiariesCount * valuePerBeneficiary;
    const sroiRatio = totalSocialValueCreated / investmentAmount;

    return {
        socialValue: totalSocialValueCreated,
        ratio: sroiRatio.toFixed(2),
        message: `Para cada R$ 1 investido, o projeto gera R$ ${sroiRatio.toFixed(2)} em impacto socioeconômico.`
    };
};

export const SROICalculator: React.FC = () => {
    const [formData, setFormData] = useState({
        projectName: '',
        investment: '',
        beneficiaries: '',
        projectType: 'empregabilidade' as 'empregabilidade' | 'saneamento_basico',
        attribution: '100'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');

    useEffect(() => {
        fetchHistory();
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await supabase.from('projects').select('*').eq('pilar', 'Social').order('name');
            if (data) setProjects(data);
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            setIsLoadingHistory(true);
            const { data } = await supabase.from('sroi_impact_records').select('*').order('created_at', { ascending: false }).limit(5);
            if (data) setHistory(data);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // --- Real-time S-ROI Calculation using Proxies ---
    const currentSROI = useMemo(() => {
        const inv = parseFloat(formData.investment) || 0;
        const ben = parseInt(formData.beneficiaries) || 0;
        const attr = parseFloat(formData.attribution) || 100;
        
        const result = calculateProjectSROI(inv, ben, formData.projectType);
        
        // Aplica o Deadweight (Atribuição)
        const adjustedSocialValue = result.socialValue * (attr / 100);
        const adjustedRatio = inv > 0 ? (adjustedSocialValue / inv).toFixed(2) : "0.00";

        return {
            ...result,
            socialValue: adjustedSocialValue,
            ratio: adjustedRatio
        };
    }, [formData]);

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        const project = projects.find(p => p.id.toString() === projectId);
        if (project) {
            setFormData({
                ...formData,
                projectName: project.name,
                investment: project.budget || '',
                beneficiaries: project.beneficiaries_target?.toString() || '',
            });
        }
    };

    const saveSROIResult = async () => {
        const investment = parseFloat(formData.investment) || 0;
        if (investment <= 0) {
            showError('Insira um valor de investimento válido.');
            return;
        }

        try {
            setIsSaving(true);
            const { data: { session } } = await supabase.auth.getSession();
            const { error } = await supabase.from('sroi_impact_records').insert({
                project_name: formData.projectName || 'Iniciativa Sem Nome',
                investment,
                beneficiaries_count: parseInt(formData.beneficiaries) || 0,
                outcome_type: IMPACT_PROXIES[formData.projectType].label,
                attribution_percentage: parseFloat(formData.attribution),
                sroi_ratio: parseFloat(currentSROI.ratio),
                created_by: session?.user.id
            });
            
            if (error) throw error;
            
            showSuccess('Mensuração de impacto salva com sucesso!');
            fetchHistory();
        } catch (error: any) {
            showError('Falha ao persistir dados: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-1">
                        <div className="w-14 h-14 bg-happiness-1/10 text-happiness-1 rounded-2xl flex items-center justify-center border border-happiness-1/20">
                            <Calculator size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Motor de Impacto Social</h1>
                            <p className="text-sm font-bold text-black">Social Return on Investment (SROI) • Proxies Financeiras</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1.5 border border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase rounded-xl flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/10">
                        <ShieldCheck size={14} /> Compliance PR 2030
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Coins size={120} className="text-happiness-1" />
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                                <FileBarChart className="text-blue-600 w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">Parâmetros de Investimento</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-black uppercase ml-1">Vincular a Projeto Estratégico</label>
                                <select
                                    value={selectedProjectId}
                                    onChange={(e) => handleProjectChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:border-happiness-1 transition-all text-gray-900 dark:text-white"
                                >
                                    <option value="">-- Inserção Manual --</option>
                                    {projects.map((p) => <option key={p.id} value={p.id.toString()}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-black uppercase ml-1">Título da Iniciativa Social</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Formação de Estivadores Locais"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:border-happiness-1 transition-all text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-black uppercase ml-1">Investimento EMAP (R$)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                                        <input
                                            type="number"
                                            value={formData.investment}
                                            onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                                            className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-black text-happiness-1 focus:outline-none focus:border-happiness-1 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-black uppercase ml-1">Nº Beneficiários Diretos</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                                        <input
                                            type="number"
                                            value={formData.beneficiaries}
                                            onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                                            className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-black focus:outline-none focus:border-happiness-1 transition-all text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-black uppercase ml-1">Tipo de Impacto (Proxy de Mercado)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {Object.entries(IMPACT_PROXIES).map(([id, proxy]) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, projectType: id as any })}
                                            className={`p-4 rounded-2xl border text-left transition-all ${formData.projectType === id ? 'bg-happiness-1 border-happiness-1 text-white shadow-lg shadow-happiness-1/20 scale-[1.02]' : 'bg-transparent border-gray-100 hover:border-happiness-1/30 dark:border-white/5 dark:text-black'}`}
                                        >
                                            <span className="text-[10px] font-black uppercase block mb-1 opacity-80">Metodologia ESGporto</span>
                                            <span className="text-sm font-black uppercase tracking-tight">{proxy.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">% de Atribuição (Deadweight)</label>
                                    <span className="text-xs font-black text-happiness-1">{formData.attribution}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.attribution}
                                    onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                                    className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-happiness-1"
                                />
                                <div className="flex items-center gap-2 text-[9px] text-black italic">
                                    <Info size={10} />
                                    <span>Valor que ocorreria SEM a intervenção do Porto.</span>
                                </div>
                            </div>

                            <button
                                onClick={saveSROIResult}
                                disabled={isSaving || !formData.investment}
                                className="w-full h-16 rounded-full bg-happiness-1 hover:bg-happiness-1/90 text-white font-black text-lg uppercase tracking-wide shadow-xl shadow-happiness-1/30 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                            >
                                {isSaving ? <RotateCw className="animate-spin" /> : <Save className="w-6 h-6" />}
                                {isSaving ? 'PERSISTINDO DADOS...' : 'CALCULAR & REGISTRAR IMPACTO'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard / History Column */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Result Card */}
                    <div className="bg-gradient-to-br from-happiness-1 to-blue-600 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group animate-in slide-in-from-right-4 duration-500">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                             <TrendingUp size={180} />
                         </div>
                         
                         <div className="relative z-10 space-y-8">
                             <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/20 text-[9px] font-black uppercase tracking-widest mb-4">
                                    <ShieldCheck size={10} /> Resultado do Cálculo (S-ROI)
                                </span>
                                <h1 className="text-6xl font-black tracking-tighter">
                                    {currentSROI.ratio}x
                                </h1>
                                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-1">Social Return on Investment</p>
                             </div>

                             <div className="space-y-4">
                                 <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                     <span className="text-[10px] font-black uppercase text-white/60 block mb-1">Valor Social Total Criado</span>
                                     <span className="text-2xl font-black tracking-tight">R$ {currentSROI.socialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                 </div>
                                 <p className="text-xs font-medium leading-relaxed italic opacity-80 flex items-start gap-2">
                                     <Lightbulb size={24} className="shrink-0" />
                                     "{currentSROI.message} Cálculo baseado em proxies de mercado validadas pela EMAP."
                                 </p>
                             </div>

                             <div className="pt-4 flex justify-between items-center border-t border-white/10">
                                 <div className="flex -space-x-2">
                                     {[1, 2, 3].map(i => (
                                         <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-white/20" />
                                     ))}
                                 </div>
                                 <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest hover:underline">
                                     Exportar Laudo <ExternalLink size={12} />
                                 </button>
                             </div>
                         </div>
                    </div>

                    {/* History */}
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/10">
                                    <History className="text-purple-600 w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-none">Histórico de Impacto</h2>
                            </div>
                        </div>

                        {isLoadingHistory ? (
                            <div className="py-10 text-center flex justify-center">
                                <Loader2 className="w-8 h-8 text-gray-700 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((record) => (
                                    <div
                                        key={record.id}
                                        className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-transparent hover:border-happiness-1 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="min-w-0 flex-1 pr-4">
                                                <h3 className="text-xs font-black text-gray-900 dark:text-white truncate mb-1 group-hover:text-happiness-1 transition-colors uppercase tracking-tight">{record.project_name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[8px] font-black text-black dark:text-gray-700 uppercase truncate">
                                                        {record.outcome_type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-sm font-black text-happiness-1">{record.sroi_ratio.toFixed(2)}x</div>
                                                <div className="text-[9px] font-bold text-black uppercase tracking-tighter">R$ {record.investment.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
