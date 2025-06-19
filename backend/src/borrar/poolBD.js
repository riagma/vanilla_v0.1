import { Worker } from 'node:worker_threads';
import path from 'node:path';

export class WorkerPool {
  constructor(size, workerPath) {
    this.workers = [];
    this.free = [];
    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerPath);
      this.workers.push(worker);
      this.free.push(worker);
    }
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      if (this.free.length === 0) {
        setTimeout(() => this.runTask(task).then(resolve, reject), 10);
        return;
      }
      const worker = this.free.pop();
      const id = Math.random().toString(36).slice(2);
      worker.once('message', (msg) => {
        this.free.push(worker);
        if (msg.ok) resolve(msg.resultado);
        else reject(new Error(msg.error));
      });
      worker.postMessage({ ...task, id });
    });
  }
}

// Crea y exporta el pool global de 4 workers
export const poolBD = new WorkerPool(4, path.resolve('./src/bd/workerBD.js'));