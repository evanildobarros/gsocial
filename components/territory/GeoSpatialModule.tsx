import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Layers, Eye, EyeOff, Trash2, MapPin, Hexagon, Navigation,
    Shield, Users, ChevronDown, AlertTriangle,
    ChevronRight, Database, Star,
    Clock, ChevronLeft,
    BarChart3, Lightbulb
} from 'lucide-react';
import { LayerUploadModal } from '../LayerUploadModal';
import { supabase } from '../../utils/supabase';
import { showSuccess, showError } from '../../utils/notifications';

// --- Global Styles (Leaflet / Popup) ---
const mapStyle = `
  .leaflet-container {
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
    background: #e8e8e8;
    z-index: 0;
  }
  .leaflet-popup-content-wrapper {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 24px !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
  .leaflet-popup-content {
    margin: 0 !important;
    width: auto !important;
    line-height: inherit !important;
  }
  .leaflet-popup-tip-container {
    display: none !important;
  }
  .leaflet-popup-close-button {
    color: #ffffff !important;
    width: 28px !important;
    height: 28px !important;
    font-size: 20px !important;
    line-height: 24px !important;
    top: 6px !important;
    right: 6px !important;
    z-index: 10 !important;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  }
  .leaflet-popup-close-button:hover {
    color: #0FDBAB !important;
  }
  .esg-map-marker {
    background: transparent !important;
    border: 0 !important;
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

type LatLngTuple = [number, number];

const center: LatLngTuple = [-2.5833, -44.2333]; // Itaqui/São Luís

// --- Helpers Geoespaciais (conversão para o formato do Leaflet) ---

/**
 * Normaliza `layer.data` em uma lista de anéis/linhas de coordenadas.
 * Aceita tanto `[{lat,lng}, ...]` (geometria única) quanto
 * `[[{lat,lng}, ...], ...]` (MultiPolygon / MultiLineString) — formato emitido pelo geoParser.
 */
const toRings = (data: any): LatLngTuple[][] => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const rings: any[] = Array.isArray(data[0]) ? data : [data];
    return rings
        .filter((ring: any) => Array.isArray(ring))
        .map((ring: any[]) =>
            ring
                .filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number')
                .map((p): LatLngTuple => [p.lat, p.lng])
        )
        .filter((ring: LatLngTuple[]) => ring.length > 0);
};

// Cache de ícones customizados de marcador (cor da camada), evitando recriação a cada render.
const markerIcons = new Map<string, L.DivIcon>();
const getMarkerIcon = (color: string): L.DivIcon => {
    const key = color || '#0FDBAB';
    if (!markerIcons.has(key)) {
        markerIcons.set(key, L.divIcon({
            className: 'esg-map-marker',
            html: `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14 1C6.82 1 1 6.82 1 14c0 9.6 13 21 13 21s13-11.4 13-21C27 6.82 21.18 1 14 1z" fill="${key}" stroke="#ffffff" stroke-width="2"/><circle cx="14" cy="14" r="4.5" fill="#ffffff"/></svg>`,
            iconSize: [28, 36],
            iconAnchor: [14, 36],
            popupAnchor: [0, -34],
        }));
    }
    return markerIcons.get(key)!;
};

// Expõe a instância do mapa Leaflet para o componente pai (substitui onLoad do Google Maps).
const MapLifecycle = ({ onReady }: { onReady: (map: L.Map) => void }) => {
    const map = useMap();
    useEffect(() => {
        onReady(map);
    }, [map, onReady]);
    return null;
};

// Simple Star Rating Component
const StarRating = ({ value }: { value: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star
                key={i}
                className={`w-3.5 h-3.5 ${i <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-zinc-800'}`}
            />
        ))}
    </div>
);

// Helper for Risk Style
const getRiskStyle = (riskBadge?: string) => {
    if (!riskBadge) return { color: 'text-black', bg: 'bg-gray-100', border: 'border-gray-200' };
    if (riskBadge.includes('Crítico')) return { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-900/30' };
    if (riskBadge.includes('Moderado')) return { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-900/30' };
    return { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-900/30' };
};

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
    const [mapRef, setMapRef] = useState<L.Map | null>(null);
    const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({
        Environmental: true, Social: true, Governance: true, Operational: true
    });
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Carregar camadas do Supabase na inicialização
    useEffect(() => {
        const fetchLayers = async () => {
            try {
                const { data, error } = await supabase.from('map_layers').select('*');
                if (error) throw error;
                if (data) {
                    setLayers(prev => {
                        const dbLayers = data.map(l => ({ ...l, visible: l.visible ?? true }));
                        const existingIds = new Set(prev.map(l => l.id));
                        const uniqueDbLayers = dbLayers.filter(l => !existingIds.has(l.id));
                        return [...prev, ...uniqueDbLayers];
                    });
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
                showError('Erro ao carregar camadas: ' + err.message);
            } finally {
                setIsInitialLoad(false);
            }
        };
        fetchLayers();
    }, []);

    // Sincronizar additionalLayers do App.tsx (ex: KML principal)
    useEffect(() => {
        if (additionalLayers.length > 0) {
            setLayers(prev => {
                const existingIds = new Set(prev.map(l => l.id));
                const newLayers = additionalLayers.filter(l => !existingIds.has(l.id) && !deletedLayers.has(l.id));
                return [...prev, ...newLayers];
            });
        }
    }, [additionalLayers, deletedLayers]);

    const togglePillar = (pillar: string) => {
        setExpandedPillars(prev => ({ ...prev, [pillar]: !prev[pillar] }));
    };

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const toggleLayer = useCallback(async (id: string) => {
        let updatedVisibility = false;
        setLayers(prev => prev.map(l => {
            if (l.id === id) {
                updatedVisibility = !l.visible;
                return { ...l, visible: updatedVisibility };
            }
            return l;
        }));

        if (!id.startsWith('community-')) {
            try {
                await supabase.from('map_layers').update({ visible: updatedVisibility }).eq('id', id);
            } catch (err) {
                console.error('Error syncing visibility:', err);
            }
        }
    }, []);

    const removeLayer = useCallback(async (id: string) => {
        setSelectedElement((prev: any) => prev?.layer?.id === id ? null : prev);
        setLayers(prev => prev.filter(l => l.id !== id));
        setDeletedLayers(prev => new Set(prev).add(id));

        try {
            if (id.startsWith('community-')) {
                const communityId = id.replace('community-', '');
                await supabase.from('community_assessments').update({ geometry: null }).eq('id', communityId);
                showSuccess('Geometria da comunidade removida.');
            } else {
                await supabase.from('map_layers').delete().eq('id', id);
            }
        } catch (err: any) {
            showError(`Erro ao remover: ${err.message}`);
        }
    }, []);

    const removeGroup = useCallback(async (groupName: string, layersInGroup: Layer[]) => {
        if (!confirm(`Tem certeza que deseja remover o grupo \"${groupName}\" e todas as suas ${layersInGroup.length} camadas?`)) return;

        const idsToRemove = layersInGroup.map(l => l.id);

        // Update UI immediately
        setLayers(prev => prev.filter(l => !idsToRemove.includes(l.id)));
        setDeletedLayers(prev => {
            const newSet = new Set(prev);
            idsToRemove.forEach(id => newSet.add(id));
            return newSet;
        });

        let successCount = 0;
        try {
            for (const id of idsToRemove) {
                if (id.startsWith('community-')) {
                    const communityId = id.replace('community-', '');
                    await supabase.from('community_assessments').update({ geometry: null }).eq('id', communityId);
                } else {
                    await supabase.from('map_layers').delete().eq('id', id);
                }
                successCount++;
            }
            showSuccess(`Grupo removido com sucesso.`);
        } catch (err: any) {
            console.error('Error removing group:', err);
            showError(`Erro ao remover grupo.`);
        }
    }, []);

    const toggleGroupVisibility = useCallback(async (groupName: string, layersInGroup: Layer[]) => {
        const anyVisible = layersInGroup.some(l => l.visible);
        const targetVisibility = !anyVisible;

        setLayers(prev => prev.map(l => {
            if (layersInGroup.some(g => g.id === l.id)) {
                return { ...l, visible: targetVisibility };
            }
            return l;
        }));

        const idsToUpdate = layersInGroup
            .filter(l => !l.id.startsWith('community-'))
            .map(l => l.id);

        if (idsToUpdate.length > 0) {
            try {
                await supabase.from('map_layers')
                    .update({ visible: targetVisibility })
                    .in('id', idsToUpdate);
            } catch (err) {
                console.error('Error updating group visibility:', err);
            }
        }
    }, []);

    const focusLayer = useCallback((layer: Layer) => {
        if (!mapRef || !layer.data) return;

        if (layer.type === 'MARKER' && typeof layer.data.lat === 'number') {
            mapRef.setView([layer.data.lat, layer.data.lng], 15);
            return;
        }

        const points = toRings(layer.data).flat();
        if (points.length === 0) return;

        mapRef.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 17 });
    }, [mapRef]);

    const handleLayersImported = (newLayers: Layer[]) => {
        setLayers(prev => [...prev, ...newLayers]);
        setIsUploadModalOpen(false);
        showSuccess(`${newLayers.length} camadas importadas.`);
    };

    const handleMapReady = useCallback((map: L.Map) => {
        setMapRef(map);
    }, []);

    return (
        <div className={`flex h-[500px] md:h-[calc(100vh-220px)] animate-in fade-in duration-500 ${isSidebarOpen ? 'gap-6' : 'gap-0'}`}>
            <style>{mapStyle}</style>

            {/* Sidebar / Layer Manager Container */}
            <div className={`relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
                <div className={`w-80 h-full flex flex-col bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden shrink-0 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
                        <div className="flex items-center gap-2 text-black dark:text-white">
                            <Layers size={18} />
                            <h2 className="font-bold text-sm">Gestão de Camadas</h2>
                            <span className="text-[11px] bg-happiness-1/10 text-happiness-1 px-1.5 py-0.5 rounded-3xl font-bold">{layers.length}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-4">
                        {layers.length === 0 && <div className="text-left p-4 text-black text-xs">Nenhuma camada encontrada.</div>}

                        {(['Environmental', 'Social', 'Governance', 'Operational'] as ESGPillar[]).map(pillar => {
                            const pillarLayers = layers.filter(l => l.pillar === pillar);
                            if (pillarLayers.length === 0) return null;

                            const pillarConfig = {
                                Environmental: { label: 'Ambiental', color: 'text-green-700 dark:text-green-400', icon: <Hexagon className="w-4 h-4 text-green-600" /> },
                                Social: { label: 'Social', color: 'text-orange-700 dark:text-orange-400', icon: <Users className="w-4 h-4 text-orange-600" /> },
                                Governance: { label: 'Governança', color: 'text-blue-700 dark:text-blue-400', icon: <Shield className="w-4 h-4 text-blue-600" /> },
                                Operational: { label: 'Operacional', color: 'text-black dark:text-white', icon: <Navigation className="w-4 h-4 text-black dark:text-white" /> }
                            }[pillar];

                            return (
                                <div key={pillar} className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => togglePillar(pillar)} className="flex-1 flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-zinc-900 rounded-3xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                            <div className="flex items-center gap-2">
                                                {expandedPillars[pillar] ? <ChevronDown size={14} className="text-black dark:text-white" /> : <ChevronRight size={14} className="text-black dark:text-white" />}
                                                {pillarConfig.icon}
                                                <span className={`text-[11px] font-black uppercase ${pillarConfig.color}`}>{pillarConfig.label}</span>
                                            </div>
                                            <span className="text-[11px] font-bold bg-white dark:bg-zinc-800 text-black dark:text-white px-1.5 py-0.5 rounded-full border">{pillarLayers.length}</span>
                                        </button>
                                    </div>

                                    {expandedPillars[pillar] && (
                                        <div className="pl-1 space-y-2 mt-2">
                                            {Object.entries(pillarLayers.reduce((acc, l) => {
                                                const group = l.group || 'Geral';
                                                if (!acc[group]) acc[group] = [];
                                                acc[group].push(l);
                                                return acc;
                                            }, {} as Record<string, Layer[]>)).map(([groupName, groupLayers]) => (
                                                <div key={groupName} className="space-y-1">
                                                    <div className="flex items-center gap-1 group/header">
                                                        <button onClick={() => toggleGroup(groupName)} className="flex-1 flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-3xl transition-all text-left">
                                                            {expandedGroups[groupName] ? <ChevronDown size={12} className="text-black dark:text-white" /> : <ChevronRight size={12} className="text-black dark:text-white" />}
                                                            <Database size={12} className="text-happiness-1" />
                                                            <span className="text-[11px] font-black text-black dark:text-white truncate tracking-tight uppercase">{groupName}</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleGroupVisibility(groupName, groupLayers); }}
                                                            className="p-1.5 text-black hover:text-happiness-1 dark:text-white dark:hover:text-happiness-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover/header:opacity-100"
                                                            title={groupLayers.some(l => l.visible) ? "Ocultar grupo" : "Mostrar grupo"}
                                                        >
                                                            {groupLayers.some(l => l.visible) ? <Eye size={12} /> : <EyeOff size={12} />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeGroup(groupName, groupLayers); }}
                                                            className="p-1.5 text-black hover:text-red-500 dark:text-white dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover/header:opacity-100"
                                                            title="Remover grupo de camadas"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>

                                                    {expandedGroups[groupName] && (
                                                        <div className="pl-4 space-y-0.5 border-l-2 border-gray-100 dark:border-white/5 ml-3">
                                                            {groupLayers.map(layer => (
                                                                <div key={layer.id} onClick={() => focusLayer(layer)} className={`group flex items-center justify-between p-1.5 rounded-3xl transition-all cursor-pointer ${layer.visible ? 'bg-white dark:bg-white/5 shadow-sm border border-gray-100 dark:border-white/5' : 'bg-gray-50/50 dark:bg-transparent opacity-60'} hover:bg-happiness-1/5 mb-0.5`}>
                                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: layer.color }} />
                                                                        <span className={`text-[11px] font-black truncate tracking-tight ${layer.visible ? 'text-black dark:text-white' : 'text-black dark:text-white italic'}`}>
                                                                            {layer.name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <button onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id); }} className="text-black hover:text-happiness-1 dark:text-white dark:hover:text-happiness-1">
                                                                            {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                                                        </button>
                                                                        <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} className="text-black hover:text-red-500 dark:text-white dark:hover:text-red-500 transition-colors">
                                                                            <Trash2 size={12} />
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

                    <div className="p-4 border-t bg-gray-50 dark:bg-zinc-900">
                        <div className="text-[11px] text-black dark:text-white font-bold uppercase tracking-widest flex items-center gap-2">
                            <Navigation size={12} />
                            Poligonal Ativa 2026
                        </div>
                    </div>
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-6 -right-5 z-20 w-5 h-8 bg-white dark:bg-[#1C1C1C] rounded-r-lg border border-l-0 border-gray-200 dark:border-white/5 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors"
                    title={isSidebarOpen ? "Recolher Menu" : "Expandir Menu"}
                >
                    {isSidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                </button>
            </div>

            {/* Main Map Content */}
            <div className="flex-1 relative flex flex-col h-full overflow-hidden rounded-3xl border border-gray-200 dark:border-white/5 shadow-lg">
                <MapContainer
                    center={center}
                    zoom={13}
                    scrollWheelZoom
                    className="h-full w-full"
                    style={{ width: '100%', height: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                        maxZoom={19}
                    />

                    <MapLifecycle onReady={handleMapReady} />

                    {layers.filter(l => l.visible).map(layer => {
                        try {
                            if (!layer.data) return null;

                            if (layer.type === 'MARKER') {
                                const position: LatLngTuple = [layer.data.lat, layer.data.lng];
                                return (
                                    <Marker
                                        key={layer.id}
                                        position={position}
                                        icon={getMarkerIcon(layer.color)}
                                        eventHandlers={{ click: () => setSelectedElement({ layer, position }) }}
                                    />
                                );
                            }

                            if (layer.type === 'POLYGON') {
                                return toRings(layer.data).map((ring, idx) => (
                                    <Polygon
                                        key={`${layer.id}-${idx}`}
                                        positions={ring}
                                        pathOptions={{ color: layer.color, weight: 2, fillColor: layer.color, fillOpacity: 0.3 }}
                                        eventHandlers={{ click: (e: any) => setSelectedElement({ layer, position: [e.latlng.lat, e.latlng.lng] }) }}
                                    />
                                ));
                            }

                            if (layer.type === 'POLYLINE') {
                                return toRings(layer.data).map((path, idx) => (
                                    <Polyline
                                        key={`${layer.id}-${idx}`}
                                        positions={path}
                                        pathOptions={{ color: layer.color, weight: 3 }}
                                        eventHandlers={{ click: (e: any) => setSelectedElement({ layer, position: [e.latlng.lat, e.latlng.lng] }) }}
                                    />
                                ));
                            }
                        } catch (err) {
                            console.error(`Erro ao renderizar camada ${layer.name}:`, err);
                            return null;
                        }
                        return null;
                    })}

                    {selectedElement && (
                        <Popup
                            position={selectedElement.position}
                            maxWidth={400}
                            autoPan
                            eventHandlers={{ remove: () => setSelectedElement(null) }}
                        >
                            <div className="custom-pop-content min-w-[320px] bg-white dark:bg-[#121212] overflow-hidden shadow-2xl rounded-3xl border border-gray-100 dark:border-white/10">
                                {/* Header com Risco */}
                                <div className={`h-1.5 w-full ${selectedElement.layer.details?.risk_level?.includes('Crítico') ? 'bg-red-500' :
                                        selectedElement.layer.details?.risk_level?.includes('Moderado') ? 'bg-amber-500' : 'bg-green-500'
                                    }`} />

                                <div className="p-6 space-y-5">
                                    {/* Identidade */}
                                    <div className="flex items-start gap-4">
                                        {/* Ícone Primeiro */}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${getRiskStyle(selectedElement.layer.details?.risk_level).bg} ${getRiskStyle(selectedElement.layer.details?.risk_level).border}`}>
                                            <MapPin className={`w-6 h-6 ${getRiskStyle(selectedElement.layer.details?.risk_level).color}`} />
                                        </div>

                                        {/* Títulos Depois */}
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-black text-black dark:text-white uppercase tracking-widest">Diagnóstico Social</span>
                                                {selectedElement.layer.details?.risk_level && (
                                                    <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${getRiskStyle(selectedElement.layer.details.risk_level).bg} ${getRiskStyle(selectedElement.layer.details.risk_level).color}`}>
                                                        {selectedElement.layer.details.risk_level.split(' ').pop()}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-black text-black dark:text-white text-xl tracking-tight truncate leading-none">
                                                {selectedElement.layer.name}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Métricas Principais (Estilo CommunityAssessment) */}
                                    <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-bold text-black dark:text-white uppercase tracking-widest block">Famílias</span>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={12} className="text-happiness-1" />
                                                <span className="text-sm font-black text-black dark:text-white">
                                                    {selectedElement.layer.details?.familias || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-bold text-black dark:text-white uppercase tracking-widest block">Perfil</span>
                                            <div className="flex items-center gap-1.5">
                                                <Database size={12} className="text-orange-500" />
                                                <span className="text-sm font-black text-black dark:text-white">
                                                    {selectedElement.layer.details?.tipo || '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-0.5 mt-2">
                                            <span className="text-[11px] font-bold text-black dark:text-white uppercase tracking-widest block">Relacionamento</span>
                                            <StarRating value={selectedElement.layer.details?.relacionamento || 0} />
                                        </div>
                                        <div className="space-y-0.5 mt-2">
                                            <span className="text-[11px] font-bold text-black dark:text-white uppercase tracking-widest block">Demandas</span>
                                            <div className="flex items-center gap-1.5">
                                                <BarChart3 size={12} className="text-amber-500" />
                                                <span className="text-sm font-black text-black dark:text-white">
                                                    {selectedElement.layer.details?.demandas || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recomendação Consultiva Automática se for Crítico */}
                                    {selectedElement.layer.details?.risk_level?.includes('Crítico') && (
                                        <div className="bg-black dark:bg-white p-4 rounded-2xl border border-happiness-1 shadow-lg relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Lightbulb size={16} className="text-happiness-1" />
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle size={14} className="text-happiness-3 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-[11px] font-black uppercase text-happiness-3 block mb-1">Ação Recomendada</span>
                                                    <p className="text-[11px] font-bold text-white dark:text-black leading-relaxed italic">
                                                        "Criação de Fundação Portuária compartilhada para mitigação de impactos locais."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rodapé do Popup */}
                                    <div className="flex items-center gap-1.5 pt-2">
                                        <Clock size={10} className="text-black dark:text-white" />
                                        <span className="text-[11px] font-bold text-black dark:text-white italic">Atualizado em 2026</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    )}
                </MapContainer>
            </div>

            <LayerUploadModal open={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onLayersLoaded={handleLayersImported} />
        </div>
    );
};
