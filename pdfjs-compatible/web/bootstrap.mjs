import '../build/runtime-support.js';
import { GlobalWorkerOptions } from '../build/pdf.mjs';
GlobalWorkerOptions.workerSrc = new URL('../build/compat-worker.mjs', import.meta.url).href;
const eventDocument = window.parent.document;
function configureViewer(event) {
  if (event.detail?.source !== window) return;
  const options = window.PDFViewerApplicationOptions;
  options.setAll({
    disablePreferences: true,
    disableAutoFetch: true,
    disableStream: true,
    disableRange: false,
    rangeChunkSize: 262144,
    enableScripting: false,
    annotationEditorMode: -1,
    maxCanvasPixels: 8388608
  });
  eventDocument.removeEventListener('webviewerloaded', configureViewer);
}
eventDocument.addEventListener('webviewerloaded', configureViewer);
await import('./viewer.mjs?v=speed-20261126');
