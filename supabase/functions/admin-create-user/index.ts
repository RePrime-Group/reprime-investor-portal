import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { verifyJWT } from '../_shared/jwt.ts'
import { hashPassword } from '../_shared/password.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify JWT from X-Auth-Token header
    const token = req.headers.get('X-Auth-Token')
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const payload = await verifyJWT(token)

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    if (!payload.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { name, username, email, password, is_admin } = await req.json()

    // Validate required fields
    if (!name || !username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Name, username, email, and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if email or username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email.toLowerCase()},username.eq.${username.toLowerCase()}`)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'A user with this email or username already exists' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Hash password using PBKDF2
    const password_hash = await hashPassword(password)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password_hash,
        is_admin: is_admin || false,
      })
      .select('id, name, username, email, is_admin, created_at')
      .single()

    if (error) {
      console.error('Create user error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ user: newUser }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Admin create user error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
