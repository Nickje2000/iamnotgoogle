"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, AlertCircle } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setError(null)

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = { role: "assistant", content: data.content }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setError("An error occurred while fetching the response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div
        ref={chatContainerRef}
        className="mb-4 h-[300px] overflow-y-auto border border-white/20 rounded-md p-4 bg-black/50 custom-scrollbar"
      >
        {messages.length === 0 && !error && (
          <div className="text-white/50 text-center mt-4">Start a conversation with Gemini...</div>
        )}
        {messages.map((m, index) => (
          <div key={index} className="mb-4">
            <strong className="text-[hsl(var(--primary))]">{m.role === "user" ? "You: " : "Gemini: "}</strong>
            <span className="text-white/90">{m.content}</span>
          </div>
        ))}
        {isLoading && <div className="text-[hsl(var(--primary))] animate-pulse">Gemini is thinking...</div>}
        {error && (
          <div className="text-red-500 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gemini a question..."
          className="flex-grow bg-black border-white/20 text-white 
                   placeholder:text-white/50 focus:border-[hsl(var(--primary))] input-glow"
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/90] text-white"
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  )
}

