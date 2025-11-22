import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
// import { staticFile } from 'remotion';
// import { loadFont } from '@remotion/fonts';
// import { FONT_FAMILY_MAIN } from './constants';

async function main() {
  // フォントを読み込む場合はここで読み込む
  // await loadFont({
  //   family: FONT_FAMILY_MAIN,
  //   url: staticFile('assets/fonts/YourFontFile.ttf'),
  // });

  registerRoot(RemotionRoot);
}

main().catch((err) => {
  console.error(err);
});
