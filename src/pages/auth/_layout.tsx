export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full xl:grid  xl:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid max-sm:w-[90%] w-1/2 gap-6">
          {children}
        </div>
      </div>
      <div className="hidden bg-muted xl:block">
        <img
          src="/illustration.png"
          alt="Image"
          width="1920"
          height="100%"
          className="w-full h-screen object-cover dark:brightness-[0.5]"
        />
      </div>
    </div>
  );
}
