import {
  literal,
  object,
  string,
  number,
  infer as zInfer,
  union,
  boolean,
} from 'zod';
import { displayOptionsSchema, scenarioMetaSchema } from './common';

export const inputScenarioBgmCommandSchema = object({
  command: literal('bgm'),
  src: string(),
  volume: number().min(0).max(1.0).default(1.0),
});
export type InputScenarioBgmCommand = zInfer<
  typeof inputScenarioBgmCommandSchema
>;

export const inputScenarioStopBgmCommandSchema = object({
  command: literal('stopBgm'),
});
export type InputScenarioStopBgmCommand = zInfer<
  typeof inputScenarioStopBgmCommandSchema
>;

export const inputScenarioImageCommandSchema = object({
  ...displayOptionsSchema.shape,
  command: literal('image'),
  src: string(),
});
export type InputScenarioImageCommand = zInfer<
  typeof inputScenarioImageCommandSchema
>;

export const inputScenarioVideoCommandSchema = object({
  ...displayOptionsSchema.shape,
  command: literal('video'),
  src: string(),
  volume: number().min(0).max(1.0).default(1.0),
});
export type InputScenarioVideoCommand = zInfer<
  typeof inputScenarioVideoCommandSchema
>;

export const inputScenarioTextCommandSchema = object({
  id: string().optional(),
  command: literal('text'),
  name: string(),
  face: string().default(''),
  lines: object({
    text: string(),
    duration: number(),
  }).array(),
  voice: object({
    talk: string(),
    src: string(),
    isExist: boolean(),
  }).optional(),
  duration: number(),
});
export type InputScenarioTextCommand = zInfer<
  typeof inputScenarioTextCommandSchema
>;

export const inputScenarioOverlayUiCommandSchema = object({
  command: literal('overlayUi'),
  show: boolean(),
});
export type InputScenarioOverlayUiCommand = zInfer<
  typeof inputScenarioOverlayUiCommandSchema
>;

export const inputScenarioCommandSchema = union([
  inputScenarioBgmCommandSchema,
  inputScenarioStopBgmCommandSchema,
  inputScenarioVideoCommandSchema,
  inputScenarioImageCommandSchema,
  inputScenarioTextCommandSchema,
  inputScenarioOverlayUiCommandSchema,
]);
export type InputScenarioCommand = zInfer<typeof inputScenarioCommandSchema>;

export const inputScenarioSchema = object({
  meta: scenarioMetaSchema,
  commands: inputScenarioCommandSchema.array(),
});
export type InputScenario = zInfer<typeof inputScenarioSchema>;
