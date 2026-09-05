import { createRoute, createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', username)
      .single()

    if (userError || !user) {
      setError('Invalid credentials')
      return
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (isMatch) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
    } else {
      setError('Invalid credentials')
    }
  }

  if (isAuthenticated || localStorage.getItem('admin_auth') === 'true') {
    return <AdminDashboard />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  )
}

function AdminDashboard() {
  const [threads, setThreads] = useState<any[]>([])
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [emails, setEmails] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  async function fetchThreads() {
    setLoading(true)
    const { data } = await supabase
      .from('threads')
      .select('*')
      .order('updated_at', { ascending: false })
    setThreads(data || [])
    setLoading(false)
  }

  async function fetchEmails(threadId: string) {
    const { data } = await supabase
      .from('emails')
      .select('*')
      .eq('thread_id', threadId)
      .order('sent_at', { ascending: true })
    setEmails(data || [])
    setSelectedThread(threadId)
  }

  async function handleSend() {
    if (!replyText || !selectedThread) return
    setSending(true)

    const lastEmail = emails[emails.length - 1]
    const recipient = lastEmail?.from_email || 'unknown@example.com'
    const subject = threads.find(t => t.id === selectedThread)?.subject || 'Re: Conversation'

    try {
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
          text: replyText,
          html: `<p>${replyText}</p>`,
          threadId: selectedThread,
        }),
      })

      if (!res.ok) throw new Error('Failed to send')

      setReplyText('')
      await fetchEmails(selectedThread)
    } catch (e) {
      alert('Error sending email: ' + e)
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    fetchThreads()
  }, [])

  const filteredThreads = threads.filter(t => 
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar: Thread List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <input 
            type="text" 
            placeholder="Search mail..." 
            className="w-full p-2 bg-gray-100 rounded-lg outline-none border focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredThreads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations found</div>
          ) : (
            filteredThreads.map(thread => (
              <div 
                key={thread.id} 
                onClick={() => fetchEmails(thread.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedThread === thread.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
              >
                <div className="font-semibold truncate">{thread.subject || '(No Subject)'}</div>
                <div className="text-xs text-gray-500 truncate">Updated {new Date(thread.updated_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main: Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold truncate">{threads.find(t => t.id === selectedThread)?.subject}</h2>
              <button 
                onClick={() => setSelectedThread(null)} 
                className="text-gray-500 hover:text-black"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {emails.map(email => (
                <div key={email.id} className="max-w-3xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-bold">{email.from_email}</span>
                    <span className="text-gray-500">{new Date(email.sent_at).toLocaleString()}</span>
                  </div>
                  <div 
                    className="text-gray-800 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: email.body }} 
                  />
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="max-w-3xl mx-auto">
                <textarea 
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Reply to conversation..." 
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={handleSend}
                    disabled={sending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to read
          </div>
        )}
      </div>
    </div>
  )
}
