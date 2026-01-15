import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { email, password, full_name, role } = await req.json()

    // 1. Criar usuário no Auth
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name },
      email_confirm: true
    })

    if (authError) throw authError

    // 2. Inserir na tabela profiles (se o trigger não fizer isso automaticamente)
    // Nota: Muitas configs do Supabase têm um trigger que já faz isso.
    // Vamos tentar inserir/atualizar para garantir.
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email,
        full_name,
        role,
        created_at: new Date().toISOString()
      })

    if (profileError) {
      // Se der erro no profile, vamos pelo menos retornar o usuário criado
      console.error('Erro ao criar perfil:', profileError)
    }

    return new Response(
      JSON.stringify({ message: 'Usuário criado com sucesso', user: authData.user }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
