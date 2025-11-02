'use client'; // 1. Convert to client component

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/Card';
import { DeleteAccountModal } from './_components/DeleteAccountModal';
import Link from 'next/link';
import { ArrowRight, Lock, MessageCircle, Users } from 'lucide-react';
import { Label } from '@/src/app/components/ui/Label'; // 2. Import UI components
import { Switch } from '@/src/app/components/ui/Switch';
import { RadioGroup, RadioGroupItem } from '@/src/app/components/ui/RadioGroup';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { getPrivacySettings, updatePrivacySettings, fetcher } from '@/src/app/api'; // 3. Import API functions

// 4. Define the type for settings
interface PrivacySettings {
  account_privacy: 'public' | 'private';
  dm_privacy: 'open' | 'mutuals';
}

export default function SettingsPage() {
  // 5. Fetch settings data
  const { data: settings, error, isLoading } = useSWR<PrivacySettings>(
    '/users/me/privacy', // Assumes a new endpoint
    fetcher
  );

  // 6. Local state for optimistic UI
  const [isPrivate, setIsPrivate] = useState(false);
  const [dmSetting, setDmSetting] = useState('open');

  // 7. Sync local state when data loads
  useEffect(() => {
    if (settings) {
      setIsPrivate(settings.account_privacy === 'private');
      setDmSetting(settings.dm_privacy);
    }
  }, [settings]);

  // 8. Handler for Private Account toggle
  const handleAccountPrivacyChange = async (checked: boolean) => {
    const newSetting = checked ? 'private' : 'public';
    setIsPrivate(checked); // Optimistic update
    
    try {
      await updatePrivacySettings({ account_privacy: newSetting });
      toast.success('Account privacy updated!');
      mutate('/users/me/privacy'); // Revalidate
    } catch (err) {
      toast.error('Failed to update privacy.');
      setIsPrivate(!checked); // Rollback
    }
  };

  // 9. Handler for DM Radio Group
  const handleDmPrivacyChange = async (value: 'open' | 'mutuals') => {
    const oldSetting = dmSetting;
    setDmSetting(value); // Optimistic update

    try {
      await updatePrivacySettings({ dm_privacy: value });
      toast.success('Message privacy updated!');
      mutate('/users/me/privacy'); // Revalidate
    } catch (err) {
      toast.error('Failed to update privacy.');
      setDmSetting(oldSetting); // Rollback
    }
  };


  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        
        {/* --- NEW PRIVACY AND SAFETY CARD --- */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy and Safety</CardTitle>
            <CardDescription>
              Control who can see your content and interact with you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Spinner />
              </div>
            ) : error ? (
              <div className="text-red-500">Failed to load privacy settings.</div>
            ) : (
              <>
                {/* Private Account Toggle */}
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="private-account" className="flex flex-col space-y-1">
                    <span className="font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Private Account
                    </span>
                    <span className="font-normal text-sm text-neutral-500">
                      When your account is private, only people you approve can see your posts and follower lists.
                    </span>
                  </Label>
                  <Switch
                    id="private-account"
                    checked={isPrivate}
                    onCheckedChange={handleAccountPrivacyChange}
                  />
                </div>

                {/* DM Privacy Radio Group */}
                <div className="space-y-3">
                  <Label className="font-semibold flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Allow new messages from:
                  </Label>
                  <RadioGroup
                    value={dmSetting}
                    onValueChange={(val: 'open' | 'mutuals') => handleDmPrivacyChange(val)}
                    className="pl-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="open" id="dm-open" />
                      <Label htmlFor="dm-open" className="font-normal">
                        Everyone
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mutuals" id="dm-mutuals" />
                      <Label htmlFor="dm-mutuals" className="font-normal">
                        People You Follow (Mutuals)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* --- EXISTING CARDS --- */}
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Other settings like \"Change Password\" could go here in the future */}
            <p className="text-sm text-neutral-500">Account settings will go here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>
              Manage your account data and privacy settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/settings/my-data"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors -mx-4"
            >
              <div>
                <h3 className="font-semibold">View Your Data</h3>
                <p className="text-sm text-neutral-500">Browse all of your profile data, posts, and comments.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400" />
            </Link>

            <Link
              href="/settings/export"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors -mx-4"
            >
              <div>
                <h3 className="font-semibold">Export Your Data</h3>
                <p className="text-sm text-neutral-500">Download a JSON archive of all your data.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              These actions are permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <p>Delete your account and all associated data.</p>
            <DeleteAccountModal />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
