"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

export default function SearchBox() {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Google..."
        className="flex-grow p-3 bg-black border border-white/20 rounded-l-md 
                 text-white placeholder:text-white/50 focus:outline-none input-glow"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-r-md 
                 hover:bg-[hsl(var(--primary))/90] transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  )
}

