import React, { useEffect, useState } from 'react';
import { MapPin, ArrowUpRight, Leaf, Users, ShieldCheck, Loader2 } from 'lucide-react';
import { Project } from '../types';
import { supabase } from '../utils/supabase';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setProjects(data as Project[]);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPilarIcon = (pilar: string) => {
    switch (pilar) {
      case 'Ambiental': return <Leaf className="w-3 h-3" />;
      case 'Social': return <Users className="w-3 h-3" />;
      case 'Governança': return <ShieldCheck className="w-3 h-3" />;
      default: return null;
    }
  };

  const getPilarColor = (pilar: string) => {
    switch (pilar) {
      case 'Ambiental': return 'bg-green-100 text-green-700 border-green-200';
      case 'Social': return 'bg-happiness-3/10 text-happiness-1 border-happiness-3/30';
      case 'Governança': return 'bg-happiness-4/10 text-happiness-5 border-happiness-4/30';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.community.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-happiness-1 tracking-tight">Portfólio de Projetos ESG</h2>
          <p className="text-gray-500 font-medium italic">Gestão integrada da Área de Influência do Itaqui (Dados em Tempo Real)</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filtrar projetos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-happiness-1 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-happiness-1 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Conectando ao Supabase...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group cursor-pointer h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border flex items-center gap-1 ${getPilarColor(p.pilar)}`}>
                  {getPilarIcon(p.pilar)}
                  {p.pilar}
                </span>
                <div className="text-happiness-4 opacity-0 group-hover:opacity-100 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-black text-happiness-1 mb-1 text-lg group-hover:translate-x-1 transition-transform">{p.name}</h4>
              <p className="text-xs text-gray-500 mb-4">{p.tema}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center text-xs text-gray-400">
                  <MapPin className="w-3 h-3 mr-1" />
                  {p.community}
                </div>
                <span className={`text-[10px] font-black tracking-[0.2em] ${p.status === 'Concluído' ? 'text-green-600' : 'text-happiness-2'}`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">Nenhum projeto encontrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};