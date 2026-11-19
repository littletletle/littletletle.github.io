import '../build/runtime-support.js';
import { GlobalWorkerOptions } from '../build/pdf.mjs';
GlobalWorkerOptions.workerSrc = new URL('../build/compat-worker.mjs', import.meta.url).href;
await import('./viewer.mjs');
