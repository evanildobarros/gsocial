import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Trash2, Tag, Globe, Hexagon, Users, Shield, Navigation, Database, Loader2 } from 'lucide-react';
import { Layer, ESGPillar } from '../types';
import { processFile, getSupportedFormats, isFormatSupported } from '../utils/geoParser';

interface LayerUploaderInlineProps {
    onLayersLoaded: (layers: Layer[]) => void;
}

type UploadStatus = 'idle' | 'processing' | 'success' | 'error';

interface UploadState {
    status: UploadStatus;
    message: string;
    fileName?: string;
    layersCount?: number;
}

const PILLAR_OPTIONS: { label: string; value: ESGPillar; color: string; icon: React.ReactNode; bg: string; border: string }[] = [
    { label: 'Ambiental', value: 'Environmental', color: 'text-green-600', icon: <Hexagon className="w-5 h-5" />, bg: 'bg-green-500/10', border: 'border-green-500/30' },
    { label: 'Social', value: 'Social', color: 'text-orange-600', icon: <Users className="w-5 h-5" />, bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    { label: 'Governança', value: 'Governance', color: 'text-blue-600', icon: <Shield className="w-5 h-5" />, bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { label: 'Operacional', value: 'Operational', color: 'text-gray-600', icon: <Navigation className="w-5 h-5" />, bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
];

export const LayerUploaderInline: React.FC<LayerUploaderInlineProps> = ({ onLayersLoaded }) => {
    const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle', message: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Form fields
    const [layerName, setLayerName] = useState('');
    const [selectedPillar, setSelectedPillar] = useState<ESGPillar | ''>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setSelectedFile(null);
        setLayerName('');
        setSelectedPillar('');
        setUploadState({ status: 'idle', message: '' });
    };

    const handleFileSelect = (file: File) => {
        if (!isFormatSupported(file.name)) {
            setUploadState({
                status: 'error',
                message: `Formato não suportado. Use: ${getSupportedFormats().join(', ')}`,
                fileName: file.name
            });
            setTimeout(() => setUploadState({ status: 'idle', message: '' }), 3000);
            return;
        }

        setSelectedFile(file);
        if (!layerName) {
            setLayerName(file.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleImport = async () => {
        if (!selectedFile || !selectedPillar || !layerName) return;

        setUploadState({
            status: 'processing',
            message: 'Processando arquivo e injetando metadados...',
            fileName: selectedFile.name
        });

        try {
            const layers = await processFile(selectedFile, {
                name: layerName,
                pillar: selectedPillar as ESGPillar,
                group: layerName
            });

            setUploadState({
                status: 'success',
                message: `${layers.length} camada(s) categorizada(s) e importada(s)!`,
                fileName: selectedFile.name,
                layersCount: layers.length
            });

            onLayersLoaded(layers);

            setTimeout(() => resetForm(), 2000);
        } catch (error) {
            setUploadState({
                status: 'error',
                message: error instanceof Error ? error.message : 'Erro ao processar arquivo',
                fileName: selectedFile.name
            });
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    return (
        <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-900/50">
                <div className="w-10 h-10 bg-happiness-1/10 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-happiness-1" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Importar Mapeamento ESG</h3>
                    <p className="text-xs text-gray-500">Categorização obrigatória para inteligência de dados</p>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Section 1: File Setup */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" /> 1. Arquivo Geoespacial
                    </label>

                    {!selectedFile ? (
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center
                                ${isDragging ? 'border-happiness-1 bg-happiness-1/5 scale-[0.99]' : 'border-gray-200 dark:border-white/10 hover:border-happiness-1/50 hover:bg-gray-50 dark:hover:bg-white/5'}
                            `}
                        >
                            <input ref={fileInputRef} type="file" onChange={onFileChange} accept=".kml,.geojson,.json,.zip,.csv" className="hidden" />
                            <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                                <Upload className={`w-6 h-6 ${isDragging ? 'text-happiness-1' : 'text-gray-400'}`} />
                            </div>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Arraste e solte ou clique para selecionar</p>
                            <p className="text-[10px] text-gray-400">KML, GeoJSON, Shapefile (ZIP) ou CSV</p>
                        </div>
                    ) : (
                        <div className="bg-green-500/5 dark:bg-green-500/10 rounded-lg border border-green-500/20 p-4 flex items-center justify-between animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 truncate">
                                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{selectedFile.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFile(null)} className="p-1.5 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Section 2: Metadata */}
                <div className="space-y-5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" /> 2. Metadados e Categorização
                    </label>

                    <div className="grid grid-cols-1 gap-5">
                        {/* Layer Name (Principal) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Nome da Camada Principal</label>
                            <input
                                type="text"
                                value={layerName}
                                onChange={(e) => setLayerName(e.target.value)}
                                placeholder="Ex: Mapeamento da Poligonal do Porto"
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-happiness-1 focus:ring-1 focus:ring-happiness-1 transition-all outline-none"
                            />
                        </div>

                        {/* ESG Pillar Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Pilar ESG (Categoria)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {PILLAR_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSelectedPillar(opt.value)}
                                        className={`
                                            flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all text-left
                                            ${selectedPillar === opt.value
                                                ? `${opt.bg} ${opt.border} ring-1 ring-inset ring-happiness-1/20 shadow-sm transition-all duration-300`
                                                : 'border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/10'
                                            }
                                        `}
                                    >
                                        <span className={opt.color}>{opt.icon}</span>
                                        <span className={`${opt.color} text-[10px] font-black uppercase tracking-wider`}>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Feedback */}
                {uploadState.status !== 'idle' && (
                    <div className={`p-4 rounded-xl border transition-all animate-in slide-in-from-top-2 ${uploadState.status === 'processing' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100' :
                        uploadState.status === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-100' :
                            'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20'
                        }`}>
                        <div className="flex gap-3">
                            {uploadState.status === 'processing' ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> :
                                uploadState.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                                    <AlertCircle className="w-5 h-5 text-red-500" />}
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{uploadState.status === 'success' ? 'Importação Concluída' : uploadState.status === 'error' ? 'Falha na Importação' : 'Processando...'}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{uploadState.message}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-zinc-900/50 flex justify-end gap-3">
                <button
                    onClick={resetForm}
                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all outline-none"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleImport}
                    disabled={!selectedFile || !selectedPillar || !layerName || uploadState.status === 'processing'}
                    className={`
                        flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg
                        ${!selectedFile || !selectedPillar || !layerName || uploadState.status === 'processing'
                            ? 'bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-happiness-1 hover:bg-happiness-1/90 text-white hover:scale-[1.02] active:scale-[0.98]'
                        }
                    `}
                >
                    {uploadState.status === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                    <span>Finalizar Importação</span>
                </button>
            </div>
        </div>
    );
};

export default LayerUploaderInline;
