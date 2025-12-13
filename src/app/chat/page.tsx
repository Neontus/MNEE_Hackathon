import { ChatInterface } from "@/components/chat/chat-interface";

export default async function ChatPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">AI Assistant</h1>
                <p className="text-muted-foreground mt-2">
                    Get help with your finances, invoices, and treasury management
                </p>
            </div>
            <ChatInterface />
        </div>
    );
}
