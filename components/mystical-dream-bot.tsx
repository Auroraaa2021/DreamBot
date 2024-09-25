"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, Stars, Send } from 'lucide-react'
import OpenAI from 'openai'

interface Message {
  role: 'user' | 'bot'
  content: string
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production
})

export default function MysticalDreamBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Greetings, seeker of dreams. I am Mysti. Share with me the visions of your night, and I shall unveil their hidden meanings." }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are Mysti, a mystical dream interpreter. Provide mysterious and insightful interpretations for the dreams described to you." },
            { role: "user", content: input }
        ],
      })

      const botMessage: Message = { 
        role: 'bot', 
        content: response.choices[0].message.content || "The mists of interpretation are thick. I cannot discern the meaning of this dream."
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { 
        role: 'bot', 
        content: "The ethereal connection has been disrupted. Please try again later."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-md mx-auto p-6 bg-gradient-to-b from-purple-900 to-indigo-900 rounded-lg shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random() * 0.5 + 0.5,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-200 font-cinzel relative z-10">Dream Bot</h1>
      <ScrollArea className="flex-grow mb-4 p-4 border border-purple-500 rounded-md bg-purple-950 bg-opacity-50 relative z-10">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className="w-8 h-8">
                {message.role === 'user' ? (
                  <Moon className="text-yellow-300" />
                ) : (
                  <Stars className="text-purple-300" />
                )}
                <AvatarFallback>{message.role === 'user' ? 'U' : 'M'}</AvatarFallback>
              </Avatar>
              <div className={`mx-2 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-indigo-700 text-indigo-100' 
                  : 'bg-purple-800 text-purple-100'
              }`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center bg-purple-800 text-purple-100 rounded-lg p-3">
              <span className="animate-pulse">Mysti is divining</span>
              <span className="animate-pulse ml-1">.</span>
              <span className="animate-pulse ml-1">.</span>
              <span className="animate-pulse ml-1">.</span>
            </div>
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2 relative z-10">
        <Input
          type="text"
          placeholder="Describe your dream vision..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-purple-800 text-purple-100 placeholder-purple-300 border-purple-600"
        />
        <Button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}