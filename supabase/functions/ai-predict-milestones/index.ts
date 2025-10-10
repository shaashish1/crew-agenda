import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    // Fetch project phases (milestones)
    const { data: phases, error: phasesError } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId)
      .order('phase_number', { ascending: true });

    if (phasesError) throw phasesError;

    if (!phases || phases.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No phases found for this project' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an AI Project Management Assistant specializing in milestone prediction and timeline forecasting.
Analyze project phase data and predict completion dates based on:
1. Current progress and status
2. Historical patterns
3. Dependencies between phases
4. Risk factors
5. Resource constraints

Provide realistic predictions with confidence scores and identify risk factors.`;

    const userPrompt = `Analyze these project phases and predict completion dates:

${JSON.stringify(phases, null, 2)}

For each phase, predict:
- Expected completion date
- Confidence score (0-100%)
- Risk factors that could cause delays
- Recommendations to stay on track`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'predict_milestones',
            description: 'Predict milestone completion dates and assess risks',
            parameters: {
              type: 'object',
              properties: {
                predictions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      phase_id: { type: 'string' },
                      phase_name: { type: 'string' },
                      original_target: { type: 'string' },
                      predicted_completion: { type: 'string' },
                      confidence_score: { type: 'number', description: '0-100' },
                      risk_factors: { type: 'array', items: { type: 'string' } },
                      recommendations: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['phase_id', 'phase_name', 'predicted_completion', 'confidence_score']
                  }
                },
                overall_timeline_risk: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                suggested_actions: { type: 'array', items: { type: 'string' } }
              },
              required: ['predictions', 'overall_timeline_risk']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'predict_milestones' } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const predictions = JSON.parse(toolCall.function.arguments);

    // Store predictions in database
    const predictionRecords = predictions.predictions?.map((pred: any) => ({
      project_id: projectId,
      prediction_type: 'milestone_forecast',
      prediction_data: pred,
      confidence_score: pred.confidence_score,
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
      model_version: 'gemini-2.5-flash'
    })) || [];

    if (predictionRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('ai_predictions' as any)
        .insert(predictionRecords);

      if (insertError) {
        console.error('Error storing predictions:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        predictions,
        predictions_stored: predictionRecords.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in ai-predict-milestones:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
