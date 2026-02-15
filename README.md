# ESGporto - Sistema de Gestão Inteligente ESG do Porto do Itaqui

![ESGporto Dashboard](public/hero-bg.png)

O **ESGporto** é uma plataforma integrada de gestão e inteligência de dados focada nos pilares **Environmental (Ambiental), Social e Governance (Governança)** para o Porto do Itaqui. O sistema visa centralizar, monitorar e otimizar as iniciativas de sustentabilidade e responsabilidade corporativa, alinhando-se aos Objetivos de Desenvolvimento Sustentável (ODS) e às melhores práticas globais (GRI, SASB).

## 🚀 Funcionalidades Principais

### 🌱 Ambiental (Environmental)
- **Gestão de Carbono:** Monitoramento de emissões e estratégias de descarbonização.
- **Eficiência de Recursos:** Controle de consumo de energia e recursos hídricos.
- **Controle de Poluição:** Monitoramento da qualidade do ar, água e gestão de resíduos sólidos e efluentes.
- **Conformidade Legal:** Acompanhamento de licenças e condicionantes ambientais.
- **LAIA Digital:** Levantamento de Aspectos e Impactos Ambientais digitalizado (PC-56).
- **Gestão de Resíduos de Navios:** Controle automatizado de retiradas (PC-112).

### 🤝 Social (Social)
- **Gestão de Projetos Sociais:** Cadastro e acompanhamento de iniciativas comunitárias.
- **Cálculo de SROI:** Análise do Retorno Social sobre Investimento.
- **Mapeamento Territorial:** GIS integrado para visualização de comunidades e áreas de influência.
- **Diversidade & Inclusão:** Dashboards de indicadores demográficos e de inclusão.
- **Direitos Humanos:** Monitoramento de riscos e conformidade na cadeia de valor.

### 🏛️ Governança (Governance)
- **Matriz de Riscos:** Heatmaps dinâmicos para gestão de riscos corporativos e operacionais.
- **Relatórios Integrados:** Geração de relatórios de sustentabilidade e transparência.
- **Auditoria da Cadeia de Valor:** Avaliação e homologação de fornecedores com critérios ESG.
- **Inovação (CRIARE):** Funil de inovação para gestão de ideias e projetos de melhoria.

### 🧠 Inteligência & Estratégia
- **Análise Preditiva:** Modelos de IA para prever tendências e riscos.
- **Central de Diagnósticos:** Autoavaliação de maturidade ESG baseada na ABNT PR 2030.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, Vite, Tailwind CSS, Material UI (MUI).
- **Mapas:** Google Maps API, Leaflet/OpenLayers (suporte a KML/GeoJSON).
- **Backend/Dados:** Supabase (PostgreSQL, Auth, Storage).
- **Linguagem:** TypeScript.

## 📦 Como Rodar Localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- NPM ou Yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/evanildobarros/gsocial.git
cd gsocial
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com suas chaves do Supabase e Google Maps:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

## 📄 Licença

Este projeto é desenvolvido para uso exclusivo do Porto do Itaqui e seus parceiros autorizados.

---
Desenvolvido com ❤️ e Inteligência Artificial para um futuro sustentável.
