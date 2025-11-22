import { readFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve } from 'node:path';
import { Command, parse as parseMnsc } from '@rutan/mnsc';
import { parse as parseYaml } from 'yaml';
import {
  InputScenario,
  inputScenarioSchema,
  InputScenarioTextCommand,
} from '../../src/entities';
import { PUBLIC_DIR } from './constants';
import { isFileExists } from './utils';

/**
 * mnscファイルを読み込んでInputScenario形式に変換して返す
 * @param filePath
 * @returns
 */
export async function parseMnscFile(filePath: string): Promise<InputScenario> {
  const scenarioText = await readFile(filePath, 'utf-8');
  const scenarioData = parseMnsc(scenarioText, {
    frontMatterParser: (frontMatter) => {
      return parseYaml(frontMatter);
    },
  });

  return inputScenarioSchema.parse({
    ...scenarioData,
    commands: await Promise.all(
      scenarioData.commands.map((command) =>
        transformCommand(command, { scenarioPath: filePath }),
      ),
    ),
  });
}

type TransformContext = {
  scenarioPath: string;
};

async function transformCommand(command: Command, context: TransformContext) {
  switch (command.command) {
    case 'bgm':
      return transformAssetCommand(command, context);
    case 'image':
    case 'video':
      return transformAssetCommand(command, context);
    case 'stopBgm':
      return { command: 'stopBgm' };
    case 'text':
      return transformTextCommand(command, context);
    case 'showUi':
      return { command: 'overlayUi', show: true };
    case 'hideUi':
      return { command: 'overlayUi', show: false };
    default:
      throw new Error(`Unknown command: ${command.command}`);
  }
}

function transformAssetCommand(command: Command, context: TransformContext) {
  const [assetPath, rawOptions] = command.args as [
    string,
    Record<string, unknown> | undefined,
  ];

  return {
    ...command,
    ...rawOptions,
    src: convertScenarioRelativePath(context.scenarioPath, assetPath),
  };
}

async function transformTextCommand(
  command: Command,
  context: TransformContext,
) {
  const [originalText, rawOptions] = command.args as [
    string,
    Record<string, unknown> | undefined,
  ];
  const { lines, talk, duration } = convertBBCode(originalText);

  let voice: InputScenarioTextCommand['voice'];
  if (command.id) {
    const base = basename(context.scenarioPath, '.mnsc');
    const voicePath = `voices_${base}.gen/${command.id}.wav`;
    voice = {
      talk,
      src: convertScenarioRelativePath(context.scenarioPath, voicePath),
      isExist: await isFileExists(
        resolve(dirname(context.scenarioPath), voicePath),
      ),
    };
  }

  return {
    ...command,
    ...rawOptions,
    lines,
    voice,
    duration,
  };
}

function convertScenarioRelativePath(
  scenarioPath: string,
  originalPath: string,
) {
  const scenarioDir = dirname(scenarioPath);
  const absolutePath = resolve(scenarioDir, originalPath);
  const relativePathFromPublic = relative(PUBLIC_DIR, absolutePath);
  return relativePathFromPublic.split('\\').join('/');
}

/**
 * BBCode形式のテキストを処理する
 * @param bbCodeText
 * @returns
 */
export function convertBBCode(bbCodeText: string) {
  const lines: InputScenarioTextCommand['lines'] = [];
  let totalDuration = 0;
  let talk = '';

  const rawLines = bbCodeText.split(/\r?\n/);
  for (const rawLine of rawLines) {
    const trimmedLine = rawLine.trim();
    if (!trimmedLine) continue;

    const match = trimmedLine.match(/^\[t=([0-9]+(?:\.[0-9]+)?)\](.*)$/i);
    if (!match) continue;

    const [, durationStr, remainingText] = match;
    const rawText = (remainingText || '').trim();
    const { displayText, talkText } = extractTalkSegments(rawText);
    const parsedDuration = Number(durationStr);
    const duration = Number.isFinite(parsedDuration)
      ? parsedDuration
      : talkText.length * 0.1;

    lines.push({ text: displayText, duration });
    talk += talkText;
    totalDuration += duration;
  }

  return {
    lines,
    talk,
    duration: totalDuration,
  };
}

function extractTalkSegments(text: string) {
  const talkPattern =
    /\[talk(?:=(?:"([^"]*)"|'([^']*)'|([^\]]+)))?\](.*?)\[\/talk]/gi;
  let displayText = '';
  let talkText = '';
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = talkPattern.exec(text)) !== null) {
    const [fullMatch, doubleQuoted, singleQuoted, unquoted, innerText] = match;
    const matchStart = match.index;

    const leading = text.slice(lastIndex, matchStart);
    displayText += leading;
    talkText += leading;

    displayText += innerText;
    talkText += doubleQuoted ?? singleQuoted ?? unquoted ?? innerText;

    lastIndex = matchStart + fullMatch.length;
  }

  const trailing = text.slice(lastIndex);
  displayText += trailing;
  talkText += trailing;

  return { displayText, talkText };
}
