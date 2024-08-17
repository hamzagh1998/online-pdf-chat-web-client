import { PdfReader } from "./pdf-reader";
import { ChatSection } from "./chat-section";
import { SideBar } from "./side-bar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function ResizableWrapper() {
  return (
    <section className="flex justify-start items-start w-full h-full">
      <div className="w-2/12 h-full border-r border-secondary">
        <SideBar />
      </div>
      <div className="w-10/12 h-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <PdfReader />
          </ResizablePanel>
          <ResizableHandle
            className="transition-colors delay-150 hover:bg-primary"
            withHandle
          />
          <ResizablePanel>
            <ChatSection />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </section>
  );
}
