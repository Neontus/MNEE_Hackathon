import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import { TOOLS, executeTool } from "@/lib/ai-tools";

export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;
        const cookieStore = await cookies();

        if (!apiKey) {
          const errorMsg = JSON.stringify({ type: "error", content: "GEMINI_API_KEY is not defined" }) + "\n";
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
          return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // User requested gemini-2.0/2.5 but hit rate limits.
        // Switching to gemini-1.5-flash which has a stable free tier.
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-lite", 
            tools: [{ functionDeclarations: TOOLS }] 
        });

        const lastMessage = messages[messages.length - 1];
        
        // Filter history
        const historyMessages = messages.slice(0, -1);
        const firstUserIndex = historyMessages.findIndex((m: any) => m.role === 'user');
        
        const history = firstUserIndex !== -1 
            ? historyMessages.slice(firstUserIndex).map((m: any) => ({
                role: m.role === 'agent' ? 'model' : 'user',
                parts: [{ text: m.content }]
              }))
            : [];

        const chat = model.startChat({ history });

        let result = await chat.sendMessage(lastMessage.content);
        let response = await result.response;
        
        // Loop for tool calls
        while (response.functionCalls()) {
            const functionCalls = response.functionCalls();
            if (!functionCalls) break; 
            
            const functionResponses = [];
            for (const call of functionCalls) {
                // Stream Status Update
                const statusMsg = JSON.stringify({ type: "status", message: `Executing ${call.name}...` }) + "\n";
                controller.enqueue(encoder.encode(statusMsg));

                const toolResult = await executeTool(call.name, call.args);
                
                // Stream Status Update (Done)
                const doneMsg = JSON.stringify({ type: "status", message: `Completed ${call.name}` }) + "\n";
                controller.enqueue(encoder.encode(doneMsg));

                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: toolResult
                    }
                });
            }

            result = await chat.sendMessage(functionResponses);
            response = await result.response;
        }

        const text = response.text();
        const contentMsg = JSON.stringify({ type: "text", content: text }) + "\n";
        controller.enqueue(encoder.encode(contentMsg));
        controller.close();

      } catch (error: any) {
        console.error("Error generating content:", error);
        const errorMsg = JSON.stringify({ type: "error", content: "Failed to generate content" }) + "\n";
        controller.enqueue(encoder.encode(errorMsg));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
