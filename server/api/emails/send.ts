import { supabase } from '@/lib/supabase'

const RESEND_API_KEY = 're_DE94dGT1_9eQUbGKCkNNHwfUivXdy5vhP'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { to, subject, text, html, threadId } = body

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

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to send email')
    }

    if (threadId) {
      const { error: emailErr } = await supabase
        .from('emails')
        .insert({
          thread_id: threadId,
          from_email: 'contact@atbogdan.ro',
          to_email: to,
          subject: subject,
          body: text || html,
          raw_content: html,
          sent_at: new Date().toISOString(),
        })
      if (emailErr) console.error('Error logging sent email:', emailErr)
    }

    return { status: 200, body: { success: true } }
  } catch (error: any) {
    console.error('Send error:', error)
    return { status: 500, body: { error: error.message } }
  }
})
