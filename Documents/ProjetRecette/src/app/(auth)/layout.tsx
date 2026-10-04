export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <p className="font-display text-4xl text-rose-500">Mes Recettes</p>
        <p className="mt-2 text-cocoa-500">Espace privé famille & amis</p>
      </div>
      {children}
    </div>
  );
}
