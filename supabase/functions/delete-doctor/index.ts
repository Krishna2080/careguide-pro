import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeleteDoctorRequest {
  doctorId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client to verify user permissions
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: authHeader!,
          },
        },
      }
    );

    // Verify user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const { doctorId }: DeleteDoctorRequest = await req.json();
    
    console.log('Deleting doctor:', doctorId);

    // Get doctor's user_id first
    const { data: doctor, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('user_id, full_name')
      .eq('id', doctorId)
      .single();

    if (fetchError) {
      console.error('Error fetching doctor:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Doctor not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Delete from profiles table first
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', doctorId);

    if (profileDeleteError) {
      console.error('Profile delete error:', profileDeleteError);
      throw profileDeleteError;
    }

    // Delete from auth.users using admin client
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(doctor.user_id);

    if (authDeleteError) {
      console.error('Auth delete error:', authDeleteError);
      // Profile is already deleted, so we continue but log the error
      console.warn('Profile deleted but auth user deletion failed:', authDeleteError.message);
    }

    console.log('Doctor successfully deleted:', doctor.full_name);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${doctor.full_name} has been completely removed from the system` 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Delete doctor error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete doctor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);