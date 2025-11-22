import { resolve } from 'node:path';
import { TalkVoiceTimelineItem, VoicepeakConfig } from '../../src/entities';
import { PUBLIC_DIR } from './constants';
import { callVoicepeak } from './voicepeak';

export interface VoiceQueueItem {
  item: TalkVoiceTimelineItem;
  voicepeakConfig: VoicepeakConfig;
}

export class VoiceQueue {
  private _tasks: VoiceQueueItem[] = [];
  private _cursor = 0;
  private _isRunning = false;

  get isRunning() {
    return this._isRunning;
  }

  setTasks(items: VoiceQueueItem[]) {
    this._tasks = [...items];
    this._cursor = 0;
  }

  async kick(): Promise<void> {
    const queueItem = this._dequeue();
    if (!queueItem) {
      this._isRunning = false;
      return;
    }

    this._isRunning = true;

    try {
      const voiceFilePath = resolve(PUBLIC_DIR, queueItem.item.src);
      await callVoicepeak(queueItem.item.talk, voiceFilePath, {
        ...queueItem.voicepeakConfig,
        maxRetryCount: 3,
      });
    } catch (error) {
      this._isRunning = false;
      throw error;
    }

    return this.kick();
  }

  private _dequeue(): VoiceQueueItem | undefined {
    if (this._cursor >= this._tasks.length) {
      return undefined;
    }
    const next = this._tasks[this._cursor];
    this._cursor += 1;
    return next;
  }

  clear() {
    this._tasks = [];
    this._cursor = 0;
  }

  hasPending() {
    return this._cursor < this._tasks.length;
  }
}
