import { Conversation } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/Avatar";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { Button } from "@/src/app/components/ui/Button";
import { ArrowLeft } from "lucide-react";


interface ConversationViewProps {
  conversation: Conversation;
  onBack: () => void;
}

// Dummy messages for UI development
const dummyMessages = [
    { id: 1, text: 'Hey, saw your post, love the energy!', isCurrentUser: false, timestamp: '9:15 AM' },
    { id: 2, text: 'Thanks so much! Appreciate you reaching out.', isCurrentUser: true, timestamp: '9:16 AM' },
    { id: 3, text: 'Of course! Keep it up.', isCurrentUser: false, timestamp: '9:17 AM' },
];

export function ConversationView({ conversation, onBack }: ConversationViewProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center p-4 border-b gap-4">
                {/* Back button, hidden on medium screens and up */}
                <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0" onClick={onBack}>
                    <ArrowLeft size={20} />
                </Button>
                <Avatar>
                    <AvatarImage src={conversation.user.profile_picture_url || undefined} />
                    <AvatarFallback>{conversation.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{conversation.user.username}</h3>
            </div>
            {/* Messages */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {dummyMessages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>
            {/* Input */}
            <div className="p-4 border-t">
                <MessageInput />
            </div>
        </div>
    );
}
