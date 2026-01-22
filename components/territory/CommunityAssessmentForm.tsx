import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Autocomplete,
    Chip,
    Rating,
    Button,
    Stack,
    Alert,
    CircularProgress,
    FormLabel,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Construction as InfrastructureIcon,
    BarChart as ImpactIcon,
    Save as SaveIcon,
    ArrowBack as BackIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Map as MapIcon,
    Group as PeopleIcon
} from '@mui/icons-material';
import { Plus, Table, ChevronRight, Search, Filter, CheckCircle2, Trash2 } from 'lucide-react';
import { parseKmlToLayers } from '../../utils/geoUtils';
import { Layer, CommunityAssessment } from '../../types';
import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';

interface CommunityAssessmentFormProps {
    onSave?: (data: any) => void;
}

const SETTLEMENT_TYPES = ["Urbano", "Rural", "Ribeirinho", "Quilombola"];
const WATER_ACCESS_OPTIONS = ["Rede CAEMA", "Poço Artesiano", "Carro Pipa", "Precário"];
const SANITATION_OPTIONS = ["Rede Coletora", "Fossa Séptica", "Esgoto a Céu Aberto"];
const NEGATIVE_IMPACTS_OPTIONS = ["Poeira/Particulados", "Ruído Noturno", "Tráfego de Caminhões", "Odor Forte", "Resíduos na Praia"];
const PRIORITY_NEEDS_OPTIONS = ["Empregabilidade", "Cursos Profissionalizantes", "Reforma de Equipamentos Públicos", "Acesso à Internet", "Segurança Alimentar"];

const CommunityAssessmentForm: React.FC<CommunityAssessmentFormProps> = ({ onSave }) => {
    // Mode State
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');

    // List State
    const [assessments, setAssessments] = useState<CommunityAssessment[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [communityName, setCommunityName] = useState('');
    const [settlementType, setSettlementType] = useState<string>('');
    const [estimatedFamilies, setEstimatedFamilies] = useState<number | ''>('');
    const [waterAccess, setWaterAccess] = useState('');
    const [sanitationStatus, setSanitationStatus] = useState('');
    const [negativeImpacts, setNegativeImpacts] = useState<string[]>([]);
    const [priorityNeeds, setPriorityNeeds] = useState<string[]>([]);
    const [relationshipLevel, setRelationshipLevel] = useState<number | null>(3);

    // KML Data State
    const [availableCommunities, setAvailableCommunities] = useState<Layer[]>([]);
    const [dynamicSettlementTypes, setDynamicSettlementTypes] = useState<string[]>(SETTLEMENT_TYPES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Geospatial Upload State
    const [uploadedGeometry, setUploadedGeometry] = useState<Layer | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await Promise.all([loadKmlData(), fetchAssessments()]);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Import geoParser utilities
    const handleFileUpload = async (file: File) => {
        try {
            const { processFile } = await import('../../utils/geoParser');
            const layers = await processFile(file, {
                pillar: 'Social',
                name: communityName || file.name.replace(/\.[^/.]+$/, "")
            });

            if (layers.length > 0) {
                setUploadedGeometry(layers[0]);
                if (!communityName) setCommunityName(layers[0].name);
                showSuccess(`${layers.length} geometria(s) carregada(s) com sucesso.`);
            }
        } catch (err: any) {
            console.error('File Upload Error:', err);
            showError('Erro ao processar arquivo geoespacial: ' + err.message);
        }
    };

    const fetchAssessments = async () => {
        try {
            const { data, error } = await supabase
                .from('community_assessments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setAssessments(data as CommunityAssessment[]);
        } catch (err: any) {
            console.error('Error fetching assessments:', err);
            showError('Erro ao carregar lista de diagnósticos.');
        }
    };

    const loadKmlData = async () => {
        try {
            const response = await fetch('/Mapeamento da Poligonal do Porto do Itaqui.kml');
            if (!response.ok) throw new Error('Falha ao carregar dados geográficos (KML).');
            const kmlText = await response.text();

            const layers = parseKmlToLayers(kmlText);
            setAvailableCommunities(layers);

            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
            const dataNodes = kmlDoc.querySelectorAll('Data[name="Tipo_Povoa"] value');
            const extractedTypes = Array.from(new Set(Array.from(dataNodes).map(node => node.textContent || '').filter(Boolean)));

            if (extractedTypes.length > 0) {
                setDynamicSettlementTypes(extractedTypes);
            }
        } catch (err: any) {
            console.error('KML Load Error:', err);
        }
    };

    const calculateCentroid = (layer: Layer) => {
        if (layer.type === 'MARKER') {
            return [layer.data.lng, layer.data.lat];
        } else if (layer.type === 'POLYGON' && Array.isArray(layer.data)) {
            const coords = layer.data;
            const lat = coords.reduce((acc: number, curr: any) => acc + curr.lat, 0) / coords.length;
            const lng = coords.reduce((acc: number, curr: any) => acc + curr.lng, 0) / coords.length;
            return [lng, lat];
        }
        return [0, 0];
    };

    const handleSave = async () => {
        if (!communityName) {
            showError('O nome da comunidade é obrigatório.');
            return;
        }

        setSaving(true);
        try {
            // Se houver geometria uploadada, ela tem prioridade. Senão busca no KML fixo.
            const sourceLayer = uploadedGeometry || availableCommunities.find(l => l.name === communityName);
            const coordinates = sourceLayer ? calculateCentroid(sourceLayer) : [0, 0];

            const { data: { user } } = await supabase.auth.getUser();

            const newAssessment = {
                community_name: communityName,
                settlement_type: settlementType,
                estimated_families: estimatedFamilies === '' ? 0 : estimatedFamilies,
                water_access: waterAccess,
                sanitation_status: sanitationStatus,
                negative_impacts: negativeImpacts,
                priority_needs: priorityNeeds,
                relationship_level: relationshipLevel,
                assessment_date: new Date().toISOString(),
                coordinates: coordinates,
                geometry: sourceLayer ? { type: sourceLayer.type, data: sourceLayer.data } : null,
                created_by: user?.id
            };

            const { error: insertError } = await supabase
                .from('community_assessments')
                .insert([newAssessment]);

            if (insertError) throw insertError;

            showSuccess('Diagnóstico salvo com sucesso!');
            resetForm();
            await fetchAssessments();
            setViewMode('list');
            if (onSave) onSave(newAssessment);
        } catch (err: any) {
            console.error('Save error:', err);
            showError('Erro ao salvar diagnóstico: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setCommunityName('');
        setSettlementType('');
        setEstimatedFamilies('');
        setWaterAccess('');
        setSanitationStatus('');
        setNegativeImpacts([]);
        setPriorityNeeds([]);
        setRelationshipLevel(3);
        setUploadedGeometry(null);
    };

    const filteredAssessments = assessments.filter(a =>
        a.community_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.settlement_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && viewMode === 'list') return <Box className="flex flex-col justify-center items-center py-40 gap-4"><CircularProgress /><Typography className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando Inventário...</Typography></Box>;

    return (
        <Box className="max-w-6xl mx-auto p-4 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Typography variant="h4" className="font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                        {viewMode === 'list' ? 'Inventário Socioeconômico' : 'Novo Diagnóstico Comunidade'}
                    </Typography>
                    <Typography className="text-gray-500 font-medium italic">
                        {viewMode === 'list'
                            ? 'Gestão de materialidade e dados territoriais das comunidades do entorno.'
                            : 'Preencha os campos para registrar o perfil e necessidades da localidade.'}
                    </Typography>
                </div>
                <div className="flex gap-3">
                    {viewMode === 'list' ? (
                        <>
                            <Button
                                variant="outlined"
                                onClick={fetchAssessments}
                                startIcon={<RefreshIcon />}
                                className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold rounded-sm text-xs px-4"
                            >
                                ATUALIZAR
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setViewMode('create')}
                                className="bg-happiness-1 text-white px-6 py-2 rounded-sm font-black text-xs uppercase tracking-widest shadow-lg shadow-happiness-1/20 transition-all transform hover:scale-[1.02]"
                                startIcon={<Plus size={16} />}
                            >
                                NOVO DIAGNÓSTICO
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={() => setViewMode('list')}
                            startIcon={<BackIcon />}
                            className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold rounded-sm text-xs px-4"
                        >
                            VOLTAR À LISTA
                        </Button>
                    )}
                </div>
            </header>

            {error && <Alert severity="error" className="rounded-sm border-l-4 border-l-red-500">{error}</Alert>}

            {viewMode === 'list' ? (
                <Stack spacing={4}>
                    {/* Filter & Search */}
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative flex items-center">
                                <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar comunidade por nome ou perfil..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-sm outline-none focus:border-happiness-1 transition-all text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button startIcon={<Filter size={14} />} className="text-gray-400 font-bold text-xs uppercase tracking-widest">Filtros</Button>
                                <Button startIcon={<Table size={14} />} className="text-gray-400 font-bold text-xs uppercase tracking-widest">Exportar CSV</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Records List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAssessments.map((assessment) => (
                            <Card key={assessment.id} className="rounded-sm border border-gray-200 dark:border-white/5 shadow-sm hover:border-happiness-1 transition-all group cursor-pointer overflow-hidden bg-white dark:bg-[#1C1C1C]">
                                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 w-full" />
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Typography variant="h6" className="font-black text-gray-900 dark:text-white tracking-tight group-hover:text-happiness-1 transition-colors">{assessment.community_name}</Typography>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 block">{assessment.settlement_type}</span>
                                        </div>
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-sm">
                                            <LocationIcon className="text-blue-500 w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <PeopleIcon sx={{ fontSize: 14 }} className="text-gray-300" />
                                            <span>{assessment.estimated_families} Famílias</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <InfrastructureIcon sx={{ fontSize: 14 }} className="text-gray-300" />
                                            <span>Água: {assessment.water_access}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <ImpactIcon sx={{ fontSize: 14 }} className="text-gray-300" />
                                            <span>{assessment.priority_needs?.length || 0} Demandas Prioritárias</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-white/5">
                                        <div className="flex items-center gap-1">
                                            <Rating value={assessment.relationship_level} size="small" readOnly />
                                        </div>
                                        <Button size="small" className="text-happiness-1 font-bold text-[10px] uppercase tracking-widest">Detalhes <ChevronRight size={14} /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredAssessments.length === 0 && (
                            <div className="col-span-full py-20 text-center flex flex-col items-center opacity-30">
                                <PeopleIcon sx={{ fontSize: 64, mb: 2 }} />
                                <Typography className="font-black uppercase tracking-[0.2em] text-sm">Nenhum diagnóstico registrado</Typography>
                                <Button onClick={() => setViewMode('create')} className="mt-4 text-happiness-1 font-bold lowercase">Clique aqui para criar o primeiro</Button>
                            </div>
                        )}
                    </div>
                </Stack>
            ) : (
                <Stack spacing={4}>
                    {/* 📍 Identidade Territorial */}
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none overflow-visible">
                        <CardContent className="p-8">
                            <Box className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                <LocationIcon className="text-blue-500" />
                                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">📍 Identidade Territorial</Typography>
                            </Box>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <Autocomplete
                                            freeSolo
                                            options={availableCommunities.map((option) => option.name)}
                                            value={communityName}
                                            onChange={(_, newValue) => setCommunityName(newValue || '')}
                                            onInputChange={(_, newInputValue) => setCommunityName(newInputValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Nome da Comunidade"
                                                    placeholder="Selecione ou digite o nome..."
                                                    className="rounded-sm"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Nº Estimado de Famílias"
                                            value={estimatedFamilies}
                                            onChange={(e) => setEstimatedFamilies(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="rounded-sm"
                                        />
                                    </div>
                                    <div>
                                        <Typography className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Perfil do Povoado</Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {dynamicSettlementTypes.map((type) => (
                                                <Chip
                                                    key={type}
                                                    label={type}
                                                    clickable
                                                    onClick={() => setSettlementType(type)}
                                                    className={`rounded-sm transition-all font-bold ${settlementType === type
                                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'hover:bg-gray-100 dark:hover:bg-white/5'
                                                        }`}
                                                    variant={settlementType === type ? "filled" : "outlined"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 🌐 Geospatial Upload Zone */}
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Geometria do Território (KML/SHP/GEOJSON)</label>

                                    {!uploadedGeometry ? (
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                                const file = e.dataTransfer.files?.[0];
                                                if (file) handleFileUpload(file);
                                            }}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`
                                                flex-1 min-h-[180px] border-2 border-dashed rounded-sm transition-all flex flex-col items-center justify-center gap-3 cursor-pointer
                                                ${isDragging ? 'border-happiness-1 bg-happiness-1/5' : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-happiness-1/50'}
                                            `}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file);
                                                }}
                                                accept=".kml,.geojson,.json,.zip"
                                            />
                                            <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm border border-gray-100 dark:border-white/10">
                                                <MapIcon className="text-gray-400 w-6 h-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Arraste o shape ou clique aqui</p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase">KML, GeoJSON ou Shapefile (ZIP)</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 min-h-[180px] bg-blue-500/5 border border-blue-500/20 rounded-sm p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                                                <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <Typography className="text-sm font-black text-gray-800 dark:text-gray-200 mb-1">{uploadedGeometry.name}</Typography>
                                            <Typography className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4">Formato: {uploadedGeometry.type}</Typography>

                                            <Button
                                                size="small"
                                                onClick={() => setUploadedGeometry(null)}
                                                className="text-red-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-zinc-800 hover:bg-red-50"
                                                startIcon={<Trash2 size={12} />}
                                            >
                                                Remover Geometria
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 🏗️ Infraestrutura Crítica (Vol. I) */}
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none">
                        <CardContent className="p-8">
                            <Box className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                <InfrastructureIcon className="text-emerald-500" />
                                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">🏗️ Infraestrutura Crítica (Vol. I)</Typography>
                            </Box>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Abastecimento de Água</FormLabel>
                                    <RadioGroup
                                        value={waterAccess}
                                        onChange={(e) => setWaterAccess(e.target.value)}
                                        className="space-y-1"
                                    >
                                        {WATER_ACCESS_OPTIONS.map(opt => (
                                            <FormControlLabel
                                                key={opt}
                                                value={opt}
                                                control={<Radio size="small" />}
                                                label={<Typography className="text-sm font-medium">{opt}</Typography>}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>

                                <FormControl component="fieldset">
                                    <FormLabel component="legend" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Esgotamento Sanitário</FormLabel>
                                    <RadioGroup
                                        value={sanitationStatus}
                                        onChange={(e) => setSanitationStatus(e.target.value)}
                                        className="space-y-1"
                                    >
                                        {SANITATION_OPTIONS.map(opt => (
                                            <FormControlLabel
                                                key={opt}
                                                value={opt}
                                                control={<Radio size="small" />}
                                                label={<Typography className="text-sm font-medium">{opt}</Typography>}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 📊 Materialidade & Impactos (Vol. III) */}
                    <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-none overflow-visible">
                        <CardContent className="p-8">
                            <Box className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                <ImpactIcon className="text-amber-500" />
                                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">📊 Materialidade & Impactos (Vol. III)</Typography>
                            </Box>

                            <div className="space-y-8">
                                <Autocomplete
                                    multiple
                                    options={NEGATIVE_IMPACTS_OPTIONS}
                                    value={negativeImpacts}
                                    onChange={(_, newValue) => setNegativeImpacts(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Impactos Percebidos do Porto" placeholder="Selecione os impactos..." className="rounded-sm" />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (
                                                <Chip
                                                    key={key}
                                                    label={option}
                                                    {...tagProps}
                                                    className="rounded-sm font-bold bg-red-50 text-red-600 border border-red-100"
                                                    size="small"
                                                />
                                            );
                                        })
                                    }
                                />

                                <Autocomplete
                                    multiple
                                    options={PRIORITY_NEEDS_OPTIONS}
                                    value={priorityNeeds}
                                    onChange={(_, newValue) => setPriorityNeeds(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Demandas Prioritárias da Liderança" placeholder="Selecione as demandas..." className="rounded-sm" />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (
                                                <Chip
                                                    key={key}
                                                    label={option}
                                                    {...tagProps}
                                                    className="rounded-sm font-bold bg-green-50 text-green-600 border border-green-100"
                                                    size="small"
                                                />
                                            );
                                        })
                                    }
                                />

                                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-sm border border-gray-100 dark:border-white/10">
                                    <Typography className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nível de Relacionamento Empreendedor (EMAP)</Typography>
                                    <div className="flex items-center gap-4">
                                        <Rating
                                            size="large"
                                            value={relationshipLevel}
                                            onChange={(_, newValue) => setRelationshipLevel(newValue)}
                                            className="text-amber-500"
                                        />
                                        <Typography className="text-sm font-bold text-gray-500">
                                            {relationshipLevel === 1 && 'Crítico'}
                                            {relationshipLevel === 2 && 'Fraco'}
                                            {relationshipLevel === 3 && 'Moderado'}
                                            {relationshipLevel === 4 && 'Bom'}
                                            {relationshipLevel === 5 && 'Exclente / Parceria'}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4 pb-12">
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-happiness-1 hover:bg-happiness-1/90 text-white px-10 py-4 rounded-sm font-black text-sm uppercase tracking-widest shadow-xl shadow-happiness-1/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        >
                            {saving ? 'SALVANDO...' : 'SALVAR DIAGNÓSTICO 2026'}
                        </Button>
                    </div>
                </Stack>
            )}
        </Box>
    );
};

export default CommunityAssessmentForm;
