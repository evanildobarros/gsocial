import { kml } from '@mapbox/togeojson';
import { Layer } from '../types';

export const parseKmlToLayers = (kmlText: string): Layer[] => {
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
    const geoJson = kml(kmlDoc);

    const layers: Layer[] = [];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

    geoJson.features.forEach((feature: any, index: number) => {
        if (!feature.geometry) return;

        const type = feature.geometry.type;
        // Extract 'Bairro' if present, otherwise use name or fallback
        const layerName = feature.properties?.Bairro || feature.properties?.name || `Layer ${index + 1}`;
        const color = colors[index % colors.length];
        // Gera um ID estável baseado no nome e índice (sem Date.now())
        const layerId = `kml-${index}-${layerName.toLowerCase().replace(/\s+/g, '-')}`;

        if (type === 'Polygon') {
            // Flatten coordinates for Google Maps Polygon path (assuming simple polygon)
            // GeoJSON Polygon coordinates are explicitly an array of linear rings. 
            // The first ring is the exterior ring.
            const coordinates = feature.geometry.coordinates[0];
            const paths = coordinates.map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0]
            }));

            layers.push({
                id: layerId,
                name: layerName,
                type: 'POLYGON',
                visible: true,
                color: color,
                data: paths
            });
        } else if (type === 'Point') {
            const coordinates = feature.geometry.coordinates;
            const position = {
                lat: coordinates[1],
                lng: coordinates[0]
            };

            layers.push({
                id: layerId,
                name: layerName,
                type: 'MARKER',
                visible: true,
                color: color,
                data: position
            });
        }
    });

    return layers;
};
