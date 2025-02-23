import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "edge"

// Use the environment variable for the API key
const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables")
}

const genAI = new GoogleGenerativeAI(API_KEY)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Get the last message from the user
    const lastMessage = messages[messages.length - 1]

    try {
      const result = await model.generateContent(lastMessage.content)
      const response = await result.response
      const text = response.text()

      return new Response(JSON.stringify({ content: text }), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error("Gemini API Error:", error)
      return new Response(JSON.stringify({ error: "Error generating response", details: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    console.error("Request Error:", error)
    return new Response(JSON.stringify({ error: "Invalid request", details: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}

