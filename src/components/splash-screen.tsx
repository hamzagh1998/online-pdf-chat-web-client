export function SplashScreen() {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col space-y-6">
      <div className="w-full h-fit flex justify-center items-center gap-2">
        <img src="icon.png" alt="logo" className="w-16 h-16" />
        <p className="text-4xl font-bold">OnlinePDFChat</p>
      </div>
      <div className="h-1.5 w-1/2 lg:w-1/6 bg-primary-foreground overflow-hidden">
        <div className="progress w-full h-full bg-primary left-right"></div>
      </div>
    </div>
  );
}
