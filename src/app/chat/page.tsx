import { ActionSuggestions } from "@/components/chat/action-suggestions";
import { ChatInterface } from "@/components/chat/chat-interface";

export default async function ChatPage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Chat Assistant</h1>
            <ChatInterface />
            <ActionSuggestions />
        </div>
    );
}
