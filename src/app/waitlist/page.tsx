'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/src/app/api';
import toast from 'react-hot-toast';
import { Input } from '@/src/app/components/ui/Input';
import { Button } from '@/src/app/components/ui/Button';
import { Waves, Sparkles, Heart } from 'lucide-react';

// Validation schema for the email form
const waitlistSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export default function WaitlistPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof waitlistSchema>) => {
    try {
      await api.post('/waitlist', values);
      setIsSubmitted(true);
      toast.success('You\'re on the list! We\'ll be in touch soon.');
    } catch (error: any) {
      if (error.response?.status === 200) {
        // The API returns 200 if the email is already subscribed
        setIsSubmitted(true);
        toast.success('You\'re already on the list!');
      } else {
        toast.error('Something went wrong. Please try again.');
        console.error('Waitlist submission failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-sand to-brand-sage flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center items-center space-x-4 text-brand-deep-blue mb-6">
            <Waves className="h-8 w-8" />
            <Sparkles className="h-8 w-8" />
            <Heart className="h-8 w-8" />
        </div>
        
        <h1 className="font-heading text-5xl font-black text-brand-deep-blue">VibeSpace</h1>
        <p className="mt-4 text-xl text-brand-deep-blue/80">
          Authentic connection. No algorithms.
        </p>

        {isSubmitted ? (
          <div className="mt-8 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <h2 className="font-heading text-2xl font-bold text-brand-deep-blue">Thank You!</h2>
            <p className="mt-2 text-brand-deep-blue/80">You're on the waitlist. We'll let you know when VibeSpace is ready.</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <p className="text-brand-deep-blue/80">Be the first to know when we launch.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register('email')}
                className="flex-grow"
              />
              <Button type="submit" disabled={isSubmitting} className="bg-brand-deep-blue text-white hover:bg-brand-deep-blue/90">
                {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
              </Button>
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
