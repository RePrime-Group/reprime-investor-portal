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

    const { id, name, username, email, password, is_admin } = await req.json()

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build update object
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (username !== undefined) updateData.username = username.toLowerCase()
    if (email !== undefined) updateData.email = email.toLowerCase()
    if (is_admin !== undefined) updateData.is_admin = is_admin
    if (password) {
      updateData.password_hash = await hashPassword(password)
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No fields to update' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for duplicate email/username if being changed
    if (updateData.email || updateData.username) {
      const orConditions = []
      if (updateData.email) orConditions.push(`email.eq.${updateData.email}`)
      if (updateData.username) orConditions.push(`username.eq.${updateData.username}`)

      const { data: duplicate } = await supabase
        .from('users')
        .select('id')
        .or(orConditions.join(','))
        .neq('id', id)
        .single()

      if (duplicate) {
        return new Response(
          JSON.stringify({ error: 'A user with this email or username already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update user
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, name, username, email, is_admin, created_at, updated_at')
      .single()

    if (error) {
      console.error('Update user error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ user: updatedUser }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Admin update user error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
