import React, { useState, useEffect, useMemo } from 'react';
import {
    Shield,
    HelpCircle,
    Save,
    Upload,
    Info,
    ChevronRight,
    CheckCircle,
    FileText,
    Plus,
    RefreshCw,
    Search,
    Filter,
    Table,
    Edit,
    Trash2,
    Loader2,
    ArrowLeft,
    Building2,
    AlertTriangle,
    ShieldAlert,
    ShieldCheck,
    Lightbulb,
    Zap,
    Thermometer,
    FileCheck
} from 'lucide-react';

import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';
import { LayerUploaderInline } from '../LayerUploaderInline';
import { GovernanceSummaryCard } from './GovernanceSummaryCard';

// --- Types & Config ---
interface Question {
    id: string;
    question: string;
    options: { value: number; label: string }[];
    weight: number;
    evidenceRequired?: boolean;
}

const CRITICALITY_LEVELS = [
    { id: 'low', label: 'Baixa', color: 'bg-green-500' },
    { id: 'medium', label: 'Média', color: 'bg-amber-500' },
    { id: 'high', label: 'Alta', color: 'bg-red-500' },
];

const GOVERNANCE_QUESTIONS: Question[] = [
    {
        id: "g_compliance",
        question: "Estrutura de Integridade e Compliance?",
        options: [
            { value: 1, label: "Inexistente" },
            { value: 3, label: "Código de Conduta publicado" },
            { value: 5, label: "Código de Compliance 2024 (ESG como Pilar) + Canal de Denúncia" }
        ],
        weight: 2.0,
        evidenceRequired: true // Exige Política Anticorrupção
    },
    {
        id: "g_compensation",
        question: "Incentivos e Remuneração Executiva?",
        options: [
            { value: 1, label: "Apenas metas financeiras" },
            { value: 3, label: "Metas ESG mencionadas, sem peso na remuneração" },
            { value: 5, label: "Remuneração variável vinculada a metas ambientais e sociais (SROI)" }
        ],
        weight: 1.5
    },
    {
        id: "g_sdg",
        question: "Alinhamento com Objetivos Globais (ODS ONU)?",
        options: [
            { value: 1, label: "Não monitora ODS" },
            { value: 3, label: "Mapeamento genérico de ODS" },
            { value: 5, label: "ODS internalizados no Planejamento Estratégico e Orçamento" }
        ],
        weight: 1.0
    },
    {
        id: "g_risks",
        question: "Maturidade na Gestão de Riscos?",
        options: [
            { value: 1, label: "Reativa" },
            { value: 3, label: "Matriz de Riscos Corporativos" },
            { value: 5, label: "Riscos ESG integrados à estratégia e auditados" }
        ],
        weight: 1.5
    },
    {
        id: "g_transparency",
        question: "Nível de Transparência e Reporte?",
        options: [
            { value: 1, label: "Sem relatórios" },
            { value: 3, label: "Relatório anual simples" },
            { value: 5, label: "Relatório GRI/Relato Integrado com verificação externa" }
        ],
        weight: 1.5,
        evidenceRequired: true // Exige Relatório de Sustentabilidade
    },
    {
        id: "g_board",
        question: "Composição e Independência do Conselho?",
        options: [
            { value: 1, label: "Sem conselho formal" },
            { value: 3, label: "Conselho existente, sem independentes" },
            { value: 5, label: "Conselho com membros independentes e comitês ESG" }
        ],
        weight: 1.0
    },
    {
        id: "g_ethics",
        question: "Gestão de Conflitos de Interesse e Anticorrupção?",
        options: [
            { value: 1, label: "Sem política formal" },
            { value: 3, label: "Política existente, aplicação parcial" },
            { value: 5, label: "Due Diligence de terceiros e monitoramento ativo" }
        ],
        weight: 2.0
    }
];

// Motor de Cálculo de Risco de Governança (Compliance & Transparência)
const calculateGovernanceRisk = (answers: Record<string, number>, criticality: string) => {
    let riskScore = 0;
    
    // 1. Falta de Compliance em fornecedor de Alta Criticidade (Penalização Severa)
    if (criticality === 'high' && (answers['g_compliance'] || 1) <= 3) riskScore += 5;
    
    // 2. Falta de Transparência (GRI)
    if ((answers['g_transparency'] || 1) === 1) riskScore += 2;
    
    // 3. Ausência de Ética/Anticorrupção
    if ((answers['g_ethics'] || 1) === 1) riskScore += 3;

    if (riskScore >= 7) {
        return {
            level: 'CRÍTICO',
            color: 'text-red-600 bg-red-50 border-red-200',
            badge: '🔴 Risco Crítico de Compliance',
            recommendation: 'BLOQUEIO RECOMENDADO: Fornecedor estratégico sem controles de integridade. Alto risco de corrupção ou violação ética. Exigir auditoria externa de Due Diligence antes de novas contratações.'
        };
    } else if (riskScore >= 4) {
        return {
            level: 'MODERADO',
            color: 'text-amber-600 bg-amber-50 border-amber-200',
            badge: '🟡 Governança Reativa',
            recommendation: 'PLANO DE AÇÃO: O operador possui gaps em transparência e reporte GRI. Recomenda-se workshop de integração ESG e monitoramento trimestral do Canal de Denúncias.'
        };
    } else {
        return {
            level: 'ESTÁVEL',
            color: 'text-purple-600 bg-purple-50 border-purple-200',
            badge: '🟢 Governança Transparente',
            recommendation: 'QUALIFICAÇÃO MÁXIMA: Governança sólida e transparente. O parceiro está apto para projetos de coinvestimento e parcerias estratégicas de longo prazo.'
        };
    }
};

export const GovernanceDiagnosticForm: React.FC = () => {
    // Mode State
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Persistence State
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [companyName, setCompanyName] = useState('');
    const [criticality, setCriticality] = useState('medium');
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [evidences, setEvidences] = useState<Record<string, File | null>>({});

    const fetchAssessments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('governance_assessments')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            if (data) setAssessments(data);
        } catch (err: any) {
            console.error('Fetch error:', err);
            if (err.code === '42P01') {
                showError('Tabela de governança não encontrada no banco.');
            } else {
                showError('Erro ao carregar auditorias GRC.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    const currentRisk = useMemo(() => {
        return calculateGovernanceRisk(answers, criticality);
    }, [answers, criticality]);

    const handleAnswerChange = (id: string, value: number) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setEvidences(prev => ({ ...prev, [id]: file }));
    };

    const handleSave = async () => {
        if (!companyName) {
            showError('Razão Social é obrigatória.');
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const dataToSave = {
                company_name: companyName,
                criticality: criticality,
                answers: answers,
                risk_level: currentRisk.level,
                created_by: user?.id
            };

            if (editingId) {
                const { error } = await supabase
                    .from('governance_assessments')
                    .update(dataToSave)
                    .eq('id', editingId);
                if (error) throw error;
                showSuccess('Diagnóstico de governança atualizado!');
            } else {
                const { error } = await supabase
                    .from('governance_assessments')
                    .insert([dataToSave]);
                if (error) throw error;
                showSuccess('Nova auditoria de integridade registrada!');
            }

            resetForm();
            await fetchAssessments();
            setViewMode('list');
        } catch (err: any) {
            showError('Erro ao salvar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Excluir auditoria da empresa "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('governance_assessments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            showSuccess('Registro excluído.');
            await fetchAssessments();
        } catch (err: any) {
            showError('Erro ao excluir: ' + err.message);
        }
    };

    const resetForm = () => {
        setCompanyName('');
        setCriticality('medium');
        setAnswers({});
        setEvidences({});
        setEditingId(null);
    };

    const handleEdit = (a: any) => {
        setEditingId(a.id);
        setCompanyName(a.company_name);
        setCriticality(a.criticality);
        setAnswers(a.answers);
        setViewMode('create');
    };

    const filteredList = assessments.filter(a => 
        a.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && viewMode === 'list') {
        return (
            <div className="flex flex-col justify-center items-center py-40 gap-4">
                <Loader2 className="w-8 h-8 text-purple-300 animate-spin" />
                <p className="text-black font-bold uppercase tracking-widest text-xs">Carregando Auditorias GRC...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div>
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Shield size={12} /> Pilar Governança (G) — ABNT PR 2030
                    </div>
                    <h1 className="text-2xl font-black text-black dark:text-white tracking-tighter">
                        {viewMode === 'list' ? 'Operadores & Fornecedores' : 'Nova Auditoria de Integridade'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    {viewMode === 'list' ? (
                        <button
                            onClick={() => setViewMode('create')}
                            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]"
                        >
                            <Plus size={16} /> NOVA AUDITORIA
                        </button>
                    ) : (
                        <button
                            onClick={() => { setViewMode('list'); resetForm(); }}
                            className="flex items-center gap-2 px-4 py-2 text-black font-bold rounded-3xl text-xs hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft size={14} /> VOLTAR À LISTA
                        </button>
                    )}
                </div>
            </header>

            {viewMode === 'list' ? (
                <div className="space-y-6 px-2">
                    {/* Filter & Search */}
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 p-4 flex gap-4">
                        <div className="flex-1 relative flex items-center">
                            <Search className="absolute left-3 w-4 h-4 text-black" />
                            <input
                                type="text"
                                placeholder="Buscar por razão social ou nível de risco..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-3xl outline-none focus:border-purple-500 transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchAssessments} className="px-4 py-2 text-black hover:text-purple-600 transition-colors"><RefreshCw size={14} /></button>
                    </div>

                    {/* Records List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredList.map((a) => {
                            const risk = calculateGovernanceRisk(a.answers, a.criticality);
                            return (
                                <div key={a.id} className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm hover:border-purple-500 transition-all overflow-hidden group">
                                    <div className={`h-1.5 w-full ${risk.level === 'CRÍTICO' ? 'bg-red-500' : risk.level === 'MODERADO' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-black text-black dark:text-white truncate pr-2 group-hover:text-purple-600 transition-colors">{a.company_name}</h3>
                                                <span className="text-[10px] font-bold text-black uppercase tracking-widest">Criticidade: {a.criticality}</span>
                                            </div>
                                            <div className={`p-2 rounded-xl ${risk.color} bg-opacity-10`}>
                                                <ShieldCheck size={16} />
                                            </div>
                                        </div>
                                        <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${risk.color}`}>
                                            {risk.badge}
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-white/5">
                                            <span className="text-[9px] font-bold text-black">DUE DILIGENCE 2026</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEdit(a)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(a.id, a.company_name)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 px-2">
                    {/* Main Form */}
                    <div className="space-y-6">
                        {/* Company ID & Criticallity */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 p-8 space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                                <Building2 className="text-purple-600" />
                                <h2 className="font-black text-black dark:text-white uppercase tracking-wider text-sm">Entidade & Criticidade Estratégica</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Razão Social / Nome Fantasia</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Operador Logístico Alpha"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:border-purple-500 transition-all outline-none"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Nível de Criticidade Estratégica</label>
                                    <div className="flex gap-2">
                                        {CRITICALITY_LEVELS.map(level => (
                                            <button
                                                key={level.id}
                                                onClick={() => setCriticality(level.id)}
                                                className={`flex-1 p-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${criticality === level.id ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-transparent border-gray-100 text-black dark:border-white/5 dark:text-black'}`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                            <div className="p-8 space-y-12">
                                {GOVERNANCE_QUESTIONS.map(q => (
                                    <div key={q.id} className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-black dark:text-white">{q.question}</h3>
                                            <HelpCircle className="text-gray-300 cursor-help" size={16} />
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                            {q.options.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => handleAnswerChange(q.id, opt.value)}
                                                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${answers[q.id] === opt.value ? 'border-purple-500 bg-purple-50/30' : 'border-gray-50 dark:border-white/5 hover:border-purple-200'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt.value ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                                                        {answers[q.id] === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <span className="text-sm font-bold text-black dark:text-white">{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {q.evidenceRequired && (
                                            <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl border border-dashed border-purple-200 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <FileCheck className="text-purple-600" size={18} />
                                                    <div>
                                                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">Provas de Vida Obrigatórias</span>
                                                        <span className="text-[11px] font-bold text-black italic">{q.id === 'g_compliance' ? 'Política Anticorrupção' : 'Relatório de Sustentabilidade/GRI'}</span>
                                                    </div>
                                                </div>
                                                <button className="text-[10px] font-black text-purple-600 uppercase hover:underline">Fazer Upload</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pb-12">
                            <button onClick={() => { setViewMode('list'); resetForm(); }} className="px-6 py-3 text-black font-black text-xs uppercase tracking-widest hover:text-black transition-colors">Descartar</button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !companyName}
                                className="px-10 py-4 bg-purple-600 text-white font-black text-sm uppercase tracking-widest rounded-3xl shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                                {editingId ? 'ATUALIZAR AUDITORIA' : 'CONFIRMAR AUDITORIA GRC'}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Termômetro de Risco */}
                        <div className={`p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-500 ${currentRisk.color} border-current border-opacity-20`}>
                             <div className="flex items-center gap-2 mb-6 text-purple-600">
                                <Thermometer className="opacity-70" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Matriz de Integridade (GRC)</span>
                             </div>

                             <div className="space-y-6">
                                <div>
                                    <h4 className="text-xl font-black leading-tight uppercase tracking-tight">{currentRisk.badge}</h4>
                                    <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Due Diligence de Terceiros</p>
                                </div>

                                <div className="p-5 bg-white/40 dark:bg-black/20 rounded-2xl border border-current border-opacity-10 space-y-3">
                                    <div className="flex items-start gap-3">
                                        {currentRisk.level === 'CRÍTICO' ? <AlertTriangle className="shrink-0" size={18} /> : <Lightbulb className="shrink-0" size={18} />}
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase opacity-70">RECOMENDAÇÃO GRC</span>
                                            <p className="text-xs font-bold leading-relaxed italic">"{currentRisk.recommendation}"</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <GovernanceSummaryCard answers={answers} />

                        {/* Layer Uploader */}
                        <div className="bg-zinc-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-200 dark:border-white/10">
                             <div className="flex items-center gap-2 mb-4 text-black dark:text-white">
                                <Zap size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Mapas de Risco Corporativo</span>
                             </div>
                             <p className="text-[11px] text-black dark:text-black font-medium mb-6">Importe poligonais de áreas de atuação ou infraestrutura vinculadas a este parceiro.</p>
                             <LayerUploaderInline onLayersLoaded={() => showSuccess('Geometria vinculada ao parceiro.')} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovernanceDiagnosticForm;
