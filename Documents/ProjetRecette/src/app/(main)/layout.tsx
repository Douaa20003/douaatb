import { AppShell } from "@/components/layout/AppShell";
import { getCurrentProfile } from "@/services/profiles";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;
  try {
    profile = await getCurrentProfile();
  } catch {
    profile = null;
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
