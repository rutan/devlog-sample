import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { execa } from 'execa';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { VoicepeakConfig } from '../../src/entities';
import { isFileExists } from './utils';

const VOICE_METADATA_SUFFIX = '.meta.json';

export async function callVoicepeak(
  message: string,
  output: string,
  {
    maxRetryCount = 1,
    isForceGenerate = false,
    ...voicepeakConfig
  }: VoicepeakConfig & {
    maxRetryCount?: number;
    isForceGenerate?: boolean;
  },
) {
  const voicepeakPath = process.env.VOICEPEAK_PATH;
  if (!voicepeakPath) {
    console.warn('VOICEPEAK_PATH is not set in the environment variables.');
    return;
  }

  const outputDir = dirname(output);
  await mkdir(outputDir, { recursive: true });

  const metadataPath = getVoiceMetadataPath(output);

  const currentMetadata = await readVoiceMetadata(metadataPath);
  const nextMetadata = createVoiceMetadata(message, voicepeakConfig);
  if (
    !isForceGenerate &&
    currentMetadata?.signature === nextMetadata.signature
  ) {
    // console.log(`Skipping generation, voice file is up to date: ${output}`);
    return;
  }

  let retryCount = 0;
  while (true) {
    try {
      await execa(voicepeakPath, [
        // ナレーター
        '-n',
        voicepeakConfig.narrator,

        // ピッチ
        '--pitch',
        String(voicepeakConfig.pitch),

        // スピード
        '--speed',
        String(voicepeakConfig.speed),

        // メッセージ
        '-s',
        message,

        // 出力先
        '-o',
        output,
      ]);
      console.log(`Generated voice file: ${output}`);
      break;
    } catch (e) {
      console.error(e);
      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying... (${retryCount})`);
        continue;
      }
      throw e;
    }
  }

  await writeVoiceMetadata(metadataPath, nextMetadata);
}

type VoiceMetadata = {
  signature: string;
  source: {
    talk: string;
    voice: VoicepeakConfig;
  };
};

function buildVoiceSignature(talk: string, voice: VoicepeakConfig): string {
  const hash = createHash('sha256');
  hash.update(
    JSON.stringify({
      talk,
      voice,
    }),
  );
  return hash.digest('hex');
}

async function readVoiceMetadata(metadataPath: string) {
  if (!(await isFileExists(metadataPath))) return null;

  try {
    const content = await readFile(metadataPath, 'utf-8');
    return JSON.parse(content) as VoiceMetadata;
  } catch (error) {
    console.warn(`Failed to read voice metadata: ${metadataPath}`, error);
    return null;
  }
}

async function writeVoiceMetadata(
  metadataPath: string,
  metadata: VoiceMetadata,
) {
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
}

function createVoiceMetadata(
  talk: string,
  voice: VoicepeakConfig,
): VoiceMetadata {
  return {
    signature: buildVoiceSignature(talk, voice),
    source: {
      talk,
      voice,
    },
  };
}

function getVoiceMetadataPath(voiceFilePath: string) {
  return `${voiceFilePath}${VOICE_METADATA_SUFFIX}`;
}
