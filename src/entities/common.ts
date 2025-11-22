import { literal, number, object, string, union, infer as zInfer } from 'zod';

export const voicepeakConfigSchema = object({
  narrator: string(),
  speed: number().default(100),
  pitch: number().default(0),
});
export type VoicepeakConfig = zInfer<typeof voicepeakConfigSchema>;

export const layoutNameSchema = union([
  literal('contain'),
  literal('cover'),
  literal('full-contain'),
  literal('full-cover'),
  literal('full-upper'),
]);
export type LayoutName = zInfer<typeof layoutNameSchema>;

export const transitionNameSchema = union([
  literal('fade'),
  literal('slide'),
  literal('wipe'),
  literal('flip'),
]);
export type TransitionName = zInfer<typeof transitionNameSchema>;

export const displayOptionsSchema = object({
  layout: layoutNameSchema.default('contain'),
  transition: transitionNameSchema.optional(),
});
export type DisplayOptions = zInfer<typeof displayOptionsSchema>;

export const scenarioMetaSchema = object({
  title: object({
    text: string(),
    fontSize: number().default(96),
  }),
  category: string(),
  voice: voicepeakConfigSchema,
});
export type ScenarioMeta = zInfer<typeof scenarioMetaSchema>;
