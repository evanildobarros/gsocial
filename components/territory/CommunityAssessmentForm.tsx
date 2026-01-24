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
    Group as PeopleIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { Plus, Table, ChevronRight, Search, Filter } from 'lucide-react';

import { CommunityAssessment } from '../../types';
import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';
import { LayerUploaderInline } from '../LayerUploaderInline';

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

    // Static Data
    const [dynamicSettlementTypes] = useState<string[]>(SETTLEMENT_TYPES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);


    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await fetchAssessments();
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

    const handleEdit = (assessment: CommunityAssessment) => {
        setEditingId(assessment.id);
        setCommunityName(assessment.community_name);
        setSettlementType(assessment.settlement_type);
        setEstimatedFamilies(assessment.estimated_families);
        setWaterAccess(assessment.water_access);
        setSanitationStatus(assessment.sanitation_status || '');
        setNegativeImpacts(assessment.negative_impacts || []);
        setPriorityNeeds(assessment.priority_needs || []);
        setRelationshipLevel(assessment.relationship_level);
        setViewMode('create');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o diagnóstico da comunidade "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('community_assessments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showSuccess('Diagnóstico excluído com sucesso!');
            await fetchAssessments();
        } catch (err: any) {
            console.error('Delete error:', err);
            showError('Erro ao excluir diagnóstico: ' + err.message);
        }
    };

    const handleSave = async () => {
        if (!communityName) {
            showError('O nome da comunidade é obrigatório.');
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const assessmentData = {
                community_name: communityName,
                settlement_type: settlementType,
                estimated_families: estimatedFamilies === '' ? 0 : estimatedFamilies,
                water_access: waterAccess,
                sanitation_status: sanitationStatus,
                negative_impacts: negativeImpacts,
                priority_needs: priorityNeeds,
                relationship_level: relationshipLevel,
                assessment_date: new Date().toISOString(),
                coordinates: [0, 0],
                geometry: null,
                created_by: user?.id
            };

            if (editingId) {
                const { error: updateError } = await supabase
                    .from('community_assessments')
                    .update(assessmentData)
                    .eq('id', editingId);

                if (updateError) throw updateError;
                showSuccess('Diagnóstico atualizado com sucesso!');
            } else {
                const { error: insertError } = await supabase
                    .from('community_assessments')
                    .insert([assessmentData]);

                if (insertError) throw insertError;
                showSuccess('Diagnóstico salvo com sucesso!');
            }

            resetForm();
            await fetchAssessments();
            setViewMode('list');
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
        setEditingId(null);
    };

    const filteredAssessments = assessments.filter(a =>
        a.community_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.settlement_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && viewMode === 'list') return <Box className="flex flex-col justify-center items-center py-40 gap-4"><CircularProgress /><Typography className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando Inventário...</Typography></Box>;

    return (
        <Box className="w-full p-4 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Typography className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Inventário & Território
                    </Typography>
                    <Typography variant="h4" className="font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                        {viewMode === 'list' ? 'Diagnóstico Social' : 'Novo Diagnóstico Comunidade'}
                    </Typography>
                    <Typography className="text-gray-500 font-medium italic">
                        {viewMode === 'list'
                            ? 'Levantamento socioeconômico das comunidades do entorno e materialidade social.'
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
                            onClick={() => {
                                setViewMode('list');
                                resetForm();
                            }}
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
                                        <div className="flex items-center gap-1">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(assessment);
                                                    }}
                                                    className="text-blue-500 hover:bg-blue-50"
                                                >
                                                    <EditIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(assessment.id, assessment.community_name);
                                                    }}
                                                    className="text-red-500 hover:bg-red-50"
                                                >
                                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    {/* Main Content */}
                    <div className="space-y-6">
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
                                            <TextField
                                                fullWidth
                                                label="Nome da Comunidade"
                                                placeholder="Digite o nome da comunidade..."
                                                value={communityName}
                                                onChange={(e) => setCommunityName(e.target.value)}
                                                className="rounded-sm"
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
                                {saving ? (editingId ? 'ATUALIZANDO...' : 'SALVANDO...') : (editingId ? 'ATUALIZAR DIAGNÓSTICO' : 'SALVAR DIAGNÓSTICO 2026')}
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 sticky top-24 h-fit">
                        {/* Resumo do Diagnóstico */}
                        <Card className="rounded-sm border border-gray-200 dark:border-white/5 shadow-sm p-6 bg-white dark:bg-[#1C1C1C]">
                            <Typography className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <PeopleIcon sx={{ fontSize: 14 }} className="text-orange-500" />
                                Resumo do Diagnóstico
                            </Typography>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-500">Comunidade</span>
                                    <span className="font-black text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{communityName || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-500">Famílias</span>
                                    <span className="font-black text-orange-500">{estimatedFamilies || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-500">Perfil</span>
                                    <span className="font-black text-gray-800 dark:text-gray-200">{settlementType || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-500">Relacionamento</span>
                                    <span className="font-black text-amber-500">{relationshipLevel}/5</span>
                                </div>
                            </div>
                        </Card>

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
                                    group: l.group || 'Diagnóstico Social',
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
            )}
        </Box>
    );
};

export default CommunityAssessmentForm;
