import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch relevant data from database
    const [projectsRes, tasksRes, milestonesRes] = await Promise.all([
      supabase.from('tasks').select('project_id').limit(1),
      supabase.from('tasks').select('*').limit(100),
      supabase.from('milestones').select('*').limit(100)
    ]);

    // Build context from database
    const context = {
      totalTasks: tasksRes.data?.length || 0,
      totalMilestones: milestonesRes.data?.length || 0,
      tasks: tasksRes.data || [],
      milestones: milestonesRes.data || []
    };

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an AI assistant for a project management system. You have access to the following data:
- Total Tasks: ${context.totalTasks}
- Total Milestones: ${context.totalMilestones}

Analyze the user's question and provide helpful insights based on the available data. Be concise and actionable.

Available data summary:
Tasks: ${JSON.stringify(context.tasks.slice(0, 5))}
Milestones: ${JSON.stringify(context.milestones.slice(0, 5))}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages.slice(-6), // Keep last 6 messages for context
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-assistant-chat:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: "I'm having trouble processing your request right now. Please try again."
      }),
      { 
        status: 200, // Return 200 to show error message in chat
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
