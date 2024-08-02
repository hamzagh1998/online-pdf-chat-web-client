import { HeadView } from "./components/desktop-view/head-view";
import { ResizableWrapper } from "./components/desktop-view/resizable-wrapper";

export function MainPage() {
  return (
    <div className="w-full h-screen">
      <HeadView />
      <div className="w-full h-full">
        <ResizableWrapper />
      </div>
    </div>
  );
}
