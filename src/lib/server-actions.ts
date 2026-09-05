import { supabase } from '@/lib/supabase'

const RESEND_API_KEY = 're_DE94dGT1_9eQUbGKCkNNHwfUivXdy5vhP'

export async function handleInboundEmail(body: any) {
  if (!body || !Array.isArray(body.data)) {
    throw new Error('Invalid payload')
  }

  for (const event of body.data) {
    if (event.type === 'inbound') {
      const { from, to, subject, text, html } = event.data
      
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
  return { success: true }
}

export async function sendEmail({ to, subject, text, html, threadId }: any) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'contact@atbogdan.ro',
      to,
      subject,
      text,
      html,
    }),
  })

  const result = await response.json()
  if (!response.ok) throw new Error(result.error?.message || 'Failed to send email')

  if (threadId) {
    await supabase.from('emails').insert({
      thread_id: threadId,
      from_email: 'contact@atbogdan.ro',
      to_email: to,
      subject: subject,
      body: text || html,
      raw_content: html,
      sent_at: new Date().toISOString(),
    })
  }
  return { success: true }
}
