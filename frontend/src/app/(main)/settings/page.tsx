import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/Card';
import { DeleteAccountModal } from './_components/DeleteAccountModal';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Other settings like "Change Password" could go here in the future */}
            <p className="text-sm text-neutral-500">Account settings will go here.</p>
          </CardContent>
        </Card>

        {/* --- ADDED THIS NEW CARD --- */}
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
        {/* --- END OF NEW CARD --- */}

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