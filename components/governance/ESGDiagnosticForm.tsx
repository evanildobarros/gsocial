import React, { useState, useMemo } from 'react';
import {
    Leaf,
    ShieldCheck,
    BarChart3,
    Upload,
    HelpCircle,
    Save,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';

import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';
import { LayerUploaderInline } from '../LayerUploaderInline';
import { EnvironmentalSummaryCard } from '../environmental/EnvironmentalSummaryCard';
import { GovernanceSummaryCard } from './GovernanceSummaryCard';

// --- Types & Config ---
const MATURITY_LEVELS = {
    1: { label: "Elementar", desc: "Apenas cumpre lei", color: "text-red-500", bg: "bg-red-50" },
    2: { label: "Não Integrado", desc: "Ações dispersas", color: "text-orange-500", bg: "bg-orange-50" },
    3: { label: "Gerencial", desc: "Processos estruturados", color: "text-yellow-600", bg: "bg-yellow-50" },
    4: { label: "Estratégico", desc: "Metas e KPIs", color: "text-blue-500", bg: "bg-blue-50" },
    5: { label: "Transformador", desc: "Influencia a cadeia", color: "text-green-500", bg: "bg-green-50" }
};

interface Question {
    id: string;
    question: string;
    options: { value: number; label: string }[];
    weight: number;
    evidenceRequired?: boolean;
}

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
    }
];

const GOVERNANCE_QUESTIONS: Question[] = [
    {
        id: "g_compliance",
        question: "Estrutura de Integridade e Compliance?",
        options: [
            { value: 1, label: "Inexistente" },
            { value: 3, label: "Código de Conduta publicado" },
            { value: 5, label: "Programa de Integridade completo com Canal de Denúncia e Due Diligence" }
        ],
        weight: 2.0
    },
    {
        id: "g_risks",
        question: "Maturidade na Gestão de Riscos?",
        options: [
            { value: 1, label: "Reativa" },
            { value: 3, label: "Matriz de Riscos Corporativos" },
            { value: 5, label: "Riscos ESG integrados à estratégia e auditados" }
        ],
        weight: 1.0
    },
    {
        id: "g_transparency",
        question: "Nível de Transparência e Reporte?",
        options: [
            { value: 1, label: "Sem relatórios" },
            { value: 3, label: "Relatório anual simples" },
            { value: 5, label: "Relatório GRI/Relato Integrado com verificação externa" }
        ],
        weight: 1.0
    }
];

interface ESGDiagnosticFormProps {
    initialTab?: number;
}

export const ESGDiagnosticForm: React.FC<ESGDiagnosticFormProps> = ({ initialTab = 0 }) => {
    const [tabIndex, setTabIndex] = useState(initialTab);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [evidences, setEvidences] = useState<Record<string, File | null>>({});

    const handleAnswerChange = (id: string, value: number) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setEvidences(prev => ({ ...prev, [id]: file }));
    };

    // --- Scoring Logic ---
    const scores = useMemo(() => {
        const calculateCategoryScore = (questions: Question[]) => {
            let totalWeight = 0;
            let weightedSum = 0;

            questions.forEach(q => {
                const answer = answers[q.id] || 1;
                weightedSum += answer * q.weight;
                totalWeight += q.weight;
            });

            return totalWeight > 0 ? weightedSum / totalWeight : 1;
        };

        const environmentalScore = calculateCategoryScore(ENVIRONMENTAL_QUESTIONS);
        const governanceScore = calculateCategoryScore(GOVERNANCE_QUESTIONS);

        return {
            environmental: environmentalScore,
            governance: governanceScore,
            global: (environmentalScore + governanceScore) / 2
        };
    }, [answers]);

    const getMaturityInfo = (score: number) => {
        const level = Math.round(score) as keyof typeof MATURITY_LEVELS;
        return MATURITY_LEVELS[level] || MATURITY_LEVELS[1];
    };

    const currentMaturity = getMaturityInfo(scores.global);

    const renderQuestions = (questions: Question[]) => (
        <div className="space-y-8">
            {questions.map(q => (
                <div key={q.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                                {q.question}
                            </span>
                            {q.weight > 1 && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-500 font-bold text-[8px] rounded-lg dark:bg-red-900/20">
                                    Crítico (2x Peso)
                                </span>
                            )}
                        </div>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="Saiba mais">
                            <HelpCircle size={14} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {q.options.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => handleAnswerChange(q.id, opt.value)}
                                className={`p-4 rounded-3xl border cursor-pointer transition-all hover:border-happiness-1 ${answers[q.id] === opt.value
                                        ? 'bg-happiness-1/5 border-happiness-1'
                                        : 'bg-transparent border-gray-100 dark:border-white/5'
                                    }`}
                            >
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers[q.id] === opt.value
                                            ? 'border-happiness-1 bg-happiness-1'
                                            : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {answers[q.id] === opt.value && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    {q.evidenceRequired && (
                        <div className="mt-4 p-4 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Upload size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Evidência Obrigatória</span>
                                </div>
                                <button
                                    onClick={() => document.getElementById(`upload-${q.id}`)?.click()}
                                    className="text-[10px] font-black text-happiness-1 uppercase hover:underline"
                                >
                                    {evidences[q.id] ? evidences[q.id]?.name : 'Selecionar Arquivo'}
                                </button>
                                <input
                                    id={`upload-${q.id}`}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(q.id, e)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                        Diagnóstico de Maturidade ESG porto
                    </h1>
                    <p className="text-gray-500 font-medium italic mt-1">
                        Autoavaliação baseada na ABNT PR 2030 (Vol. II) e Materialidade (Vol. III)
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                        {/* Tab Navigation */}
                        <div className="bg-gray-50 dark:bg-zinc-900 flex border-b border-gray-100 dark:border-white/5">
                            <button
                                onClick={() => setTabIndex(0)}
                                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${tabIndex === 0
                                        ? 'text-happiness-1 border-b-2 border-happiness-1 bg-white dark:bg-[#1C1C1C]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Leaf size={18} />
                                Ambiental (E)
                            </button>
                            <button
                                onClick={() => setTabIndex(1)}
                                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${tabIndex === 1
                                        ? 'text-happiness-1 border-b-2 border-happiness-1 bg-white dark:bg-[#1C1C1C]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <ShieldCheck size={18} />
                                Governança (G)
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            {tabIndex === 0 && renderQuestions(ENVIRONMENTAL_QUESTIONS)}
                            {tabIndex === 1 && renderQuestions(GOVERNANCE_QUESTIONS)}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <button className="bg-happiness-1 text-white font-black text-xs px-8 py-3 rounded-3xl uppercase tracking-widest shadow-lg shadow-happiness-1/20 transition-all hover:scale-105 flex items-center gap-2">
                                <Save size={18} />
                                Salvar Diagnóstico 2026
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results & Chart Section */}
                <div className="space-y-6 sticky top-24">
                    {tabIndex === 0 ? (
                        <EnvironmentalSummaryCard answers={answers} />
                    ) : (
                        <GovernanceSummaryCard answers={answers} />
                    )}

                    {/* Geospatial Upload - Bloco Inline ESG */}
                    <LayerUploaderInline onLayersLoaded={async (newLayers) => {
                        try {
                            const { data: { user } } = await supabase.auth.getUser();
                            const layersToInsert = newLayers.map(l => ({
                                id: l.id,
                                name: l.name,
                                type: l.type,
                                visible: l.visible ?? true,
                                color: l.color,
                                data: l.data,
                                details: l.details || {},
                                pillar: l.pillar,
                                group: l.group || 'Diagnóstico ESG',
                                created_by: user?.id || null
                            }));

                            const { error } = await supabase
                                .from('map_layers')
                                .upsert(layersToInsert);

                            if (error) throw error;
                            showSuccess(`${newLayers.length} camada(s) geoespacial(is) adicionada(s) ao banco.`);
                        } catch (err: any) {
                            showError('Erro ao salvar camadas: ' + err.message);
                        }
                    }} />
                </div>
            </div>
        </div>
    );
};

export default ESGDiagnosticForm;
