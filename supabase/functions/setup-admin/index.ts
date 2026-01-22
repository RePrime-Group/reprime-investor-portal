import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { hashPassword } from '../_shared/password.ts'

// ONE-TIME SETUP FUNCTION - Delete after creating admin user
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, username, email, password, setup_key } = await req.json()

    // Simple protection - change this key before deploying
    if (setup_key !== 'reprime-setup-2024') {
      return new Response(
        JSON.stringify({ error: 'Invalid setup key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!name || !username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'All fields required: name, username, email, password' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Hash password
    const password_hash = await hashPassword(password)

    // Create admin user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password_hash,
        is_admin: true,
      })
      .select('id, name, username, email, is_admin')
      .single()

    if (error) {
      console.error('Setup error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'Admin user created successfully!',
        user
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ error: 'Setup failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
