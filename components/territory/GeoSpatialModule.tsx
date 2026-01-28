import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Polyline, MarkerF, InfoWindowF } from '@react-google-maps/api';
import {
    Layers, Eye, EyeOff, Trash2, MapPin, Hexagon, Loader2, Navigation,
    Route, Shield, Users, ChevronDown, ChevronUp, AlertTriangle,
    ChevronRight, Database, Wrench, BarChart2, Star, Upload,
    Droplets, Map as MapIcon, X, Info, Clock, CheckCircle2, ChevronLeft
} from 'lucide-react';
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
import { Layer, ESGPillar, LayerType } from '../../types';

// --- Map Styles (Light & Clean) ---
const lightMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
    { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
];

const containerStyle = { width: '100%', height: '100%' };
const center = { lat: -2.5833, lng: -44.2333 }; // Itaqui/São Luís

// Simple Star Rating Component
const StarRating = ({ value }: { value: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star
                key={i}
                className={`w-3 h-3 ${i <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ))}
    </div>
);

// Simple Badge Component
const NotificationBadge = ({ count, color, children }: { count: number; color: string; children: React.ReactNode }) => (
    <div className="relative">
        {children}
        {count > 0 && (
            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 ${color} text-white text-[8px] font-bold rounded-full flex items-center justify-center`}>
                {count}
            </span>
        )}
    </div>
);

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
        Environmental: true, Social: true, Governance: true, Operational: true
    });
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Estado dos Alertas
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [activeAlertTab, setActiveAlertTab] = useState<'environmental' | 'social'>('environmental');

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    });

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
        if (!confirm(`Tem certeza que deseja remover o grupo "${groupName}" e todas as suas ${layersInGroup.length} camadas?`)) return;

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

    const focusLayer = useCallback((layer: Layer) => {
        if (!mapRef || !layer.data) return;

        let bounds = new google.maps.LatLngBounds();
        if (layer.type === 'MARKER') {
            bounds.extend(layer.data as google.maps.LatLngLiteral);
        } else {
            (layer.data as google.maps.LatLngLiteral[]).forEach(point => bounds.extend(point));
        }

        mapRef.fitBounds(bounds);
        if (layer.type === 'MARKER') mapRef.setZoom(15);
    }, [mapRef]);

    const handleLayersImported = (newLayers: Layer[]) => {
        setLayers(prev => [...prev, ...newLayers]);
        setIsUploadModalOpen(false);
        showSuccess(`${newLayers.length} camadas importadas.`);
    };

    const onLoad = useCallback((map: google.maps.Map) => {
        setMapRef(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMapRef(null);
    }, []);

    if (!isLoaded) return (
        <div className="h-full flex items-center justify-center flex-col gap-2 text-gray-500 animate-pulse bg-gray-100 dark:bg-[#1C1C1C] rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin text-happiness-1" />
            <p className="text-sm font-bold">Carregando Módulo Geoespacial...</p>
        </div>
    );

    return (
        <div className={`flex h-[calc(100vh-140px)] animate-in fade-in duration-500 ${isSidebarOpen ? 'gap-6' : 'gap-0'}`}>
            <style>{infoWindowStyle}</style>

            {/* Sidebar / Layer Manager Container */}
            <div className={`relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
                <div className={`w-80 h-full flex flex-col bg-white dark:bg-[#1C1C1C] rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden shrink-0 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                            <Layers size={18} />
                            <h2 className="font-bold text-sm">Gestão de Camadas</h2>
                            <span className="text-[10px] bg-happiness-1/10 text-happiness-1 px-1.5 py-0.5 rounded-3xl font-bold">{layers.length}</span>
                        </div>
                        <button onClick={() => setIsUploadModalOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-3xl transition-colors text-happiness-1" title="Adicionar Camada">
                            <Upload size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-4">
                        {layers.length === 0 && <div className="text-center p-4 text-gray-400 text-xs">Nenhuma camada encontrada.</div>}

                        {(['Environmental', 'Social', 'Governance', 'Operational'] as ESGPillar[]).map(pillar => {
                            const pillarLayers = layers.filter(l => l.pillar === pillar);
                            if (pillarLayers.length === 0) return null;

                            const pillarConfig = {
                                Environmental: { label: 'Ambiental', color: 'text-green-700 dark:text-green-400', icon: <Hexagon className="w-4 h-4 text-green-600" /> },
                                Social: { label: 'Social', color: 'text-orange-700 dark:text-orange-400', icon: <Users className="w-4 h-4 text-orange-600" /> },
                                Governance: { label: 'Governança', color: 'text-blue-700 dark:text-blue-400', icon: <Shield className="w-4 h-4 text-blue-600" /> },
                                Operational: { label: 'Operacional', color: 'text-gray-700 dark:text-gray-400', icon: <Navigation className="w-4 h-4 text-gray-600" /> }
                            }[pillar];

                            return (
                                <div key={pillar} className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => togglePillar(pillar)} className="flex-1 flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-zinc-900 rounded-3xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                            <div className="flex items-center gap-2">
                                                {expandedPillars[pillar] ? <ChevronDown size={14} className="text-gray-600 dark:text-gray-400" /> : <ChevronRight size={14} className="text-gray-600 dark:text-gray-400" />}
                                                {pillarConfig.icon}
                                                <span className={`text-[10px] font-black uppercase ${pillarConfig.color}`}>{pillarConfig.label}</span>
                                            </div>
                                            <span className="text-[9px] font-bold bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded-full border">{pillarLayers.length}</span>
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
                                                            {expandedGroups[groupName] ? <ChevronDown size={12} className="text-gray-900 dark:text-white" /> : <ChevronRight size={12} className="text-gray-900 dark:text-white" />}
                                                            <Database size={12} className="text-happiness-1" />
                                                            <span className="text-[11px] font-black text-gray-900 dark:text-white truncate tracking-tight uppercase">{groupName}</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeGroup(groupName, groupLayers); }}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover/header:opacity-100"
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
                                                                        <span className={`text-[11px] font-black truncate tracking-tight ${layer.visible ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                                                                            {layer.name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <button onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id); }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                                            {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                                                        </button>
                                                                        <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} className="text-gray-400 hover:text-red-500 transition-colors">
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
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Navigation size={12} />
                            Poligonal Ativa 2026
                        </div>
                    </div>
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-6 -right-5 z-20 w-5 h-8 bg-white dark:bg-[#1C1C1C] rounded-r-lg border border-l-0 border-gray-200 dark:border-white/5 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title={isSidebarOpen ? "Recolher Menu" : "Expandir Menu"}
                >
                    {isSidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                </button>
            </div>

            {/* Main Map Content */}
            <div className="flex-1 relative flex flex-col h-full overflow-hidden rounded-3xl border border-gray-200 dark:border-white/5 shadow-lg">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        styles: [], // Clear custom styles to use Google Standard Roadmap
                        streetViewControl: false,
                        mapTypeControl: true,
                        fullscreenControl: true,
                        mapTypeId: 'roadmap'
                    }}
                >
                    {layers.filter(l => l.visible).map(layer => {
                        if (layer.type === 'MARKER') return (
                            <MarkerF key={layer.id} position={layer.data} onClick={() => setSelectedElement({ layer, position: layer.data })} />
                        );
                        if (layer.type === 'POLYGON') return (
                            <Polygon key={layer.id} paths={layer.data} options={{ fillColor: layer.color, fillOpacity: 0.3, strokeColor: layer.color, strokeWeight: 2 }} onClick={(e) => setSelectedElement({ layer, position: e.latLng?.toJSON() })} />
                        );
                        if (layer.type === 'POLYLINE') return (
                            <Polyline key={layer.id} path={layer.data} options={{ strokeColor: layer.color, strokeWeight: 3 }} onClick={(e) => setSelectedElement({ layer, position: e.latLng?.toJSON() })} />
                        );
                        return null;
                    })}

                    {selectedElement && (
                        <InfoWindowF position={selectedElement.position} onCloseClick={() => setSelectedElement(null)}>
                            <div className="custom-pop-content min-w-[300px] bg-white dark:bg-[#121212] overflow-hidden -m-3">
                                <div className="h-1.5 bg-gradient-to-r from-happiness-1 to-blue-600 w-full" />
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white text-lg">{selectedElement.layer.name}</h4>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedElement.layer.pilllar || 'Território'}</span>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center border border-blue-100">
                                            <MapPin className="text-blue-500 w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="space-y-3 py-2 border-y border-gray-100 dark:border-white/5">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-bold text-gray-400 tracking-widest uppercase text-[9px]">Famílias</span>
                                            <span className="font-black text-gray-700 dark:text-gray-200">{selectedElement.layer.details?.familias || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-xs items-center">
                                            <span className="font-bold text-gray-400 tracking-widest uppercase text-[9px]">Relacionamento</span>
                                            <StarRating value={selectedElement.layer.details?.relacionamento || 0} />
                                        </div>
                                    </div>
                                    <button onClick={() => removeLayer(selectedElement.layer.id)} className="w-full py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-3xl border border-red-100">Remover Camada</button>
                                </div>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>

                <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-2 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => { setActiveAlertTab('environmental'); setIsAlertModalOpen(true); }}
                        className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-3xl transition-colors group"
                    >
                        <NotificationBadge count={1} color="bg-green-500">
                            <Droplets className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                        </NotificationBadge>
                    </button>

                    <button
                        onClick={() => { setActiveAlertTab('social'); setIsAlertModalOpen(true); }}
                        className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-3xl transition-colors group"
                    >
                        <NotificationBadge count={4} color="bg-purple-500">
                            <MapIcon className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                        </NotificationBadge>
                    </button>
                </div>
            </div>

            <LayerUploadModal open={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onLayersLoaded={handleLayersImported} />

            {/* Modal de Alertas Detalhado */}
            {isAlertModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header do Modal */}
                        <div className={`p-6 flex items-center justify-between text-white ${activeAlertTab === 'environmental' ? 'bg-green-600' : 'bg-purple-600'}`}>
                            <div className="flex items-center gap-3">
                                {activeAlertTab === 'environmental' ? <Droplets className="w-6 h-6" /> : <MapIcon className="w-6 h-6" />}
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest leading-none">
                                        {activeAlertTab === 'environmental' ? 'Alertas Ambientais' : 'Demandas Sociais'}
                                    </h3>
                                    <p className="text-[10px] opacity-80 font-bold uppercase tracking-tight mt-1">Monitoramento em Tempo Real</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAlertModalOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Conteúdo do Modal */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-zinc-950">
                            {activeAlertTab === 'environmental' ? (
                                <div className="space-y-4">
                                    <div className="bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 p-4 rounded-3xl flex gap-4 animate-pulse">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-3xl h-fit">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Alerta Crítico</span>
                                                <span className="text-[9px] font-bold text-gray-400">Há 12 min</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 italic">Resíduo Fora da Zona COFAM</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                                                Detectado descarte não autorizado nas coordenadas <span className="font-mono">-2.585, -44.372</span>. Protocolo de contingência nível 2 ativado.
                                            </p>
                                            <div className="mt-4 flex gap-2">
                                                <button className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-red-700 transition-colors">Acionar PAM</button>
                                                <button className="px-3 py-1.5 border border-gray-200 dark:border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-gray-50 transition-colors">Ignorar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[
                                        { id: '#TK-902', title: 'Infraestrutura: Vila Maranhão', tags: ['Urgente', 'Infra'], status: 'Aberta' },
                                        { id: '#TK-884', title: 'Saneamento: Itaqui-Bacanga', tags: ['Médio', 'Saúde'], status: 'Análise' },
                                        { id: '#TK-871', title: 'Relocação: Anjo da Guarda', tags: ['Crítico', 'Social'], status: 'Pendente' },
                                        { id: '#TK-855', title: 'Acesso Hídrico: Vila Nova', tags: ['Social'], status: 'Em andamento' },
                                    ].map((tk, idx) => (
                                        <div key={idx} className="bg-white dark:bg-zinc-900 p-4 border border-gray-100 dark:border-white/5 rounded-3xl hover:border-purple-300 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[9px] font-mono font-black text-gray-400">{tk.id}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${tk.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{tk.status}</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 transition-colors">{tk.title}</h4>
                                            <div className="mt-2 flex gap-1">
                                                {tk.tags.map(t => (
                                                    <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-3xl">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer do Modal */}
                        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                            <button
                                onClick={() => setIsAlertModalOpen(false)}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Fechar
                            </button>
                            <button className="px-4 py-2 bg-gray-900 dark:bg-white dark:text-black text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:opacity-90 transition-opacity">
                                Histórico Completo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
