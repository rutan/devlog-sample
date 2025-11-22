import { Html5Audio, Series, staticFile, useVideoConfig } from 'remotion';
import { TalkVoiceTimelineItem } from '../entities';

export interface TalkVoicePlayerProps {
  talkTimeline: TalkVoiceTimelineItem[];
}

export const TalkVoicePlayer = ({ talkTimeline }: TalkVoicePlayerProps) => {
  const { fps } = useVideoConfig();

  return (
    <Series>
      {talkTimeline.map((item, index) => (
        <Series.Sequence
          key={index}
          durationInFrames={Math.round(item.duration * fps)}
          name={`${item.isExist ? '' : '[NoAudio] '}${item.talk}`}
        >
          {item.isExist ? (
            <Html5Audio src={staticFile(item.src)} />
          ) : (
            <div>{/* No audio */}</div>
          )}
        </Series.Sequence>
      ))}
    </Series>
  );
};
