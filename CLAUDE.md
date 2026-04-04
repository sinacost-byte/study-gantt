# CLAUDE.md — Study Gantt

## このプロジェクトについて
学習管理PWAアプリ「Study Gantt」。実装済み・稼働中。
URL: sinacost-byte.github.io/study-gantt/

## 仕様書
`docs/spec_study_gantt.md` が唯一の正。修正作業の前に必ず読むこと。

## 技術スタック
- バニラ HTML / CSS / JavaScript（フレームワーク不使用）
- GitHub Pages（public リポジトリ）でホスティング
- 進捗データは localStorage に保存

## コード構成
- `index.html` — HTML構造
- `app.js` — アプリケーションロジック全体
- `style.css` — スタイル
- `sw.js` — Service Worker（キャッシュ）

## 作業ルール
- 修正完了後、作業ログを `docs/logs/` に残すこと
- ログのファイル名: `work_log_YYYYMMDD.md`
- 修正内容の概要、変更ファイル、注意点を記載すること