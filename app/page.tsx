import SearchBox from "./components/SearchBox"
import GeminiChat from "./components/GeminiChat"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,119,0,0.1),rgba(0,0,0,0.8))]" />
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white glow relative z-10">
        I am not Google, look it up here instead
      </h1>
      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <SearchBox />
        <GeminiChat />
      </div>
    </main>
  )
}

