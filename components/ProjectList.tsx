import React, { useEffect, useState } from 'react';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as MapPinIcon,
  Nature as LeafIcon,
  People as UsersIcon,
  VerifiedUser as ShieldIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
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

  const getPilarInfo = (pilar: string) => {
    switch (pilar) {
      case 'Ambiental': return { icon: <LeafIcon fontSize="small" />, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
      case 'Social': return { icon: <UsersIcon fontSize="small" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'Governança': return { icon: <ShieldIcon fontSize="small" />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' };
      default: return { icon: null, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.tema.toLowerCase().includes(filter.toLowerCase()) ||
    p.community.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Search and Action Bar */}
      <div className="p-6 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Portfólio de Projetos Estratégicos
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Gestão integrada da Área de Influência do Itaqui
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <SearchIcon fontSize="small" />
            </div>
            <input
              type="text"
              placeholder="Filtrar projetos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <AddIcon fontSize="small" />
            Novo Projeto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
            Sincronizando Portfólio...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => {
            const pilarInfo = getPilarInfo(p.pilar);
            return (
              <div
                key={p.id}
                className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-white/5 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                {/* Header Card */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${pilarInfo.color}`}>
                    {pilarInfo.icon}
                    {p.pilar}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit?.(p)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:text-primary hover:border-primary transition-colors"
                      title="Editar"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => setProjectToDelete(p.id)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors"
                      title="Excluir"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>

                {/* Title and Theme */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary/80"></span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {p.tema}
                  </span>
                </div>

                {/* ODS Icons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(p.sdg_targets && p.sdg_targets.length > 0 ? p.sdg_targets : [4, 8, 9, 11]).slice(0, 4).map(ods => (
                    <img
                      key={ods}
                      src={`https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-${ods}.svg`}
                      alt={`ODS ${ods}`}
                      className="w-8 h-8 rounded-3xl border border-gray-100 dark:border-white/5"
                      title={`ODS ${ods}`}
                    />
                  ))}
                  {(p.sdg_targets?.length || 0) > 4 && (
                    <div className="w-8 h-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center text-[10px] font-black text-gray-500">
                      +{p.sdg_targets!.length - 4}
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-end justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-red-500">
                      <MapPinIcon style={{ fontSize: 14 }} />
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {p.community}
                      </span>
                    </div>
                    {p.budget && (
                      <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-blue-700 dark:text-blue-400 w-fit">
                        <MoneyIcon style={{ fontSize: 14 }} />
                        <span className="text-xs font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(p.budget))}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'Concluído' ? 'text-emerald-500' :
                      p.status === 'Planejado' ? 'text-amber-500' : 'text-blue-500'
                    }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal Overlay */}
      {projectToDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1C1C] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="h-1.5 w-full bg-red-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                    Alerta de Exclusão
                  </span>
                </div>
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>

              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                Excluir dados deste projeto?
              </h3>

              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-red-500 shrink-0">
                  <DeleteIcon />
                </div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Esta ação é irreversível e removerá permanentemente todos os KPIs e métricas sociais deste registro.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => projectToDelete && handleDelete(projectToDelete)}
                  disabled={isDeleting}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-black text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'CONFIRMAR EXCLUSÃO'
                  )}
                </button>
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold text-sm transition-colors"
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