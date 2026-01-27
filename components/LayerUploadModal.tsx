import React, { useState, useRef } from 'react';
import {
    X, Upload, CheckCircle2, AlertCircle, Trash2, Tag, Globe, Hexagon,
    Users, Shield, Navigation, Database, Loader2
} from 'lucide-react';
import { Layer, ESGPillar } from '../types';
import { processFile, getSupportedFormats, isFormatSupported } from '../utils/geoParser';

interface LayerUploadModalProps {
    open: boolean;
    onClose: () => void;
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

export const LayerUploadModal: React.FC<LayerUploadModalProps> = ({ open, onClose, onLayersLoaded }) => {
    const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle', message: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [layerName, setLayerName] = useState('');
    const [selectedPillar, setSelectedPillar] = useState<ESGPillar | ''>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setSelectedFile(null);
        setLayerName('');
        setSelectedPillar('');
        setUploadState({ status: 'idle', message: '' });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleFileSelect = (file: File) => {
        if (!isFormatSupported(file.name)) {
            setUploadState({
                status: 'error',
                message: `Formato não suportado. Use: ${getSupportedFormats().join(', ')}`,
                fileName: file.name
            });
            return;
        }

        setSelectedFile(file);
        if (!layerName) {
            setLayerName(file.name.replace(/\.[^/.]+$/, ""));
        }
        setUploadState({ status: 'idle', message: '' });
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
            setTimeout(() => handleClose(), 1500);
        } catch (error) {
            setUploadState({
                status: 'error',
                message: error instanceof Error ? error.message : 'Erro ao processar arquivo',
                fileName: selectedFile.name
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-happiness-1/10 rounded-3xl flex items-center justify-center">
                            <Database className="w-5 h-5 text-happiness-1" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white leading-tight">Importar Mapeamento ESG</h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Categorização obrigatória para inteligência de dados</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 overflow-y-auto">
                    {/* Section 1: File Setup */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5" /> 1. Arquivo Geoespacial
                        </span>

                        {!selectedFile ? (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleFileSelect(file);
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center
                                    ${isDragging ? 'border-happiness-1 bg-happiness-1/5 scale-[0.99]' : 'border-gray-200 dark:border-white/10 hover:border-happiness-1/50 hover:bg-gray-50 dark:hover:bg-white/5'}
                                `}
                            >
                                <input ref={fileInputRef} type="file" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file);
                                }} accept=".kml,.geojson,.json,.zip,.csv" className="hidden" />
                                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Upload className={`w-8 h-8 ${isDragging ? 'text-happiness-1' : 'text-gray-400'}`} />
                                </div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Arraste e solte ou clique para selecionar</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">KML, GeoJSON, Shapefile (ZIP) ou CSV</p>
                            </div>
                        ) : (
                            <div className="bg-green-500/5 dark:bg-green-500/10 rounded-3xl border border-green-500/20 p-5 flex items-center justify-between animate-in zoom-in-95 duration-200">
                                <div className="flex items-center gap-4 truncate">
                                    <div className="w-10 h-10 bg-green-500/10 rounded-3xl flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-black text-gray-800 dark:text-gray-200 truncate">{selectedFile.name}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedFile(null)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Metadata */}
                    <div className="space-y-6">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5" /> 2. Metadados e Categorização
                        </span>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome da Camada Principal</label>
                                <input
                                    type="text"
                                    value={layerName}
                                    onChange={(e) => setLayerName(e.target.value)}
                                    placeholder="Ex: Mapeamento da Poligonal do Porto"
                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-3xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-happiness-1 focus:ring-1 focus:ring-happiness-1 transition-all outline-none font-bold"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pilar ESG (Categoria)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {PILLAR_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setSelectedPillar(opt.value)}
                                            className={`
                                                flex items-center gap-4 p-4 rounded-3xl border transition-all text-left group
                                                ${selectedPillar === opt.value
                                                    ? `${opt.bg} border-happiness-1/50 ring-1 ring-happiness-1/20`
                                                    : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/10'
                                                }
                                            `}
                                        >
                                            <div className={`w-8 h-8 rounded-3xl flex items-center justify-center transition-colors ${selectedPillar === opt.value ? 'bg-white/50' : 'bg-white dark:bg-black/10'}`}>
                                                <span className={`${opt.color}`}>{opt.icon}</span>
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-wider ${selectedPillar === opt.value ? opt.color : 'text-gray-600 dark:text-gray-400'}`}>
                                                {opt.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Feedback */}
                    {uploadState.status !== 'idle' && (
                        <div className={`p-5 rounded-3xl border transition-all animate-in slide-in-from-top-2 ${uploadState.status === 'processing' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100' :
                            uploadState.status === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-100' :
                                'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20'
                            }`}>
                            <div className="flex gap-4">
                                {uploadState.status === 'processing' ? <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> :
                                    uploadState.status === 'success' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> :
                                        <AlertCircle className="w-6 h-6 text-red-500" />}
                                <div className="flex-1">
                                    <p className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                                        {uploadState.status === 'success' ? 'Importação Concluída' : uploadState.status === 'error' ? 'Falha na Importação' : 'Processando...'}
                                    </p>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium mt-1">{uploadState.message}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-zinc-900/50 flex justify-between gap-4">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 rounded-full text-sm font-black text-gray-500 hover:text-gray-800 dark:hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!selectedFile || !selectedPillar || !layerName || uploadState.status === 'processing'}
                        className={`
                            flex items-center gap-3 px-10 py-3 rounded-3xl text-xs font-black transition-all shadow-lg uppercase tracking-widest
                            ${!selectedFile || !selectedPillar || !layerName || uploadState.status === 'processing'
                                ? 'bg-gray-200 dark:bg-white/5 text-gray-400 shadow-none cursor-not-allowed'
                                : 'bg-happiness-1 hover:bg-happiness-1/90 text-white hover:scale-105'
                            }
                        `}
                    >
                        {uploadState.status === 'processing' ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
                        Finalizar Importação
                    </button>
                </div>
            </div>
        </div>
    );
};
