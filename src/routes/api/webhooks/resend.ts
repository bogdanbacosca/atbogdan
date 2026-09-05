import { createFileRoute } from '@tanstack/react-router'
import { handleInboundEmail } from '@/lib/server-actions'

export const Route = createFileRoute('/api/webhooks/resend')({
  loader: async ({ request }) => {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    try {
      const body = await request.json()
      await handleInboundEmail(body)
      return new Response('Success', { status: 200 })
    } catch (error: any) {
      console.error('Webhook error:', error)
      return new Response(error.message || 'Internal Server Error', { status: 500 })
    }
  },
})
