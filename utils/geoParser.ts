import { kml } from '@mapbox/togeojson';
import shp from 'shpjs';
import { Layer, LayerType, ESGPillar } from '../types';

// Cores para camadas importadas
const LAYER_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#84CC16', // Lime
];

let colorIndex = 0;

const getNextColor = (): string => {
    const color = LAYER_COLORS[colorIndex % LAYER_COLORS.length];
    colorIndex++;
    return color;
};

export interface LayerMetadata {
    name?: string;
    pillar: ESGPillar;
    group?: string;
}

/**
 * Determina a extensão do arquivo e chama o parser específico
 */
export const processFile = async (file: File, metadata: LayerMetadata): Promise<Layer[]> => {
    const fileName = file.name.toLowerCase();
    const baseName = metadata.name || file.name.replace(/\.[^/.]+$/, "");

    try {
        if (fileName.endsWith('.kml')) {
            const text = await file.text();
            return parseKmlToLayers(text, baseName, metadata);
        } else if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
            const text = await file.text();
            const geoJson = JSON.parse(text);
            return parseGeoJsonToLayers(geoJson, baseName, metadata);
        } else if (fileName.endsWith('.zip')) {
            const arrayBuffer = await file.arrayBuffer();
            return parseShpToLayers(arrayBuffer, baseName, metadata);
        } else if (fileName.endsWith('.csv')) {
            const text = await file.text();
            return parseCsvToLayers(text, baseName, metadata);
        } else {
            throw new Error(`Formato de arquivo não suportado: ${fileName}`);
        }
    } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        throw error;
    }
};

/**
 * Converte KML para layers usando @mapbox/togeojson
 */
export const parseKmlToLayers = (kmlText: string, fileName: string, metadata: LayerMetadata): Layer[] => {
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');

    // Verifica se há erros de parsing
    const parseError = kmlDoc.querySelector('parsererror');
    if (parseError) {
        throw new Error('Arquivo KML inválido ou corrompido');
    }

    const geoJson = kml(kmlDoc);
    return parseGeoJsonToLayers(geoJson, fileName, metadata);
};

/**
 * Converte FeatureCollection GeoJSON em array de Layer
 */
export const parseGeoJsonToLayers = (geoJson: any, fileName: string, metadata: LayerMetadata): Layer[] => {
    const layers: Layer[] = [];

    if (!geoJson || !geoJson.features || !Array.isArray(geoJson.features)) {
        throw new Error('GeoJSON inválido: esperado FeatureCollection com features');
    }

    if (geoJson.features.length === 0) {
        throw new Error('GeoJSON não contém nenhuma feature');
    }

    geoJson.features.forEach((feature: any, index: number) => {
        if (!feature.geometry) return;

        const geometryType = feature.geometry.type;
        const props = feature.properties || {};

        // Se o usuário forneceu um nome, usa-o para o primeiro elemento, senão usa do GeoJSON ou fallback
        let layerName = (index === 0 && metadata.name) ? metadata.name :
            (props.Bairro || props.name || props.Name || props.NAME || props.title || props.Title || `${fileName} - ${index + 1}`);

        const color = getNextColor();
        const layerId = `import-${Date.now()}-${index}-${layerName.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`;

        try {
            const layer = convertGeometryToLayer(geometryType, feature.geometry, {
                id: layerId,
                name: layerName,
                color,
                details: props,
                pillar: metadata.pillar,
                group: metadata.group
            });

            if (layer) {
                layers.push(layer);
            }
        } catch (error) {
            console.warn(`Erro ao converter feature ${index}:`, error);
        }
    });

    if (layers.length === 0) {
        throw new Error('Nenhuma camada válida encontrada no arquivo');
    }

    return layers;
};

/**
 * Converte geometria GeoJSON para Layer
 */
const convertGeometryToLayer = (
    geometryType: string,
    geometry: any,
    options: {
        id: string;
        name: string;
        color: string;
        details: Record<string, any>;
        pillar: ESGPillar;
        group?: string;
    }
): Layer | null => {
    const { id, name, color, details, pillar, group } = options;

    const baseLayer = {
        id,
        name,
        visible: true,
        color,
        details,
        pillar,
        group
    };

    switch (geometryType) {
        case 'Point':
            return {
                ...baseLayer,
                type: 'MARKER',
                data: {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0]
                }
            };

        case 'MultiPoint':
            if (geometry.coordinates.length > 0) {
                return {
                    ...baseLayer,
                    type: 'MARKER',
                    data: {
                        lat: geometry.coordinates[0][1],
                        lng: geometry.coordinates[0][0]
                    },
                    details: { ...details, multiPointCount: geometry.coordinates.length }
                };
            }
            return null;

        case 'Polygon':
            const paths = geometry.coordinates[0].map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0]
            }));
            return {
                ...baseLayer,
                type: 'POLYGON',
                data: paths
            };

        case 'MultiPolygon':
            const multiPaths = geometry.coordinates[0][0].map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0]
            }));
            return {
                ...baseLayer,
                type: 'POLYGON',
                data: multiPaths,
                details: { ...details, multiPolygonCount: geometry.coordinates.length }
            };

        case 'LineString':
            const linePath = geometry.coordinates.map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0]
            }));
            return {
                ...baseLayer,
                type: 'POLYLINE',
                data: linePath
            };

        case 'MultiLineString':
            const multiLinePath = geometry.coordinates[0].map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0]
            }));
            return {
                ...baseLayer,
                type: 'POLYLINE',
                data: multiLinePath,
                details: { ...details, multiLineCount: geometry.coordinates.length }
            };

        default:
            console.warn(`Tipo de geometria não suportado: ${geometryType}`);
            return null;
    }
};

/**
 * Converte Shapefile (ZIP) para layers usando shpjs
 */
export const parseShpToLayers = async (arrayBuffer: ArrayBuffer, fileName: string, metadata: LayerMetadata): Promise<Layer[]> => {
    try {
        const geoJson = await shp(arrayBuffer);

        if (Array.isArray(geoJson)) {
            const allLayers: Layer[] = [];
            for (const fc of geoJson) {
                const layers = parseGeoJsonToLayers(fc, fileName, metadata);
                allLayers.push(...layers);
            }
            return allLayers;
        } else {
            return parseGeoJsonToLayers(geoJson, fileName, metadata);
        }
    } catch (error) {
        console.error('Erro ao processar Shapefile:', error);
        throw new Error('Erro ao processar Shapefile. Verifique se o arquivo ZIP contém .shp, .shx e .dbf válidos.');
    }
};

/**
 * Converte CSV com coordenadas para layers de marcadores
 */
export const parseCsvToLayers = (csvText: string, fileName: string, metadata: LayerMetadata): Layer[] => {
    const lines = csvText.trim().split('\n');

    if (lines.length < 2) {
        throw new Error('CSV deve ter pelo menos uma linha de cabeçalho e uma linha de dados');
    }

    const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

    const latIndex = headers.findIndex(h => ['lat', 'latitude', 'y', 'lat.', 'latitude_dd'].includes(h));
    const lngIndex = headers.findIndex(h => ['lng', 'lon', 'long', 'longitude', 'x', 'lon.', 'long.', 'longitude_dd'].includes(h));

    if (latIndex === -1 || lngIndex === -1) {
        throw new Error('CSV deve conter colunas de latitude e longitude');
    }

    const nameIndex = headers.findIndex(h => ['name', 'nome', 'title', 'titulo', 'label', 'description', 'descricao', 'id'].includes(h));

    const layers: Layer[] = [];
    const delimiter = lines[0].includes(';') ? ';' : (lines[0].includes('\t') ? '\t' : ',');

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(delimiter).map(v => v.trim().replace(/['"]/g, ''));
        const lat = parseFloat(values[latIndex]?.replace(',', '.'));
        const lng = parseFloat(values[lngIndex]?.replace(',', '.'));

        if (isNaN(lat) || isNaN(lng)) continue;

        const recordName = (i === 1 && metadata.name) ? metadata.name :
            (nameIndex !== -1 && values[nameIndex] ? values[nameIndex] : `${fileName} - Ponto ${i}`);

        const details: Record<string, any> = {};
        headers.forEach((header, idx) => {
            if (idx !== latIndex && idx !== lngIndex && values[idx]) {
                details[header] = values[idx];
            }
        });

        layers.push({
            id: `csv-${Date.now()}-${i}`,
            name: recordName,
            type: 'MARKER',
            visible: true,
            color: getNextColor(),
            data: { lat, lng },
            details,
            pillar: metadata.pillar,
            group: metadata.group
        });
    }

    return layers;
};

/**
 * Reseta o índice de cores (útil para novos uploads)
 */
export const resetColorIndex = () => {
    colorIndex = 0;
};

/**
 * Retorna os formatos de arquivo suportados
 */
export const getSupportedFormats = (): string[] => {
    return ['.kml', '.geojson', '.json', '.zip', '.csv'];
};

/**
 * Valida se o arquivo é de um formato suportado
 */
export const isFormatSupported = (fileName: string): boolean => {
    const lowerName = fileName.toLowerCase();
    return getSupportedFormats().some(ext => lowerName.endsWith(ext));
};
