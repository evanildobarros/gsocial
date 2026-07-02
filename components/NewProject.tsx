import React, { useState } from 'react';
import { Sparkles, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { AIAnalysisResult } from '../types';
import { supabase } from '../utils/supabase';
import { showSuccess, showError } from '../utils/notifications';

interface NewProjectProps {
    onBack: () => void;
}

export const NewProject: React.FC<NewProjectProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        pilar: '',
        tema: '',
        objeto: '',
        community: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!formData.name) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('projects')
                .insert([
                    {
                        name: formData.name,
                        pilar: formData.pilar,
                        tema: formData.tema,
                        status: 'Em andamento',
                        community: formData.community,
                        budget: '0' // Default ou vindo da análise
                    }
                ]);

            if (error) throw error;

            showSuccess('Projeto salvo com sucesso!');
            onBack();
        } catch (error: any) {
            console.error("Erro ao salvar projeto:", error);
            showError('Erro ao salvar no banco de dados: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAnalyze = async () => {
        if (!formData.name || !formData.objeto) return;

        setIsAnalyzing(true);
        try {
            const { data, error } = await supabase.functions.invoke('analyze-project', {
                body: {
                    name: formData.name,
                    pilar: formData.pilar,
                    tema: formData.tema,
                    community: formData.community,
                    objeto: formData.objeto
                }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            setAnalysis(data as AIAnalysisResult);
        } catch (error) {
            console.error("AI Error", error);
            showError('Não foi possível gerar a análise. Tente novamente.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
            <button onClick={onBack} className="flex items-center text-black hover:text-happiness-1 transition font-bold uppercase text-[10px] tracking-widest">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-happiness-1 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Cadastrar Iniciativa ESG</h2>
                        <p className="text-happiness-3 text-xs">Conformidade ABNT PR 2030 & Inventário Vol. III</p>
                    </div>
                    <FileText className="w-8 h-8 opacity-50" />
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-black">Nome do Projeto</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border-2 border-gray-100 rounded-3xl p-3 focus:border-happiness-1 focus:outline-none transition text-black placeholder:text-black font-semibold"
                                placeholder="Ex: Monitoramento Hídrico Vila Maranhão"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-black">Pilar ESG</label>
                            <select
                                value={formData.pilar}
                                onChange={e => setFormData({ ...formData, pilar: e.target.value })}
                                className="w-full border-2 border-gray-100 rounded-3xl p-3 focus:border-happiness-1 focus:outline-none bg-white transition text-black font-semibold"
                            >
                                <option value="">Selecione...</option>
                                <option value="Ambiental">Ambiental (E)</option>
                                <option value="Social">Social (S)</option>
                                <option value="Governança">Governança (G)</option>
                            </select>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-bold text-black">Tema Material (Vol. III)</label>
                            <select
                                value={formData.tema}
                                onChange={e => setFormData({ ...formData, tema: e.target.value })}
                                className="w-full border-2 border-gray-100 rounded-3xl p-3 focus:border-happiness-1 focus:outline-none bg-white transition text-black font-semibold"
                            >
                                <option value="">Selecione o tema mapeado...</option>
                                <option>Atração de novos negócios e investimentos</option>
                                <option>Regularidade operacional e licenciamento</option>
                                <option>Saúde e segurança do trabalhador</option>
                                <option>Prevenção de derramamentos</option>
                                <option>Compliance e Integridade</option>
                                <option>Geração de Emprego e Renda</option>
                                <option>Relação com Comunidades do Entorno</option>
                            </select>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-bold text-black">Descrição do Objeto</label>
                            <textarea
                                value={formData.objeto}
                                onChange={e => setFormData({ ...formData, objeto: e.target.value })}
                                rows={3}
                                className="w-full border-2 border-gray-100 rounded-3xl p-3 focus:border-happiness-1 focus:outline-none transition text-black placeholder:text-black font-semibold"
                                placeholder="Descreva as ações, público-alvo e metodologia..."
                            />
                        </div>
                    </div>

                    {/* AI Section */}
                    <div className="bg-gradient-to-br from-happiness-3/10 to-happiness-1/5 p-6 rounded-3xl border border-happiness-3/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-24 h-24 text-happiness-1" />
                        </div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center space-x-2 text-happiness-1">
                                <Sparkles className="w-5 h-5 text-happiness-4" />
                                <span className="font-bold">Análise de Inteligência (Gemini 2.5)</span>
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !formData.name}
                                className="bg-happiness-1 text-white px-4 py-2 rounded-3xl text-sm font-bold hover:opacity-90 transition flex items-center space-x-2 disabled:opacity-50"
                            >
                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Analisar Aderência</span>}
                            </button>
                        </div>

                        {analysis ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white px-4 py-2 rounded-3xl shadow-sm border border-happiness-3/30">
                                        <span className="text-xs text-black uppercase font-bold">Score de Alinhamento</span>
                                        <div className="text-2xl font-bold text-happiness-1">{analysis.alinhamento_score}/100</div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {analysis.ods_relacionados?.map(ods => (
                                            <span key={ods} className="bg-happiness-4/20 text-happiness-5 text-xs px-2 py-1 rounded-3xl font-bold border border-happiness-4/40">
                                                {ods}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/60 p-4 rounded-3xl border border-happiness-3/30">
                                        <h4 className="text-xs font-bold uppercase text-green-700 mb-1">Impactos Positivos</h4>
                                        <p className="text-sm text-black">{analysis.impactos}</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-3xl border border-happiness-3/30">
                                        <h4 className="text-xs font-bold uppercase text-red-700 mb-1">Riscos Mapeados</h4>
                                        <p className="text-sm text-black">{analysis.riscos}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-happiness-1/60 italic">
                                Preencha os dados do projeto e clique em analisar para receber um diagnóstico baseado no Inventário do Porto.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100">
                        <button onClick={onBack} className="px-6 py-3 text-black font-bold hover:text-black transition">Cancelar</button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !formData.name}
                            className="px-8 py-3 bg-happiness-5 text-white font-bold rounded-3xl shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                            Salvar Projeto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};