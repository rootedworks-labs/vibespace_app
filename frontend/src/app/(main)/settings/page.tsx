import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/Card';
import { DeleteAccountModal } from './_components/DeleteAccountModal';

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Other settings like "Change Password" could go here in the future */}
        </CardContent>
      </Card>

      <Card className="mt-6 border-red-500">
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
  );
}