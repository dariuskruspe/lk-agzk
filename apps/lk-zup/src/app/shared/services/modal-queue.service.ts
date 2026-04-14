import { Injectable } from '@angular/core';

/**
 * Сервис очереди модалок, чтобы не перекрывать одной модалкой другую
 * Особенно актуально в момент инициализации приложения
 */

const DEFAULT_DELAY_BETWEEN = 500;

@Injectable({
  providedIn: 'root',
})
export class ModalQueueService {
  private queue: ModalQueueItem[] = [];

  private active: ModalQueueItem | null = null;

  showWhenFree(name: string, callback: ModalQueueCallback) {
    this.queue.push({ name, callback });
    this.checkQueue();
  }

  cancel(name: string) {
    this.queue = this.queue.filter((i) => i.name !== name);
    this.checkQueue();
  }

  private checkQueue() {
    if (this.queue.length && !this.active) {
      this.showOne(this.queue.shift());
    }
  }

  private showOne(next: ModalQueueItem) {
    this.active = next;
    setTimeout(() => {
      this.active.callback(() => {
        this.active = null;
        this.checkQueue();
      });
    }, DEFAULT_DELAY_BETWEEN);
  }
}

type ModalQueueItem = { name: string; callback: ModalQueueCallback };

type ModalQueueCallback = (done: () => void) => void;
