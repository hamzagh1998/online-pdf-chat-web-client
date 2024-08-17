import { HeadView } from "./components/desktop-view/head-view";
import { ResizableWrapper } from "./components/desktop-view/resizable-wrapper";

export function MainPage() {
  return (
    <main className="w-full h-screen">
      <HeadView />
      <ResizableWrapper />
    </main>
  );
}
