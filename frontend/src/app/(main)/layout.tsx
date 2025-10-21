import { AuthGuard } from '../components/AuthGuard';
import { MobileNavbar } from '../components/MobileNavBar';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-white dark:bg-neutral-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* --- APPLY RESPONSIVE CLASSES HERE --- */}
          <div className="hidden md:block"> {/* Hide on mobile (default), show on medium screens+ */}
            <Navbar />
          </div>
          {/* --- END --- */}

          {/* This main element should have flex-1 */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--color-brand-light-sand)] dark:bg-neutral-900">
            {children}
          </main>
        </div>
        
      </div>
      <MobileNavbar /> {/* Your mobile nav likely handles mobile navigation */}
    </AuthGuard>
  );
}