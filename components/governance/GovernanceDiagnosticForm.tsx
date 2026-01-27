import React, { useState } from 'react';
import {
    Shield,
    HelpCircle,
    Save,
    Upload,
    Info,
    ChevronRight,
    CheckCircle,
    FileText
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

const GOVERNANCE_QUESTIONS: Question[] = [
    {
        id: "g_compliance",
        question: "Estrutura de Integridade e Compliance?",
        options: [
            { value: 1, label: "Inexistente" },
            { value: 3, label: "Código de Conduta publicado" },
            { value: 5, label: "Programa de Integridade completo com Canal de Denúncia e Due Diligence" }
        ],
        weight: 2.0,
        evidenceRequired: true
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
        weight: 1.5
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

export const GovernanceDiagnosticForm: React.FC = () => {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [evidences, setEvidences] = useState<Record<string, File | null>>({});

    const handleAnswerChange = (id: string, value: number) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setEvidences(prev => ({ ...prev, [id]: file }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <p className="text-xs font-black text-purple-600 uppercase tracking-widest">
                        ABNT PR 2030 (G)
                    </p>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        Diagnóstico de Governança
                    </h1>
                    <p className="text-sm text-gray-500 italic">
                        Estrutura de compliance, transparência e gestão de riscos corporativos.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border-b border-gray-100 dark:border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-purple-600 uppercase tracking-widest">
                                    Questionário de Governança Corporativa
                                </span>
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    Compliance Corporativo
                                </span>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="p-8 space-y-10">
                            {GOVERNANCE_QUESTIONS.map(q => (
                                <div key={q.id} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-black text-gray-900 dark:text-white">
                                                {q.question}
                                            </h3>
                                            {q.weight > 1.5 && (
                                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 text-[8px] font-black uppercase rounded-lg" title="Critério essencial de integridade">
                                                    Crítico
                                                </span>
                                            )}
                                        </div>
                                        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="Ajuda">
                                            <HelpCircle size={14} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {q.options.map(opt => (
                                            <div
                                                key={opt.value}
                                                onClick={() => handleAnswerChange(q.id, opt.value)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:border-purple-400 ${answers[q.id] === opt.value
                                                        ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-500'
                                                        : 'bg-transparent border-gray-100 dark:border-white/5'
                                                    }`}
                                            >
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers[q.id] === opt.value
                                                            ? 'border-purple-500 bg-purple-500'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                        }`}>
                                                        {answers[q.id] === opt.value && (
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{opt.label}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {q.evidenceRequired && (
                                        <div className="mt-4 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                                                        <Upload className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                                                            EVIDÊNCIA OBRIGATÓRIA
                                                        </span>
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                            {evidences[q.id] ? evidences[q.id]?.name : 'Nenhum documento anexado'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => document.getElementById(`upload-${q.id}`)?.click()}
                                                    className="text-xs font-black text-purple-600 uppercase hover:underline"
                                                >
                                                    {evidences[q.id] ? 'Trocar Arquivo' : 'Anexar'}
                                                </button>
                                                <input id={`upload-${q.id}`} type="file" className="hidden" onChange={(e) => handleFileUpload(q.id, e)} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-purple-600/20 transition-all hover:scale-105 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Salvar Diagnóstico Governança
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 lg:sticky lg:top-24">
                    <GovernanceSummaryCard answers={answers} />

                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <Info className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">
                                MAPA DE RISCOS
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Adicione camadas de infraestrutura e áreas críticas para correlacionar com a matriz de riscos corporativos.
                        </p>
                        <LayerUploaderInline onLayersLoaded={async (layers) => {
                            try {
                                const { data: { user } } = await supabase.auth.getUser();
                                const layersToInsert = layers.map(l => ({
                                    id: l.id,
                                    name: l.name,
                                    type: l.type,
                                    visible: true,
                                    color: l.color,
                                    data: l.data,
                                    details: l.details || {},
                                    pillar: l.pillar,
                                    group: l.group || 'Diagnóstico Governança',
                                    created_by: user?.id || null
                                }));
                                const { error } = await supabase.from('map_layers').upsert(layersToInsert);
                                if (error) throw error;
                                showSuccess(`${layers.length} camada(s) de risco adicionada(s).`);
                            } catch (err: any) {
                                showError('Erro ao salvar camadas: ' + err.message);
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GovernanceDiagnosticForm;
