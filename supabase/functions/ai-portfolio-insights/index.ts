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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    // Fetch all project data
    const { data: phases, error: phasesError } = await supabase
      .from('project_phases')
      .select('*')
      .order('created_at', { ascending: false });

    if (phasesError) throw phasesError;

    // Group phases by project
    const projectsMap = new Map();
    phases?.forEach(phase => {
      if (!projectsMap.has(phase.project_id)) {
        projectsMap.set(phase.project_id, {
          project_id: phase.project_id,
          phases: []
        });
      }
      projectsMap.get(phase.project_id).phases.push(phase);
    });

    const projects = Array.from(projectsMap.values());

    // Prepare context for AI
    const portfolioContext = {
      total_projects: projects.length,
      projects: projects.map(p => ({
        project_id: p.project_id,
        phase_count: p.phases.length,
        current_phase: p.phases[0]?.phase_name || 'Unknown',
        status: p.phases[0]?.status || 'unknown',
        gate_approved: p.phases.filter((ph: any) => ph.gate_approved).length,
        total_phases: p.phases.length
      }))
    };

    const systemPrompt = `You are an AI Portfolio Management Assistant for a PMO managing 40+ IT projects. 
Analyze the portfolio data and provide executive-level insights for CIO/CEO decision-making.

Focus on:
1. Portfolio health and overall trends
2. Critical attention areas requiring immediate action
3. Opportunities for optimization
4. Risk patterns across the portfolio
5. Resource utilization insights
6. Actionable recommendations with urgency levels

Be concise, data-driven, and actionable. Use specific project references where relevant.`;

    const userPrompt = `Analyze the following portfolio data and generate executive insights:

${JSON.stringify(portfolioContext, null, 2)}

Provide a comprehensive analysis covering:
- Executive summary (2-3 sentences)
- Portfolio health score (0-100) with justification
- Count of projects requiring critical attention
- Key opportunities
- Top 3-5 recommended interventions with urgency levels
- Trend analysis (improving/declining/stable projects)`;

    // Call Lovable AI Gateway
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
            name: 'generate_portfolio_insights',
            description: 'Generate comprehensive portfolio insights for executive decision-making',
            parameters: {
              type: 'object',
              properties: {
                executive_summary: { type: 'string', description: 'Brief 2-3 sentence summary' },
                portfolio_health_score: { type: 'number', description: 'Score from 0-100' },
                health_justification: { type: 'string', description: 'Why this score?' },
                critical_attention_count: { type: 'number', description: 'Number of projects needing immediate attention' },
                critical_projects: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      project_id: { type: 'string' },
                      reason: { type: 'string' },
                      urgency: { type: 'string', enum: ['immediate', 'this_week', 'this_month'] }
                    }
                  }
                },
                opportunities: {
                  type: 'array',
                  items: { type: 'string' }
                },
                recommended_interventions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      action: { type: 'string' },
                      expected_impact: { type: 'string' },
                      urgency: { type: 'string', enum: ['immediate', 'this_week', 'this_month'] },
                      affected_projects: { type: 'array', items: { type: 'string' } }
                    }
                  }
                },
                trend_analysis: {
                  type: 'object',
                  properties: {
                    improving: { type: 'array', items: { type: 'string' } },
                    declining: { type: 'array', items: { type: 'string' } },
                    stable: { type: 'array', items: { type: 'string' } }
                  }
                }
              },
              required: ['executive_summary', 'portfolio_health_score', 'critical_attention_count', 'recommended_interventions']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_portfolio_insights' } }
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

    const insights = JSON.parse(toolCall.function.arguments);

    // Store insights in database
    const criticalInsights = insights.critical_projects?.map((cp: any) => ({
      insight_type: 'risk_alert',
      title: `Critical Attention Required: Project ${cp.project_id}`,
      description: cp.reason,
      severity: cp.urgency === 'immediate' ? 'critical' : 'high',
      affected_projects: [cp.project_id],
      action_items: [],
      status: 'new'
    })) || [];

    const recommendationInsights = insights.recommended_interventions?.map((ri: any) => ({
      insight_type: 'recommendation',
      title: ri.action,
      description: `Expected impact: ${ri.expected_impact}`,
      severity: ri.urgency === 'immediate' ? 'high' : 'medium',
      affected_projects: ri.affected_projects || [],
      action_items: [ri.action],
      status: 'new'
    })) || [];

    const allInsights = [...criticalInsights, ...recommendationInsights];

    if (allInsights.length > 0) {
      const { error: insertError } = await supabase
        .from('ai_insights')
        .insert(allInsights);

      if (insertError) {
        console.error('Error storing insights:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        insights,
        insights_stored: allInsights.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in ai-portfolio-insights:', error);
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
