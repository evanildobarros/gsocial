// Edge Function: análise de aderência ESG de projetos via Gemini.
// A chave GEMINI_API_KEY fica em segredo no servidor (supabase secrets set),
// nunca exposta no bundle do front-end.

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `
Você é um consultor ESG sênior especialista no Complexo Portuário do Itaqui (Maranhão).
Baseie-se no Inventário ESG Vol II (Diagnóstico) e Vol III (Materialidade).

CONTEXTO DO PORTO:
- Maturidade: Nível 5 (Máximo na ABNT PR 2030), mas com desafios sociais.
- Prioridades Materiais (Vol III): Atração de Negócios, Regularidade Operacional, Saúde do Trabalhador, Prevenção de Óleo.
- Comunidades Críticas (Vol I/III): Vila Maranhão (pó de minério), Cajueiro (conflito fundiário), Anjo da Guarda (emprego).
- ODS Prioritários: 8, 9, 14, 16.

TAREFA:
Analise a proposta de projeto abaixo e forneça um JSON.
Seja crítico. Se o projeto for genérico, aponte riscos de 'greenwashing'.
Se for robusto, alinhe aos temas materiais.
`;

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const apiKey = Deno.env.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY não configurada nos segredos da função');
        }

        const { name, pilar, tema, community, objeto } = await req.json();
        if (!name || !objeto) {
            return new Response(JSON.stringify({ error: 'Campos obrigatórios: name, objeto' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const userPrompt = `
            PROJETO: ${name}
            PILAR: ${pilar || 'Não informado'}
            TEMA: ${tema || 'Não informado'}
            LOCAL: ${community || 'Não informado'}
            DESCRIÇÃO: ${objeto}
        `;

        const geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] },
                ],
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: 'OBJECT',
                        properties: {
                            impactos: { type: 'STRING', description: 'Análise de impactos positivos reais baseados no território.' },
                            riscos: { type: 'STRING', description: 'Riscos sociais, ambientais ou de governança identificados.' },
                            ods_relacionados: { type: 'ARRAY', items: { type: 'STRING' } },
                            alinhamento_score: { type: 'NUMBER', description: 'Nota de 0 a 100 de alinhamento com a materialidade do Porto.' },
                        },
                    },
                },
            }),
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            console.error('Erro na API do Gemini:', geminiResponse.status, errorBody);
            throw new Error(`Gemini retornou status ${geminiResponse.status}`);
        }

        const result = await geminiResponse.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error('Resposta do Gemini sem conteúdo');
        }

        return new Response(text, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Erro em analyze-project:', error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
