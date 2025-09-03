'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/src/app/api';
import toast from 'react-hot-toast';
import { Button } from '@/src/app/components/ui/Button';
import { Input } from '@/src/app/components/ui/Input';
import { HeartHandshake, Clock, ShieldCheck } from 'lucide-react';

const waitlistSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export default function WaitlistPage() {
  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: '' },
  });

  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof waitlistSchema>) => {
    try {
      await api.post('/waitlist', values);
      toast.success('Thank you for joining the waitlist!');
      form.reset();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-sand to-brand-sage text-brand-deep-blue">
      <main className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center">
          <img src="/vibespace-logo-transparent-hardmask.png" alt="VibeSpace Logo" className="w-48 mx-auto mb-4" />
          <h1 className="font-heading text-4xl md:text-6xl font-black leading-tight">A Social Space That Respects You.</h1>
          <p className="mt-4 text-lg md:text-xl text-brand-deep-blue/80 max-w-2xl mx-auto">
            Tired of algorithms, tracking, and performance? VibeSpace is a new social platform built on authentic connection and data privacy. Your feed, your rules.
          </p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 max-w-md mx-auto flex items-start gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full text-lg"
                {...form.register('email')}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
            </Button>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-24 md:mt-32">
          <h2 className="text-center font-heading text-3xl font-bold">What makes us different?</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="bg-white/30 p-8 rounded-2xl">
              <HeartHandshake className="h-12 w-12 mx-auto text-brand-terracotta" />
              <h3 className="font-heading text-xl font-bold mt-4">Authentic Expression</h3>
              <p className="mt-2 text-brand-deep-blue/80">
                Go beyond a simple 'like.' Share how you really feel with a spectrum of "Vibes" that capture the true energy of a post.
              </p>
            </div>

            <div className="bg-white/30 p-8 rounded-2xl">
              <Clock className="h-12 w-12 mx-auto text-brand-terracotta" />
              <h3 className="font-heading text-xl font-bold mt-4">A Mindful Feed</h3>
              <p className="mt-2 text-brand-deep-blue/80">
                No endless scrolling. Our feed is chronological and broken into "Time Windows," creating a calmer, more intentional experience.
              </p>
            </div>

            <div className="bg-white/30 p-8 rounded-2xl">
              <ShieldCheck className="h-12 w-12 mx-auto text-brand-terracotta" />
              <h3 className="font-heading text-xl font-bold mt-4">Your Privacy, Your Data</h3>
              <p className="mt-2 text-brand-deep-blue/80">
                We will never sell your data. VibeSpace is a place for connection, not a product to be sold. You are in control.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
