import React, { useState, useEffect } from 'react';
import {
    Calculator,
    MapPin,
    TrendingUp,
    Users,
    Save,
    List,
    RotateCw,
    History,
    FileBarChart,
    ArrowRight,
    DollarSign,
    Loader2
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

export const SROICalculator: React.FC = () => {
    const [formData, setFormData] = useState({
        projectName: '',
        investment: '',
        beneficiaries: '',
        outcomeType: 'Geração de Renda',
        attribution: '100'
    });

    const [sroiResult, setSroiResult] = useState<number | null>(null);
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

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        const project = projects.find(p => p.id.toString() === projectId);
        if (project) {
            setFormData({
                projectName: project.name,
                investment: project.budget || '',
                beneficiaries: project.beneficiaries_target?.toString() || '',
                outcomeType: project.materiality_topics?.[0] || 'Geração de Renda',
                attribution: '100'
            });
        }
    };

    const calculateSROI = async () => {
        const investment = parseFloat(formData.investment) || 0;
        const attribution = parseFloat(formData.attribution) || 0;

        if (investment > 0) {
            const mockResult = (investment * 2.5 * (attribution / 100)) / investment;
            setSroiResult(mockResult);

            try {
                setIsSaving(true);
                const { data: { session } } = await supabase.auth.getSession();
                const { error } = await supabase.from('sroi_impact_records').insert({
                    project_name: formData.projectName || 'Iniciativa Sem Nome',
                    investment,
                    beneficiaries_count: parseInt(formData.beneficiaries) || 0,
                    outcome_type: formData.outcomeType,
                    attribution_percentage: attribution,
                    sroi_ratio: mockResult,
                    created_by: session?.user.id
                });
                if (error) throw error;
                fetchHistory();
            } catch (error) {
                console.error('Erro ao salvar:', error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-1">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Calculator size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mensuração de Valor Social</h1>
                            <p className="text-sm font-bold text-gray-500">Social Return on Investment (SROI)</p>
                        </div>
                    </div>
                </div>
                <div className="px-3 py-1.5 border border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 font-black text-xs uppercase rounded-xl flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/10">
                    <TrendingUp size={14} />
                    Portaria EMAP-S-01
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Column */}
                <div className="w-full">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 h-full relative shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                                <FileBarChart className="text-blue-600 w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">Gerar Novo Cálculo d'Impacto</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Vincular a Projeto Estratégico</label>
                                <select
                                    value={selectedProjectId}
                                    onChange={(e) => handleProjectChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                                >
                                    <option value="">-- Inserção Manual --</option>
                                    {projects.map((p) => <option key={p.id} value={p.id.toString()}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título da Iniciativa</label>
                                <input
                                    type="text"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Investimento (R$)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.investment}
                                            onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                                            className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Beneficiários</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.beneficiaries}
                                            onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                                            className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Cadeia de Valor do Impacto</label>
                                <select
                                    value={formData.outcomeType}
                                    onChange={(e) => setFormData({ ...formData, outcomeType: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                                >
                                    {['Geração de Renda', 'Empregabilidade', 'Capacitação Técnica', 'Infraestrutura Comunitária'].map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">% de Atribuição (Deadweight)</label>
                                <input
                                    type="number"
                                    value={formData.attribution}
                                    onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                                />
                                <p className="text-[10px] text-gray-400 font-medium ml-1">Valor que ocorreria SEM a intervenção do Porto</p>
                            </div>

                            <button
                                onClick={calculateSROI}
                                disabled={isSaving}
                                className="w-full h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg uppercase tracking-wide shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-3"
                            >
                                {isSaving ? <RotateCw className="animate-spin text-white" /> : <Save className="w-6 h-6" />}
                                {isSaving ? 'Salvando...' : 'Calcular & Persistir Resultado'}
                            </button>
                        </div>

                        {sroiResult !== null && (
                            <div className="mt-8 animate-in zoom-in-95 duration-500">
                                <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-3xl p-8 text-center relative overflow-hidden">
                                    <DollarSign className="absolute -top-5 -right-5 w-32 h-32 text-blue-500 opacity-10 rotate-12" />
                                    <span className="block text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">SOCIAL RETURN RATIO</span>
                                    <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                                        {sroiResult.toFixed(2)} : 1
                                    </h1>
                                    <p className="text-sm font-medium text-gray-500 italic max-w-xs mx-auto">
                                        Para cada R$ 1,00 investido pela EMAP, o território recebe <strong>R$ {sroiResult.toFixed(2)}</strong> em valor social gerado.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Column */}
                <div className="w-full flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/10">
                                    <History className="text-purple-600 w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">Últimas Mensurações</h2>
                            </div>
                            <button className="flex items-center gap-1 text-sm font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                Histórico Completo <ArrowRight size={16} />
                            </button>
                        </div>

                        {isLoadingHistory ? (
                            <div className="py-10 text-center flex justify-center">
                                <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((record) => (
                                    <div
                                        key={record.id}
                                        className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-transparent hover:border-blue-200 dark:hover:border-blue-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{record.project_name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[9px] font-black text-gray-600 dark:text-gray-300 uppercase">
                                                        {record.outcome_type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400">
                                                        {new Date(record.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-black text-blue-600">{record.sroi_ratio.toFixed(2)}:1</div>
                                                <div className="text-[10px] font-bold text-gray-400">R$ {record.investment.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <p className="text-center py-6 text-sm text-gray-500 italic">
                                        Nenhuma mensuração encontrada para o pilar social.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xl">
                        <TrendingUp className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10 rotate-12" />
                        <h3 className="text-2xl font-black mb-2 relative z-10">Relatório Integrado de Valor</h3>
                        <p className="text-sm opacity-80 mb-6 max-w-xs relative z-10 leading-relaxed font-medium">
                            As métricas de SROI são auditadas e alimentam automaticamente o Reporting Hub GRI/SASB.
                        </p>
                        <button className="bg-white text-blue-900 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg relative z-10">
                            Gerar PDF Consolidado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
