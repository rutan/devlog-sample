import { Composition } from 'remotion';
import { PortraitComposition, LandscapeComposition } from './compositions';

// 自動生成されたシナリオデータをインポート
import { scenario } from './scenario.gen';

const FPS = 60;

export const RemotionRoot: React.FC = () => {
  const durationFrames = Math.round(FPS * scenario.duration);
  return (
    <>
      <Composition
        id="PortraitComposition"
        component={PortraitComposition}
        durationInFrames={durationFrames}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scenario,
        }}
      />

      <Composition
        id="LandscapeComposition"
        component={LandscapeComposition}
        durationInFrames={durationFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenario,
        }}
      />
    </>
  );
};
