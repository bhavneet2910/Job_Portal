import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useState } from "react"

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PDFViewer({ open, setOpen, pdfUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Resume Preview</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center h-full overflow-auto">
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="flex flex-col items-center"
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            width={Math.min(window.innerWidth * 0.8, 800)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                    <div className="flex items-center gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                            disabled={pageNumber <= 1}
                        >
                            Previous
                        </Button>
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                            disabled={pageNumber >= numPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 