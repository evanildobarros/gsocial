import React from 'react';
import { MapPin, ArrowUpRight, Leaf, Users, ShieldCheck } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  { id: 1, name: 'Programa de Eficiência Hídrica', pilar: 'Ambiental', tema: 'Gestão de Recursos', status: 'Em andamento', community: 'Complexo Portuário' },
  { id: 2, name: 'Cinturão Verde Itaqui-Bacanga', pilar: 'Ambiental', tema: 'Biodiversidade', status: 'Planejado', community: 'Anjo da Guarda' },
  { id: 3, name: 'Escola de Portuários Comunidade', pilar: 'Social', tema: 'Educação e Trabalho', status: 'Em andamento', community: 'Vila Nova' },
  { id: 4, name: 'Inventário de GEE Ciclo 2025', pilar: 'Ambiental', tema: 'Mudanças Climáticas', status: 'Concluído', community: 'Interno' },
  { id: 5, name: 'Portal de Transparência Portuária', pilar: 'Governança', tema: 'Ética e Compliance', status: 'Em andamento', community: 'Geral' },
  { id: 6, name: 'Projeto Partilhar', pilar: 'Social', tema: 'Desenvolvimento Local', status: 'Em andamento', community: 'Vila Maranhão' }
];

export const ProjectList: React.FC = () => {
  const getPilarIcon = (pilar: string) => {
    switch(pilar) {
        case 'Ambiental': return <Leaf className="w-3 h-3" />;
        case 'Social': return <Users className="w-3 h-3" />;
        case 'Governança': return <ShieldCheck className="w-3 h-3" />;
        default: return null;
    }
  };

  const getPilarColor = (pilar: string) => {
    switch(pilar) {
        case 'Ambiental': return 'bg-green-100 text-green-700 border-green-200';
        case 'Social': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Governança': return 'bg-amber-100 text-amber-700 border-amber-200';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Portfólio de Projetos ESG</h2>
          <p className="text-gray-500">Gestão integrada da Área de Influência do Itaqui</p>
        </div>
        <div className="flex gap-2">
           <input type="text" placeholder="Filtrar projetos..." className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border flex items-center gap-1 ${getPilarColor(p.pilar)}`}>
                        {getPilarIcon(p.pilar)}
                        {p.pilar}
                    </span>
                    <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
                <h4 className="font-bold text-blue-900 mb-1 text-lg">{p.name}</h4>
                <p className="text-xs text-gray-500 mb-4">{p.tema}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center text-xs text-gray-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        {p.community}
                    </div>
                    <span className={`text-[10px] font-bold ${p.status === 'Concluído' ? 'text-green-600' : 'text-blue-600'}`}>
                        {p.status.toUpperCase()}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};