import { Rectangle } from '../types';

export interface TalkBalloonProps {
  layout: Rectangle;
}

const BALLOON_BACKGROUND_COLOR = '#fafafa';
const BALLOON_BORDER_COLOR = '#545454';

export const TalkBalloon = ({ layout }: TalkBalloonProps) => (
  <div
    style={{
      position: 'absolute',
      left: layout.x,
      top: layout.y,
      width: layout.width,
      height: layout.height,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: BALLOON_BACKGROUND_COLOR,
      boxShadow: `0px 10px 0 ${BALLOON_BORDER_COLOR}`,
    }}
  >
    {/* 吹き出しの尻尾 */}
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: '70%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '62px solid transparent',
        borderRight: '62px solid transparent',
        borderTop: `62px solid ${BALLOON_BORDER_COLOR}`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% - 2px)',
        left: '70%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '50px solid transparent',
        borderRight: '50px solid transparent',
        borderTop: `50px solid ${BALLOON_BACKGROUND_COLOR}`,
      }}
    />
  </div>
);
