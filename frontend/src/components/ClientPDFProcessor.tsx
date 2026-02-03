import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractedQuestion {
    id: string;
    page: number;
    imageUrl: string;
    bbox: number[];
}

export const ClientPDFProcessor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setQuestions([]);
            setLogs([]);
        }
    };

    const loadSample = async () => {
        setProcessing(true);
        addLog("Fetching sample.pdf...");
        try {
            const res = await fetch('/sample.pdf');
            const blob = await res.blob();
            const file = new File([blob], "sample.pdf", { type: "application/pdf" });
            setFile(file);
            // We need to trigger processing after setting file, or just call logic directly.
            // Let's call logic directly or use useEffect. 
            // For simplicity, let's just call a modified process function or wait.
            // Actually, setting file is async. Let's just pass the array buffer to logic.

            const arrayBuffer = await blob.arrayBuffer();
            await processArrayBuffer(arrayBuffer);

        } catch (err) {
            addLog(`Error loading sample: ${err}`);
            setProcessing(false);
        }
    };

    const processArrayBuffer = async (arrayBuffer: ArrayBuffer) => {
        addLog(`Starting processing...`);
        try {
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            addLog(`PDF loaded. Pages: ${pdf.numPages}`);

            const newQuestions: ExtractedQuestion[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                addLog(`Processing page ${i}...`);
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const viewport = page.getViewport({ scale: 2.0 });

                const items = textContent.items as any[];
                const anchors: { num: string, y: number, x: number }[] = [];
                const regex = /^\s*(\d+)[\.)]/;

                for (const item of items) {
                    if (regex.test(item.str)) {
                        const match = item.str.match(regex);
                        anchors.push({
                            num: match[1],
                            x: item.transform[4],
                            y: item.transform[5]
                        });
                    }
                }

                anchors.sort((a, b) => b.y - a.y);
                addLog(`Found ${anchors.length} anchors on page ${i}: ${anchors.map(a => a.num).join(', ')}`);

                if (anchors.length === 0) continue;

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;

                    for (let j = 0; j < anchors.length; j++) {
                        const anchor = anchors[j];
                        const nextAnchor = anchors[j + 1];

                        const pdfTop = anchor.y + 10;
                        const pdfBottom = nextAnchor ? (nextAnchor.y + 10) : 20;

                        const [, y1] = viewport.convertToViewportPoint(0, pdfTop);
                        const [, y2] = viewport.convertToViewportPoint(page.view[2], pdfBottom);

                        const cropX = 0;
                        const cropY = y1;
                        const cropWidth = viewport.width;
                        const cropHeight = y2 - y1;

                        if (cropHeight <= 0) continue;

                        const questionCanvas = document.createElement('canvas');
                        questionCanvas.width = cropWidth;
                        questionCanvas.height = cropHeight;
                        const qCtx = questionCanvas.getContext('2d');

                        if (qCtx) {
                            qCtx.drawImage(
                                canvas,
                                cropX, cropY, cropWidth, cropHeight,
                                0, 0, cropWidth, cropHeight
                            );

                            const dataUrl = questionCanvas.toDataURL('image/png');
                            newQuestions.push({
                                id: `${i}-${anchor.num}`,
                                page: i,
                                imageUrl: dataUrl,
                                bbox: [cropX, cropY, cropWidth, cropHeight]
                            });
                        }
                    }
                }
            }
            setQuestions(newQuestions);
            addLog(`Done! Extracted ${newQuestions.length} questions.`);
        } catch (err) {
            console.error(err);
            addLog(`Error: ${err}`);
        } finally {
            setProcessing(false);
        }
    };

    const processPDF = async () => {
        if (!file) return;
        setProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            await processArrayBuffer(arrayBuffer);
        } catch (err) {
            addLog(`Error: ${err}`);
            setProcessing(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Client-Side PDF Processor</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <div className="flex gap-4 items-center mb-4">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        onClick={processPDF}
                        disabled={!file || processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Process PDF'}
                    </button>
                    <button
                        onClick={loadSample}
                        disabled={processing}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        Load Sample
                    </button>
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs h-40 overflow-y-auto">
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
                    {logs.length === 0 && <div className="text-gray-500">Ready...</div>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {questions.map(q => (
                    <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border">
                        <div className="text-sm font-bold text-gray-500 mb-2">Page {q.page} - Question {q.id.split('-')[1]}</div>
                        <img src={q.imageUrl} alt="Question" className="max-w-full h-auto border rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};
