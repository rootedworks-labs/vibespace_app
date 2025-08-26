// src/app/(prototypes)/page.tsx
import { EnergyStream } from './_components/EnergyStream';
import { VibeCheck } from './_components/VibeCheck';

export default function PrototypeHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-8">Prototype Playground</h1>
      
      {/* Display your prototypes here */}
      <EnergyStream />
      <VibeCheck />
    </div>
  );
}