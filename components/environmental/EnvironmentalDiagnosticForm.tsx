import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Stack,
    Divider,
    Paper,
    Tooltip,
    IconButton,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    Leaf,
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
import { EnvironmentalSummaryCard } from './EnvironmentalSummaryCard';

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

    const handleAnswerChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: parseInt(value) }));
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

    const chartData = useMemo(() => {
        return ENVIRONMENTAL_QUESTIONS.map(q => ({
            subject: q.id.replace('e_', '').toUpperCase(),
            current: answers[q.id] || 1,
            target: 5,
            fullMark: 5,
        }));
    }, [answers]);

    const getMaturityInfo = (s: number) => {
        const level = Math.round(s) as keyof typeof MATURITY_LEVELS;
        return MATURITY_LEVELS[level] || MATURITY_LEVELS[1];
    };

    const currentMaturity = getMaturityInfo(score);

    return (
        <Box className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Typography className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        ABNT PR 2030 (E)
                    </Typography>
                    <Typography variant="h4" className="font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                        <Leaf className="w-10 h-10 text-emerald-500" />
                        Diagnóstico Ambiental
                    </Typography>
                    <Typography className="text-gray-500 font-medium italic mt-1">
                        Avaliação de maturidade em GEE, Resíduos e Eficiência baseada na Norma 2030.
                    </Typography>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none overflow-hidden">
                        <Box className="p-4 bg-emerald-500/5 border-b border-emerald-500/10">
                            <Typography className="text-xs font-black text-emerald-600 uppercase tracking-widest">Questionário Ambiental</Typography>
                        </Box>
                        <CardContent className="p-8">
                            <Stack spacing={6}>
                                {ENVIRONMENTAL_QUESTIONS.map(q => (
                                    <div key={q.id} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Typography className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                                                    {q.question}
                                                </Typography>
                                                {q.weight > 1 && (
                                                    <Chip label="Crítico" size="small" className="bg-red-50 text-red-500 font-bold text-[8px] rounded-sm" />
                                                )}
                                            </div>
                                            <Tooltip title="Saiba mais sobre este requisito ABNT PR 2030">
                                                <IconButton size="small"><HelpCircle size={14} /></IconButton>
                                            </Tooltip>
                                        </div>

                                        <FormControl component="fieldset" className="w-full">
                                            <RadioGroup
                                                value={answers[q.id]?.toString() || "1"}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                className="grid grid-cols-1 gap-2"
                                            >
                                                {q.options.map(opt => (
                                                    <Paper
                                                        key={opt.value}
                                                        variant="outlined"
                                                        className={`p-3 transition-all cursor-pointer rounded-sm hover:border-emerald-500 ${answers[q.id] === opt.value ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500' : 'bg-transparent border-gray-100 dark:border-white/5'}`}
                                                        onClick={() => handleAnswerChange(q.id, opt.value.toString())}
                                                    >
                                                        <FormControlLabel
                                                            value={opt.value.toString()}
                                                            control={<Radio size="small" />}
                                                            label={<Typography className="text-sm font-medium">{opt.label}</Typography>}
                                                        />
                                                    </Paper>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>

                                        {q.evidenceRequired && (
                                            <div className="mt-4 p-4 rounded-sm border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Upload size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Evidência Obrigatória</span>
                                                    </div>
                                                    <button
                                                        onClick={() => document.getElementById(`upload-${q.id}`)?.click()}
                                                        className="text-[10px] font-black text-emerald-600 uppercase hover:underline"
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
                            </Stack>
                        </CardContent>

                        <Box className="p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <Button
                                variant="contained"
                                startIcon={<Save size={18} />}
                                className="bg-emerald-500 text-white font-black text-xs px-8 py-3 rounded-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                            >
                                Salvar Diagnóstico Ambiental
                            </Button>
                        </Box>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 sticky top-24">
                    <EnvironmentalSummaryCard answers={answers} />

                    {/* Geospatial Upload - Bloco Inline ESG */}
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
                            showSuccess(`${layers.length} camada(s) geoespacial(is) adicionada(s) ao banco e ao mapa.`);
                        } catch (err: any) {
                            showError('Erro ao salvar camadas: ' + err.message);
                        }
                    }} />
                </div>
            </div>
        </Box>
    );
};

export default EnvironmentalDiagnosticForm;
