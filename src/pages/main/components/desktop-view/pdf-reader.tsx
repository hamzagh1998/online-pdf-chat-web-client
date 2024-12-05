import { useEffect, useState } from "react";
import PdfViwer from "@/components/pdf-viewer";
import {
  MdOutlineZoomIn,
  MdOutlineZoomOut,
  MdZoomOutMap,
  MdZoomInMap,
} from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { IoMdDownload } from "react-icons/io";

import { useConversationStore } from "@/hooks/store/use-conversation-store";

import { Input } from "@/components/ui/input";

export function PdfReader({
  setIsCollapsed,
}: {
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { currentConversation } = useConversationStore();

  const [zoom, setZoom] = useState(620);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onCollapseSideBar = () => {
    const isCollapsed = JSON.parse(localStorage.getItem("isCollapsed")!);
    localStorage.setItem("isCollapsed", JSON.stringify(!isCollapsed));

    setIsCollapsed && setIsCollapsed(!isCollapsed);
  };

  const onChangePage = (value: string) => {
    if (isNaN(+value)) return setCurrentPage(1);
    else if (+value > totalPages) return setCurrentPage(totalPages);
    else if (+value <= 0) return setCurrentPage(1);
    setCurrentPage(+value);
  };

  const enterFullscreen = () => {
    const element = document.getElementById("fullscreenContainer")!;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      // Firefox
      (element as any).mozRequestFullScreen();
    } else if ((element as any).webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      // IE/Edge
      (element as any).msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (!document.fullscreenElement) return;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      // Chrome, Safari and Opera
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      (document as any).msExitFullscreen();
    }
  };

  useEffect(() => {
    isFullscreen ? enterFullscreen() : exitFullscreen();
  }, [isFullscreen]);

  return (
    <section className="w-full h-full flex flex-col">
      <nav className="py-2 px-4 border-b h-12 border-b-gray-300 flex justify-between items-center">
        {setIsCollapsed && (
          <button className="cursor-pointer w-fit" onClick={onCollapseSideBar}>
            <VscLayoutSidebarLeftOff size={24} />
          </button>
        )}
        <div className="w-fit flex justify-center items-center gap-4">
          <button onClick={() => setZoom(zoom + 50)}>
            <MdOutlineZoomIn size={28} />
          </button>
          <button onClick={() => setZoom(zoom - 50)}>
            <MdOutlineZoomOut size={28} />
          </button>
        </div>
        <div className="flex justify-center items-center gap-2">
          <button
            className="disabled:text-muted disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() =>
              currentPage > 1
                ? setCurrentPage(currentPage - 1)
                : setCurrentPage(1)
            }
          >
            <GrFormPrevious size={36} />
          </button>
          <Input
            type="number"
            className="w-14 h-8"
            value={currentPage}
            onChange={(e) => onChangePage(e.target.value)}
          />
          &#47;
          <div className="rounded-md border border-border w-14 h-8 flex justify-center items-center">
            <p>{totalPages}</p>
          </div>
          {/* next */}
          <button
            className="disabled:text-muted disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() =>
              currentPage < totalPages
                ? setCurrentPage(currentPage + 1)
                : setCurrentPage(totalPages)
            }
          >
            <GrFormNext size={36} />
          </button>
        </div>
        {setIsCollapsed && (
          <button
            className="disabled:cursor-not-allowed disabled:text-muted"
            disabled={!currentConversation?.pdfFileURL}
            onClick={() =>
              currentConversation?.pdfFileURL ? setIsFullscreen(true) : null
            }
          >
            <MdZoomOutMap size={24} />
          </button>
        )}
        <button
          className="disabled:cursor-not-allowed disabled:text-muted"
          disabled={!currentConversation?.pdfFileURL}
        >
          {currentConversation?.pdfFileURL ? (
            <a href={currentConversation.pdfFileURL} download={true}>
              <IoMdDownload size={20} />
            </a>
          ) : (
            <IoMdDownload size={20} />
          )}
        </button>
      </nav>
      {/* PDF content */}
      <div className="w-full h-full overflow-y-scroll">
        <PdfViwer
          pdfUrl={
            currentConversation?.pdfFileURL
              ? currentConversation.pdfFileURL
              : ""
          }
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          width={zoom}
        />
      </div>
      {isFullscreen && (
        <div
          id="fullscreenContainer"
          className="absolute w-screen h-screen top-0 left-0 z-20 bg-secondary overflow-hidden overflow-y-scroll"
          onKeyUp={(e) => e.key === "Escape" && setIsFullscreen(false)}
          tabIndex={0}
        >
          <div className="w-full h-full">
            <PdfViwer
              pdfUrl={
                currentConversation?.pdfFileURL
                  ? currentConversation.pdfFileURL
                  : ""
              }
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              width={820}
            />
          </div>
          <button
            className="fixed top-10 right-10"
            onClick={() => setIsFullscreen(false)}
          >
            <MdZoomInMap size={48} />
          </button>
        </div>
      )}
    </section>
  );
}
