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
    Target,
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
import { Map as MapIcon } from 'lucide-react';
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
                pillar: 'Environmental',
                name: `Evidência Ambiental: ${file.name.split('.')[0]}`,
                group: 'Diagnóstico Ambiental'
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
                    group: l.group || 'Diagnóstico Ambiental',
                    created_by: user?.id || null
                }));

                const { error } = await supabase
                    .from('map_layers')
                    .upsert(layersToInsert);

                if (error) throw error;

                setGeoLayers(prev => [...prev, ...layers]);
                showSuccess(`${layers.length} camada(s) geoespacial(is) adicionada(s) ao banco e ao mapa.`);
            }
        } catch (err: any) {
            showError('Erro ao processar arquivo: ' + err.message);
        } finally {
            setIsUploadingGeo(false);
        }
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
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-sm border border-emerald-200 dark:border-emerald-900/30 flex items-center gap-3">
                    <Target className="text-emerald-500 w-5 h-5" />
                    <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Maturidade E</p>
                        <p className={`text-sm font-black ${currentMaturity.color} uppercase mt-1`}>Nível {Math.round(score)} - {currentMaturity.label}</p>
                    </div>
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

                    {/* Geospatial Upload */}
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none overflow-hidden">
                        <Box className="p-4 bg-blue-500/5 border-b border-blue-500/10 flex items-center gap-2">
                            <MapIcon className="text-blue-500 w-4 h-4" />
                            <Typography className="text-xs font-black text-blue-500 uppercase tracking-widest">Evidência Geoespacial (SHP/KML)</Typography>
                        </Box>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <Typography className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                                        Vincular Área de Impacto Ambiental
                                    </Typography>
                                    <Typography className="text-[10px] text-gray-500 uppercase font-medium">
                                        Faça upload de Shapefiles (ZIP), KML ou GeoJSON para visualizar áreas no mapa do porto.
                                    </Typography>
                                </div>
                                <div className="shrink-0">
                                    <input id="geo-upload-env" type="file" className="hidden" accept=".zip,.kml,.geojson,.json" onChange={handleGeoUpload} />
                                    <Button
                                        variant="outlined"
                                        startIcon={isUploadingGeo ? <CircularProgress size={16} /> : <Upload size={16} />}
                                        onClick={() => document.getElementById('geo-upload-env')?.click()}
                                        className="border-blue-200 text-blue-500 font-bold text-xs rounded-sm"
                                        disabled={isUploadingGeo}
                                    >
                                        UPLOAD SHP/KML
                                    </Button>
                                </div>
                            </div>
                            {geoLayers.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    {geoLayers.map((layer, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-sm border border-gray-100 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{layer.name}</span>
                                            </div>
                                            <span className="text-[9px] font-black bg-white dark:bg-black/20 px-1.5 py-0.5 rounded border border-gray-100 dark:border-white/10 text-gray-400 uppercase">{layer.type}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 sticky top-24">
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 bg-white dark:bg-[#1C1C1C]">
                        <Typography className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <BarChart3 size={14} className="text-emerald-500" />
                            Performance Ambiental
                        </Typography>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                    <Radar name="Atual" dataKey="current" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
                                    <Radar name="Meta (L5)" dataKey="target" stroke="#cbd5e1" fill="transparent" strokeDasharray="4 4" />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <Divider className="my-6 opacity-50" />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-500">Pontuação</span>
                                <span className="font-black text-emerald-500">{score.toFixed(1)} / 5.0</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(score / 5) * 100}%` }} />
                            </div>
                        </div>
                    </Card>

                    <Paper className={`p-6 border border-gray-100 dark:border-white/5 rounded-sm shadow-sm ${currentMaturity.bg}`}>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-sm bg-white/50">
                                <AlertCircle className={currentMaturity.color} />
                            </div>
                            <div>
                                <h4 className={`text-xs font-black uppercase tracking-widest ${currentMaturity.color} mb-1`}>
                                    Nível: {currentMaturity.label}
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {currentMaturity.desc}. Foque em rastreabilidade de dados ambientais para evoluir.
                                </p>
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
        </Box>
    );
};

export default EnvironmentalDiagnosticForm;
