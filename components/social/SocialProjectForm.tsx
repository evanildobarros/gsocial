import React, { useState, useEffect } from 'react';
import { SocialProject, SocialProjectStatus, MATERIALITY_TOPICS } from '../../types';
import { Calendar, DollarSign, Users, MapPin, Target, BarChart3, Save, X, Search } from 'lucide-react';
import { Autocomplete, TextField, Chip } from '@mui/material';

interface SocialProjectFormProps {
    onSubmit: (project: Omit<SocialProject, 'id'>) => void;
    onCancel: () => void;
    initialData?: Partial<SocialProject>;
}

const SocialProjectForm: React.FC<SocialProjectFormProps> = ({ onSubmit, onCancel, initialData }) => {
    // Estado do Formulário
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

    // Estado Derivado: SROI
    const [sroi, setSroi] = useState<number>(0);

    // Efeito: Calcula SROI automaticamente
    useEffect(() => {
        if (formData.budget > 0 && formData.estimatedImpactValue > 0) {
            // Fórmula Simples: Valor do Impacto / Orçamento
            const calculatedSroi = formData.estimatedImpactValue / formData.budget;
            setSroi(parseFloat(calculatedSroi.toFixed(2)));
        } else {
            setSroi(0);
        }
    }, [formData.budget, formData.estimatedImpactValue]);

    // Efeito: Sincroniza estado quando initialData mudar
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                budget: initialData.budget || 0,
                status: (initialData.status as SocialProjectStatus) || 'planning',
                startDate: initialData.startDate || '',
                endDate: initialData.endDate || '',
                beneficiariesTarget: initialData.beneficiariesTarget || 0,
                neighborhoods: initialData.neighborhoods || [],
                materialityTopics: initialData.materialityTopics || [],
                sdgTargets: initialData.sdgTargets || [],
                estimatedImpactValue: initialData.estimatedImpactValue || 0
            });
        }
    }, [initialData]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

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

    const toggleNeighborhood = (neighborhood: string) => {
        setFormData(prev => {
            const includes = prev.neighborhoods.includes(neighborhood);
            return {
                ...prev,
                neighborhoods: includes
                    ? prev.neighborhoods.filter(n => n !== neighborhood)
                    : [...prev.neighborhoods, neighborhood]
            };
        });
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            projectedSroi: sroi
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-[95%] mx-auto border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-500">

            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        {initialData ? 'Editar Projeto Social' : 'Novo Projeto Social'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Alinhado ao Plano de Investimento Social da EMAP (Vol. I & III)
                    </p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors">
                        <Save className="w-4 h-4" />
                        {initialData ? 'Salvar Alterações' : 'Registrar Projeto'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Coluna Esquerda: Dados Operacionais */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-l-4 border-blue-500 pl-3">
                        📦 Dados Operacionais
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título do Projeto</label>
                        <input
                            type="text" name="title" required value={formData.title} onChange={handleChange}
                            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Capacita Itaqui - Solda Industrial"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição & Justificativa</label>
                        <textarea
                            name="description" rows={3} required value={formData.description} onChange={handleChange}
                            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                            placeholder="Descreva o objetivo e como ele atende a uma carência comunitária..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Orçamento Estimado</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-sm font-bold text-gray-500">R$</span>
                                <input
                                    type="text"
                                    name="budget"
                                    required
                                    value={formData.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    onChange={handleBudgetChange}
                                    className="w-full pl-10 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 font-mono font-bold text-blue-600 text-lg"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Atual</label>
                            <select
                                name="status" value={formData.status} onChange={handleChange}
                                className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-lg font-medium"
                            >
                                <option value="planning">Planejamento</option>
                                <option value="active">Em Execução</option>
                                <option value="paused">Pausado</option>
                                <option value="completed">Concluído</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Início</label>
                            <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Fim</label>
                            <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-lg" />
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Inteligência ESG */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-l-4 border-green-500 pl-3">
                        🎯 Impacto & Materialidade
                    </h3>

                    {/* SROI Widget */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Previsão SROI (Retorno Social)
                            </h4>
                            <span className={`text-xl font-bold ${sroi >= 1 ? 'text-green-600' : 'text-orange-500'}`}>
                                {sroi}x
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">Beneficiários Diretos</label>
                                <input
                                    type="number" name="beneficiariesTarget" value={formData.beneficiariesTarget} onChange={handleChange}
                                    className="w-full text-sm p-1 border rounded bg-white dark:bg-gray-700" placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">Valor Estimado do Impacto (R$)</label>
                                <input
                                    type="number" name="estimatedImpactValue" value={formData.estimatedImpactValue} onChange={handleChange}
                                    className="w-full text-sm p-1 border rounded bg-white dark:bg-gray-700" placeholder="0.00"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 italic">
                            *Para cada R$ 1,00 investido, o projeto devolve R$ {sroi} em valor social (proxy).
                        </p>
                    </div>

                    {/* Território (Combo Box Autocomplete) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            Comunidades Beneficiadas (Área de Influência Itaqui)
                        </label>
                        <Autocomplete
                            multiple
                            freeSolo
                            id="neighborhoods-autocomplete"
                            options={[]}
                            value={formData.neighborhoods}
                            onChange={(_event, newValue) => {
                                setFormData(prev => ({ ...prev, neighborhoods: newValue }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Digite o nome da comunidade e aperte Enter..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: 'transparent',
                                            '& fieldset': {
                                                borderColor: '#e5e7eb',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    }}
                                />
                            )}
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => {
                                    const { key, ...tagProps } = getTagProps({ index });
                                    return (
                                        <Chip
                                            key={key}
                                            label={option}
                                            {...tagProps}
                                            size="small"
                                            sx={{
                                                borderRadius: '4px',
                                                bgcolor: '#dbeafe',
                                                color: '#1e40af',
                                                fontWeight: 'bold',
                                                fontSize: '10px'
                                            }}
                                        />
                                    );
                                })
                            }
                            className="w-full"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">*Digite para filtrar e selecione as comunidades impactadas.</p>
                    </div>

                    {/* Tema Material (Badges Estilizados) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tema Material Prioritário (Vol. III)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {MATERIALITY_TOPICS.map(topic => {
                                const isSelected = (formData as any).materialityTopics.includes(topic);
                                // Mapeamento de cores conforme o modelo enviado
                                const getTopicColor = (t: string) => {
                                    if (t.includes("Emprego")) return "green";
                                    if (t.includes("Educação")) return "blue";
                                    if (t.includes("Urbana")) return "orange";
                                    if (t.includes("Saúde")) return "purple";
                                    if (t.includes("Alimentar")) return "red";
                                    if (t.includes("Ambiental")) return "teal";
                                    return "blue";
                                };
                                const color = getTopicColor(topic);

                                const styles: Record<string, string> = {
                                    green: isSelected ? "bg-green-600 text-white border-green-700 shadow-md" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                                    blue: isSelected ? "bg-blue-600 text-white border-blue-700 shadow-md" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
                                    orange: isSelected ? "bg-orange-600 text-white border-orange-700 shadow-md" : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
                                    purple: isSelected ? "bg-purple-600 text-white border-purple-700 shadow-md" : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
                                    red: isSelected ? "bg-red-600 text-white border-red-700 shadow-md" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
                                    teal: isSelected ? "bg-teal-600 text-white border-teal-700 shadow-md" : "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
                                };

                                return (
                                    <button
                                        key={topic}
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            materialityTopics: (prev as any).materialityTopics.includes(topic)
                                                ? (prev as any).materialityTopics.filter((t: string) => t !== topic)
                                                : [...(prev as any).materialityTopics, topic]
                                        }))}
                                        className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${styles[color]}`}
                                    >
                                        {topic}
                                        {isSelected && <X className="w-3 h-3" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* ODS Selector - Full Width Bottom Section */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <label className="text-lg font-bold text-gray-800 dark:text-white">
                        ODS Relacionados (ONU)
                    </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-17 gap-2">
                    {Array.from({ length: 17 }, (_, i) => i + 1).map(ods => (
                        <button
                            key={ods}
                            type="button"
                            onClick={() => toggleSdg(ods)}
                            className={`relative aspect-square rounded-lg border-4 transition-all overflow-hidden transform hover:scale-110 active:scale-95 ${formData.sdgTargets.includes(ods)
                                ? 'border-blue-600 shadow-lg z-10 ring-4 ring-blue-600/20'
                                : 'border-transparent grayscale opacity-50 hover:opacity-100 hover:grayscale-0'
                                }`}
                            title={`ODS ${ods}`}
                        >
                            <img
                                src={`https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-${ods}.svg`}
                                alt={`ODS ${ods}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    // Fallback para IPEA caso o servidor da ONU Brasil falhe
                                    target.src = `https://www.ipea.gov.br/ods/img/ods${ods}.gif`;
                                }}
                            />
                            {formData.sdgTargets.includes(ods) && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white p-1 rounded-bl shadow-md">
                                    <X className="w-3 h-3" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                    <p className="text-xs text-gray-500 italic flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        *Selecione os Objetivos de Desenvolvimento Sustentável (ODS) em que este projeto social gera impacto direto ou indireto, conforme os manuais da EMAP e Agenda 2030.
                    </p>
                </div>
            </div>
        </form>
    );
};

export default SocialProjectForm;
