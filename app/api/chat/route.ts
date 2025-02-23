import { GoogleGenerativeAI } from "@google/generative-ai"

// Use the environment variable for the API key
const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables")
}

const genAI = new GoogleGenerativeAI(API_KEY)

export async function POST(req: Request) {
  console.log("API route called")
  try {
    const { messages } = await req.json()
    console.log("Received messages:", messages)

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Get the last message from the user
    const lastMessage = messages[messages.length - 1]
    console.log("Last message:", lastMessage)

    try {
      console.log("Calling Gemini API")
      const result = await model.generateContent(lastMessage.content)
      console.log("Gemini API response received")
      const response = await result.response
      const text = response.text()
      console.log("Generated text:", text)

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

