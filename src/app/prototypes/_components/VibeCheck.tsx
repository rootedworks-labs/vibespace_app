// src/app/(prototypes)/_components/VibeCheck.tsx
import { Button } from '@/src/app/components/ui/Button';
import { Textarea } from '@/src/app/components/ui/TextArea';

export function VibeCheck() {
  const dailyPrompt = "What's one small thing that brought you joy today?";

  return (
    <div className="w-full max-w-md mt-8">
       <h3 className="font-heading font-bold text-xl mb-4">Prototype: Vibe Check</h3>
       <div className="border-2 border-dashed border-primary/50 rounded-lg p-6 text-center bg-primary/5">
         <p className="font-semibold text-lg">{dailyPrompt}</p>
         <Textarea className="mt-4" placeholder="Share your vibe..." />
         <Button className="mt-4">Post Vibe</Button>
       </div>
    </div>
  );
}