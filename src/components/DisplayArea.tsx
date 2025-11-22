import { Img, OffthreadVideo, staticFile, useVideoConfig } from 'remotion';
import {
  TransitionPresentation,
  TransitionSeries,
  linearTiming,
} from '@remotion/transitions';
import { fade, FadeProps } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { DisplayTimelineItem, TransitionName } from '../entities';
import { flip } from '@remotion/transitions/flip';
import { Rectangle } from '../types';

export interface DisplayAreaProps {
  layout: Rectangle;
  displayTimeline: DisplayTimelineItem[];
}

export const DisplayArea = ({ layout, displayTimeline }: DisplayAreaProps) => {
  const { width, height, fps } = useVideoConfig();
  const transitionFrames = Math.round((15 * fps) / 60);

  return (
    <>
      {/* background */}

      {/* content */}
      <TransitionSeries>
        {displayTimeline.map((item, index) => (
          <>
            {index > 0 && item.transition && (
              <TransitionSeries.Transition
                presentation={getTransitionPresentation(item.transition)}
                timing={linearTiming({
                  durationInFrames: transitionFrames,
                  easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
                })}
              />
            )}
            <TransitionSeries.Sequence
              key={index}
              durationInFrames={
                Math.round(item.duration * fps) +
                (index > 0 && item.transition ? transitionFrames : 0)
              }
              name={item.src}
              layout="none"
            >
              <div
                className="SequenceContent"
                style={{
                  position: 'absolute',
                  left: item.layout.startsWith('full-') ? 0 : layout.x,
                  top: item.layout.startsWith('full-') ? 0 : layout.y,
                  width: item.layout.startsWith('full-') ? width : layout.width,
                  height: item.layout.startsWith('full-')
                    ? height
                    : layout.height,
                  boxSizing: 'border-box',
                }}
              >
                {!item.layout.startsWith('full-') && (
                  <div
                    style={{
                      position: 'absolute',
                      width: layout.width,
                      height: layout.height,
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(0, 0, 0, .9)',
                    }}
                  ></div>
                )}

                <MediaPlayer item={item} />
              </div>
            </TransitionSeries.Sequence>
          </>
        ))}
      </TransitionSeries>
    </>
  );
};

function getTransitionPresentation(name: TransitionName) {
  switch (name) {
    case 'fade':
      return fade();
    case 'slide':
      return slide({ direction: 'from-right' });
    case 'wipe':
      return wipe({
        direction: 'from-bottom-right',
      }) as TransitionPresentation<FadeProps>;
    case 'flip':
      return flip({
        direction: 'from-right',
      }) as TransitionPresentation<FadeProps>;
    default: {
      const _exhaustiveCheck: never = name;
      throw new Error(`Unhandled transition name: ${String(name)}`);
    }
  }
}

const MediaPlayer = ({ item }: { item: DisplayTimelineItem }) => {
  const layoutStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    objectFit: item.layout.includes('cover') ? 'cover' : 'contain',
    objectPosition: item.layout.includes('upper') ? 'top' : 'center',
  } as const;

  if (item.command === 'image') {
    return <Img src={staticFile(item.src)} style={layoutStyle} />;
  }

  if (item.command === 'video') {
    return (
      <OffthreadVideo
        src={staticFile(item.src)}
        volume={item.volume}
        style={layoutStyle}
      />
    );
  }

  return null;
};
