import { useMediaQuery } from "@/hooks/use-media-query";

import { HeadView } from "./components/desktop-view/head-view";
import { ResizableWrapper } from "./components/desktop-view/resizable-wrapper";
import { TabContainer } from "./components/mobile-view/tab-container";

export function MainPage() {
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const isPhone = useMediaQuery("(max-width: 767px)");

  return (
    <main className="w-full h-screen flex flex-col overflow-x-hidden">
      {isTablet ? (
        <TabContainer />
      ) : isPhone ? (
        <TabContainer />
      ) : (
        <>
          <div className="w-full">
            <HeadView />
          </div>
          <div className="flex-grow w-full min-h-0 overflow-hidden">
            <ResizableWrapper />
          </div>
        </>
      )}
    </main>
  );
}
