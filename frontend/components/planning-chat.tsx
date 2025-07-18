'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChat } from '@ai-sdk/react'
import { Loader2, RotateCcw, Send, Square } from 'lucide-react'
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PlanningChat() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, input, handleInputChange, handleSubmit, status, stop, setMessages } = useChat({
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        content:
          "Hello! I'm here to help you plan your trip. Tell me about your travel preferences and I'll create a personalized itinerary for you.\n\n**I can help you with:**\n- Destination recommendations\n- Itinerary planning\n- Budget considerations\n- Travel tips and advice\n\nJust let me know what you're looking for!",
      },
    ],
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input when assistant responds
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant' && status === 'ready') {
      // Small delay to ensure the message is fully rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, status])

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleStartOver = () => {
    setMessages([
      {
        id: 'initial',
        role: 'assistant',
        content:
          "Hello! I'm here to help you plan your trip. Tell me about your travel preferences and I'll create a personalized itinerary for you.\n\n**I can help you with:**\n- Destination recommendations\n- Itinerary planning\n- Budget considerations\n- Travel tips and advice\n\nJust let me know what you're looking for!",
      },
    ])
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header with Start Over button */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-end items-center">
          <Button
            onClick={handleStartOver}
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-[28rem] px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600">
                    <AvatarFallback className="text-gray-500 text-sm font-medium">AI</AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`max-w-[80%] p-2 px-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0'
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  <div
                    className={`text-sm leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none text-sm">
                        {message.parts.map((part, index) => {
                          switch (part.type) {
                            case 'text':
                              return (
                                <ReactMarkdown
                                  key={`text-${index}`}
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    // Custom styling for markdown elements
                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => (
                                      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                                    ),
                                    li: ({ children }) => <li className="text-sm">{children}</li>,
                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                    code: ({ children }) => (
                                      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
                                        {children}
                                      </code>
                                    ),
                                    pre: ({ children }) => (
                                      <pre className="bg-gray-100 text-gray-800 p-2 rounded text-xs font-mono overflow-x-auto mb-2">
                                        {children}
                                      </pre>
                                    ),
                                    blockquote: ({ children }) => (
                                      <blockquote className="border-l-4 border-blue-500 pl-3 italic text-gray-600 mb-2">
                                        {children}
                                      </blockquote>
                                    ),
                                    a: ({ children, href }) => (
                                      <a
                                        href={href}
                                        className="text-blue-600 hover:text-blue-800 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {children}
                                      </a>
                                    ),
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              )
                            case 'tool-invocation':
                              const callId = part.toolInvocation.toolCallId

                              switch (part.toolInvocation.toolName) {
                                case 'createTrip': {
                                  switch (part.toolInvocation.state) {
                                    case 'call':
                                      return (
                                        <div key={`trip-call-${callId}`}>
                                          Gathering information for {part.toolInvocation.args.destination}...
                                        </div>
                                      )
                                    case 'result':
                                      return (
                                        <div key={`trip-result-${callId}`}>
                                          Awesome! I've created a trip for you to{' '}
                                          {part.toolInvocation.result.destination},{' '}
                                          {part.toolInvocation.result.duration} days. Next I will redirect you to the
                                          trip itinerary.
                                        </div>
                                      )
                                  }
                                  break
                                }
                              }

                              return null
                          }
                        })}
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </Card>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-gray-500 to-gray-600">
                    <AvatarFallback className="text-gray-500 text-sm font-medium">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <AvatarFallback className="text-white text-sm font-medium">AI</AvatarFallback>
                </Avatar>
                <Card className="bg-white border border-gray-200 shadow-sm p-2 px-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="bg-white border rounded-md border-gray-200 px-4 py-4 sticky bottom-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                name="prompt"
                value={input}
                onChange={handleInputChange}
                disabled={status !== 'ready'}
                placeholder="Tell me about your dream destination..."
                className="pr-12 py-3 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                ref={inputRef}
              />
              {isLoading && (
                <Button
                  type="button"
                  onClick={stop}
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Square className="h-4 w-4 text-red-400" strokeWidth={3} />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={status !== 'ready' || !input.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-3"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {['Plan a weekend in Paris', 'Beach vacation ideas', 'Mountain hiking trip'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
                onClick={() => {
                  if (status === 'ready') {
                    handleInputChange({ target: { value: suggestion } } as any)
                  }
                }}
                disabled={status !== 'ready'}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
