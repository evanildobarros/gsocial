import React, { useEffect, useState } from 'react';
import { MapPin, ArrowUpRight, Leaf, Users, ShieldCheck, Loader2, Edit2, Trash2, X } from 'lucide-react';
import { Project } from '../types';
import { supabase } from '../utils/supabase';
import { showSuccess, showError } from '../utils/notifications';

interface ProjectListProps {
  onAddNew?: () => void;
  onEdit?: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onAddNew, onEdit }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      showError('Falha ao carregar projetos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      showSuccess('Projeto removido com sucesso!');
      setProjectToDelete(null);
    } catch (error: any) {
      console.error('Erro na operação de exclusão:', error);
      showError(`Falha ao excluir projeto: ${error.message || 'Erro de conexão'}`);
    } finally {
      setIsDeleting(false);
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
      case 'Ambiental': return 'text-green-600 bg-green-50 border-green-100';
      case 'Social': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Governança': return 'text-purple-600 bg-purple-50 border-purple-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.tema.toLowerCase().includes(filter.toLowerCase()) ||
    p.community.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-white/5 p-6 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Portfólio de Projetos Sociais</h2>
          <p className="text-gray-400 font-medium text-sm mt-1 italic">Gestão integrada da Área de Influência do Itaqui (Dados em Tempo Real)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <SearchIcon sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-happiness-1 transition-colors" />
            <input
              type="text"
              placeholder="Filtrar projetos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-sm text-sm focus:ring-2 focus:ring-happiness-1/20 focus:border-happiness-1 outline-none transition-all w-full md:w-64"
            />
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-6 py-2.5 bg-happiness-1 hover:bg-happiness-2 text-white rounded-sm shadow-lg shadow-happiness-1/20 transition-all font-black text-xs uppercase tracking-widest active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            Novo Projeto
          </button>
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
            <div key={p.id} className="bg-white dark:bg-white/5 rounded-sm shadow-sm border border-gray-100 dark:border-white/10 p-5 hover:shadow-md transition group cursor-pointer h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border flex items-center gap-1 ${getPilarColor(p.pilar)}`}>
                  {getPilarIcon(p.pilar)}
                  {p.pilar}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit?.(p); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 hover:bg-happiness-1 hover:text-white rounded-sm text-happiness-1 transition-all border-2 border-happiness-1/20 hover:border-happiness-1 shadow-sm font-bold text-xs"
                    title="Editar Projeto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>EDITAR</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setProjectToDelete(p.id); }}
                    className="flex items-center justify-center w-10 h-10 bg-white dark:bg-white/5 hover:bg-red-500 hover:text-white rounded-sm text-red-500 transition-all border-2 border-red-100 dark:border-red-900/20 hover:border-red-500 shadow-sm"
                    title="Excluir Projeto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h4 className="font-black text-happiness-1 mb-1 text-xl group-hover:translate-x-1 transition-transform">{p.name}</h4>
              <p className="text-xs text-gray-500 mb-4 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-happiness-1/30"></span>
                {p.tema}
              </p>

              {/* ODS Section in Card */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(p.sdg_targets && p.sdg_targets.length > 0 ? p.sdg_targets : [4, 8, 9, 11]).slice(0, 4).map(ods => (
                  <div key={ods} className="w-7 h-7 rounded-sm overflow-hidden border border-gray-100 shadow-sm" title={`ODS ${ods}`}>
                    <img
                      src={`https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-${ods}.svg`}
                      alt={`ODS ${ods}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(p.sdg_targets?.length || 0) > 4 && (
                  <div className="w-7 h-7 rounded-sm bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">
                    +{p.sdg_targets!.length - 4}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-white/5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3 mr-1 text-red-400" />
                    {p.community}
                  </div>
                  {p.budget && (
                    <div className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded w-fit">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(p.budget))}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-black tracking-[0.2em] px-2 py-1 rounded bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 ${p.status === 'Concluído' ? 'text-green-600' : 'text-happiness-2'}`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-white/5 rounded-sm border-2 border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-400 font-medium">Nenhum projeto encontrado.</p>
            </div>
          )}
        </div>
      )}
      {/* Modal de Confirmação de Exclusão (Design Bloco Premium) */}
      {projectToDelete !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-sm overflow-hidden max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-300 relative">

            {/* Top Border Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-orange-400"></div>

            <button
              onClick={() => setProjectToDelete(null)}
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              {/* Header Label style "Bloco" */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Pilar Social - Alerta</span>
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                Excluir dados deste projeto?
              </h3>

              {/* Bloco de Mensagem */}
              <div className="bg-red-50/50 dark:bg-red-900/10 p-5 rounded-sm border border-red-100/50 dark:border-red-900/20 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 bg-white dark:bg-zinc-800 rounded-sm flex items-center justify-center shadow-sm">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                    Esta ação é irreversível e removerá permanentemente todos os KPIs e métricas sociais deste registro.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleDelete(projectToDelete)}
                  disabled={isDeleting}
                  className="w-full py-4 px-6 bg-red-500 hover:bg-red-600 text-white rounded-sm font-black text-sm shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CONFIRMAR EXCLUSÃO'}
                </button>
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="w-full py-4 px-6 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 rounded-sm font-black text-xs transition-all uppercase tracking-widest"
                >
                  Manter Projeto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Precisamos importar o SearchIcon do Material UI para compatibilidade com o código original
const SearchIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18" height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);