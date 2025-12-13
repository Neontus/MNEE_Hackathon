"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
    id: number;
    role: "user" | "agent";
    content: string;
    timestamp: string;
}

const initialMessages: Message[] = [
    {
        id: 1,
        role: "agent",
        content: "Hello! I'm your financial assistant. I can help you manage your treasury, create invoices, and answer questions about your account. What would you like to do today?",
        timestamp: new Date().toISOString(),
    },
];

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, status]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: Message = {
            id: Date.now(),
            role: "user",
            content: input,
            timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);
        setStatus("Thinking...");

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            if (!response.ok || !response.body) {
                throw new Error("Failed to connect");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";
            let finalDone = false;

            while (!finalDone) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                // Split by newline filter empty
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.type === 'status') {
                            setStatus(data.message);
                        } else if (data.type === 'text') {
                            accumulatedText += data.content;
                        } else if (data.type === 'error') {
                            throw new Error(data.content);
                        }
                    } catch (e) {
                        console.error("Error parsing JSON chunk", e);
                    }
                }
            }

            if (accumulatedText) {
                const agentMsg: Message = {
                    id: Date.now() + 1,
                    role: "agent",
                    content: accumulatedText,
                    timestamp: new Date().toISOString()
                };
                setMessages((prev) => [...prev, agentMsg]);
            }

        } catch (error) {
            const errorMsg: Message = {
                id: Date.now() + 1,
                role: "agent",
                content: "I encountered an error. Please check your connection and try again.",
                timestamp: new Date().toISOString()
            }
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
            setStatus("");
        }
    };

    const quickActions = [
        { label: "Check my balance", prompt: "Show my current treasury balance" },
        { label: "Recent transactions", prompt: "Show my recent transactions" },
        { label: "Create invoice", prompt: "Help me create an invoice" },
    ];

    return (
        <Card className="border shadow-sm h-[calc(100vh-16rem)] flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className={msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                                    {msg.role === "user" ? "You" : <Sparkles className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>

                            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                <div
                                    className={`px-4 py-3 rounded-lg ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                        {msg.content}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground px-1" suppressHydrationWarning>
                                    {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-accent text-accent-foreground">
                                    <Sparkles className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="px-4 py-3 rounded-lg bg-muted">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span>{status || "Thinking..."}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 bg-background">
                <div className="max-w-3xl mx-auto space-y-3">
                    {/* Quick Actions */}
                    {messages.length <= 1 && (
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(action.prompt)}
                                    className="px-3 py-1.5 text-xs rounded-full bg-accent hover:bg-accent/80 transition-colors"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Form */}
                    <form
                        className="flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                    >
                        <Input
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            size="icon"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </Card>
    );
}
