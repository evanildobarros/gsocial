import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    FormControl,
    FormLabel,
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
    ShieldCheck,
    BarChart3,
    Upload,
    HelpCircle,
    Save,
    Target,
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
import { Map as MapIcon, ChevronRight } from 'lucide-react';
import { Layer } from '../../types';
import { supabase } from '../../utils/supabase';
import { processFile } from '../../utils/geoParser';
import { showSuccess, showError } from '../../utils/notifications';

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
    const [geoLayers, setGeoLayers] = useState<Layer[]>([]);
    const [isUploadingGeo, setIsUploadingGeo] = useState(false);

    const handleAnswerChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: parseInt(value) }));
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setEvidences(prev => ({ ...prev, [id]: file }));
    };

    const handleGeoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingGeo(true);
        try {
            const layers = await processFile(file, {
                pillar: tabIndex === 0 ? 'Environmental' : 'Governance',
                name: `Evidência: ${file.name.split('.')[0]}`,
                group: 'Diagnóstico ESG'
            });

            if (layers.length > 0) {
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
                    group: l.group || 'Diagnóstico ESG',
                    created_by: user?.id || null
                }));

                const { error } = await supabase
                    .from('map_layers')
                    .upsert(layersToInsert);

                if (error) throw error;

                setGeoLayers(prev => [...prev, ...layers]);
                showSuccess(`${layers.length} camada(s) geoespacial(is) adicionada(s) ao banco e ao mapa global.`);
            }
        } catch (err: any) {
            console.error(err);
            showError('Erro ao processar arquivo geográfico: ' + err.message);
        } finally {
            setIsUploadingGeo(false);
        }
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

    // --- Radar Chart Data ---
    const chartData = useMemo(() => {
        const allQuestions = [...ENVIRONMENTAL_QUESTIONS, ...GOVERNANCE_QUESTIONS];
        return allQuestions.map(q => ({
            subject: q.id.startsWith('e_') ? `E: ${q.id.replace('e_', '').toUpperCase()}` : `G: ${q.id.replace('g_', '').toUpperCase()}`,
            current: answers[q.id] || 1,
            target: 5,
            fullMark: 5,
        }));
    }, [answers]);

    const getMaturityInfo = (score: number) => {
        const level = Math.round(score) as keyof typeof MATURITY_LEVELS;
        return MATURITY_LEVELS[level] || MATURITY_LEVELS[1];
    };

    const currentMaturity = getMaturityInfo(scores.global);

    return (
        <Box className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Typography variant="h4" className="font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                        Diagnóstico de Maturidade ESG porto
                    </Typography>
                    <Typography className="text-gray-500 font-medium italic mt-1">
                        Autoavaliação baseada na ABNT PR 2030 (Vol. II) e Materialidade (Vol. III)
                    </Typography>
                </div>
                <div className="bg-happiness-1/10 px-4 py-2 rounded-sm border border-happiness-1/20 flex items-center gap-3">
                    <Target className="text-happiness-1 w-5 h-5" />
                    <div>
                        <p className="text-[10px] font-black text-happiness-1 uppercase tracking-widest leading-none">Status Global</p>
                        <p className={`text-sm font-black ${currentMaturity.color} uppercase mt-1`}>Nível {Math.round(scores.global)} - {currentMaturity.label}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none overflow-hidden">
                        <Box className="bg-gray-50 dark:bg-zinc-900">
                            <Tabs
                                value={tabIndex}
                                onChange={(_, v) => setTabIndex(v)}
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab icon={<Leaf size={18} className="mr-2" />} label="Ambiental (E)" className="font-bold text-xs" />
                                <Tab icon={<ShieldCheck size={18} className="mr-2" />} label="Governança (G)" className="font-bold text-xs" />
                            </Tabs>
                        </Box>

                        <CardContent className="p-8">
                            {tabIndex === 0 && (
                                <Stack spacing={6}>
                                    {ENVIRONMENTAL_QUESTIONS.map(q => (
                                        <div key={q.id} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Typography className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                                                        {q.question}
                                                    </Typography>
                                                    {q.weight > 1 && (
                                                        <Chip
                                                            label="Crítico (2x Peso)"
                                                            size="small"
                                                            className="bg-red-50 text-red-500 font-bold text-[8px] rounded-sm"
                                                        />
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
                                                            className={`p-3 transition-all cursor-pointer rounded-sm hover:border-happiness-1 ${answers[q.id] === opt.value ? 'bg-happiness-1/5 border-happiness-1' : 'bg-transparent border-gray-100 dark:border-white/5'}`}
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
                                </Stack>
                            )}

                            {tabIndex === 1 && (
                                <Stack spacing={6}>
                                    {GOVERNANCE_QUESTIONS.map(q => (
                                        <div key={q.id} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Typography className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                                                        {q.question}
                                                    </Typography>
                                                    {q.weight > 1 && <Chip label="Tópico Crítico" size="small" className="bg-blue-50 text-blue-500 font-bold text-[8px] rounded-sm" />}
                                                </div>
                                                <Tooltip title="Critérios de Governança Corporativa e Ética">
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
                                                            className={`p-3 transition-all cursor-pointer rounded-sm hover:border-happiness-1 ${answers[q.id] === opt.value ? 'bg-happiness-1/5 border-happiness-1' : 'bg-transparent border-gray-100 dark:border-white/5'}`}
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
                                        </div>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>

                        <Box className="p-6 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <Button
                                variant="contained"
                                startIcon={<Save size={18} />}
                                className="bg-happiness-1 text-white font-black text-xs px-8 py-3 rounded-sm uppercase tracking-widest shadow-lg shadow-happiness-1/20 transition-all hover:scale-105"
                            >
                                Salvar Diagnóstico 2026
                            </Button>
                        </Box>
                    </Card>

                    {/* Geospatial Integration Section */}
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none overflow-hidden mt-8">
                        <Box className="p-4 bg-blue-500/5 border-b border-blue-500/10 flex items-center gap-2">
                            <MapIcon className="text-blue-500 w-4 h-4" />
                            <Typography className="text-xs font-black text-blue-500 uppercase tracking-widest">Integração Geoespacial (SHP/KML)</Typography>
                        </Box>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <Typography className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                                        Vincular Evidência Geográfica ao Diagnóstico
                                    </Typography>
                                    <Typography className="text-[10px] text-gray-500 uppercase font-medium leading-relaxed">
                                        Faça upload de Shapefiles (ZIP), KML ou GeoJSON para visualizar as áreas de impacto ambiental ou infraestrutura de governança diretamente no mapa do porto.
                                    </Typography>
                                </div>
                                <div className="shrink-0 flex gap-3">
                                    <input
                                        id="geo-upload-input"
                                        type="file"
                                        className="hidden"
                                        accept=".zip,.kml,.geojson,.json"
                                        onChange={handleGeoUpload}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={isUploadingGeo ? <CircularProgress size={16} /> : <Upload size={16} />}
                                        onClick={() => document.getElementById('geo-upload-input')?.click()}
                                        className="border-blue-200 text-blue-500 font-bold text-xs rounded-sm hover:bg-blue-50"
                                        disabled={isUploadingGeo}
                                    >
                                        UPLOAD SHP/KML
                                    </Button>
                                </div>
                            </div>

                            {geoLayers.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <Typography className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-2">Camadas Vinculadas:</Typography>
                                    {geoLayers.map((layer, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-sm border border-gray-100 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{layer.name}</span>
                                            </div>
                                            <span className="text-[9px] font-black bg-white dark:bg-black/20 px-1.5 py-0.5 rounded border border-gray-100 dark:border-white/10 text-gray-400 uppercase">{layer.type}</span>
                                        </div>
                                    ))}
                                    <Button
                                        className="w-full mt-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest py-3 rounded-sm hover:scale-[1.01] transition-all"
                                        endIcon={<ChevronRight size={14} />}
                                        onClick={() => window.alert('Navegue para o Módulo Mapa ESG (GIS) para visualizar as novas camadas.')}
                                    >
                                        Visualizar no Mapa Global
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Results & Chart Section */}
                <div className="space-y-6 sticky top-24">
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 bg-white dark:bg-[#1C1C1C]">
                        <Typography className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <BarChart3 size={14} className="text-happiness-1" />
                            Performance Preditiva
                        </Typography>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Atual"
                                        dataKey="current"
                                        stroke="#1CA65B"
                                        fill="#1CA65B"
                                        fillOpacity={0.5}
                                    />
                                    <Radar
                                        name="Meta (L5)"
                                        dataKey="target"
                                        stroke="#cbd5e1"
                                        fill="transparent"
                                        strokeDasharray="4 4"
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <Divider className="my-6 opacity-50" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-500">Maturidade Ambiental</span>
                                <span className="font-black text-emerald-500">{scores.environmental.toFixed(1)} / 5.0</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full transition-all duration-500"
                                    style={{ width: `${(scores.environmental / 5) * 100}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center text-xs mt-4">
                                <span className="font-bold text-gray-500">Maturidade Governança</span>
                                <span className="font-black text-blue-500">{scores.governance.toFixed(1)} / 5.0</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-500"
                                    style={{ width: `${(scores.governance / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                    </Card>

                    <Paper className={`p-6 border border-gray-100 dark:border-white/5 rounded-sm shadow-sm ${currentMaturity.bg} transition-colors duration-500`}>
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-sm ${currentMaturity.bg.replace('bg-', 'bg-opacity-20 ')}`}>
                                <AlertCircle className={currentMaturity.color} />
                            </div>
                            <div>
                                <h4 className={`text-xs font-black uppercase tracking-widest ${currentMaturity.color} mb-1`}>
                                    Destaque de Nível: {currentMaturity.label}
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    Sua organização está no estágio <strong>{currentMaturity.label}</strong>.
                                    Para atingir o próximo nível, foque em
                                    {tabIndex === 0 ? " rastreabilidade de dados ambientais" : " auditoria externa dos riscos ESG"}.
                                </p>
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
        </Box>
    );
};

export default ESGDiagnosticForm;
