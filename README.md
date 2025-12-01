# devlog sample

## これはなに？

Remotion を利用した devlog サンプルプロジェクトです。
[実際に使っているもの](https://www.youtube.com/@RutanDayo/shorts) の一部を切り出してサンプル化しています。

## 記事
https://qiita.com/rutan/items/8609e04430237c0967cc

## 実行方法

```bash
# 環境変数ファイルを作成
# Voicepeak のパスを指定してください
# 設定しない場合は読み上げ音声が生成されません
$ cp .env.sample .env

# 依存関係をインストール
$ pnpm install

# プレビューを起動
$ pnpm dev public/sample/sample.mnsc
```

`public/sample/sample.mnsc` を編集するとプレビューに反映されます。

## ライセンス

MIT License
