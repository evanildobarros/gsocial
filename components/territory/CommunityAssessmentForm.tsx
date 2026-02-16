import React, { useState, useEffect, useMemo } from 'react';
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
    Droplets,
    ShieldAlert,
    FileCheck,
    Lightbulb,
    FileText,
    Upload
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
    const [dueDiligence, setDueDiligence] = useState('');
    const [sroiEvidence, setSroiEvidence] = useState<File | null>(null);

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

    // --- Risk Heatmap Logic ---
    const riskData = useMemo(() => {
        let score = 0;
        
        // 1. Impactos Negativos (Mais que 3 é crítico)
        if (negativeImpacts.length >= 3) score += 40;
        else if (negativeImpacts.length > 0) score += 20;

        // 2. Acesso à Água (Precário é crítico)
        if (waterAccess === 'Precário') score += 30;

        // 3. Relacionamento (Abaixo de 2 é crítico)
        if (relationshipLevel <= 2) score += 30;

        let level: 'Critical' | 'Moderate' | 'Full' = 'Full';
        let label = 'Licença Social Plena';
        let color = 'text-green-500';
        let bg = 'bg-green-50';

        if (score >= 60) {
            level = 'Critical';
            label = 'Risco Crítico (Instabilidade)';
            color = 'text-red-600';
            bg = 'bg-red-50';
        } else if (score >= 30) {
            level = 'Moderate';
            label = 'Risco Moderado';
            color = 'text-amber-600';
            bg = 'bg-amber-50';
        }

        return { level, label, color, bg, score };
    }, [negativeImpacts, waterAccess, relationshipLevel]);

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
        setDueDiligence(assessment.due_diligence_audit || '');
        setViewMode('create');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o diagnóstico da comunidade "${name}"? Todas as camadas de mapa vinculadas também serão removidas.`)) return;

        try {
            await supabase
                .from('map_layers')
                .delete()
                .or(`name.eq."${name}",group.eq."${name}"`);

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

            const assessmentData: Partial<CommunityAssessment> = {
                community_name: communityName,
                settlement_type: settlementType,
                estimated_families: estimatedFamilies === '' ? 0 : estimatedFamilies,
                water_access: waterAccess,
                sanitation_status: sanitationStatus,
                negative_impacts: negativeImpacts,
                priority_needs: priorityNeeds,
                relationship_level: relationshipLevel,
                due_diligence_audit: dueDiligence,
                risk_level: riskData.level,
                assessment_date: new Date().toISOString(),
                coordinates: [0, 0],
                created_by: user?.id
            };

            if (editingId) {
                const { error: updateError } = await supabase
                    .from('community_assessments')
                    .update(assessmentData)
                    .eq('id', editingId);

                if (updateError) throw updateError;
                showSuccess('Diagnóstico e Matriz de Risco atualizados!');
            } else {
                const { error: insertError } = await supabase
                    .from('community_assessments')
                    .insert([assessmentData]);

                if (insertError) throw insertError;
                showSuccess('Diagnóstico salvo com sucesso!');
            }

            // Sync metadata for GIS
            const detailsToSync = {
                familias: assessmentData.estimated_families,
                tipo: assessmentData.settlement_type,
                relacionamento: assessmentData.relationship_level,
                community_name: communityName,
                risk_level: riskData.label,
                demandas: assessmentData.priority_needs?.length || 0
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
        setDueDiligence('');
        setSroiEvidence(null);
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
        <div className="w-full p-4 space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Licença Social para Operar (LSO)
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                        {viewMode === 'list' ? 'Gestão de Territórios & Risco' : 'Calculadora de Impacto Social'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium italic mt-1">
                        {viewMode === 'list'
                            ? 'Mapeamento de riscos e materialidade das comunidades do entorno portuário.'
                            : 'Analise os vetores de risco e gere recomendações automáticas para o plano de ação.'}
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
                                NOVA COMUNIDADE
                            </button>
                        </>
                    ) : null}
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
                                placeholder="Buscar por comunidade ou nível de risco..."
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
                                <div className={`h-1.5 w-full ${
                                    assessment.risk_level === 'Critical' ? 'bg-red-500' : 
                                    assessment.risk_level === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'
                                }`} />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight group-hover:text-happiness-1 transition-colors">
                                                {assessment.community_name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    {assessment.settlement_type}
                                                </span>
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                    assessment.risk_level === 'Critical' ? 'bg-red-100 text-red-600' : 
                                                    assessment.risk_level === 'Moderate' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                                                }`}>
                                                    {assessment.risk_level === 'Critical' ? 'CRÍTICO' : 
                                                     assessment.risk_level === 'Moderate' ? 'MODERADO' : 'ESTÁVEL'}
                                                </span>
                                            </div>
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

                        {/* 🏗️ Infraestrutura Crítica & Due Diligence */}
                        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                    <Hammer className="text-happiness-1 w-5 h-5" />
                                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">🏗️ Infraestrutura & Conformidade (Vol. I)</h3>
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

                                    <div className="space-y-6">
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

                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                                            <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                <ShieldAlert size={12} /> Auditoria de Due Diligence
                                            </label>
                                            <textarea
                                                placeholder="Descreva o status da Due Diligence na Cadeia de Transporte (Diretiva Europeia)..."
                                                value={dueDiligence}
                                                onChange={(e) => setDueDiligence(e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-purple-100 dark:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-400"
                                                rows={3}
                                            />
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
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 block">Ações Sociais & S-ROI</label>
                                        <MultiSelectChips
                                            options={PRIORITY_NEEDS_OPTIONS}
                                            selected={priorityNeeds}
                                            onChange={setPriorityNeeds}
                                            colorClass="bg-happiness-1/10 text-happiness-1 border-happiness-1/20"
                                        />
                                        
                                        {priorityNeeds.length > 0 && (
                                            <div className="mt-4 p-4 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-blue-50/50 dark:bg-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm">
                                                        <FileCheck className="w-5 h-5 text-happiness-1" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Comprovante de S-ROI</span>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                            {sroiEvidence ? sroiEvidence.name : 'Upload obrigatório para ações sociais'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => document.getElementById('sroi-upload')?.click()}
                                                    className="text-[10px] font-black text-happiness-1 uppercase hover:underline"
                                                >
                                                    {sroiEvidence ? 'Trocar' : 'Selecionar'}
                                                </button>
                                                <input id="sroi-upload" type="file" className="hidden" onChange={(e) => setSroiEvidence(e.target.files?.[0] || null)} />
                                            </div>
                                        )}
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

                        {/* Botões de Ação Inferiores */}
                        <div className="flex justify-end items-center gap-4 pt-4 pb-12">
                            <button
                                onClick={() => {
                                    setViewMode('list');
                                    resetForm();
                                }}
                                className="px-6 py-2.5 text-gray-500 font-bold text-sm tracking-wide hover:text-gray-700 dark:hover:text-white transition-colors"
                            >
                                Descartar e Voltar
                            </button>
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
                        {/* Heatmap de Risco LSO */}
                        <div className={`p-6 rounded-3xl border shadow-xl animate-in zoom-in-95 duration-500 ${riskData.bg} border-current border-opacity-20`}>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldAlert className={riskData.color} size={18} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${riskData.color}`}>
                                    Matriz de Risco LSO
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className={`text-xl font-black leading-tight ${riskData.color}`}>
                                        {riskData.label}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tight">
                                        Licença Social para Operar
                                    </p>
                                </div>

                                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${
                                            riskData.level === 'Critical' ? 'bg-red-500' : 
                                            riskData.level === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'
                                        }`}
                                        style={{ width: `${riskData.score}%` }}
                                    />
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                        <span>Severidade do Impacto</span>
                                        <span className="text-gray-600 dark:text-gray-300">{negativeImpacts.length}/5</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                        <span>Conflito Territorial</span>
                                        <span className="text-gray-600 dark:text-gray-300">{relationshipLevel < 3 ? 'ALTO' : 'BAIXO'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Automatic Recommendation - Critical Case */}
                        {riskData.level === 'Critical' && (
                            <div className="bg-zinc-900 dark:bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Lightbulb className="w-16 h-16 text-happiness-1" />
                                </div>
                                <h4 className="text-white dark:text-zinc-900 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Lightbulb size={14} className="text-happiness-3" />
                                    Recomendação Consultiva
                                </h4>
                                <p className="text-happiness-3 dark:text-happiness-4 text-xs font-black mb-2">AÇÃO RECOMENDADA:</p>
                                <p className="text-gray-300 dark:text-zinc-600 text-sm font-medium leading-relaxed italic">
                                    "Criação de Fundação Portuária compartilhada para mitigação de impactos locais e gestão centralizada de investimentos sociais."
                                </p>
                            </div>
                        )}

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
                                        risk_level: riskData.label,
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
                                showSuccess(`${layers.length} camada(s) vinculada(s) à matriz de risco.`);
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
