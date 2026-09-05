import { createFileRoute } from '@tanstack/react-router'
import { sendEmail } from '@/lib/server-actions'

export const Route = createFileRoute('/api/emails/send')({
  loader: async ({ request }) => {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    try {
      const body = await request.json()
      await sendEmail(body)
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    } catch (error: any) {
      console.error('Send error:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
  },
})
