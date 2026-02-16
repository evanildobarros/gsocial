import React, { useState, useEffect, useMemo } from 'react';
import {
    Leaf,
    HelpCircle,
    Save,
    Upload,
    Info,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Plus,
    RefreshCw,
    Search,
    Filter,
    Table,
    Edit,
    Trash2,
    Loader2,
    ArrowLeft,
    Anchor,
    Droplets,
    Wind,
    ShieldAlert,
    Thermometer,
    Lightbulb,
    AlertTriangle,
    Database,
    Zap,
    Users,
    FileText
} from 'lucide-react';

import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';
import { LayerUploaderInline } from '../LayerUploaderInline';
import { EnvironmentalSummaryCard } from './EnvironmentalSummaryCard';

// --- Types & Config ---
interface Question {
    id: string;
    question: string;
    options: { value: number; label: string }[];
    weight: number;
    evidenceRequired?: boolean;
}

const OPERATION_TYPES = [
    { id: 'liquid', label: 'Granéis Líquidos', icon: Droplets },
    { id: 'solid', label: 'Granéis Sólidos', icon: Database },
    { id: 'general', label: 'Carga Geral', icon: Anchor },
    { id: 'passengers', label: 'Passageiros', icon: Users },
];

const ENVIRONMENTAL_QUESTIONS: Question[] = [
    {
        id: "e_ghg",
        question: "Qual o nível de gestão das emissões de GEE?",
        options: [
            { value: 1, label: "Não monitora" },
            { value: 3, label: "Inventário Escopo 1 e 2" },
            { value: 5, label: "Inventário Escopo 1, 2 e 3 validado + Metas de Redução" }
        ],
        weight: 2.0,
        evidenceRequired: true
    },
    {
        id: "e_waste",
        question: "Como é feita a gestão de resíduos sólidos?",
        options: [
            { value: 1, label: "Apenas remoção básica" },
            { value: 3, label: "Segregação e PGRS implantado" },
            { value: 5, label: "Economia Circular e Rastreabilidade Total" }
        ],
        weight: 2.0
    },
    {
        id: "e_spill",
        question: "Prontidão para emergências ambientais (Óleo/Químicos)?",
        options: [
            { value: 1, label: "Sem plano formal" },
            { value: 3, label: "Plano básico individual" },
            { value: 5, label: "Integração total ao PAM e simulados frequentes" }
        ],
        weight: 2.0
    },
    {
        id: "e_water",
        question: "Gestão de Efluentes e Qualidade da Água?",
        options: [
            { value: 1, label: "Sem monitoramento" },
            { value: 3, label: "Monitoramento pontual" },
            { value: 5, label: "Tratamento avançado e monitoramento contínuo" }
        ],
        weight: 1.5
    },
    {
        id: "e_biodiversity",
        question: "Práticas de Conservação da Biodiversidade?",
        options: [
            { value: 1, label: "Nenhuma ação formal" },
            { value: 3, label: "Estudos de impacto realizados" },
            { value: 5, label: "Programa de compensação e monitoramento ativo" }
        ],
        weight: 1.0
    }
];

// Motor de Cálculo de Risco Ambiental
const calculateEnvironmentalRisk = (answers: Record<string, number>, operationType: string) => {
    let riskScore = 0;
    
    // 1. Ausência de Monitoramento de GEE
    if ((answers['e_ghg'] || 1) === 1) riskScore += 3;
    
    // 2. Ausência de Integração ao PAM (e_spill)
    if ((answers['e_spill'] || 1) === 1) riskScore += 4;
    
    // 3. Impacto por Operação
    if (operationType === 'liquid' && (answers['e_spill'] || 1) < 5) riskScore += 3;

    if (riskScore >= 7) {
        return {
            level: 'CRÍTICO',
            color: 'text-red-600 bg-red-50 border-red-200',
            badge: '🔴 Risco de Embargo/Multa',
            recommendation: 'AÇÃO IMEDIATA: Ausência de monitoramento de emissões e plano de emergência. Risco iminente de sanções regulatórias. Recomendada auditoria de conformidade urgente e adesão imediata ao PAM portuário.'
        };
    } else if (riskScore >= 4) {
        return {
            level: 'MODERADO',
            color: 'text-amber-600 bg-amber-50 border-amber-200',
            badge: '🟡 Risco Moderado',
            recommendation: 'ATENÇÃO: Monitoramento parcial identificado. Necessário fechar gaps na gestão de efluentes e inventariar emissões de Escopo 2 para manter a conformidade ABNT PR 2030.'
        };
    } else {
        const isPerfect = Object.values(answers).every(v => v === 5);
        return {
            level: 'ESTÁVEL',
            color: 'text-green-600 bg-green-50 border-green-200',
            badge: isPerfect ? '🟢 Operação Eco-Eficiente' : '🟢 Baixo Risco Ambiental',
            recommendation: 'OPERAÇÃO CONFORME: O terminal apresenta bons controles ambientais. Manter o cronograma de simulados de vazamento e iniciar a transição para economia circular total.'
        };
    }
};

export const EnvironmentalDiagnosticForm: React.FC = () => {
    // Mode State
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Persistence State
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [terminalName, setTerminalName] = useState('');
    const [operationType, setOperationType] = useState('general');
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [evidences, setEvidences] = useState<Record<string, File | null>>({});

    const fetchAssessments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('environmental_assessments') 
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            if (data) setAssessments(data);
        } catch (err: any) {
            console.error('Fetch error:', err);
            showError('Erro ao carregar auditorias ambientais.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    const currentRisk = useMemo(() => {
        return calculateEnvironmentalRisk(answers, operationType);
    }, [answers, operationType]);

    const handleAnswerChange = (id: string, value: number) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setEvidences(prev => ({ ...prev, [id]: file }));
    };

    const handleSave = async () => {
        if (!terminalName) {
            showError('Nome do terminal é obrigatório.');
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const dataToSave = {
                terminal_name: terminalName,
                operation_type: operationType,
                answers: answers,
                risk_level: currentRisk.level,
                created_by: user?.id
            };

            if (editingId) {
                const { error } = await supabase
                    .from('environmental_assessments')
                    .update(dataToSave)
                    .eq('id', editingId);
                if (error) throw error;
                showSuccess('Diagnóstico ambiental atualizado!');
            } else {
                const { error } = await supabase
                    .from('environmental_assessments')
                    .insert([dataToSave]);
                if (error) throw error;
                showSuccess('Novo diagnóstico ambiental registrado!');
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
        if (!window.confirm(`Excluir diagnóstico do terminal "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('environmental_assessments')
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
        setTerminalName('');
        setOperationType('general');
        setAnswers({});
        setEvidences({});
        setEditingId(null);
    };

    const handleEdit = (a: any) => {
        setEditingId(a.id);
        setTerminalName(a.terminal_name);
        setOperationType(a.operation_type);
        setAnswers(a.answers);
        setViewMode('create');
    };

    const filteredList = assessments.filter(a => 
        a.terminal_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && viewMode === 'list') {
        return (
            <div className="flex flex-col justify-center items-center py-40 gap-4">
                <Loader2 className="w-8 h-8 text-green-300 animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando Auditorias Ambientais...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div>
                    <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Leaf size={12} /> Pilar Ambiental (E) — ABNT PR 2030
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {viewMode === 'list' ? ' Auditorias & Terminais' : 'Novo Diagnóstico de Instalação'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    {viewMode === 'list' ? (
                        <button
                            onClick={() => setViewMode('create')}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
                        >
                            <Plus size={16} /> NOVO DIAGNÓSTICO
                        </button>
                    ) : (
                        <button
                            onClick={() => { setViewMode('list'); resetForm(); }}
                            className="flex items-center gap-2 px-4 py-2 text-gray-500 font-bold rounded-3xl text-xs hover:bg-gray-50 transition-colors"
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
                            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por terminal ou instalação..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-3xl outline-none focus:border-green-500 transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchAssessments} className="px-4 py-2 text-gray-400 hover:text-green-600 transition-colors"><RefreshCw size={14} /></button>
                    </div>

                    {/* Terminal List Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredList.map((a) => {
                            const risk = calculateEnvironmentalRisk(a.answers, a.operation_type);
                            return (
                                <div key={a.id} className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm hover:border-green-500 transition-all overflow-hidden group">
                                    <div className={`h-1.5 w-full ${risk.level === 'CRÍTICO' ? 'bg-red-500' : risk.level === 'MODERADO' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-black text-gray-900 dark:text-white truncate pr-2 group-hover:text-green-600 transition-colors">{a.terminal_name}</h3>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{a.operation_type}</span>
                                            </div>
                                            <div className={`p-2 rounded-xl ${risk.color} bg-opacity-10`}>
                                                <AlertTriangle size={16} />
                                            </div>
                                        </div>
                                        <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${risk.color}`}>
                                            {risk.badge}
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-white/5">
                                            <span className="text-[9px] font-bold text-gray-400">AUDITORIA 2026</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEdit(a)} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(a.id, a.terminal_name)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
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
                        {/* Terminal ID & Setup */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 p-8 space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-white/5 pb-4">
                                <Anchor className="text-green-600" />
                                <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Instalação & Operação</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Terminal / Instalação</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Terminal de Granéis Sul"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
                                        value={terminalName}
                                        onChange={(e) => setTerminalName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Operação (Dual Materiality)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {OPERATION_TYPES.map(op => (
                                            <button
                                                key={op.id}
                                                onClick={() => setOperationType(op.id)}
                                                className={`p-3 rounded-2xl border flex items-center gap-2 transition-all ${operationType === op.id ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-transparent border-gray-100 text-gray-500 hover:border-green-300 dark:border-white/5 dark:text-gray-400'}`}
                                            >
                                                <op.icon size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-tight">{op.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                            <div className="p-8 space-y-12">
                                {ENVIRONMENTAL_QUESTIONS.map(q => {
                                    // Dupla Materialidade: Dobra peso para líquidos em vazamentos e efluentes
                                    const isMaterial = (operationType === 'liquid' && (q.id === 'e_spill' || q.id === 'e_water'));
                                    const effectiveWeight = isMaterial ? q.weight * 2 : q.weight;

                                    return (
                                        <div key={q.id} className="space-y-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-gray-800 dark:text-white">{q.question}</h3>
                                                    {isMaterial && (
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase rounded-lg border border-amber-200">Materialidade Crítica (2x Peso)</span>
                                                    )}
                                                </div>
                                                <HelpCircle className="text-gray-300 cursor-help" size={16} />
                                            </div>

                                            <div className="grid grid-cols-1 gap-2">
                                                {q.options.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleAnswerChange(q.id, opt.value)}
                                                        className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${answers[q.id] === opt.value ? 'border-green-500 bg-green-50/30' : 'border-gray-50 dark:border-white/5 hover:border-green-200'}`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt.value ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                                            {answers[q.id] === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{opt.label}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {q.evidenceRequired && (
                                                <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="text-green-600" size={18} />
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Evidência Obrigatória (PR 2030)</span>
                                                    </div>
                                                    <button className="text-[10px] font-black text-green-600 uppercase hover:underline">Selecionar PDF/Anexo</button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pb-12">
                            <button onClick={() => { setViewMode('list'); resetForm(); }} className="px-6 py-3 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors">Descartar</button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !terminalName}
                                className="px-10 py-4 bg-green-600 text-white font-black text-sm uppercase tracking-widest rounded-3xl shadow-xl shadow-green-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {editingId ? 'ATUALIZAR DIAGNÓSTICO' : 'REGISTRAR AUDITORIA AMBIENTAL'}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Termômetro de Risco */}
                        <div className={`p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-500 ${currentRisk.color} border-current border-opacity-20`}>
                             <div className="flex items-center gap-2 mb-6">
                                <Thermometer className="opacity-70" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Termômetro de Risco Ambiental</span>
                             </div>

                             <div className="space-y-6">
                                <div>
                                    <h4 className="text-xl font-black leading-tight uppercase tracking-tight">{currentRisk.badge}</h4>
                                    <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Status de Conformidade Operacional</p>
                                </div>

                                <div className="p-5 bg-white/40 dark:bg-black/20 rounded-2xl border border-current border-opacity-10 space-y-3">
                                    <div className="flex items-start gap-3">
                                        {currentRisk.level === 'CRÍTICO' ? <AlertTriangle className="shrink-0" size={18} /> : <Lightbulb className="shrink-0" size={18} />}
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase opacity-70">RECOMENDAÇÃO CONSULTIVA</span>
                                            <p className="text-xs font-bold leading-relaxed italic">"{currentRisk.recommendation}"</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Summary Visualization */}
                        <EnvironmentalSummaryCard answers={answers} />

                        {/* Layer Uploader */}
                        <div className="bg-blue-50/30 dark:bg-white/5 p-6 rounded-3xl border border-blue-100 dark:border-white/10">
                             <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                                <Zap size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Geoprocessamento</span>
                             </div>
                             <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-6">Vincule camadas de monitoramento (fumaça, poeira, vazamentos) ao terminal selecionado.</p>
                             <LayerUploaderInline onLayersLoaded={() => showSuccess('Geometria vinculada à instalação.')} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnvironmentalDiagnosticForm;
