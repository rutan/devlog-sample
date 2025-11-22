import {
  InputScenario,
  BgmTimelineItem,
  CharacterTimelineItem,
  DisplayTimelineItem,
  MessageTimelineItem,
  OverlayUiTimelineItem,
  TalkVoiceTimelineItem,
  VideoScenario,
  videoScenarioSchema,
} from '../../src/entities';
import { parseMnscFile } from './parseMnsc';

/**
 * シナリオファイルの読み込み
 * @param filePath
 * @returns
 */
export async function loadScenario(filePath: string) {
  const mnscScenario = await parseMnscFile(filePath);
  const videoScenario = convertToVideoScenario(mnscScenario);
  return videoScenario;
}

function convertToVideoScenario(inputScenario: InputScenario): VideoScenario {
  return videoScenarioSchema.parse({
    meta: inputScenario.meta,
    bgmTimeline: makeBgmTimeline(inputScenario),
    displayTimeline: makeDisplayTimeline(inputScenario),
    characterTimeline: makeCharacterTimeline(inputScenario),
    messageTimeline: makeMessageTimeline(inputScenario),
    talkVoiceTimeline: makeTalkVoiceTimeline(inputScenario),
    overlayUiTimeline: makeOverlayUiTimeline(inputScenario),
    duration: inputScenario.commands.reduce((sum, cmd) => {
      if ('duration' in cmd) {
        return sum + cmd.duration;
      }
      return sum;
    }, 0),
  } satisfies VideoScenario);
}

function makeBgmTimeline(inputScenario: InputScenario): BgmTimelineItem[] {
  const timeline: BgmTimelineItem[] = [];
  let currentTime = 0;
  for (const command of inputScenario.commands) {
    if (command.command === 'bgm') {
      timeline.push({
        ...command,
        startTime: currentTime,
        duration: -1, // dummy value
      });
    } else if (command.command === 'stopBgm') {
      timeline.push({
        startTime: currentTime,
        duration: 0,
        src: '',
        volume: 0,
      });
    } else if ('duration' in command) {
      currentTime += command.duration;
    }
  }

  applySequentialDurations(timeline, currentTime);

  for (let i = timeline.length - 1; i >= 0; i--) {
    if (timeline[i].src === '') {
      timeline.splice(i, 1);
    }
  }

  return timeline;
}

function makeDisplayTimeline(
  inputScenario: InputScenario,
): DisplayTimelineItem[] {
  const timeline: DisplayTimelineItem[] = [];

  let currentTime = 0;
  for (const command of inputScenario.commands) {
    if (command.command === 'video' || command.command === 'image') {
      timeline.push({
        ...command,
        startTime: currentTime,
        duration: -1, // dummy value
      });
    } else if ('duration' in command) {
      currentTime += command.duration;
    }
  }

  applySequentialDurations(timeline, currentTime);

  return timeline;
}

function makeTalkVoiceTimeline(
  inputScenario: InputScenario,
): TalkVoiceTimelineItem[] {
  const timeline: TalkVoiceTimelineItem[] = [];

  let currentTime = 0;
  for (const command of inputScenario.commands) {
    if (command.command === 'text') {
      if (command.voice) {
        timeline.push({
          ...command.voice,
          startTime: currentTime,
          duration: command.duration,
        });
      }
      currentTime += command.duration;
    }
  }

  return timeline;
}

function makeMessageTimeline(
  inputScenario: InputScenario,
): MessageTimelineItem[] {
  const timeline: MessageTimelineItem[] = [];

  let currentTime = 0;
  for (const command of inputScenario.commands) {
    if (command.command === 'text') {
      command.lines.forEach((line) => {
        timeline.push({
          startTime: currentTime,
          duration: line.duration,
          text: line.text,
        });
        currentTime += line.duration;
      });
    }
  }

  return timeline;
}

function makeCharacterTimeline(
  inputScenario: InputScenario,
): CharacterTimelineItem[] {
  const timeline: CharacterTimelineItem[] = [];

  let currentTime = 0;
  for (const command of inputScenario.commands) {
    if (command.command === 'text') {
      timeline.push({
        startTime: currentTime,
        duration: command.duration,
        name: command.name,
        face: command.face,
      });
      currentTime += command.duration;
    }
  }

  return timeline;
}

function makeOverlayUiTimeline(
  inputScenario: InputScenario,
): OverlayUiTimelineItem[] {
  const timeline: OverlayUiTimelineItem[] = [];

  let currentTime = 0;
  for (const command of inputScenario.commands) {
    if (command.command === 'overlayUi') {
      timeline.push({
        startTime: currentTime,
        duration: 0, // dummy value
        show: command.show,
      });
    } else if ('duration' in command) {
      currentTime += command.duration;
    }
  }

  applySequentialDurations(timeline, currentTime);

  if (timeline.length === 0) {
    timeline.push({
      startTime: 0,
      duration: currentTime,
      show: true,
    });
  } else if (timeline[0].startTime > 0) {
    timeline.unshift({
      startTime: 0,
      duration: timeline[0].startTime,
      show: true,
    });
  }

  return timeline;
}

type TimelineItemWithDuration = {
  startTime: number;
  duration: number;
};

function applySequentialDurations<TItem extends TimelineItemWithDuration>(
  timeline: TItem[],
  finalTime: number,
) {
  for (let i = 0; i < timeline.length; i++) {
    const currentItem = timeline[i];
    const nextItem = timeline[i + 1];
    currentItem.duration =
      (nextItem?.startTime ?? finalTime) - currentItem.startTime;
  }
}
