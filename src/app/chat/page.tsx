import { ActionSuggestions } from "@/components/chat/action-suggestions";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Agent Chat</h2>
            </div>
            <ChatInterface />
            <ActionSuggestions />
        </div>
    );
}
