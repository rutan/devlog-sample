import { staticFile, useVideoConfig } from 'remotion';
import { VideoScenario } from '../entities';
import {
  BgmPlayer,
  CharacterArea,
  DisplayArea,
  MessageArea,
  MetaInfoArea,
  TalkBalloon,
  TalkVoicePlayer,
} from '../components';
import { useMemo } from 'react';

export type PortraitCompositionProps = {
  scenario: VideoScenario;
};

export const PortraitComposition = ({ scenario }: PortraitCompositionProps) => {
  const { width, height } = useVideoConfig();
  const layout = useMemo(() => calcLayout(width, height), [width, height]);

  return (
    <div>
      <BgmPlayer bgmTimeline={scenario.bgmTimeline} />
      <TalkVoicePlayer talkTimeline={scenario.talkVoiceTimeline} />

      {/* Background */}
      <div
        style={{
          position: 'absolute',
          width,
          height,
          backgroundImage: `url(${staticFile('assets/back.png')})`,
        }}
      ></div>

      <DisplayArea
        layout={layout.displayArea}
        displayTimeline={scenario.displayTimeline}
      />

      <CharacterArea
        layout={layout.characterArea}
        characterTimeline={scenario.characterTimeline}
      />

      <MetaInfoArea layout={layout.metaInfoArea} metaInfo={scenario.meta} />

      <TalkBalloon
        layout={{
          ...layout.messageArea,
          y: layout.messageArea.y - 5,
        }}
      />
      <MessageArea
        layout={layout.messageArea}
        fontSize={64}
        messageTimeline={scenario.messageTimeline}
      />
    </div>
  );
};

export function calcLayout(width: number, height: number) {
  const displayAreaHeight = (width / 16) * 9;
  const metaAreaHeight = (((height - displayAreaHeight) / 2) * 2) / 3;
  const characterAreaHeight = 960;

  return {
    mode: 'portrait',
    displayArea: {
      x: 0,
      y: (height - displayAreaHeight) / 2,
      width: width,
      height: displayAreaHeight,
    },
    metaInfoArea: {
      x: 0,
      y: (height - displayAreaHeight) / 2 - metaAreaHeight,
      width: width,
      height: metaAreaHeight,
    },
    characterArea: {
      x: width - 740,
      y: height - characterAreaHeight + 100,
      width: characterAreaHeight,
      height: characterAreaHeight,
      angle: 12,
    },
    messageArea: {
      x: 0,
      y: (height - displayAreaHeight) / 2 + displayAreaHeight + 25,
      width: width,
      height: 160,
    },
  };
}
