import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('hc_auth_token')?.value;

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const lastMessage = messages[messages.length - 1];
    
    // Filter history to ensure it starts with a user message
    const historyMessages = messages.slice(0, -1);
    const firstUserIndex = historyMessages.findIndex((m: any) => m.role === 'user');
    
    const history = firstUserIndex !== -1 
        ? historyMessages.slice(firstUserIndex).map((m: any) => ({
            role: m.role === 'agent' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        : [];

    // Construct chat history for correct context
    const chat = model.startChat({
        history
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
