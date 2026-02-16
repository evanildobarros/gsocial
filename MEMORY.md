# Memory - Curated Durable Entries

## Notion Integration (2026-02-11)
- Configured Notion integration using token `ntn_23602...`.
- Created `scripts/notion/conexao-notion.js` for direct API manipulation.
- Updated the **"Controle de Aulas"** database in the **"ST 10/25 NOT"** page.
- Task: Updated dates for 10 classes starting today (2026-02-11), skipping the Carnival period (16/02–23/02), resuming on 25/02.
- Task: Changed status of these 10 classes to **"Pendente"**.

## ESG Research (gsocial/docs) – PDF Summary (2026-02-12)

**Documentos PDF extraídos:**  
- `Analise_ESG_Itaqui.pdf` – Análise ESG do Porto de Itaqui (≈694 KB).  
- `Diagnostico_Itaqui_Bacanga.pdf` – Diagnóstico socioeconômico (≈2.5 MB).  
- `Materialidade_Porto_do_Itaqui.pdf` – Matriz de materialidade e priorização (≈774 KB).  
- `pgri-portodoitaqui-v3.pdf`, `pgri-pontadaespera-v3.pdf`, `pgri-cujupe-v3.pdf` – Planos de Gestão de Risco de Impacto (≈5‑7 MB cada).  
- `E3-Plano-de-Descarbonizacao-VF03-Brazilian-Portuguese-Version.pdf` – Plano de descarbonização (≈6.5 MB).  
- `relatorio-da-pegadade-carbono.pdf` – Relatório de pegada de carbono (≈1.3 MB).  
- `correntometria-Itaqui-06-2021.pdf` – Medição de corrente (≈18 MB).  
- Outros PDFs: *...*.

**Principais insights:**  
- **Materialidade:** ranking de temas (ver Tabela 10) – destaque para “Atração de negócios”, “Regularidade operacional”, “Saúde e segurança”.  
- **Stakeholders:** categorias e ranking (Tabelas 3‑8) – governança, mercado, trabalho, cadeia de suprimentos, sociedade.  
- **Dupla Materialidade:** impacto (Tabela 12) e financeira (Tabela 13).  
- **Correlação com ODS:** mapeamento de cada tema a ODS correspondentes (Tabela 14).  
- **Próximas etapas:** institucionalização do Comitê de Sustentabilidade, definição de critérios de priorização, aprovação pela Diretoria, criação da Matriz de Materialidade, integração nos processos de gestão, ciclo contínuo de atualização.  
- **Temas emergentes:** Descarbonização, Mercado/Geopolítica, Social Extendido.

*Todos os PDFs podem ser encontrados em `/home/evanildobarros/Projetos/gsocial/docs/`.*

## System Configuration
- Discussion confirmed: staying with current model (Gemini Plus vs. Gemini API billing differences) rather than switching to Flash.

## Final do Dia Highlights (11/02/2026)
- **gSocial UI/UX**: 
  - Removed search field from main bar.
  - Updated footer year to 2026.
  - Implemented global "Google Sans" font with optimizations.
  - Fixed positioning and logic of trend arrow on Carbon card.
- **ESG Mapping**:
  - Fixed "gray screen" error for MultiPolygons in `geoParser.ts`.
  - Implemented layer persistence in Supabase (`map_layers`) for both Modal and Inline components.
  - Added color picker in import flow.
  - Removed layer deletion button from InfoWindow for security.
- **Data Processing**:
  - Created 100+ `.zip` files of neighborhoods in `/mapas/mapas` for Shapefile import.
  - Mined 6 new technical documents (Decarbonização, Carbon Footprint, PGRIs, Oceanografia).

These entries represent durable insights worth retaining long-term.