import { Html5Audio, Series, staticFile, useVideoConfig } from 'remotion';
import { BgmTimelineItem } from '../entities';

export interface BgmPlayerProps {
  bgmTimeline: BgmTimelineItem[];
}

export const BgmPlayer = ({ bgmTimeline }: BgmPlayerProps) => {
  const { fps } = useVideoConfig();

  return (
    <Series>
      {bgmTimeline.map((item, index) => (
        <Series.Sequence
          key={index}
          durationInFrames={Math.round(item.duration * fps)}
          name={item.src}
        >
          <Html5Audio
            src={staticFile(item.src)}
            volume={item.volume}
            loop={true}
          />
        </Series.Sequence>
      ))}
    </Series>
  );
};
