import React from 'react';
import { Leaf, Users, ShieldCheck, PieChart, BarChart3, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Diagnóstico ESG (ABNT PR 2030)</h2>
          <p className="text-gray-500">Monitoramento dos pilares do Inventário Vol. II</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase">Itaqui-Bacanga</span>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 uppercase">Maturidade Nível 5</span>
        </div>
      </div>

      {/* ESG Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-100 p-2 rounded-lg"><Leaf className="w-6 h-6 text-green-600" /></div>
            <span className="text-2xl font-bold text-green-600">78%</span>
          </div>
          <h3 className="font-bold text-gray-800">Ambiental</h3>
          <p className="text-xs text-gray-500 mb-4">Foco: Descarbonização & Efluentes</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[78%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-2 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
            <span className="text-2xl font-bold text-blue-600">62%</span>
          </div>
          <h3 className="font-bold text-gray-800">Social</h3>
          <p className="text-xs text-gray-500 mb-4">Foco: Comunidades Ribeirinhas</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[62%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 p-2 rounded-lg"><ShieldCheck className="w-6 h-6 text-amber-600" /></div>
            <span className="text-2xl font-bold text-amber-600">91%</span>
          </div>
          <h3 className="font-bold text-gray-800">Governança</h3>
          <p className="text-xs text-gray-500 mb-4">Foco: Compliance & Transparência</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[91%]"></div>
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-2">
            <PieChart className="w-4 h-4" /> Distribuição ODS (Vol. III)
          </h3>
          <div className="space-y-4">
            {[
              { label: 'ODS 8: Trabalho Decente', val: 85, color: 'bg-blue-600' },
              { label: 'ODS 9: Indústria/Inovação', val: 70, color: 'bg-blue-500' },
              { label: 'ODS 14: Vida na Água', val: 60, color: 'bg-blue-400' },
              { label: 'ODS 11: Cidades Sustentáveis', val: 45, color: 'bg-blue-300' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>{item.label}</span>
                  <span>{item.val}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Materialidade Financeira
          </h3>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-8">1º</span>
                <div className="flex-1 bg-orange-50 p-2 rounded border border-orange-100">
                    <p className="text-sm font-bold text-orange-900">Atração de Novos Negócios</p>
                    <p className="text-xs text-orange-700">Impacto na receita portuária</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-8">2º</span>
                <div className="flex-1 bg-orange-50 p-2 rounded border border-orange-100">
                    <p className="text-sm font-bold text-orange-900">Licenciamento Ambiental</p>
                    <p className="text-xs text-orange-700">Risco operacional crítico</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-8">3º</span>
                <div className="flex-1 bg-orange-50 p-2 rounded border border-orange-100">
                    <p className="text-sm font-bold text-orange-900">Segurança do Trabalho</p>
                    <p className="text-xs text-orange-700">Prevenção de acidentes</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Map */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-blue-900 mb-4">Mapeamento Social Itaqui-Bacanga (Vol. I)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Comunidade / Bairro</th>
                <th className="py-3 px-4">Tema Crítico</th>
                <th className="py-3 px-4">Vulnerabilidade</th>
                <th className="py-3 px-4">Status ESG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-400" /> Vila Bacanga
                </td>
                <td className="py-3 px-4">Saneamento e Saúde</td>
                <td className="py-3 px-4 text-orange-600 font-bold">ALTA</td>
                <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center w-fit gap-1"><AlertCircle className="w-3 h-3"/> EM ATENÇÃO</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-400" /> Anjo da Guarda
                </td>
                <td className="py-3 px-4">Emprego e Renda</td>
                <td className="py-3 px-4 text-yellow-600 font-bold">MÉDIA</td>
                <td className="py-3 px-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center w-fit gap-1"><CheckCircle2 className="w-3 h-3"/> MONITORADO</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-400" /> Porto Grande
                </td>
                <td className="py-3 px-4">Recursos Hídricos/Pesca</td>
                <td className="py-3 px-4 text-red-600 font-bold">CRÍTICA</td>
                <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center w-fit gap-1"><AlertCircle className="w-3 h-3"/> PRIORITÁRIO</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};