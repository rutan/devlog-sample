import { FONT_FAMILY_MAIN } from '../constants';
import { ScenarioMeta } from '../entities';
import { Rectangle } from '../types';
import { OutlineText } from './OutlineText';

export interface MetaInfoAreaProps {
  layout: Rectangle;
  metaInfo: ScenarioMeta;
}

const CATEGORY_BOX_HEIGHT = 100;

export const MetaInfoArea = ({ layout, metaInfo }: MetaInfoAreaProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height: layout.height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: '#222',
          color: '#fff',
          borderRadius: '50px',
          width: 'auto',
          height: `${CATEGORY_BOX_HEIGHT}px`,
          padding: '0 75px',
          lineHeight: `${CATEGORY_BOX_HEIGHT}px`,
          textAlign: 'center',
          fontSize: '56px',
          fontFamily: FONT_FAMILY_MAIN,
        }}
      >
        {metaInfo.category}
      </div>
      <OutlineText
        width={layout.width}
        height={layout.height - CATEGORY_BOX_HEIGHT}
        text={metaInfo.title.text}
        fontSize={metaInfo.title.fontSize}
        textColor="#fff"
        outlineColor="#000"
        strokeWidth={20}
        lineHeight={1.4}
      />
    </div>
  );
};
