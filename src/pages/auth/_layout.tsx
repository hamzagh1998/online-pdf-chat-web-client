export function AuthLayout({
  children,
  bgImage,
}: {
  children: React.ReactNode;
  bgImage: string;
}) {
  return (
    <div className="w-full xl:grid  xl:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid max-sm:w-[90%] w-1/2 gap-6">
          {children}
        </div>
      </div>
      <div className="hidden xl:block p-2">
        <img
          src={bgImage}
          alt="Image"
          width="1920"
          height="100%"
          className="w-full h-screen object-cover dark:brightness-[.7]"
        />
      </div>
    </div>
  );
}
