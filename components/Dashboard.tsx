import React from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Map as MapIcon,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Globe
} from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
      </div>
      <div className={`p-2 rounded-xl ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs font-black ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
        {change}
      </span>
      <span className="text-xs font-bold text-gray-400">vs mês anterior</span>
    </div>
    {/* Mini Sparkline Simulation */}
    <div className="mt-4 h-8 flex items-end gap-1">
      {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm transition-all duration-500`}
          style={{ height: `${h}%`, backgroundColor: color, opacity: 0.2 + (i * 0.08) }}
        ></div>
      ))}
    </div>
  </div>
);

const CommunityLeader = ({ name, role, status, avatar }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-happiness-1 to-happiness-2 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
        {avatar}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 group-hover:text-happiness-1 transition-colors">{name}</p>
        <p className="text-xs font-medium text-gray-400">{role}</p>
      </div>
    </div>
    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
      {status}
    </span>
  </div>
);

const ODSCard = ({ icon: Icon, title, value, color, change }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 duration-300 shadow-lg" style={{ backgroundColor: color }}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <span className="text-[10px] font-bold text-green-500 flex items-center">
          <ArrowUpRight className="w-3 h-3" /> {change}
        </span>
      </div>
      <h4 className="text-xl font-black text-gray-900">{value}</h4>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Painel de Impacto</h2>
          <p className="text-gray-500 font-medium">Visualização em tempo real das metas ESG (Porto do Itaqui).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Nível de Maturidade 5</span>
          </div>
          <button className="bg-happiness-1 text-white p-2.5 rounded-xl shadow-lg shadow-happiness-1/20 hover:scale-105 active:scale-95 transition-all">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Novas Iniciativas"
          value="24"
          change="12%"
          isPositive={true}
          color="#154DBF"
        />
        <StatCard
          title="Líderes Engajados"
          value="156"
          change="4.5%"
          isPositive={true}
          color="#10B981"
        />
        <StatCard
          title="Investimento Social"
          value="R$ 1.2M"
          change="2.1%"
          isPositive={false}
          color="#F2BE5E"
        />
      </div>

      {/* Map & Leaders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <MapIcon className="w-6 h-6 text-happiness-1" /> Geo-Localização de Impacto
              </h3>
              <p className="text-sm text-gray-500 font-medium">Distribuição das ações nas comunidades do entorno.</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="relative aspect-[16/9] bg-happiness-3/10 rounded-2xl overflow-hidden border-2 border-dashed border-happiness-3/30 flex items-center justify-center">
            {/* Map Placeholder Graphic */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg viewBox="0 0 800 400" className="w-full h-full text-happiness-1 fill-current">
                <path d="M150,100 Q200,50 300,100 T500,150 Q600,200 700,100 L750,300 Q650,350 500,300 T200,350 Z" />
              </svg>
            </div>

            {/* Interactive Points */}
            <div className="absolute top-1/4 left-1/4 group/dot">
              <div className="w-6 h-6 bg-happiness-1 rounded-full border-4 border-white shadow-xl animate-bounce"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-gray-100 whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-all duration-300">
                <p className="text-[10px] font-black uppercase text-happiness-1">Vila Maranhão</p>
                <p className="text-xs font-bold text-gray-700">8 Propostas Ativas</p>
              </div>
            </div>

            <div className="absolute bottom-1/3 right-1/4 group/dot2">
              <div className="w-6 h-6 bg-happiness-5 rounded-full border-4 border-white shadow-xl"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-gray-100 whitespace-nowrap opacity-0 group-hover/dot2:opacity-100 transition-all duration-300">
                <p className="text-[10px] font-black uppercase text-happiness-5">Anjo da Guarda</p>
                <p className="text-xs font-bold text-gray-700">Em Monitoramento</p>
              </div>
            </div>

            <span className="text-xs font-black text-blue-300 uppercase tracking-[0.3em]">Map Visualization Engine</span>
          </div>

          <div className="mt-8 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-happiness-1 rounded-full shadow-lg shadow-happiness-1/20"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ações Sociais</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-happiness-5 rounded-full shadow-lg shadow-happiness-5/20"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Alertas de Riscos</span>
            </div>
          </div>
        </div>

        {/* Leaders Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Líderes Sociais</h3>
            <button className="text-happiness-1 text-xs font-black uppercase tracking-widest hover:underline decoration-2">Ver Todos</button>
          </div>
          <div className="space-y-2">
            <CommunityLeader name="Dona Maria" role="Presidente Vila Maranhão" status="Ativo" avatar="DM" />
            <CommunityLeader name="João Pedro" role="Assoc. Porto Grande" status="Ativo" avatar="JP" />
            <CommunityLeader name="Ana Paula" role="Conselho Bacanga" status="Pendentes" avatar="AP" />
            <CommunityLeader name="Ricardo" role="Cooperativa Pesca" status="Ativo" avatar="RC" />
          </div>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ODSCard
          icon={CheckCircle2}
          title="Compliance ODS"
          value="94.2%"
          color="#10B981"
          change="+2.4%"
        />
        <ODSCard
          icon={Users}
          title="Impacto Humano"
          value="12.5k"
          color="#154DBF"
          change="+18%"
        />
        <ODSCard
          icon={AlertCircle}
          title="Riscos Geridos"
          value="08"
          color="#EF4444"
          change="-12%"
        />
        <ODSCard
          icon={DollarSign}
          title="Valor Social"
          value="R$ 450k"
          color="#F2BE5E"
          change="+5.2%"
        />
      </div>
    </div>
  );
};