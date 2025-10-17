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

    // Fetch comprehensive data from database
    const [tasksRes, milestonesRes, risksRes, documentsRes, vendorsRes, aiInsightsRes, ideasRes] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('milestones').select('*').order('target_date', { ascending: true }).limit(200),
      supabase.from('risks').select('*'),
      supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('vendors').select('*'),
      supabase.from('ai_insights').select('*').order('generated_at', { ascending: false }).limit(50),
      supabase.from('ideas').select('*').order('created_at', { ascending: false }).limit(100)
    ]);

    const tasks = tasksRes.data || [];
    const milestones = milestonesRes.data || [];
    const risks = risksRes.data || [];
    const documents = documentsRes.data || [];
    const vendors = vendorsRes.data || [];
    const aiInsights = aiInsightsRes.data || [];
    const ideas = ideasRes.data || [];

    // Calculate analytics
    const criticalMilestones = milestones.filter(m => m.status === 'delayed' || (new Date(m.target_date) < new Date() && m.status !== 'completed'));
    const highPriorityTasks = tasks.filter(t => t.priority_score && t.priority_score > 7);
    const overdueTasks = tasks.filter(t => new Date(t.target_date) < new Date() && t.status !== 'Completed');
    const criticalRisks = risks.filter(r => r.severity === 'critical' || r.probability === 'high');
    const pendingDocuments = documents.filter(d => d.status === 'draft' || d.status === 'review');
    const activeVendors = vendors.filter(v => v.status === 'active');

    // Build comprehensive context
    const context = {
      summary: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Completed').length,
        totalMilestones: milestones.length,
        completedMilestones: milestones.filter(m => m.status === 'completed').length,
        delayedMilestones: criticalMilestones.length,
        totalRisks: risks.length,
        criticalRisks: criticalRisks.length,
        totalDocuments: documents.length,
        pendingDocuments: pendingDocuments.length,
        totalVendors: vendors.length,
        activeVendors: activeVendors.length,
        totalIdeas: ideas.length,
        recentInsights: aiInsights.length
      },
      criticalItems: {
        delayedMilestones: criticalMilestones.slice(0, 5).map(m => ({
          name: m.name,
          targetDate: m.target_date,
          status: m.status,
          projectId: m.project_id
        })),
        highPriorityTasks: highPriorityTasks.slice(0, 5).map(t => ({
          action: t.action_item,
          status: t.status,
          priority: t.priority_score,
          owner: t.owner
        })),
        criticalRisks: criticalRisks.slice(0, 5).map(r => ({
          description: r.description,
          severity: r.severity,
          probability: r.probability,
          mitigation: r.mitigation_plan
        })),
        overdueTasks: overdueTasks.slice(0, 5).map(t => ({
          action: t.action_item,
          dueDate: t.target_date,
          owner: t.owner
        }))
      },
      recentActivity: {
        recentTasks: tasks.slice(0, 10).map(t => ({
          action: t.action_item,
          status: t.status,
          createdAt: t.created_at
        })),
        upcomingMilestones: milestones.filter(m => new Date(m.target_date) > new Date()).slice(0, 5).map(m => ({
          name: m.name,
          targetDate: m.target_date,
          status: m.status
        }))
      }
    };

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an AI project management assistant with deep analytical capabilities. You have access to comprehensive project data across tasks, milestones, risks, documents, vendors, and insights.

**Portfolio Summary:**
- Tasks: ${context.summary.completedTasks}/${context.summary.totalTasks} completed (${Math.round(context.summary.completedTasks / context.summary.totalTasks * 100)}%)
- Milestones: ${context.summary.completedMilestones}/${context.summary.totalMilestones} completed, ${context.summary.delayedMilestones} delayed
- Risks: ${context.summary.criticalRisks} critical out of ${context.summary.totalRisks} total
- Documents: ${context.summary.pendingDocuments} pending approval out of ${context.summary.totalDocuments}
- Vendors: ${context.summary.activeVendors} active vendors
- Ideas: ${context.summary.totalIdeas} ideas tracked

**Critical Items Requiring Attention:**
${context.criticalItems.delayedMilestones.length > 0 ? `
Delayed Milestones:
${context.criticalItems.delayedMilestones.map(m => `- ${m.name} (due ${m.targetDate})`).join('\n')}
` : ''}
${context.criticalItems.criticalRisks.length > 0 ? `
Critical Risks:
${context.criticalItems.criticalRisks.map(r => `- ${r.description} (${r.severity}/${r.probability})`).join('\n')}
` : ''}
${context.criticalItems.overdueTasks.length > 0 ? `
Overdue Tasks:
${context.criticalItems.overdueTasks.map(t => `- ${t.action} (owner: ${t.owner?.join(', ')})`).join('\n')}
` : ''}

**Recent Activity:**
${context.recentActivity.upcomingMilestones.length > 0 ? `
Upcoming Milestones:
${context.recentActivity.upcomingMilestones.map(m => `- ${m.name} (${m.targetDate})`).join('\n')}
` : ''}

**Instructions:**
1. Provide data-driven insights based on the actual data above
2. Identify patterns, trends, and anomalies
3. Suggest concrete, actionable recommendations
4. Use specific numbers and percentages when relevant
5. Prioritize critical issues and risks
6. Be concise but thorough - aim for 3-5 key points
7. Format responses with bullet points for clarity
8. When asked about specific projects, tasks, or risks, reference the actual data
9. Provide context and explain WHY something is important

**Response Format:**
- Start with a brief summary (1-2 sentences)
- Use bullet points for key insights
- End with 1-2 actionable recommendations`;

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
