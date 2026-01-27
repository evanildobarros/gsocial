import React, { useState, useEffect } from 'react';
import {
    Save,
    X as CloseIcon,
    Target,
    Users,
    MapPin,
    BarChart3,
    Calendar,
    Check
} from 'lucide-react';
import { SocialProject, SocialProjectStatus, MATERIALITY_TOPICS } from '../../types';

interface SocialProjectFormProps {
    onSubmit: (project: Omit<SocialProject, 'id'>) => void;
    onCancel: () => void;
    initialData?: Partial<SocialProject>;
}

// ODS Images base URL
const getOdsImage = (id: number) => `https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-${id}.svg`;

const SocialProjectForm: React.FC<SocialProjectFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        budget: initialData?.budget || 0,
        status: (initialData?.status as SocialProjectStatus) || 'planning',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        beneficiariesTarget: initialData?.beneficiariesTarget || 0,
        neighborhoods: initialData?.neighborhoods || [],
        materialityTopics: initialData?.materialityTopics || [],
        sdgTargets: initialData?.sdgTargets || [],
        estimatedImpactValue: initialData?.estimatedImpactValue || 0
    });

    const [sroi, setSroi] = useState<number>(0);
    const [currentNeighborhood, setCurrentNeighborhood] = useState('');

    useEffect(() => {
        if (formData.budget > 0 && formData.estimatedImpactValue > 0) {
            const calculatedSroi = formData.estimatedImpactValue / formData.budget;
            setSroi(parseFloat(calculatedSroi.toFixed(2)));
        } else {
            setSroi(0);
        }
    }, [formData.budget, formData.estimatedImpactValue]);

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        const numericValue = parseFloat(value) / 100;
        setFormData(prev => ({ ...prev, budget: numericValue }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'beneficiariesTarget' || name === 'estimatedImpactValue'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const toggleSdg = (sdgId: number) => {
        setFormData(prev => {
            const includes = prev.sdgTargets.includes(sdgId);
            return {
                ...prev,
                sdgTargets: includes
                    ? prev.sdgTargets.filter(id => id !== sdgId)
                    : [...prev.sdgTargets, sdgId]
            };
        });
    };

    const handleNeighborhoodKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentNeighborhood.trim()) {
            e.preventDefault();
            if (!formData.neighborhoods.includes(currentNeighborhood.trim())) {
                setFormData(prev => ({
                    ...prev,
                    neighborhoods: [...prev.neighborhoods, currentNeighborhood.trim()]
                }));
            }
            setCurrentNeighborhood('');
        }
    };

    const removeNeighborhood = (name: string) => {
        setFormData(prev => ({
            ...prev,
            neighborhoods: prev.neighborhoods.filter(n => n !== name)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, projectedSroi: sroi });
    };

    const toggleMateriality = (topic: string) => {
        setFormData(prev => ({
            ...prev,
            materialityTopics: prev.materialityTopics.includes(topic)
                ? prev.materialityTopics.filter(t => t !== topic)
                : [...prev.materialityTopics, topic]
        }));
    };

    return (
        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-gray-200 dark:border-white/5 animate-in fade-in duration-500">
            {/* Background Decorative Pattern */}
            <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full opacity-50 z-0 pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {initialData ? 'Editar Projeto' : 'Novo Projeto Social'}
                            </h2>
                            <p className="text-sm font-medium text-gray-500 italic">
                                Alinhado ao Plano de Investimento Social da EMAP (Vol. I & III)
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 text-gray-500 font-bold text-sm tracking-wide hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            Descartar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {initialData ? 'Salvar Alterações' : 'Registrar Projeto'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
                    {/* Left Column: Data Input */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <span className="block text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                                📋 DADOS OPERACIONAIS
                            </span>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título do Projeto Social</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Ex: Capacita Itaqui — Solda Industrial"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-lg font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição & Justificativa Estratégica</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Orçamento Estimado</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">R$</span>
                                            <input
                                                type="text"
                                                name="budget"
                                                required
                                                value={formData.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                onChange={handleBudgetChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-lg font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Status Atual</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="planning">Planejamento</option>
                                            <option value="active">Em Execução</option>
                                            <option value="paused">Pausado</option>
                                            <option value="completed">Concluído</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Início do Projeto</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="startDate"
                                                required
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Previsão de Término</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="endDate"
                                                required
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: ESG Intelligence */}
                    <div className="lg:col-span-3 space-y-8">
                        <div>
                            <span className="block text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-4">
                                🎯 IMPACTO & MATERIALIDADE
                            </span>

                            {/* SROI Card */}
                            <div className={`p-6 rounded-3xl border flex items-center justify-between mb-2 ${sroi >= 2
                                    ? 'bg-green-50/50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30'
                                    : 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30'
                                }`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <BarChart3 className="w-4 h-4 text-gray-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Previsão SROI
                                        </span>
                                    </div>
                                    <span className={`text-4xl font-black ${sroi >= 2 ? 'text-green-600' : 'text-blue-600'}`}>
                                        {sroi}x
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 w-32">
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase">Beneficiários</label>
                                        <input
                                            type="number"
                                            name="beneficiariesTarget"
                                            value={formData.beneficiariesTarget}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-right"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase">Impacto (R$)</label>
                                        <input
                                            type="number"
                                            name="estimatedImpactValue"
                                            value={formData.estimatedImpactValue}
                                            onChange={handleChange}
                                            className="w-full px-2 py-1 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-right"
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-gray-400 px-2 italic">
                                Cada R$ 1,00 investido gera <strong>R$ {sroi}</strong> em valor social.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-red-500 w-4 h-4" />
                                <h3 className="text-sm font-black text-gray-900 dark:text-white">Comunidades Beneficiadas</h3>
                                <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 italic">Área de Influência Direta</span>
                            </div>

                            <div className="p-2 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-zinc-900/30">
                                <div className="flex flex-wrap gap-2 mb-2 p-2">
                                    {formData.neighborhoods.map(neighborhood => (
                                        <span key={neighborhood} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg">
                                            {neighborhood}
                                            <button
                                                type="button"
                                                onClick={() => removeNeighborhood(neighborhood)}
                                                className="hover:text-red-500 focus:outline-none"
                                            >
                                                <CloseIcon size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={currentNeighborhood}
                                    onChange={(e) => setCurrentNeighborhood(e.target.value)}
                                    onKeyDown={handleNeighborhoodKeyDown}
                                    placeholder="Digite e aperte Enter..."
                                    className="w-full px-4 py-2 bg-transparent text-sm focus:outline-none placeholder:text-gray-400 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white">Materialidade do Território (Vol. III)</h3>
                            <div className="flex flex-wrap gap-2">
                                {MATERIALITY_TOPICS.map(topic => {
                                    const isSelected = formData.materialityTopics.includes(topic);
                                    return (
                                        <button
                                            key={topic}
                                            type="button"
                                            onClick={() => toggleMateriality(topic)}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${isSelected
                                                    ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                                                    : 'bg-transparent border-gray-200 text-gray-500 hover:border-blue-300'
                                                }`}
                                        >
                                            {isSelected && <Check size={10} strokeWidth={4} />}
                                            {topic}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SDG Selector Bottom Area */}
                <div className="mt-12 pt-10 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">ODS Relacionados (ONU)</h3>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-3">
                        {Array.from({ length: 17 }, (_, i) => i + 1).map(ods => {
                            const isActive = formData.sdgTargets.includes(ods);
                            return (
                                <button
                                    key={ods}
                                    type="button"
                                    onClick={() => toggleSdg(ods)}
                                    className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${isActive
                                            ? 'ring-4 ring-offset-2 ring-blue-500 scale-110 opacity-100 z-10'
                                            : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105'
                                        }`}
                                >
                                    <img
                                        src={getOdsImage(ods)}
                                        alt={`ODS ${ods}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://www.ipea.gov.br/ods/img/ods${ods}.gif`;
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 dark:bg-zinc-900/30 rounded-2xl flex items-center gap-3 text-gray-500 border border-gray-100 dark:border-white/5">
                        <Target className="text-blue-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-medium italic">
                            Selecione os Objetivos de Desenvolvimento Sustentável em que este projeto gera impacto direto, conforme as diretrizes da Equipe ESG EMAP.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SocialProjectForm;
