import { HeadView } from "./components/desktop-view/head-view";
import { ResizableWrapper } from "./components/desktop-view/resizable-wrapper";

export function MainPage() {
  return (
    <main className="w-full h-screen flex flex-col">
      <div className="w-full">
        <HeadView />
      </div>
      <div className="flex-grow w-full min-h-0 overflow-hidden">
        <ResizableWrapper />
      </div>
    </main>
  );
}
