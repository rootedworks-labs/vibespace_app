import { Zap, Feather, Gem } from 'lucide-react';

// A single animated particle
const EnergyParticle = ({ icon: Icon, delay }: { icon: React.ElementType, delay: string }) => (
  <Icon
    className="absolute bottom-0 left-1/2 h-6 w-6 text-yellow-400 opacity-0 [animation:flow_3s_ease-out_infinite]"
    style={{ animationDelay: delay }}
  />
);

export function EnergyStream() {
  const particles = [
    { icon: Zap, delay: '0s' },
    { icon: Feather, delay: '0.5s' },
    { icon: Gem, delay: '1s' },
    { icon: Zap, delay: '1.8s' },
    { icon: Gem, delay: '2.3s' },
  ];

  return (
    <div className="w-full max-w-md">
      <h3 className="font-heading font-bold text-xl mb-4">Prototype: Energy Stream</h3>
      <div className="border rounded-lg p-4">
        <p className="font-bold">A sample post</p>
        <p className="mt-2 text-sm">This is where the content of the post would go.</p>
        
        <div className="mt-4 border-t pt-4">
          <div className="relative h-24 w-full overflow-hidden">
            {particles.map((p, i) => (
              <EnergyParticle key={i} icon={p.icon} delay={p.delay} />
            ))}
            <p className="text-center text-sm text-neutral-500 absolute bottom-0 w-full">
              Collective energy is flowing...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}