import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Polyline, MarkerF, InfoWindowF } from '@react-google-maps/api';
import {
    Layers, Eye, EyeOff, Trash2, MapPin, Hexagon, Loader2, Navigation,
    Route, Shield, Users, ChevronDown, ChevronUp, AlertTriangle,
    ChevronRight, Database, Wrench, BarChart2, Star, Upload
} from 'lucide-react';
import { Rating } from '@mui/material';
import { LayerUploadModal } from '../LayerUploadModal';
import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';

// --- Global Styles for Scrollbar Hiding ---
const infoWindowStyle = `
  .gm-style-iw {
    max-width: 350px !important;
    max-height: 400px !important;
    padding: 0 !important;
  }
  .gm-style-iw-d {
    overflow: hidden !important;
    max-height: none !important;
  }
  .gm-ui-hover-text {
    display: none;
  }
  .custom-pop-content::-webkit-scrollbar {
    display: none;
  }
  .custom-pop-content {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// --- Types ---
import { Layer, ESGPillar } from '../../types';


// --- Map Styles (Dark Mode) ---
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

interface GeoSpatialModuleProps {
    additionalLayers?: Layer[];
}

export const GeoSpatialModule: React.FC<GeoSpatialModuleProps> = ({ additionalLayers = [] }) => {
    // Estado das camadas
    const [layers, setLayers] = useState<Layer[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [deletedLayers, setDeletedLayers] = useState<Set<string>>(new Set());
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedElement, setSelectedElement] = useState<any>(null);
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
    const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({
        Environmental: true,
        Social: true,
        Governance: true,
        Operational: true
    });
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    // Carregar camadas do Supabase na inicialização
    useEffect(() => {
        const fetchLayers = async () => {
            try {
                const { data, error } = await supabase
                    .from('map_layers')
                    .select('*');

                if (error) throw error;
                if (data) {
                    setLayers(prev => {
                        const dbLayers = data.map(l => ({
                            ...l,
                            visible: l.visible ?? true
                        }));
                        const existingIds = new Set(prev.map(l => l.id));
                        const uniqueDbLayers = dbLayers.filter(l => !existingIds.has(l.id));
                        return [...prev, ...uniqueDbLayers];
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar camadas do banco:', err);
                showError('Erro ao carregar camadas do banco de dados.');
            } finally {
                setIsInitialLoad(false);
            }
        };

        fetchLayers();
    }, []);

    useEffect(() => {
        if (additionalLayers && additionalLayers.length > 0) {
            console.log('GeoSpatialModule: Receiving additional layers:', additionalLayers.length);
            setLayers(prev => {
                const existingIds = new Set(prev.map(l => l.id));
                const newLayers = additionalLayers.filter(l => !existingIds.has(l.id) && !deletedLayers.has(l.id));
                if (newLayers.length === 0) return prev;
                return [...prev, ...newLayers];
            });
        }
    }, [additionalLayers, deletedLayers]);

    // Carregar Diagnósticos Comunitários automaticamente como camadas
    useEffect(() => {
        const loadCommunityData = async () => {
            try {
                const { supabase } = await import('../../utils/supabase');
                const { data, error } = await supabase
                    .from('community_assessments')
                    .select('*')
                    .not('geometry', 'is', null);

                if (error) throw error;
                if (data) {
                    const communityLayers: Layer[] = data.map(item => ({
                        id: `community-${item.id}`,
                        name: item.community_name,
                        type: item.geometry.type as any,
                        visible: true,
                        color: '#F59E0B', // Cor de destaque para comunidades
                        data: item.geometry.data,
                        pillar: 'Social',
                        group: 'Diagnósticos Socioeconômicos',
                        details: {
                            familias: item.estimated_families,
                            agua: item.water_access,
                            esgoto: item.sanitation_status,
                            relacionamento: item.relationship_level,
                            tipo: item.settlement_type,
                            demandas: item.priority_needs?.length || 0
                        }
                    }));

                    setLayers(prev => {
                        const baseIds = new Set(prev.map(l => l.id));
                        const filteredNew = communityLayers.filter(l => !baseIds.has(l.id));
                        return [...prev, ...filteredNew];
                    });
                }
            } catch (err) {
                console.error('Erro ao carregar geometrias comunitárias:', err);
            }
        };

        loadCommunityData();
    }, []);


    const togglePillar = (pillar: string) => {
        setExpandedPillars(prev => ({ ...prev, [pillar]: !prev[pillar] }));
    };

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    // Load Google Maps Script
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
    });

    const containerStyle = {
        width: '100%',
        height: '100%',
        borderRadius: 1
    };

    const center = useMemo(() => ({
        lat: -2.58, // Itaqui approximate coordinates
        lng: -44.37
    }), []);

    // Gera uma key única baseada nas camadas visíveis para forçar re-render
    const visibleLayersKey = useMemo(() => {
        return layers.filter(l => l.visible).map(l => l.id).join('-');
    }, [layers]);

    const toggleLayer = useCallback(async (id: string) => {
        console.log('Toggling layer:', id);

        // Se for uma camada de comunidade, apenas toggle local (não salva no banco map_layers)
        if (id.startsWith('community-')) {
            setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
            return;
        }

        setLayers(prev => {
            const current = prev.find(l => l.id === id);
            if (!current) return prev;

            const newVisible = !current.visible;

            // Update Supabase in background
            supabase.from('map_layers').update({ visible: newVisible }).eq('id', id).then(({ error }) => {
                if (error) console.error('Erro ao atualizar visibilidade:', error);
            });

            return prev.map(l => l.id === id ? { ...l, visible: newVisible } : l);
        });
    }, []);

    const focusLayer = useCallback((layer: Layer) => {
        if (!mapRef) return;

        // Se a camada estiver oculta, exibe ela primeiro
        if (!layer.visible) {
            setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, visible: true } : l));
        }

        if (layer.type === 'MARKER') {
            mapRef.panTo(layer.data as google.maps.LatLngLiteral);
            mapRef.setZoom(16);
        } else if (layer.type === 'POLYGON' || layer.type === 'POLYLINE') {
            const bounds = new google.maps.LatLngBounds();
            const paths = layer.data as google.maps.LatLngLiteral[];
            if (paths && Array.isArray(paths)) {
                paths.forEach(p => bounds.extend(p));
                mapRef.fitBounds(bounds);
                // Pequeno ajuste para não ficar colado nas bordas
                mapRef.setZoom(mapRef.getZoom());
            }
        }

        setSelectedElement({
            type: layer.type,
            layer: { ...layer, visible: true },
            position: layer.type === 'MARKER' ? layer.data : (Array.isArray(layer.data) ? layer.data[0] : layer.data)
        });
    }, [mapRef]);

    const handleLayersImported = useCallback(async (newLayers: Layer[]) => {
        console.log('Importing layers to Supabase:', newLayers.length);

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
                group: l.group || 'Geral',
                created_by: user?.id || null
            }));

            const { error } = await supabase
                .from('map_layers')
                .upsert(layersToInsert);

            if (error) {
                console.error('Erro Supabase Insert:', error);
                throw error;
            }

            setLayers(prev => {
                const existingIds = new Set(prev.map(l => l.id));
                const uniqueNewLayers = newLayers.filter(l => !existingIds.has(l.id));
                return [...prev, ...uniqueNewLayers];
            });

            showSuccess(`${newLayers.length} camada(s) salva(s) com sucesso.`);
        } catch (err: any) {
            console.error('Erro ao salvar novas camadas:', err);
            showError(`Erro ao salvar no banco: ${err.message || 'Erro desconhecido'}`);

            // Fallback: Adiciona ao estado local mesmo se falhar no banco (para o usuário ver algo)
            setLayers(prev => {
                const existingIds = new Set(prev.map(l => l.id));
                const uniqueNewLayers = newLayers.filter(l => !existingIds.has(l.id));
                return [...prev, ...uniqueNewLayers];
            });
        }
    }, []);

    const removeLayer = useCallback(async (id: string) => {
        console.log('Removing layer:', id);

        // Limpa seleção se for a camada excluída
        setSelectedElement((prev: any) => prev?.layer?.id === id ? null : prev);

        // Atualiza estado local imediatamente (otimista)
        setLayers(prev => prev.filter(l => l.id !== id));
        setDeletedLayers(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });

        try {
            if (id.startsWith('community-')) {
                // Para camadas de comunidade, removemos a geometria do registro da comunidade
                const communityId = id.replace('community-', '');
                const { error } = await supabase
                    .from('community_assessments')
                    .update({ geometry: null })
                    .eq('id', communityId);

                if (error) throw error;
                showSuccess('Geometria da comunidade removida.');
            } else {
                const { error } = await supabase
                    .from('map_layers')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            }
        } catch (err: any) {
            console.error('Erro ao remover camada:', err);
            showError(`Erro ao sincronizar remoção: ${err.message || 'Erro de conexão'}`);
            // Opcional: Reverter estado local se for crítico
        }
    }, []);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMapRef(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMapRef(null);
    }, []);

    if (!isLoaded) return (
        <div className="h-full flex items-center justify-center flex-col gap-2 text-gray-500 animate-pulse bg-gray-100 dark:bg-[#1C1C1C] rounded-sm">
            <Loader2 className="w-8 h-8 animate-spin text-happiness-1" />
            <p className="text-sm font-bold">Carregando Módulo Geoespacial...</p>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
            <style>{infoWindowStyle}</style>
            {/* Sidebar / Layer Manager */}
            <div className="w-80 flex flex-col bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden shrink-0">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <Layers size={18} />
                        <h2 className="font-bold text-sm">Gestão de Camadas</h2>
                        <span className="text-[10px] bg-happiness-1/10 text-happiness-1 px-1.5 py-0.5 rounded-sm font-bold">
                            {layers.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors text-happiness-1"
                        title="Adicionar Camada"
                    >
                        <Upload size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    {layers.length === 0 && (
                        <div className="text-center p-4 text-gray-400 text-xs">Nenhuma camada encontrada. Use o botão acima para importar.</div>
                    )}

                    {/* Agrupamento por Pilar */}
                    {(['Environmental', 'Social', 'Governance', 'Operational'] as ESGPillar[]).map(pillar => {
                        const pillarLayers = layers.filter(l => l.pillar === pillar);
                        if (pillarLayers.length === 0) return null;

                        const pillarConfig = {
                            Environmental: { label: 'Ambiental', color: 'text-green-500', bg: 'bg-green-500/10', icon: <Hexagon className="w-4 h-4 text-green-500" /> },
                            Social: { label: 'Social', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: <Users className="w-4 h-4 text-orange-500" /> },
                            Governance: { label: 'Governança', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <Shield className="w-4 h-4 text-blue-500" /> },
                            Operational: { label: 'Operacional', color: 'text-gray-500', bg: 'bg-gray-500/10', icon: <Navigation className="w-4 h-4 text-gray-500" /> }
                        }[pillar];

                        return (
                            <div key={pillar} className="space-y-1">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => togglePillar(pillar)}
                                        className="flex-1 flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-left">
                                            {expandedPillars[pillar] ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronUp className="w-3 h-3 text-gray-400" />}
                                            {pillarConfig.icon}
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${pillarConfig.color}`}>
                                                {pillarConfig.label}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-white/10 text-gray-500">
                                            {pillarLayers.length}
                                        </span>
                                    </button>

                                    <div className="flex items-center gap-0.5">
                                        <button
                                            onClick={async () => {
                                                const allVisible = pillarLayers.every(l => l.visible);
                                                const newVisibility = !allVisible;

                                                // Update locally
                                                const updatedLayers = layers.map(l =>
                                                    l.pillar === pillar ? { ...l, visible: newVisibility } : l
                                                );
                                                setLayers(updatedLayers);

                                                // Update Supabase for non-community layers
                                                const nonCommunityIds = pillarLayers
                                                    .filter(l => !l.id.startsWith('community-'))
                                                    .map(l => l.id);

                                                if (nonCommunityIds.length > 0) {
                                                    await supabase
                                                        .from('map_layers')
                                                        .update({ visible: newVisibility })
                                                        .in('id', nonCommunityIds);
                                                }
                                            }}
                                            className={`p-1.5 rounded-sm border transition-all ${pillarLayers.every(l => l.visible)
                                                ? 'bg-happiness-1/10 border-happiness-1/20 text-happiness-1'
                                                : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400'
                                                }`}
                                            title={pillarLayers.every(l => l.visible) ? "Ocultar todas" : "Mostrar todas"}
                                        >
                                            {pillarLayers.every(l => l.visible) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>

                                        <button
                                            onClick={async () => {
                                                if (confirm(`Remover todas as camadas do pilar ${pillarConfig.label}?`)) {
                                                    const idsToRemove = pillarLayers.map(l => l.id);

                                                    // Atualiza estado local e rastreia exclusões
                                                    setLayers(prev => prev.filter(l => l.pillar !== pillar));
                                                    setDeletedLayers(prev => {
                                                        const next = new Set(prev);
                                                        idsToRemove.forEach(id => next.add(id));
                                                        return next;
                                                    });
                                                    setSelectedElement((prev: any) => idsToRemove.includes(prev?.layer?.id) ? null : prev);

                                                    // Sincroniza com Supabase
                                                    const nonCommunityIds = pillarLayers.filter(l => !l.id.startsWith('community-')).map(l => l.id);
                                                    const communityIds = pillarLayers.filter(l => l.id.startsWith('community-')).map(l => l.id.replace('community-', ''));

                                                    try {
                                                        if (nonCommunityIds.length > 0) {
                                                            await supabase.from('map_layers').delete().in('id', nonCommunityIds);
                                                        }
                                                        if (communityIds.length > 0) {
                                                            await supabase.from('community_assessments').update({ geometry: null }).in('id', communityIds);
                                                        }
                                                        showSuccess(`Pilar ${pillarConfig.label} removido.`);
                                                    } catch (err) {
                                                        console.error('Erro ao sincronizar remoção de pilar:', err);
                                                    }
                                                }
                                            }}
                                            className="p-1.5 rounded-sm border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                                            title="Excluir pilar e sub-camadas"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {expandedPillars[pillar] && (
                                    <div className="space-y-2 pl-1 animate-in slide-in-from-top-1 duration-200 mt-2">
                                        {Object.entries(
                                            pillarLayers.reduce((acc, layer) => {
                                                const group = layer.group || 'Geral';
                                                if (!acc[group]) acc[group] = [];
                                                acc[group].push(layer);
                                                return acc;
                                            }, {} as Record<string, Layer[]>)
                                        ).map(([groupName, groupLayers]) => (
                                            <div key={groupName} className="space-y-1">
                                                {/* Group Header (Camada Principal) */}
                                                <div className="flex items-center gap-1 group/header">
                                                    <button
                                                        onClick={() => toggleGroup(groupName)}
                                                        className="flex-1 flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-sm transition-all text-left min-w-0"
                                                    >
                                                        {expandedGroups[groupName] ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                                                        <Database className="w-3 h-3 text-happiness-1 shrink-0" />
                                                        <span className="text-xs font-black text-gray-800 dark:text-gray-200 truncate uppercase tracking-tighter">
                                                            {groupName}
                                                        </span>
                                                    </button>
                                                    <div className="flex items-center gap-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={async () => {
                                                                const allVisible = groupLayers.every(l => l.visible);
                                                                const newVisibility = !allVisible;

                                                                // Update locally
                                                                setLayers(prev => prev.map(l => l.group === groupName ? { ...l, visible: newVisibility } : l));

                                                                // Update Supabase for non-community layers
                                                                const nonCommunityIds = groupLayers
                                                                    .filter(l => !l.id.startsWith('community-'))
                                                                    .map(l => l.id);

                                                                if (nonCommunityIds.length > 0) {
                                                                    await supabase
                                                                        .from('map_layers')
                                                                        .update({ visible: newVisibility })
                                                                        .in('id', nonCommunityIds);
                                                                }
                                                            }}
                                                            className={`p-1 rounded-sm ${groupLayers.every(l => l.visible) ? 'text-happiness-1' : 'text-gray-400'} hover:bg-gray-100 dark:hover:bg-white/10`}
                                                            title="Alternar visibilidade do grupo"
                                                        >
                                                            {groupLayers.every(l => l.visible) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm(`Remover grupo '${groupName}' e todas as suas camadas?`)) {
                                                                    const idsToRemove = groupLayers.map(l => l.id);

                                                                    // Atualiza estado local e rastreia exclusões
                                                                    setLayers(prev => prev.filter(l => l.group !== groupName));
                                                                    setDeletedLayers(prev => {
                                                                        const next = new Set(prev);
                                                                        idsToRemove.forEach(id => next.add(id));
                                                                        return next;
                                                                    });
                                                                    setSelectedElement((prev: any) => idsToRemove.includes(prev?.layer?.id) ? null : prev);

                                                                    // Sincroniza com Supabase
                                                                    const nonCommunityIds = groupLayers.filter(l => !l.id.startsWith('community-')).map(l => l.id);
                                                                    const communityIds = groupLayers.filter(l => l.id.startsWith('community-')).map(l => l.id.replace('community-', ''));

                                                                    try {
                                                                        if (nonCommunityIds.length > 0) {
                                                                            await supabase.from('map_layers').delete().in('id', nonCommunityIds);
                                                                        }
                                                                        if (communityIds.length > 0) {
                                                                            await supabase.from('community_assessments').update({ geometry: null }).in('id', communityIds);
                                                                        }
                                                                        showSuccess(`Grupo ${groupName} removido.`);
                                                                    } catch (err) {
                                                                        console.error('Erro ao sincronizar remoção de grupo:', err);
                                                                    }
                                                                }
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10"
                                                            title="Excluir grupo"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Sub-layers (Camadas Secundárias) */}
                                                {expandedGroups[groupName] && (
                                                    <div className="space-y-0.5 pl-6 border-l border-gray-100 dark:border-white/5 ml-3.5 animate-in slide-in-from-top-1">
                                                        {groupLayers.map(layer => (
                                                            <div
                                                                key={layer.id}
                                                                onClick={() => focusLayer(layer)}
                                                                className={`
                                                                    group flex items-center justify-between p-2 rounded-sm transition-all cursor-pointer
                                                                    ${layer.visible ? 'bg-white dark:bg-white/5 border-l-2' : 'opacity-60 border-l-2 border-transparent'}
                                                                    hover:bg-happiness-1/5
                                                                `}
                                                                style={{ borderLeftColor: layer.visible ? layer.color : 'transparent' }}
                                                            >
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        {layer.type === 'POLYGON' && <Hexagon className="w-2.5 h-2.5" style={{ color: layer.color }} />}
                                                                        {layer.type === 'MARKER' && <MapPin className="w-2.5 h-2.5" style={{ color: layer.color }} />}
                                                                        {layer.type === 'POLYLINE' && <Route className="w-2.5 h-2.5" style={{ color: layer.color }} />}
                                                                    </div>
                                                                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 truncate">
                                                                        {layer.name}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id); }}
                                                                        className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                                    >
                                                                        {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                                                                        className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-900">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-sm border border-blue-100 dark:border-blue-900/30 flex gap-2">
                        <Navigation className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-[10px] text-blue-700 dark:text-blue-300">
                            <strong>Poligonal Ativa:</strong> O monitoramento de perímetro está ativo para todas as camadas visíveis.
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-white/5 overflow-hidden relative shadow-inner">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        mapTypeControl: true,
                        streetViewControl: true,
                        fullscreenControl: true,
                        zoomControl: true,
                    }
                    }
                >
                    {/* Render Polygon Layers */}
                    {
                        layers.filter(l => l.type === 'POLYGON' && l.visible).map(layer => (
                            <Polygon
                                key={`polygon-${layer.id}`}
                                paths={layer.data as google.maps.LatLngLiteral[]}
                                options={{
                                    fillColor: layer.color,
                                    fillOpacity: 0.2,
                                    strokeColor: layer.color,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                }}
                                onClick={(e) => setSelectedElement({ type: 'POLYGON', layer, position: e.latLng })}
                            />
                        ))
                    }

                    {/* Render Marker Layers */}
                    {
                        layers.filter(l => l.type === 'MARKER' && l.visible).map(layer => (
                            <MarkerF
                                key={`marker-${layer.id}`}
                                position={layer.data as google.maps.LatLngLiteral}
                                onClick={() => setSelectedElement({ type: 'MARKER', layer, position: layer.data })}
                            />
                        ))
                    }

                    {/* Render Polyline Layers */}
                    {
                        layers.filter(l => l.type === 'POLYLINE' && l.visible).map(layer => (
                            <Polyline
                                key={`polyline-${layer.id}`}
                                path={layer.data as google.maps.LatLngLiteral[]}
                                options={{
                                    strokeColor: layer.color,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 3,
                                }}
                                onClick={(e) => setSelectedElement({ type: 'POLYLINE', layer, position: e.latLng })}
                            />
                        ))
                    }

                    {/* Info Window */}
                    {
                        selectedElement && (
                            <InfoWindowF
                                position={selectedElement.position}
                                onCloseClick={() => setSelectedElement(null)}
                                options={{
                                    pixelOffset: new google.maps.Size(0, -30),
                                    maxWidth: 320
                                }}
                            >
                                <div className="custom-pop-content min-w-[300px] bg-white dark:bg-[#121212] overflow-hidden -m-3">
                                    {/* Accent Bar */}
                                    <div className="h-1.5 bg-gradient-to-r from-happiness-1 via-blue-500 to-indigo-600 w-full" />

                                    <div className="p-5">
                                        {/* Header Section */}
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 rounded-full bg-happiness-1 animate-pulse" />
                                                    <span className="text-[9px] font-black text-happiness-1 uppercase tracking-[0.2em]">Live Data</span>
                                                </div>
                                                <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight leading-tight truncate">
                                                    {selectedElement.layer.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                                        {selectedElement.layer.details?.tipo || 'Território'}
                                                    </span>
                                                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
                                                        ID: {selectedElement.layer.id.substring(0, 6)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/10 rounded-sm flex items-center justify-center shadow-sm border border-blue-100/50 dark:border-blue-500/10 transition-transform hover:scale-110">
                                                <MapPin className="text-blue-500 w-5 h-5 fill-blue-500/20" />
                                            </div>
                                        </div>

                                        {/* Stats List - Dynamic based on Pillar */}
                                        {selectedElement.layer.pillar === 'Environmental' ? (
                                            <div className="space-y-4 mb-6">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Índice de Carbono</span>
                                                    <span className="font-black text-emerald-500">L4 - Conforme</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Gestão de Resíduos</span>
                                                    <span className="font-black text-blue-500">L3 - Operacional</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Risco de Derramamento</span>
                                                    <span className="font-black text-orange-500">Baixo Risco</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Monitoramento Hídrico</span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                                        <span className="font-black text-gray-800 dark:text-gray-200">Ativo</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 mb-6">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Comunidade</span>
                                                    <span className="font-black text-gray-800 dark:text-gray-200 truncate max-w-[180px]">{selectedElement.layer.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Famílias</span>
                                                    <span className="font-black text-orange-500">{selectedElement.layer.details?.familias || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Perfil</span>
                                                    <span className="font-black text-gray-800 dark:text-gray-200">{selectedElement.layer.details?.tipo || 'Território'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Relacionamento</span>
                                                    <div className="flex items-center gap-2">
                                                        <Rating
                                                            value={selectedElement.layer.details?.relacionamento || 0}
                                                            size="small"
                                                            readOnly
                                                            sx={{ fontSize: '14px' }}
                                                            emptyIcon={<Star className="w-2.5 h-2.5 text-gray-200 dark:text-gray-800" />}
                                                            icon={<Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />}
                                                        />
                                                        <span className="font-black text-amber-500 text-[10px]">{selectedElement.layer.details?.relacionamento || 0}/5</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Priority Needs Link / Extra Info */}
                                        {selectedElement.layer.pillar === 'Social' && selectedElement.layer.details?.demandas > 0 && (
                                            <div className="pt-2 mb-6">
                                                <div className="bg-blue-50 dark:bg-blue-900/10 p-2.5 rounded-sm border border-blue-100 dark:border-blue-900/20 flex items-center justify-between group cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                                                    onClick={() => { }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
                                                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                                                            {selectedElement.layer.details.demandas} Demandas Ativas
                                                        </span>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        )}
                                        {/* Type Badge */}
                                        <div className="mb-6">
                                            <div className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-sm border border-gray-200 dark:border-white/10">
                                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: selectedElement.layer.color }} />
                                                <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                                                    {selectedElement.layer.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer Section */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Complexo Portuário do Itaqui • ESG 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </InfoWindowF>
                        )
                    }
                </GoogleMap>

                {/* Floating Status Overlay */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-sm shadow-lg flex items-center gap-3 animate-bounce border border-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Alerta: Resíduo Fora da Zona COFAM</span>
                    </div>
                </div>

                <div className="absolute bottom-6 right-16 bg-white dark:bg-[#1C1C1C] px-4 py-2 rounded-sm shadow-lg border border-gray-200 dark:border-white/5 flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Operação Nominal</span>
                    <div className="h-4 w-px bg-gray-300 dark:bg-white/20"></div>
                    <span className="text-[10px] text-gray-400 font-mono tracking-wider">LAT: -2.58 LNG: -44.37</span>
                </div>
            </div>

            <LayerUploadModal
                open={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onLayersLoaded={handleLayersImported}
            />
        </div>
    );
};
