import { object, number, union, infer as zInfer, string, boolean } from 'zod';
import { scenarioMetaSchema } from './common';
import {
  inputScenarioBgmCommandSchema,
  inputScenarioImageCommandSchema,
  inputScenarioVideoCommandSchema,
} from './inputScenario';

export const timelineParameterSchema = object({
  startTime: number(),
  duration: number(),
});
export type TimelineParameter = zInfer<typeof timelineParameterSchema>;

export const bgmTimelineItemSchema = object({
  ...timelineParameterSchema.shape,
  ...inputScenarioBgmCommandSchema.omit({ command: true }).shape,
});
export type BgmTimelineItem = zInfer<typeof bgmTimelineItemSchema>;

export const videoTimelineItemSchema = object({
  ...timelineParameterSchema.shape,
  ...inputScenarioVideoCommandSchema.shape,
});
export type VideoTimelineItem = zInfer<typeof videoTimelineItemSchema>;

export const imageTimelineItemSchema = object({
  ...timelineParameterSchema.shape,
  ...inputScenarioImageCommandSchema.shape,
});
export type ImageTimelineItem = zInfer<typeof imageTimelineItemSchema>;

export const displayTimelineItemSchema = union([
  videoTimelineItemSchema,
  imageTimelineItemSchema,
]);
export type DisplayTimelineItem = zInfer<typeof displayTimelineItemSchema>;

export const characterTimelineItemSchema = object({
  ...timelineParameterSchema.shape,
  name: string(),
  face: string(),
});
export type CharacterTimelineItem = zInfer<typeof characterTimelineItemSchema>;

export const messageTimelineItemSchema = object({
  ...timelineParameterSchema.shape,
  text: string(),
});
export type MessageTimelineItem = zInfer<typeof messageTimelineItemSchema>;

export const talkVoiceTimelineItemSchema = object({
  ...timelineParameterSchema.shape,
  talk: string(),
  src: string(),
  isExist: boolean(),
});
export type TalkVoiceTimelineItem = zInfer<typeof talkVoiceTimelineItemSchema>;

export const overlayUiTimelineItemSchema = object({
  ...timelineParameterSchema.shape,
  show: boolean(),
});
export type OverlayUiTimelineItem = zInfer<typeof overlayUiTimelineItemSchema>;

export const videoScenarioSchema = object({
  meta: scenarioMetaSchema,
  bgmTimeline: bgmTimelineItemSchema.array(),
  displayTimeline: displayTimelineItemSchema.array(),
  characterTimeline: characterTimelineItemSchema.array(),
  messageTimeline: messageTimelineItemSchema.array(),
  talkVoiceTimeline: talkVoiceTimelineItemSchema.array(),
  overlayUiTimeline: overlayUiTimelineItemSchema.array(),
  duration: number(),
});
export type VideoScenario = zInfer<typeof videoScenarioSchema>;
