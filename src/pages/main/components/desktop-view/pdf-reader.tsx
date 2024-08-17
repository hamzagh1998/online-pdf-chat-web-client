import { useState } from "react";
import PdfViwer from "@/hooks/pdf-viewer";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { IoMdDownload } from "react-icons/io";

import { Input } from "@/components/ui/input";

const pdfUrl =
  "https://res.cloudinary.com/fake-company/image/upload/v1719685563/knfftysndf9m7si50zcr.pdf";

export function PdfReader() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const onChangePage = (value: string) => {
    if (isNaN(+value)) return setCurrentPage(1);
    else if (+value > totalPages) return setCurrentPage(totalPages);
    else if (+value <= 0) return setCurrentPage(1);
    setCurrentPage(+value);
  };

  return (
    <section className="w-full h-full flex flex-col">
      <nav className="py-2 px-4 border-b border-b-gray-300 flex justify-between items-center">
        <button className="cursor-pointer w-fit">
          <VscLayoutSidebarLeftOff size={24} />
        </button>
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
            <GrFormPrevious size={24} />
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
            <GrFormNext size={24} />
          </button>
        </div>
        <button onClick={() => null}>
          <IoMdDownload size={20} />
        </button>
      </nav>
      {/* PDF content */}
      <div className="w-full overflow-auto">
        <PdfViwer
          pdfUrl={pdfUrl}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );
}
