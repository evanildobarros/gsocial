import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Polyline, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Layers, Eye, EyeOff, Trash2, MapPin, Hexagon, Loader2, Navigation, Route } from 'lucide-react';
import { LayerUploader } from '../LayerUploader';

// --- Types ---
import { Layer } from '../../types';

// --- Mock Data ---
const INITIAL_LAYERS: Layer[] = [
    {
        id: '3',
        name: 'Sensores de Qualidade do Ar',
        type: 'MARKER',
        visible: true,
        color: '#F59E0B', // Yellow
        data: { lat: -2.585, lng: -44.375 },
        pillar: 'Environmental',
        group: 'Monitoramento'
    }
];

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
    // Estado das camadas com persistência no localStorage
    const [layers, setLayers] = useState<Layer[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('gsocial_map_layers');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Erro ao carregar camadas do localStorage:', e);
                    return INITIAL_LAYERS;
                }
            }
        }
        return INITIAL_LAYERS;
    });

    // Salva camadas no localStorage sempre que mudarem
    useEffect(() => {
        localStorage.setItem('gsocial_map_layers', JSON.stringify(layers));
    }, [layers]);

    useEffect(() => {
        if (additionalLayers && additionalLayers.length > 0) {
            console.log('GeoSpatialModule: Receiving additional layers:', additionalLayers.length);
            setLayers(prev => {
                const existingIds = new Set(prev.map(l => l.id));
                const newLayers = additionalLayers.filter(l => !existingIds.has(l.id));
                if (newLayers.length === 0) return prev;
                console.log('GeoSpatialModule: Adding new layers:', newLayers.length);
                return [...prev, ...newLayers];
            });
        }
    }, [additionalLayers]);

    const [selectedElement, setSelectedElement] = useState<any>(null);
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

    // Load Google Maps Script
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
    });

    const containerStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '8px'
    };

    const center = useMemo(() => ({
        lat: -2.58, // Itaqui approximate coordinates
        lng: -44.37
    }), []);

    // Gera uma key única baseada nas camadas visíveis para forçar re-render
    const visibleLayersKey = useMemo(() => {
        return layers.filter(l => l.visible).map(l => l.id).join('-');
    }, [layers]);

    const toggleLayer = useCallback((id: string) => {
        console.log('Toggling layer:', id);
        setLayers(prev => {
            const updated = prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
            console.log('Updated layers:', updated.map(l => ({ id: l.id, name: l.name, visible: l.visible })));
            return updated;
        });
    }, []);

    const handleLayersImported = useCallback((newLayers: Layer[]) => {
        console.log('Importing layers:', newLayers.length);
        setLayers(prev => {
            const existingIds = new Set(prev.map(l => l.id));
            const uniqueNewLayers = newLayers.filter(l => !existingIds.has(l.id));
            return [...prev, ...uniqueNewLayers];
        });
    }, []);

    const removeLayer = useCallback((id: string) => {
        console.log('Removing layer:', id);
        setLayers(prev => prev.filter(l => l.id !== id));
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
            {/* Sidebar / Layer Manager */}
            <div className="w-80 flex flex-col bg-white dark:bg-[#1C1C1C] rounded-sm border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden shrink-0">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
                    <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                        <h2 className="font-bold text-gray-900 dark:text-white text-sm">Gestão de Camadas</h2>
                        <span className="text-[10px] bg-happiness-1/10 text-happiness-1 px-1.5 py-0.5 rounded font-bold">
                            {layers.length}
                        </span>
                    </div>
                </div>

                {/* Layer Uploader */}
                <div className="p-3 border-b border-gray-100 dark:border-white/5">
                    <LayerUploader onLayersLoaded={handleLayersImported} />
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {layers.length === 0 && (
                        <div className="text-center p-4 text-gray-400 text-xs">Nenhuma camada encontrada. Use o botão acima para importar.</div>
                    )}
                    {layers.map(layer => (
                        <div
                            key={layer.id}
                            className={`
                                group flex items-center justify-between p-3 rounded-sm border transition-all cursor-pointer
                                ${layer.visible ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5' : 'bg-transparent border-transparent opacity-60'}
                            `}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <button onClick={() => toggleLayer(layer.id)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white shrink-0">
                                    {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {layer.type === 'POLYGON' && <Hexagon className="w-3 h-3 shrink-0" style={{ color: layer.color }} />}
                                    {layer.type === 'MARKER' && <MapPin className="w-3 h-3 shrink-0" style={{ color: layer.color }} />}
                                    {layer.type === 'POLYLINE' && <Route className="w-3 h-3 shrink-0" style={{ color: layer.color }} />}
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{layer.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-all"
                                    title="Remover camada"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div
                                    className="w-2 h-2 rounded-full shadow-sm shrink-0"
                                    style={{ backgroundColor: layer.color }}
                                />
                            </div>
                        </div>
                    ))}
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

            {/* Map Container */}
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
                    }}
                >
                    {/* Render Polygon Layers */}
                    {layers.filter(l => l.type === 'POLYGON' && l.visible).map(layer => (
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
                    ))}

                    {/* Render Marker Layers */}
                    {layers.filter(l => l.type === 'MARKER' && l.visible).map(layer => (
                        <MarkerF
                            key={`marker-${layer.id}`}
                            position={layer.data as google.maps.LatLngLiteral}
                            onClick={() => setSelectedElement({ type: 'MARKER', layer, position: layer.data })}
                        />
                    ))}

                    {/* Render Polyline Layers */}
                    {layers.filter(l => l.type === 'POLYLINE' && l.visible).map(layer => (
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
                    ))}

                    {/* Info Window */}
                    {selectedElement && (
                        <InfoWindowF
                            position={selectedElement.position}
                            onCloseClick={() => setSelectedElement(null)}
                        >
                            <div className="px-2 py-1 min-w-[150px]">
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{selectedElement.layer.name}</h4>
                                <p className="text-xs text-gray-500">ID: {selectedElement.layer.id}</p>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white mt-2 inline-block`} style={{ backgroundColor: selectedElement.layer.color }}>
                                    {selectedElement.layer.type}
                                </span>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>

                {/* Floating Status Overlay */}
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
        </div>
    );
};
