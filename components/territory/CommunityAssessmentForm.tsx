import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Hammer,
    BarChart3,
    Save,
    ArrowLeft,
    Plus,
    RefreshCw,
    Users,
    Edit,
    Trash2,
    Search,
    Filter,
    Table,
    Loader2,
    Check,
    X,
    Star,
    AlertTriangle,
    Info,
    Droplets
} from 'lucide-react';

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

// Helper for Star Rating
const StarRating = ({ value, onChange, readOnly = false }: { value: number; onChange?: (val: number) => void; readOnly?: boolean }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readOnly && onChange?.(star)}
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                    disabled={readOnly}
                >
                    <Star
                        className={`w-${readOnly ? '3' : '6'} h-${readOnly ? '3' : '6'} ${star <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                </button>
            ))}
        </div>
    );
};

// Helper for Multi-Select Chips
const MultiSelectChips = ({ options, selected, onChange, colorClass = "bg-happiness-1/10 text-happiness-1 border-happiness-1/20" }: { options: string[], selected: string[], onChange: (val: string[]) => void, colorClass?: string }) => {
    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {options.map(option => {
                const isSelected = selected.includes(option);
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(option)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${isSelected ? colorClass : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-300 dark:border-white/10 dark:text-gray-400'}`}
                    >
                        {isSelected && <Check className="w-3 h-3" />}
                        {option}
                    </button>
                );
            })}
        </div>
    );
};

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
    const [relationshipLevel, setRelationshipLevel] = useState<number>(3);

    // Static Data
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
        setRelationshipLevel(assessment.relationship_level || 3);
        setViewMode('create');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o diagnóstico da comunidade "${name}"? Todas as camadas de mapa vinculadas também serão removidas.`)) return;

        try {
            await supabase
                .from('map_layers')
                .delete()
                .or(`name.eq.${name},group.eq.${name}`);

            const { error: communityError } = await supabase
                .from('community_assessments')
                .delete()
                .eq('id', id);

            if (communityError) throw communityError;

            showSuccess('Comunidade e camadas vinculadas excluídas com sucesso!');
            await fetchAssessments();
        } catch (err: any) {
            console.error('Delete error:', err);
            showError('Erro ao excluir: ' + err.message);
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

            // Sync metadata
            const detailsToSync = {
                familias: assessmentData.estimated_families,
                tipo: assessmentData.settlement_type,
                relacionamento: assessmentData.relationship_level,
                community_name: communityName,
                demandas: assessmentData.priority_needs.length
            };

            const { data: layersToSync } = await supabase
                .from('map_layers')
                .select('id, details')
                .or(`name.eq."${communityName}",group.eq."${communityName}"`);

            if (layersToSync && layersToSync.length > 0) {
                for (const layer of layersToSync) {
                    const currentDetails = layer.details || {};
                    await supabase
                        .from('map_layers')
                        .update({
                            details: { ...currentDetails, ...detailsToSync }
                        })
                        .eq('id', layer.id);
                }
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

    if (loading && viewMode === 'list') {
        return (
            <div className="flex flex-col justify-center items-center py-40 gap-4">
                <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando Inventário...</p>
            </div>
        );
    }

    return (
        <div className="w-full p-4 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Inventário & Território
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                        {viewMode === 'list' ? 'Diagnóstico Social' : 'Novo Diagnóstico Comunidade'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium italic mt-1">
                        {viewMode === 'list'
                            ? 'Levantamento socioeconômico das comunidades do entorno e materialidade social.'
                            : 'Preencha os campos para registrar o perfil e necessidades da localidade.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    {viewMode === 'list' ? (
                        <>
                            <button
                                onClick={fetchAssessments}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold rounded-3xl text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <RefreshCw size={14} />
                                ATUALIZAR
                            </button>
                            <button
                                onClick={() => setViewMode('create')}
                                className="flex items-center gap-2 bg-happiness-1 text-white px-6 py-2 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-happiness-1/20 transition-all transform hover:scale-[1.02] hover:bg-happiness-1/90"
                            >
                                <Plus size={16} />
                                NOVO DIAGNÓSTICO
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setViewMode('list');
                                resetForm();
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold rounded-3xl text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            VOLTAR À LISTA
                        </button>
                    )}
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">{error}</span>
                </div>
            )}

            {viewMode === 'list' ? (
                <div className="space-y-6">
                    {/* Filter & Search */}
                    <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 p-4 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative flex items-center">
                            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar comunidade por nome ou perfil..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-3xl outline-none focus:border-happiness-1 transition-all text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200">
                                <Filter size={14} /> Filtros
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200">
                                <Table size={14} /> Exportar CSV
                            </button>
                        </div>
                    </div>

                    {/* Records List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAssessments.map((assessment) => (
                            <div key={assessment.id} className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm hover:border-happiness-1 transition-all group overflow-hidden">
                                <div className="h-1.5 bg-gradient-to-r from-happiness-1 to-happiness-3 w-full" />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight group-hover:text-happiness-1 transition-colors">
                                                {assessment.community_name}
                                            </h3>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 block">
                                                {assessment.settlement_type}
                                            </span>
                                        </div>
                                        <div className="p-2 bg-happiness-1/10 rounded-2xl">
                                            <MapPin className="text-happiness-1 w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <Users size={14} className="text-gray-300" />
                                            <span>{assessment.estimated_families} Famílias</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <Droplets size={14} className="text-gray-300" />
                                            <span>Água: {assessment.water_access}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <BarChart3 size={14} className="text-gray-300" />
                                            <span>{assessment.priority_needs?.length || 0} Demandas Prioritárias</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-white/5">
                                        <div className="flex items-center gap-1">
                                            <StarRating value={assessment.relationship_level} readOnly />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(assessment);
                                                }}
                                                className="p-2 text-happiness-1 hover:bg-happiness-1/10 dark:hover:bg-happiness-1/10 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(assessment.id, assessment.community_name);
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredAssessments.length === 0 && (
                            <div className="col-span-full py-20 text-center flex flex-col items-center opacity-30">
                                <Users className="w-16 h-16 mb-4 text-gray-400" />
                                <p className="font-black uppercase tracking-[0.2em] text-sm text-gray-500">Nenhum diagnóstico registrado</p>
                                <button onClick={() => setViewMode('create')} className="mt-4 text-happiness-1 font-bold lowercase hover:underline">
                                    Clique aqui para criar o primeiro
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* 📍 Identidade Territorial */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                    <MapPin className="text-happiness-1 w-5 h-5" />
                                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">📍 Identidade Territorial</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome da Comunidade</label>
                                            <input
                                                type="text"
                                                placeholder="Digite o nome da comunidade..."
                                                value={communityName}
                                                onChange={(e) => setCommunityName(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-happiness-1/20 focus:border-happiness-1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nº Estimado de Famílias</label>
                                            <input
                                                type="number"
                                                value={estimatedFamilies}
                                                onChange={(e) => setEstimatedFamilies(e.target.value === '' ? '' : Number(e.target.value))}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-happiness-1/20 focus:border-happiness-1"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Perfil do Povoado</p>
                                            <div className="flex flex-wrap gap-2">
                                                {SETTLEMENT_TYPES.map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setSettlementType(type)}
                                                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${settlementType === type
                                                            ? 'bg-happiness-1 text-white shadow-lg shadow-happiness-1/20'
                                                            : 'bg-transparent border border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🏗️ Infraestrutura Crítica (Vol. I) */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                    <Hammer className="text-happiness-1 w-5 h-5" />
                                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">🏗️ Infraestrutura Crítica (Vol. I)</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Abastecimento de Água</p>
                                        <div className="space-y-2">
                                            {WATER_ACCESS_OPTIONS.map(opt => (
                                                <label key={opt} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${waterAccess === opt ? 'border-happiness-1' : 'border-gray-300 dark:border-white/20'}`}>
                                                        {waterAccess === opt && <div className="w-2.5 h-2.5 bg-happiness-1 rounded-full" />}
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="waterAccess"
                                                        value={opt}
                                                        checked={waterAccess === opt}
                                                        onChange={(e) => setWaterAccess(e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Esgotamento Sanitário</p>
                                        <div className="space-y-2">
                                            {SANITATION_OPTIONS.map(opt => (
                                                <label key={opt} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sanitationStatus === opt ? 'border-happiness-1' : 'border-gray-300 dark:border-white/20'}`}>
                                                        {sanitationStatus === opt && <div className="w-2.5 h-2.5 bg-happiness-1 rounded-full" />}
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="sanitationStatus"
                                                        value={opt}
                                                        checked={sanitationStatus === opt}
                                                        onChange={(e) => setSanitationStatus(e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 📊 Materialidade & Impactos (Vol. III) */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                    <BarChart3 className="text-amber-500 w-5 h-5" />
                                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">📊 Materialidade & Impactos (Vol. III)</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 block">Impactos Percebidos do Porto</label>
                                        <MultiSelectChips
                                            options={NEGATIVE_IMPACTS_OPTIONS}
                                            selected={negativeImpacts}
                                            onChange={setNegativeImpacts}
                                            colorClass="bg-red-50 text-red-600 border-red-200"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 block">Demandas Prioritárias da Liderança</label>
                                        <MultiSelectChips
                                            options={PRIORITY_NEEDS_OPTIONS}
                                            selected={priorityNeeds}
                                            onChange={setPriorityNeeds}
                                            colorClass="bg-happiness-1/10 text-happiness-1 border-happiness-1/20"
                                        />
                                    </div>

                                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nível de Relacionamento Empreendedor (EMAP)</p>
                                        <div className="flex items-center gap-4">
                                            <StarRating
                                                value={relationshipLevel}
                                                onChange={setRelationshipLevel}
                                            />
                                            <span className="text-sm font-bold text-gray-500">
                                                {relationshipLevel === 1 && 'Crítico'}
                                                {relationshipLevel === 2 && 'Fraco'}
                                                {relationshipLevel === 3 && 'Moderado'}
                                                {relationshipLevel === 4 && 'Bom'}
                                                {relationshipLevel === 5 && 'Exclente / Parceria'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 pb-12">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-happiness-1 hover:bg-happiness-1/90 text-white px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-happiness-1/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {saving ? (editingId ? 'ATUALIZANDO...' : 'SALVANDO...') : (editingId ? 'ATUALIZAR DIAGNÓSTICO' : 'SALVAR DIAGNÓSTICO 2026')}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 sticky top-24 h-fit">
                        {/* Resumo do Diagnóstico */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm p-6">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-orange-500" />
                                Resumo do Diagnóstico
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-500">Comunidade</span>
                                    <span className="font-black text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{communityName || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-500">Famílias</span>
                                    <span className="font-black text-happiness-1">{estimatedFamilies || 0}</span>
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
                        </div>

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
                                    details: {
                                        ...l.details,
                                        community_name: communityName,
                                        sync_id: editingId,
                                        familias: estimatedFamilies === '' ? 0 : estimatedFamilies,
                                        tipo: settlementType,
                                        relacionamento: relationshipLevel,
                                        demandas: priorityNeeds?.length || 0
                                    },
                                    pillar: l.pillar,
                                    group: communityName || l.group || 'Diagnóstico Social',
                                    created_by: user?.id || null
                                }));
                                const { error } = await supabase.from('map_layers').upsert(layersToInsert);
                                if (error) throw error;
                                showSuccess(`${layers.length} camada(s) geoespacial(is) vinculada(s) à comunidade "${communityName}".`);
                            } catch (err: any) {
                                showError('Erro ao salvar camadas: ' + err.message);
                            }
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityAssessmentForm;
