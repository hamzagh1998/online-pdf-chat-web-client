import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import { PdfReader } from "../desktop-view/pdf-reader";
import { ChatSection } from "../desktop-view/chat-section";
import { SideBar } from "../desktop-view/side-bar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserDropdown } from "@/components/user-dropdown";

export function TabContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className="w-full">
      <div className="w-full flex justify-between items-start p-0">
        <button className="p-2 text-xl" onClick={toggleSidebar}>
          {isSidebarOpen ? <AiOutlineClose size={26} /> : <FaBars size={26} />}
        </button>
        <section className="w-full flex justify-end items-center gap-2">
          <UserDropdown />
          <ModeToggle />
        </section>
      </div>
      {isSidebarOpen ? (
        <SideBar setIsSidebarOpen={setIsSidebarOpen} />
      ) : (
        <Tabs defaultValue="pdf-reader" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf-reader">PDF View</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="pdf-reader">
            <PdfReader />
          </TabsContent>
          <TabsContent
            value="chat"
            className="h-[calc(100vh-100px)] overflow-y-auto"
          >
            <ChatSection />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
