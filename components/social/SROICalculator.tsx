import React, { useState } from 'react';
import { Calculator, MapPin, TrendingUp, Users } from 'lucide-react';
import { Button, TextField, MenuItem, Card, CardContent, Typography } from '@mui/material';

export const SROICalculator: React.FC = () => {
    const [formData, setFormData] = useState({
        investment: '',
        beneficiaries: '',
        outcomeType: 'Geração de Renda',
        attribution: ''
    });

    const [sroiResult, setSroiResult] = useState<number | null>(null);

    const calculateSROI = () => {
        // Simplified mock calculation logic
        // In a real scenario, this would involve NPV calculations
        const investment = parseFloat(formData.investment) || 0;
        const attribution = parseFloat(formData.attribution) || 0;

        if (investment > 0) {
            // Mock formula: (Investment * 1.5 (return factor) * (attribution / 100)) / Investment
            const mockResult = (investment * 2.5 * (attribution / 100)) / investment;
            setSroiResult(mockResult);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Calculadora de Impacto (SROI)</h1>
                    <p className="text-sm text-gray-500 mt-1">Mensuração de retorno social sobre investimento</p>
                </div>
                <div className="bg-happiness-1/10 text-happiness-1 px-4 py-2 rounded-sm font-bold text-sm border border-happiness-1/20">
                    Módulo Crítico
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calculator Form */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                        <Calculator className="w-5 h-5 text-happiness-1" />
                        <h2 className="text-lg font-bold">Parâmetros de Cálculo</h2>
                    </div>

                    <div className="space-y-4">
                        <TextField
                            label="Valor Investido (R$)"
                            fullWidth
                            type="number"
                            value={formData.investment}
                            onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                        />
                        <TextField
                            label="Nº Beneficiários Diretos"
                            fullWidth
                            type="number"
                            value={formData.beneficiaries}
                            onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                        />
                        <TextField
                            select
                            label="Tipo de Resultado"
                            fullWidth
                            value={formData.outcomeType}
                            onChange={(e) => setFormData({ ...formData, outcomeType: e.target.value })}
                        >
                            {['Geração de Renda', 'Empregabilidade', 'Saúde', 'Educação'].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="% de Atribuição"
                            fullWidth
                            type="number"
                            helperText="Quanto do resultado é mérito exclusivo do projeto?"
                            value={formData.attribution}
                            onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={calculateSROI}
                            startIcon={<TrendingUp />}
                            sx={{ mt: 2 }}
                        >
                            Calcular SROI Ratio
                        </Button>
                    </div>

                    {sroiResult !== null && (
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-sm border border-green-200 dark:border-green-800 flex items-center justify-between">
                            <span className="text-green-800 dark:text-green-300 font-bold">SROI Ratio Estimado:</span>
                            <span className="text-2xl font-black text-green-700 dark:text-green-400">
                                {sroiResult.toFixed(2)} : 1
                            </span>
                        </div>
                    )}
                </div>

                {/* Geo-Dashboard Placeholder */}
                <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                        <MapPin className="w-5 h-5 text-purple-500" />
                        <h2 className="text-lg font-bold">Mapa de Investimentos: Itaqui-Bacanga</h2>
                    </div>

                    <div className="flex-1 bg-gray-100 dark:bg-white/5 rounded-sm border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center relative overflow-hidden min-h-[300px]">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_S%C3%A3o_Lu%C3%ADs%2C_Maranh%C3%A3o.svg')] bg-cover bg-center" />
                        <div className="text-center p-6 relative z-10">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 font-medium">Visualização Geoespacial</p>
                            <p className="text-xs text-gray-400 mt-1">Exibindo projetos por bairro e valor investido</p>
                        </div>

                        {/* Mock Markers */}
                        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform" title="Projeto Saúde na Comunidade" />

                        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform" title="Escola de Pesca" />
                    </div>
                </div>
            </div>
        </div>
    );
};
