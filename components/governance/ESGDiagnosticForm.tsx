import React, { useState, useMemo } from 'react';
import {
    Leaf,
    ShieldCheck,
    BarChart3,
    Upload,
    HelpCircle,
    Save,
    AlertCircle,
    ChevronRight,
    Users,
    Anchor,
    Box,
    Droplets,
    Users2
} from 'lucide-react';

import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';
import { LayerUploaderInline } from '../LayerUploaderInline';
import { EnvironmentalSummaryCard } from '../environmental/EnvironmentalSummaryCard';
import { GovernanceSummaryCard } from './GovernanceSummaryCard';
import { SocialSummaryCard } from '../social/SocialSummaryCard';

// --- Types & Config ---
const MATURITY_LEVELS = {
    1: { label: "Elementar", desc: "Apenas cumpre lei", color: "text-red-500", bg: "bg-red-50" },
    2: { label: "Não Integrado", desc: "Ações dispersas", color: "text-orange-500", bg: "bg-orange-50" },
    3: { label: "Gerencial", desc: "Processos estruturados", color: "text-yellow-600", bg: "bg-yellow-50" },
    4: { label: "Estratégico", desc: "Metas e KPIs", color: "text-blue-500", bg: "bg-blue-50" },
    5: { label: "Transformador", desc: "Influencia a cadeia", color: "text-green-500", bg: "bg-green-50" }
};

const OPERATION_TYPES = [
    { id: 'liquid', label: 'Granéis Líquidos', icon: Droplets },
    { id: 'solid', label: 'Granéis Sólidos', icon: Box },
    { id: 'general', label: 'Carga Geral', icon: Anchor },
    { id: 'passengers', label: 'Passageiros', icon: Users2 },
];

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

const SOCIAL_QUESTIONS: Question[] = [
    {
        id: "s_diversity",
        question: "Como a diversidade e inclusão são tratadas na estrutura de liderança?",
        options: [
            { value: 1, label: "Não há política formal ou baseia-se apenas no discurso (Risco de Diversity Washing)" },
            { value: 3, label: "Política implementada, código de ética e comitê de diversidade ativo" },
            { value: 5, label: "Metas afirmativas alcançadas com dados demográficos transparentes e mudança estrutural na liderança" }
        ],
        weight: 2.0,
        evidenceRequired: true // Exige upload do Relatório Demográfico ou Censo Interno
    },
    {
        id: "s_community",
        question: "Qual o nível de impacto e investimento na Relação Porto-Cidade (ex: comunidades do entorno)?",
        options: [
            { value: 1, label: "Inexistente ou restrito a doações filantrópicas esporádicas (Risco de Social Washing)" },
            { value: 3, label: "Projetos de relacionamento pontuais e mitigação de impactos (poeira, ruído)" },
            { value: 5, label: "Programas estruturantes de longo prazo focados em infraestrutura, água e segurança alimentar" }
        ],
        weight: 2.5, // Peso máximo devido à Materialidade de Impacto Portuário
        evidenceRequired: true // Exige upload de Relatório S-ROI (Retorno Social sobre Investimento)
    },
    {
        id: "s_human_rights",
        question: "Qual o rigor na garantia de Direitos Humanos e Due Diligence na Cadeia de Valor (motoristas, terceiros, OGMO)?",
        options: [
            { value: 1, label: "Apenas exigência de cláusulas contratuais padrão" },
            { value: 3, label: "Auditorias por amostragem e canal de denúncias estendido a terceiros" },
            { value: 5, label: "Due Diligence rigorosa e rastreabilidade total contra trabalho infantil/forçado" }
        ],
        weight: 2.0,
        evidenceRequired: true // Exige upload do Relatório de Auditoria de Terceira Parte
    },
    {
        id: "s_safety",
        question: "Qual a maturidade da gestão de Saúde e Segurança Ocupacional (SSO)?",
        options: [
            { value: 1, label: "Reativa: foco apenas em cumprir as Normas Regulamentadoras básicas" },
            { value: 3, label: "Prevenção: monitorização contínua e certificação ISO 45001" },
            { value: 5, label: "Cultura 'Zero Acidentes' integrada, abrangendo saúde física, mental e segurança psicológica" }
        ],
        weight: 1.5,
        evidenceRequired: false
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
    const [operationType, setOperationType] = useState('liquid');
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [evidences, setEvidences] = useState<Record<string, File | null>>({});

    const handleAnswerChange = (id: string, value: number) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setEvidences(prev => ({ ...prev, [id]: file }));
    };

    // --- Scoring Logic with Double Materiality ---
    const scores = useMemo(() => {
        const getMultiplier = (qId: string) => {
            // Lógica de Dupla Materialidade: ajusta peso conforme operação
            if (operationType === 'liquid' && qId === 'e_spill') return 2.0; // Vazamento é crítico para líquidos
            if (operationType === 'solid' && qId === 'e_waste') return 1.5; // Resíduos críticos para sólidos
            if (operationType === 'passengers' && qId === 's_community') return 1.5; // Interface social forte
            return 1.0;
        };

        const calculateCategoryScore = (questions: Question[]) => {
            let totalWeight = 0;
            let weightedSum = 0;

            questions.forEach(q => {
                const answer = answers[q.id] || 1;
                const m = getMultiplier(q.id);
                weightedSum += answer * (q.weight * m);
                totalWeight += (q.weight * m);
            });

            return totalWeight > 0 ? weightedSum / totalWeight : 1;
        };

        const environmentalScore = calculateCategoryScore(ENVIRONMENTAL_QUESTIONS);
        const socialScore = calculateCategoryScore(SOCIAL_QUESTIONS);
        const governanceScore = calculateCategoryScore(GOVERNANCE_QUESTIONS);

        return {
            environmental: environmentalScore,
            social: socialScore,
            governance: governanceScore,
            global: (environmentalScore + socialScore + governanceScore) / 3
        };
    }, [answers, operationType]);

    const getMaturityInfo = (score: number) => {
        const level = Math.round(score) as keyof typeof MATURITY_LEVELS;
        return MATURITY_LEVELS[level] || MATURITY_LEVELS[1];
    };

    const renderQuestions = (questions: Question[]) => (
        <div className="space-y-8">
            {questions.map(q => {
                // Check for materiality multiplier
                let multiplier = 1;
                if (operationType === 'liquid' && q.id === 'e_spill') multiplier = 2;
                if (operationType === 'solid' && q.id === 'e_waste') multiplier = 1.5;
                if (operationType === 'passengers' && q.id === 's_community') multiplier = 1.5;

                return (
                    <div key={q.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-black dark:text-white uppercase tracking-tight">
                                    {q.question}
                                </span>
                                {multiplier > 1 && (
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 font-bold text-[8px] rounded-lg dark:bg-amber-900/20 flex items-center gap-1 border border-amber-200">
                                        <Anchor size={8} /> Materialidade Setorial ({multiplier}x)
                                    </span>
                                )}
                                {q.weight > 1.5 && multiplier === 1 && (
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 font-bold text-[8px] rounded-lg dark:bg-red-900/20">
                                        Critério Crítico
                                    </span>
                                )}
                            </div>
                            <button className="p-1.5 text-black hover:text-black transition-colors" title="Saiba mais">
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
                                        <span className="text-sm font-bold text-black dark:text-white">{opt.label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {q.evidenceRequired && (
                            <div className="mt-4 p-4 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-black">
                                        <Upload size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            Evidência Documental Obrigatória (Evitar Wash)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => document.getElementById(`upload-${q.id}`)?.click()}
                                        className="text-[10px] font-black text-happiness-1 uppercase hover:underline"
                                    >
                                        {evidences[q.id] ? evidences[q.id]?.name : 'Selecionar Relatório'}
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
                );
            })}
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-black dark:text-white tracking-tighter flex items-center gap-3">
                        Autoavaliação de Maturidade ESG porto (ABNT PR 2030)
                    </h1>
                    <p className="text-black font-medium italic mt-1">
                        Mapeamento de materialidade setorial e conformidade normativa.
                    </p>
                </div>
            </header>

            {/* Operation Selector - Dual Materiality Input */}
            <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-3xl border border-gray-200 dark:border-white/5">
                <p className="text-[10px] font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Anchor size={14} className="text-happiness-1" />
                    Selecione o Tipo de Operação Portuária (Ajuste de Dupla Materialidade)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {OPERATION_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setOperationType(type.id)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${operationType === type.id
                                    ? 'bg-happiness-1 border-happiness-1 text-white shadow-lg scale-[1.02]'
                                    : 'border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'
                                    }`}
                            >
                                <Icon size={20} className={operationType === type.id ? 'text-white' : 'text-happiness-1'} />
                                <span className="text-xs font-black uppercase tracking-tight">{type.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

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
                                    : 'text-black hover:text-black'
                                    }`}
                            >
                                <Leaf size={18} />
                                Ambiental (E)
                            </button>
                            <button
                                onClick={() => setTabIndex(1)}
                                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${tabIndex === 1
                                    ? 'text-happiness-1 border-b-2 border-happiness-1 bg-white dark:bg-[#1C1C1C]'
                                    : 'text-black hover:text-black'
                                    }`}
                            >
                                <Users size={18} />
                                Social (S)
                            </button>
                            <button
                                onClick={() => setTabIndex(2)}
                                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${tabIndex === 2
                                    ? 'text-happiness-1 border-b-2 border-happiness-1 bg-white dark:bg-[#1C1C1C]'
                                    : 'text-black hover:text-black'
                                    }`}
                            >
                                <ShieldCheck size={18} />
                                Governança (G)
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            {tabIndex === 0 && renderQuestions(ENVIRONMENTAL_QUESTIONS)}
                            {tabIndex === 1 && renderQuestions(SOCIAL_QUESTIONS)}
                            {tabIndex === 2 && renderQuestions(GOVERNANCE_QUESTIONS)}
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
                    {tabIndex === 0 && <EnvironmentalSummaryCard answers={answers} />}
                    {tabIndex === 1 && <SocialSummaryCard answers={answers} />}
                    {tabIndex === 2 && <GovernanceSummaryCard answers={answers} />}

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
                                details: { ...l.details, op_type: operationType } || { op_type: operationType },
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

