import { staticFile, useVideoConfig } from 'remotion';
import { VideoScenario } from '../entities';
import {
  BgmPlayer,
  CharacterArea,
  DisplayArea,
  MessageArea,
  TalkVoicePlayer,
} from '../components';
import { useMemo } from 'react';

export type LandscapeCompositionProps = {
  scenario: VideoScenario;
};

export const LandscapeComposition = ({
  scenario,
}: LandscapeCompositionProps) => {
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

      <MessageArea
        layout={layout.messageArea}
        fontSize={80}
        messageTimeline={scenario.messageTimeline}
      />
    </div>
  );
};

function calcLayout(width: number, height: number) {
  const displayAreaHeight = (height * 3) / 4;
  const characterAreaHeight = 640;

  return {
    mode: 'landscape',
    displayArea: {
      x: 0,
      y: 0,
      width: width,
      height: displayAreaHeight,
    },
    characterArea: {
      x: width - 480,
      y: height - characterAreaHeight,
      width: characterAreaHeight,
      height: characterAreaHeight + 50,
      angle: 8,
    },
    messageArea: {
      x: 0,
      y: displayAreaHeight,
      width: width,
      height: height - displayAreaHeight,
    },
  };
}
