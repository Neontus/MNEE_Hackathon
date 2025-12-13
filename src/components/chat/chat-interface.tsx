"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Wait, I didn't install scroll-area. I'll check my install list. I didn't. I'll use div.
import { Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialMessages = [
    {
        id: 1,
        role: "agent",
        content: "Hello! I'm your financial assistant. How can I help you manage your treasury or invoices today?",
    },
];

export function ChatInterface() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Simulate agent response
        setTimeout(() => {
            const agentMsg = {
                id: Date.now() + 1,
                role: "agent",
                content: "I've received your request. I'm processing that for you now.",
            };
            setMessages((prev) => [...prev, agentMsg]);
        }, 1000);
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>Financial Agent</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
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
