import {
  Img,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CharacterTimelineItem } from '../entities';
import { Rectangle } from '../types';

export interface CharacterAreaProps {
  layout: Rectangle & { angle?: number };
  characterTimeline: CharacterTimelineItem[];
}

export const CharacterArea = ({
  layout,
  characterTimeline,
}: CharacterAreaProps) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const appearDuration = fps / 2;
  const appearProgress = Math.min(frame / appearDuration, 1);

  return (
    <div
      style={{
        position: 'absolute',
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height: layout.height,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          transform: `translateY(${(1 - appearProgress) * 100}%)`,
        }}
      >
        <Series>
          {characterTimeline.map((item, index) => (
            <Series.Sequence
              key={index}
              durationInFrames={Math.round(item.duration * fps)}
              name={item.face}
              layout="none"
            >
              <Img
                src={staticFile(
                  `assets/characters/${item.name}/${item.face}.png`,
                )}
                style={{
                  width: layout.width,
                  height: layout.height,
                  objectFit: 'contain',
                  objectPosition: 'center bottom',
                  transform: `rotate(${layout.angle ?? 0}deg)`,
                }}
              />
            </Series.Sequence>
          ))}
        </Series>
      </div>
    </div>
  );
};
