import React, { useState, useMemo } from 'react';
import {
    Leaf,
    HelpCircle,
    Save,
    Upload,
    Info,
    ChevronRight,
    CheckCircle,
    AlertCircle
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
import { EnvironmentalSummaryCard } from './EnvironmentalSummaryCard';

// --- Types & Config ---
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

export const EnvironmentalDiagnosticForm: React.FC = () => {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [evidences, setEvidences] = useState<Record<string, File | null>>({});

    const handleAnswerChange = (id: string, value: number) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setEvidences(prev => ({ ...prev, [id]: file }));
    };

    const score = useMemo(() => {
        let totalWeight = 0;
        let weightedSum = 0;
        ENVIRONMENTAL_QUESTIONS.forEach(q => {
            const answer = answers[q.id] || 1;
            weightedSum += answer * q.weight;
            totalWeight += q.weight;
        });
        return totalWeight > 0 ? weightedSum / totalWeight : 1;
    }, [answers]);

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <p className="text-xs font-black text-green-600 uppercase tracking-widest">
                        ABNT PR 2030 (E)
                    </p>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        Diagnóstico Ambiental
                    </h1>
                    <p className="text-sm text-gray-500 italic">
                        Avaliação de maturidade em GEE, Resíduos e Eficiência baseada na Norma 2030.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 bg-green-50/50 dark:bg-green-900/10 border-b border-gray-100 dark:border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-green-600 uppercase tracking-widest">
                                    Questionário de Sustentabilidade
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Conformidade PR 2030
                                </span>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="p-8 space-y-10">
                            {ENVIRONMENTAL_QUESTIONS.map(q => (
                                <div key={q.id} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-black text-gray-900 dark:text-white">
                                                {q.question}
                                            </h3>
                                            {q.weight > 1.5 && (
                                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 text-[8px] font-black uppercase rounded-lg">
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
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:border-green-400 ${answers[q.id] === opt.value
                                                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-500'
                                                        : 'bg-transparent border-gray-100 dark:border-white/5'
                                                    }`}
                                            >
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers[q.id] === opt.value
                                                            ? 'border-green-500 bg-green-500'
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
                                                        <Upload className="w-4 h-4 text-green-600" />
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
                                                    className="text-xs font-black text-green-600 uppercase hover:underline"
                                                >
                                                    {evidences[q.id] ? 'Trocar Arquivo' : 'Selecionar'}
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

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-green-600/20 transition-all hover:scale-105 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Salvar Diagnóstico Ambiental
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 lg:sticky lg:top-24">
                    <EnvironmentalSummaryCard answers={answers} />

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <Info className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">
                                GEOPROCESSAMENTO
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Faça o upload de arquivos KML/Shapefile para visualização de camadas ambientais no Mapa ESGporto.
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
                                    group: l.group || 'Diagnóstico Ambiental',
                                    created_by: user?.id || null
                                }));
                                const { error } = await supabase.from('map_layers').upsert(layersToInsert);
                                if (error) throw error;
                                showSuccess(`${layers.length} camada(s) geoespacial(is) adicionada(s).`);
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

export default EnvironmentalDiagnosticForm;
