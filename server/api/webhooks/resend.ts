import { supabase } from '@/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || !Array.isArray(body.data)) {
      return { status: 400, body: 'Invalid payload' }
    }

    for (const eventData of body.data) {
      if (eventData.type === 'inbound') {
        const { from, to, subject, text, html } = eventData.data
        
        const { data: thread } = await supabase
          .from('threads')
          .select('id')
          .ilike('subject', subject)
          .maybeSingle()

        let threadId = thread?.id

        if (!threadId) {
          const { data: newThread, error: threadErr } = await supabase
            .from('threads')
            .insert({ subject })
            .select()
            .single()
          if (threadErr) throw threadErr
          threadId = newThread.id
        }

        const { error: emailErr } = await supabase
          .from('emails')
          .insert({
            thread_id: threadId,
            from_email: from,
            to_email: to,
            subject: subject,
            body: text || html,
            raw_content: html,
            sent_at: new Date().toISOString(),
          })

        if (emailErr) throw emailErr
      }
    }

    return { status: 200, body: 'Success' }
  } catch (error) {
    console.error('Webhook error:', error)
    return { status: 500, body: 'Internal Server Error' }
  }
})
