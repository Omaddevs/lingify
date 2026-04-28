import { useState, useRef, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import ProfileSidebar from './ProfileSidebar'

const initialMessages = [
  { id: 1, text: 'Hi Emma! 👋 Nice to meet you.', isSent: true, time: '10:30 AM' },
  { id: 2, text: 'Hi! Nice to meet you too 😊', isSent: false, time: '10:32 AM' },
  { id: 3, text: 'What are your goals in learning English?', isSent: true, time: '10:33 AM' },
  {
    id: 4,
    text: 'I want to improve my speaking and get better at everyday conversations.',
    isSent: false,
    time: '10:34 AM',
  },
  { id: 5, text: "That's great! I'd love to practice together.", isSent: true, time: '10:35 AM' },
  { id: 6, text: 'Me too! Let\'s help each other 😊', isSent: false, time: '10:36 AM' },
]

function ChatLayout() {
  const [messages, setMessages] = useState(initialMessages)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text, file) => {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: text || '', file: file || null, isSent: true, time },
    ])
  }

  return (
    <div className="flex h-full gap-5">
      {/* Left: Profile sidebar — hidden on mobile */}
      <div className="hidden w-[320px] flex-shrink-0 xl:block">
        <ProfileSidebar />
      </div>

      {/* Right: Chat panel */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <ChatHeader />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-4">
          {/* Date separator */}
          <div className="mb-5 flex items-center justify-center">
            <span className="rounded-full bg-slate-200/60 px-3 py-1 text-xs font-medium text-slate-500">
              Today
            </span>
          </div>

          <div className="space-y-2">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isSent={msg.isSent} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}

export default ChatLayout
