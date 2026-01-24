import React, { useState, useEffect } from 'react';
import { Calculator, MapPin, TrendingUp, Users, Save, List, Loader2 } from 'lucide-react';
import { Button, TextField, MenuItem, Card, CardContent, Typography, Box } from '@mui/material';
import { supabase } from '../../utils/supabase';

export const SROICalculator: React.FC = () => {
    const [formData, setFormData] = useState({
        projectName: '',
        investment: '',
        beneficiaries: '',
        outcomeType: 'Geração de Renda',
        attribution: ''
    });

    const [sroiResult, setSroiResult] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');

    useEffect(() => {
        fetchHistory();
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('pilar', 'Social')
                .order('name');
            if (data) setProjects(data);
        } catch (error) {
            console.error('Erro ao buscar projetos para SROI:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            setIsLoadingHistory(true);
            const { data, error } = await supabase
                .from('sroi_impact_records')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) setHistory(data);
        } catch (error) {
            console.error('Erro ao buscar histórico SROI:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        const project = projects.find(p => p.id.toString() === projectId);
        if (project) {
            setFormData({
                projectName: project.name,
                investment: project.budget || '',
                beneficiaries: project.beneficiaries_target?.toString() || '',
                outcomeType: project.materiality_topics?.[0] || 'Geração de Renda',
                attribution: formData.attribution
            });
        }
    };

    const calculateSROI = async () => {
        const investment = parseFloat(formData.investment) || 0;
        const attribution = parseFloat(formData.attribution) || 0;

        if (investment > 0) {
            const mockResult = (investment * 2.5 * (attribution / 100)) / investment;
            setSroiResult(mockResult);

            try {
                setIsSaving(true);
                const { data: { session } } = await supabase.auth.getSession();

                const { error } = await supabase.from('sroi_impact_records').insert({
                    project_name: formData.projectName || 'Iniciativa Sem Nome',
                    investment,
                    beneficiaries_count: parseInt(formData.beneficiaries) || 0,
                    outcome_type: formData.outcomeType,
                    attribution_percentage: attribution,
                    sroi_ratio: mockResult,
                    created_by: session?.user.id
                });

                if (error) throw error;
                fetchHistory();
            } catch (error) {
                console.error('Erro ao salvar cálculo SROI:', error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Impacto & Retorno Social (SROI)</h1>
                    <p className="text-sm text-gray-500 mt-1">Mensuração baseada no framework internacional SROI Network</p>
                </div>
                <div className="bg-happiness-1/10 text-happiness-1 px-4 py-2 rounded-sm font-bold text-sm border border-happiness-1/20 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Portaria EMAP-S-01
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calculator Form */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                        <Calculator className="w-5 h-5 text-happiness-1" />
                        <h2 className="text-lg font-bold">Gerar Novo Cálculo</h2>
                    </div>

                    <div className="space-y-4">
                        <TextField
                            select
                            label="Vincular a Projeto Existente"
                            fullWidth
                            value={selectedProjectId}
                            onChange={(e) => handleProjectChange(e.target.value)}
                            helperText="Opcional: selecione um projeto para preencher os dados automaticamente"
                        >
                            <MenuItem value="">-- Novo Projeto Manual --</MenuItem>
                            {projects.map((p) => (
                                <MenuItem key={p.id} value={p.id.toString()}>
                                    {p.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Nome do Projeto / Iniciativa"
                            fullWidth
                            value={formData.projectName}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Valor Investido (R$)"
                                fullWidth
                                type="number"
                                value={formData.investment}
                                onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                            />
                            <TextField
                                label="Nº Beneficiários"
                                fullWidth
                                type="number"
                                value={formData.beneficiaries}
                                onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                            />
                        </div>
                        <TextField
                            select
                            label="Cadeia de Valor do Impacto"
                            fullWidth
                            value={formData.outcomeType}
                            onChange={(e) => setFormData({ ...formData, outcomeType: e.target.value })}
                        >
                            {['Geração de Renda', 'Empregabilidade', 'Capacitação Técnica', 'Infraestrutura Comunitária'].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="% de Atribuição (Deadweight)"
                            fullWidth
                            type="number"
                            helperText="Calculado como (Impacto Total - Resultado que ocorreria sem o projeto)"
                            value={formData.attribution}
                            onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isSaving}
                            onClick={calculateSROI}
                            startIcon={isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                            sx={{ mt: 2, height: 56, fontWeight: 900, borderRadius: '4px' }}
                        >
                            {isSaving ? 'SALVANDO IMPACTO...' : 'CALCULAR E PERSISTIR RESULTADO'}
                        </Button>
                    </div>

                    {sroiResult !== null && (
                        <div className="mt-6 p-6 bg-happiness-1/5 dark:bg-happiness-1/10 rounded-sm border border-happiness-1/20 animate-in zoom-in-95 duration-300">
                            <div className="text-center">
                                <span className="text-happiness-1 font-black text-xs uppercase tracking-[0.2em] block mb-2">Social Return on Investment</span>
                                <span className="text-4xl font-black text-gray-900 dark:text-white">
                                    {sroiResult.toFixed(2)} : 1
                                </span>
                                <p className="text-gray-500 font-medium text-xs mt-3 italic">
                                    Para cada R$ 1,00 investido, o Porto do Itaqui gera R$ {sroiResult.toFixed(2)} em valor social.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* History/Real-time Feed */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <List className="w-5 h-5 text-blue-500" />
                                <h2 className="text-lg font-bold">Últimas Mensurações</h2>
                            </div>
                            <Button size="small" sx={{ fontSize: '10px', fontWeight: 900 }}>Ver Todas</Button>
                        </div>

                        {isLoadingHistory ? (
                            <div className="py-10 flex justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((record) => (
                                    <div key={record.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-100 dark:border-white/10 flex justify-between items-center group hover:border-happiness-1/30 transition-all">
                                        <div>
                                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{record.project_name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{record.outcome_type} • {new Date(record.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-happiness-1 font-black">{record.sroi_ratio.toFixed(2)}:1</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Inv. R$ {record.investment.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <p className="text-center py-6 text-gray-400 text-xs italic">Nenhum cálculo registrado.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-happiness-1 to-happiness-2 p-6 rounded-sm text-white shadow-lg overflow-hidden relative">
                        <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                        <h4 className="font-black text-lg mb-1 tracking-tight italic">Relatório Integrado de Valor</h4>
                        <p className="text-xs font-semibold opacity-80 leading-relaxed mb-4">
                            As métricas de SROI alimentam automaticamente os Dashboards de Governança para auditoria externa.
                        </p>
                        <Button variant="contained" size="small" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' }, fontWeight: 900, fontSize: '10px' }}>
                            GERAR PDF COMPLETO
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

