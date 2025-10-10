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

    // Fetch project data
    const { data: phases, error: phasesError } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId);

    if (phasesError) throw phasesError;

    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId);

    if (docsError) throw docsError;

    const systemPrompt = `You are an AI Risk Assessment specialist for project management.
Analyze project data to identify potential risks before they materialize using pattern recognition.
Focus on:
1. Timeline risks (delays, dependencies)
2. Resource risks (capacity, skills)
3. Quality risks (testing, documentation)
4. Budget risks (cost overruns)
5. Communication risks (stakeholder alignment)

Provide early warning signals and preventive actions.`;

    const userPrompt = `Analyze this project data and forecast potential risks:

Project Phases:
${JSON.stringify(phases, null, 2)}

Documents Status:
${JSON.stringify(documents?.length || 0)} documents, ${documents?.filter(d => d.status === 'approved').length || 0} approved

Identify:
- Emerging risk patterns
- Probability of each risk (0-100%)
- Potential impact level
- Early warning signals
- Preventive actions`;

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
            name: 'forecast_risks',
            description: 'Forecast potential project risks with preventive actions',
            parameters: {
              type: 'object',
              properties: {
                predicted_risks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      risk_category: { type: 'string' },
                      risk_description: { type: 'string' },
                      probability: { type: 'number', description: '0-100' },
                      potential_impact: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                      early_warning_signals: { type: 'array', items: { type: 'string' } },
                      preventive_actions: { type: 'array', items: { type: 'string' } },
                      similar_past_incidents: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['risk_category', 'risk_description', 'probability', 'potential_impact']
                  }
                },
                portfolio_risk_score: { type: 'number', description: 'Overall risk score 0-100' },
                trending_risk_areas: { type: 'array', items: { type: 'string' } }
              },
              required: ['predicted_risks', 'portfolio_risk_score']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'forecast_risks' } }
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

    const riskForecast = JSON.parse(toolCall.function.arguments);

    // Store risk predictions in database
    const riskRecord = {
      project_id: projectId,
      prediction_type: 'risk_assessment',
      prediction_data: riskForecast,
      confidence_score: riskForecast.portfolio_risk_score,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      model_version: 'gemini-2.5-flash'
    };

    const { error: insertError } = await supabase
      .from('ai_predictions' as any)
      .insert(riskRecord);

    if (insertError) {
      console.error('Error storing risk predictions:', insertError);
    }

    // Create insights for high-probability risks
    const highRiskInsights = riskForecast.predicted_risks
      ?.filter((risk: any) => risk.probability >= 60)
      .map((risk: any) => ({
        insight_type: 'risk_alert',
        title: `Risk Alert: ${risk.risk_category}`,
        description: risk.risk_description,
        severity: risk.potential_impact,
        affected_projects: [projectId],
        action_items: risk.preventive_actions || [],
        status: 'new'
      })) || [];

    if (highRiskInsights.length > 0) {
      const { error: insightsError } = await supabase
        .from('ai_insights' as any)
        .insert(highRiskInsights);

      if (insightsError) {
        console.error('Error storing risk insights:', insightsError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        risk_forecast: riskForecast,
        high_risk_insights_created: highRiskInsights.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in ai-forecast-risks:', error);
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
