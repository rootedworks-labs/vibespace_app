'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/app/store/authStore';
import api from '@/src/app/api';
import toast from 'react-hot-toast';

import { AuthCard } from '../_components/AuthCard';
import { Input } from '@/src/app/components/ui/Input';
import { Button } from '@/src/app/components/ui/Button';

// 1. Define the validation schema with Zod, matching your backend rules
const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/\d/, { message: 'Password must contain at least one number.' }),
});

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // 2. Set up the form with react-hook-form and the Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const { isSubmitting, errors } = form.formState;

  // 3. Create the onSubmit handler that receives validated data
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post('/auth/register', values);
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast.success('Welcome to Vibespace!');
      router.push('/');
    } catch (err) {
      toast.error('A user with that email or username already exists.');
      console.error('Registration failed:', err);
    }
  };

  return (
    <AuthCard
      title="Create an Account"
      description="Join Vibespace today."
    >
      {/* 4. Connect the form and fields using the spread operator */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="username">Username</label>
          <Input id="username" {...form.register('username')} />
          {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" {...form.register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" {...form.register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </AuthCard>
  );
}