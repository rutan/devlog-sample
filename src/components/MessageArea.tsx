import { Series, useVideoConfig } from 'remotion';
import { MessageTimelineItem } from '../entities';
import { Rectangle } from '../types';
import { OutlineText } from './OutlineText';

export interface MessageAreaProps {
  layout: Rectangle;
  fontSize: number;
  messageTimeline: MessageTimelineItem[];
}

export const MessageArea = ({
  layout,
  fontSize,
  messageTimeline,
}: MessageAreaProps) => {
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height: layout.height,
      }}
    >
      <Series>
        {messageTimeline.map((item, index) => (
          <Series.Sequence
            key={index}
            durationInFrames={Math.round(item.duration * fps)}
            name={item.text}
            layout="none"
          >
            <div className="SequenceContent">
              <OutlineText
                text={item.text}
                fontSize={fontSize}
                width={layout.width}
                height={layout.height}
                textColor="#fff"
                outlineColor="#000"
                strokeWidth={16}
              />
            </div>
          </Series.Sequence>
        ))}
      </Series>
    </div>
  );
};
