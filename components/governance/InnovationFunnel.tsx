import React, { useState, useEffect } from 'react';
import { Lightbulb, Rocket, Target, BarChart3, Plus, ArrowRight, Heart, Zap, Sparkles, Loader2 } from 'lucide-react';
import { InnovationIdea } from '../../types';
import { supabase } from '../../utils/supabase';

export const InnovationFunnel: React.FC = () => {
    const [ideas, setIdeas] = useState<InnovationIdea[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('innovation_ideas')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setIdeas(data as InnovationIdea[]);
        } catch (error) {
            console.error('Erro ao buscar ideias de inovação:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStageCount = (stageName: string) => {
        return ideas.filter(i => i.stage === stageName).length;
    };

    const stages = [
        { name: 'Ideation (CRIARE)', icon: <Lightbulb className="w-5 h-5" />, color: 'bg-yellow-500', count: getStageCount('Ideation (CRIARE)') },
        { name: 'Screening', icon: <Zap className="w-5 h-5" />, color: 'bg-blue-500', count: getStageCount('Screening') },
        { name: 'Project Execution', icon: <Rocket className="w-5 h-5" />, color: 'bg-purple-500', count: getStageCount('Project Execution') },
        { name: 'Value Realization', icon: <Target className="w-5 h-5" />, color: 'bg-green-500', count: getStageCount('Value Realization') }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-[#1C1C1C] to-gray-800 p-8 rounded-sm text-white shadow-2xl gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-400" /> Roda da Inovação
                    </h2>
                    <p className="text-gray-400 font-medium italic mt-2">Funil de Ideias e Melhoria Contínua EMAP (CRIARE)</p>
                </div>
                <button className="bg-happiness-1 text-white px-8 py-4 rounded-sm font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-happiness-1/20 hover:scale-105 transition-all w-full md:w-auto">
                    <Plus className="w-5 h-5" /> Submeter Ideia
                </button>
            </div>

            {/* Funnel Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stages.map((stage, i) => (
                    <div key={i} className="relative group">
                        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm group-hover:shadow-md transition-all text-center space-y-3">
                            <div className={`${stage.color} text-white w-12 h-12 rounded-sm flex items-center justify-center mx-auto shadow-lg`}>
                                {stage.icon}
                            </div>
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stage.name}</h4>
                            <p className="text-3xl font-black text-gray-900">{stage.count}</p>
                        </div>
                        {i < 3 && (
                            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 bg-gray-50 rounded-full border border-gray-100">
                                <ArrowRight className="w-4 h-4 text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Ideas List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-happiness-1 animate-spin" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Carregando Portfólio de Inovação...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {ideas.map(idea => (
                        <div key={idea.id} className="bg-white p-8 rounded-sm border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-happiness-1/30 transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${idea.impact_area === 'Environmental' ? 'bg-green-500' :
                                        idea.impact_area === 'Operational' ? 'bg-blue-500' :
                                            idea.impact_area === 'Social' ? 'bg-happiness-1' : 'bg-gray-500'
                                        }`}>
                                        {idea.impact_area}
                                    </span>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                        <BarChart3 className="w-3.5 h-3.5 text-happiness-1" />
                                        <span className="text-[10px] font-black text-gray-900">{idea.alignment_score}% Alinhamento</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 leading-tight">{idea.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed italic line-clamp-2">
                                    "{idea.description}"
                                </p>
                            </div>

                            <div className="pt-8 border-t border-gray-50 mt-8 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-happiness-3/20 flex items-center justify-center text-happiness-1 font-black text-[10px]">
                                        {idea.author_id.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-900 uppercase">Autor: {idea.author_id.substring(0, 8)}...</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{idea.stage}</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-happiness-1 uppercase tracking-widest hover:underline flex items-center gap-1">
                                    Ver Projeto <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {ideas.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-sm border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">Nenhuma ideia submetida ainda.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Criare Branding */}
            <div className="bg-gradient-to-r from-happiness-1/5 to-happiness-3/5 p-8 rounded-sm border border-happiness-1/10 flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-sm shadow-sm flex items-center justify-center border border-happiness-1/20 shrink-0">
                    <Heart className="w-8 h-8 text-happiness-1 fill-happiness-1" />
                </div>
                <div>
                    <h4 className="text-gray-900 font-black text-lg">Cultura de Melhoria Contínua</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed italic">
                        O Programa CRIARE estimula funcionários a proporem soluções que reduzam custos, melhorem a segurança ou impulsionem as metas ESG do Porto do Itaqui.
                    </p>
                </div>
            </div>
        </div>
    );
};

