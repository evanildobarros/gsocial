import { describe, it, expect, beforeEach } from 'vitest';
import {
    getSupportedFormats,
    isFormatSupported,
    parseCsvToLayers,
    parseGeoJsonToLayers,
    parseKmlToLayers,
    resetColorIndex
} from './geoParser';
import { ESGPillar } from '../types';

describe('geoParser - Utilitário de Parsing Geográfico', () => {
    beforeEach(() => {
        resetColorIndex();
    });

    describe('Formatos Suportados', () => {
        it('deve retornar a lista de extensões suportadas', () => {
            const formats = getSupportedFormats();
            expect(formats).toContain('.kml');
            expect(formats).toContain('.geojson');
            expect(formats).toContain('.json');
            expect(formats).toContain('.zip');
            expect(formats).toContain('.csv');
        });

        it('deve validar se um formato é suportado ou não', () => {
            expect(isFormatSupported('mapa.kml')).toBe(true);
            expect(isFormatSupported('MAPA.GEOJSON')).toBe(true);
            expect(isFormatSupported('dados.csv')).toBe(true);
            expect(isFormatSupported('documento.pdf')).toBe(false);
            expect(isFormatSupported('imagem.png')).toBe(false);
        });
    });

    describe('parseCsvToLayers', () => {
        it('deve lançar erro se o CSV estiver vazio ou não contiver dados', () => {
            expect(() => parseCsvToLayers('', 'teste', { pillar: 'Environmental' })).toThrow();
            expect(() => parseCsvToLayers('header1,header2', 'teste', { pillar: 'Environmental' })).toThrow();
        });

        it('deve lançar erro se colunas de latitude/longitude estiverem ausentes', () => {
            const csv = 'nome,descricao\nPonto 1,Descricao 1';
            expect(() => parseCsvToLayers(csv, 'teste', { pillar: 'Environmental' })).toThrow(
                'CSV deve conter colunas de latitude e longitude'
            );
        });

        it('deve parsear com sucesso um CSV com delimitador vírgula e cabeçalhos válidos', () => {
            const csv = 'nome,latitude,longitude,detalhe\nPonto Bacanga,-2.529444,-44.301389,Valor 123';
            const metadata = { name: 'Comunidade', pillar: 'Social' as ESGPillar, group: 'Social Group' };

            const layers = parseCsvToLayers(csv, 'arquivo.csv', metadata);

            expect(layers).toHaveLength(1);
            expect(layers[0].name).toBe('Comunidade'); // Usa o nome personalizado do metadata
            expect(layers[0].type).toBe('MARKER');
            expect(layers[0].data).toEqual({ lat: -2.529444, lng: -44.301389 });
            expect(layers[0].details).toHaveProperty('nome', 'Ponto Bacanga');
            expect(layers[0].details).toHaveProperty('detalhe', 'Valor 123');
            expect(layers[0].pillar).toBe('Social');
            expect(layers[0].group).toBe('Social Group');
        });

        it('deve parsear com sucesso CSV com delimitador ponto e vírgula e vírgula decimal nas coordenadas', () => {
            const csv = 'name;lat;lng\nPonto 1;-2,529;-44,301\nPonto 2;-2,530;-44,302';
            const layers = parseCsvToLayers(csv, 'arquivo_pt_BR.csv', { pillar: 'Environmental' });

            expect(layers).toHaveLength(2);
            expect(layers[0].name).toBe('Ponto 1');
            expect(layers[0].data).toEqual({ lat: -2.529, lng: -44.301 });
            expect(layers[1].name).toBe('Ponto 2');
            expect(layers[1].data).toEqual({ lat: -2.53, lng: -44.302 });
        });
    });

    describe('parseGeoJsonToLayers', () => {
        it('deve lançar erro se o GeoJSON não contiver FeatureCollection', () => {
            expect(() => parseGeoJsonToLayers({}, 'teste', { pillar: 'Environmental' })).toThrow();
            expect(() => parseGeoJsonToLayers({ type: 'FeatureCollection' }, 'teste', { pillar: 'Environmental' })).toThrow();
        });

        it('deve converter Point GeoJSON para camada de marcador', () => {
            const geoJson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { name: 'Marcador 1', Bairro: 'Anjo da Guarda' },
                    geometry: {
                        type: 'Point',
                        coordinates: [-44.3, -2.5]
                    }
                }]
            };

            const layers = parseGeoJsonToLayers(geoJson, 'mapa', { pillar: 'Social' });
            expect(layers).toHaveLength(1);
            expect(layers[0].type).toBe('MARKER');
            expect(layers[0].name).toBe('Anjo da Guarda'); // Bairro tem precedência
            expect(layers[0].data).toEqual({ lat: -2.5, lng: -44.3 });
        });

        it('deve converter Polygon GeoJSON para camada de polígono', () => {
            const geoJson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { name: 'Área Manguezal' },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [-44.3, -2.5],
                                [-44.4, -2.5],
                                [-44.4, -2.6],
                                [-44.3, -2.5]
                            ]
                        ]
                    }
                }]
            };

            const layers = parseGeoJsonToLayers(geoJson, 'mapa', { pillar: 'Environmental' });
            expect(layers).toHaveLength(1);
            expect(layers[0].type).toBe('POLYGON');
            expect(layers[0].name).toBe('Área Manguezal');
            expect(layers[0].data).toEqual([
                { lat: -2.5, lng: -44.3 },
                { lat: -2.5, lng: -44.4 },
                { lat: -2.6, lng: -44.4 },
                { lat: -2.5, lng: -44.3 }
            ]);
        });
    });

    describe('parseKmlToLayers', () => {
        it('deve lançar erro se o KML for malformado ou contiver erro de parse', () => {
            const malformedKml = '<kml><Document><Placemark>'; // Faltam tags de fechamento
            expect(() => parseKmlToLayers(malformedKml, 'mapa', { pillar: 'Environmental' })).toThrow();
        });

        it('deve converter KML válido para camadas do sistema', () => {
            const validKml = `<?xml version="1.0" encoding="UTF-8"?>
            <kml xmlns="http://www.opengis.net/kml/2.2">
              <Document>
                <name>Documento de Teste</name>
                <Placemark>
                  <name>Ponto Itaqui</name>
                  <Point>
                    <coordinates>-44.301389,-2.529444</coordinates>
                  </Point>
                </Placemark>
              </Document>
            </kml>`;

            const layers = parseKmlToLayers(validKml, 'mapa', { pillar: 'Environmental' });
            expect(layers).toHaveLength(1);
            expect(layers[0].name).toBe('Ponto Itaqui');
            expect(layers[0].type).toBe('MARKER');
            expect(layers[0].data).toEqual({ lat: -2.529444, lng: -44.301389 });
        });
    });
});
