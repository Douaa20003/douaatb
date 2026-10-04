import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Profile } from "@/types/database";

interface AppShellProps {
  children: React.ReactNode;
  profile: Profile | null;
  hideChrome?: boolean;
}

export function AppShell({ children, profile, hideChrome }: AppShellProps) {
  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
