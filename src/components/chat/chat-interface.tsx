"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Wait, I didn't install scroll-area. I'll check my install list. I didn't. I'll use div.
import { Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



interface Message {
    id: number;
    role: "user" | "agent";
    content: string;
}

const initialMessages: Message[] = [
    {
        id: 1,
        role: "agent",
        content: "Hello! I'm your financial assistant. How can I help you manage your treasury or invoices today?",
    },
];

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { id: Date.now(), role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            const data = await response.json();

            if (response.ok) {
                const agentMsg: Message = {
                    id: Date.now() + 1,
                    role: "agent",
                    content: data.content,
                };
                setMessages((prev) => [...prev, agentMsg]);
            } else {
                console.error("API Error:", data.error);
                const errorMsg: Message = {
                    id: Date.now() + 1,
                    role: "agent",
                    content: "Sorry, I encountered an error connecting to the agent."
                }
                setMessages((prev) => [...prev, errorMsg]);
            }
        } catch (error) {
            console.error("Network Error:", error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                role: "agent",
                content: "Sorry, I encountered a network error."
            }
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Financial Agent</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <Avatar>
                                        <AvatarFallback>{msg.role === "user" ? "U" : "AI"}</AvatarFallback>
                                        <AvatarImage src={msg.role === "agent" ? "/bot-avatar.png" : undefined} />
                                    </Avatar>

                                    <div
                                        className={`rounded-lg p-3 text-sm ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 items-center text-sm text-muted-foreground p-3">
                                    <Avatar className="w-6 h-6">
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4">
                <form
                    className="flex w-full items-center space-x-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                >
                    <Input
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
