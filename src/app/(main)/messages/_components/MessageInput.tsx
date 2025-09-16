'use client';

import { Button } from "@/src/app/components/ui/Button";
import { Send } from "lucide-react";

export function MessageInput() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to send message will go here
        console.log("Message submitted");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input 
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-full border bg-transparent focus:ring-2 focus:ring-brand-sage focus:outline-none"
            />
            <Button type="submit" className="rounded-full h-12 w-12 p-0 flex-shrink-0">
                <Send size={20} />
            </Button>
        </form>
    );
}
