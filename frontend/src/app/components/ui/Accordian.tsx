'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Context to manage which item is open
const AccordionContext = React.createContext<{
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
}>({
  openItem: null,
  setOpenItem: () => {},
});

// The main Accordion wrapper
export const Accordion = ({ children }: { children: React.ReactNode }) => {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
};

// Each individual item in the accordion
interface AccordionItemProps {
  value: string;
  header: React.ReactNode;
  children: React.ReactNode;
}

export const AccordionItem = ({ value, header, children }: AccordionItemProps) => {
  const { openItem, setOpenItem } = React.useContext(AccordionContext);
  const isOpen = openItem === value;

  const toggleOpen = () => {
    setOpenItem(isOpen ? null : value);
  };

  return (
    <div className="rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
      <button
        onClick={toggleOpen}
        className="flex items-center justify-between w-full p-4 font-heading font-semibold text-left"
      >
        <span>{header}</span>
        <ChevronDown
          className={cn('h-5 w-5 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>
  );
};