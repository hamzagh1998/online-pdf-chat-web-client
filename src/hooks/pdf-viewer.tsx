//* https://github.com/wojtekmaj/react-pdf/blob/main/sample/vite/Sample.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "./pdf-viwer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

const maxWidth = 1000;

type PdfViwerProps = {
  pdfUrl: string;
  currentPage: number;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  setCurrentPage: (currentPage: number) => void;
};

export default function PdfViwer({
  pdfUrl,
  currentPage,
  totalPages,
  setTotalPages,
  setCurrentPage,
}: PdfViwerProps) {
  const pageRefs = useRef<(HTMLElement | null)[]>([]);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  useEffect(() => {
    if (pageRefs.current[currentPage - 1]) {
      pageRefs.current[currentPage - 1]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: any) => {
    setTotalPages(nextNumPages);
    setCurrentPage(1);
    pageRefs.current = Array(nextNumPages).fill(null);
  };

  return (
    <div className="Example">
      <div className="Example__container">
        <div className="Example__container__document" ref={setContainerRef}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(totalPages), (_, index) => (
              <div
                ref={(el) => (pageRefs.current[index] = el)}
                key={`page_${index + 1}`}
              >
                <Page
                  pageNumber={index + 1}
                  width={
                    containerWidth
                      ? Math.min(containerWidth, maxWidth)
                      : maxWidth
                  }
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
