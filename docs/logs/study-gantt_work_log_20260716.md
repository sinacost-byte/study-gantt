# Study Gantt 作業ログ 2026-07-16

## 作業概要

`study_gantt_patch_20260716.md` のパッチ仕様に従い、以下を実施。

1. **✅トグルのたびに表示位置が先頭へ戻るバグの修正**（`render()` にスクロール位置ポリシーを導入）
2. **sw.js の CACHE バンプ**（v2 → v3）
3. **フッターにコード版スタンプ追加**（`app 20260716-1`）
4. CLAUDE.md に運用ルール2行を追記

ナビ可動域（105859c）のコードには**触っていない**。実機で9月に到達できた件は Pages 配信遅れ／端末キャッシュの疑いであり、本パッチの push で新しい Pages ビルドが走ることで 105859c も同時に実機へ届く想定（受け入れ確認 4・5 で再検証）。

---

## 修正1: render() にスクロール位置ポリシーを導入

### 根本原因
`render()` が毎回 `app.innerHTML` を全書き換えするため、スクロールコンテナ `#chart-scroll` がDOMごと破棄・再生成され、`scrollTop` / `scrollLeft` が 0 にリセットされていた。位置を保存する仕組みが存在しなかった（起動時の「今日へスクロール」は `init()` 内の一回きり）。

### 対応
- `render(opts)` にモードを導入。**縦（scrollTop）はどのモードでも保持**。横（scrollLeft）だけ操作の性質で分ける。
  - `'preserve'`（既定）: 縦横とも保持
  - `'reset-x'`: 縦は保持、横は左端（再生成直後の 0 のまま）
  - `'center-today'`: 縦は保持、横は今日線をセンタリング
- `render()` 冒頭で旧 `#chart-scroll` の `scrollTop`/`scrollLeft` を捕捉し、`app.innerHTML = html` の直後に復元。内容が縮んだ場合のはみ出しはブラウザのクランプに任せる。
- `init()` 内の「今日へスクロール」inline `setTimeout` をヘルパー `scrollTodayIntoView()` に抽出（横センタリングのみ担当。縦は render() 側の保持ロジックに任せる）。

### 呼び出し側の指定

| 呼び出し元 | mode |
|---|---|
| `toggleTask`（✅） | `preserve`（引数なし） |
| `toggleCollapse` | `preserve`（引数なし） |
| `nav`（◀▶） | `reset-x` |
| `setView`（週/月/全体） | `reset-x` |
| `today` | `center-today` |
| `init()` | `center-today` |
| md手動読込（file-input change） | `center-today` |

---

## 修正2: sw.js の CACHE バンプ

- `const CACHE = 'study-gantt-v2'` → `'study-gantt-v3'`
- fetch戦略・ASSETS は変更なし。

---

## 修正3: フッターにコード版スタンプ

- `app.js` 冒頭に `const APP_VERSION = '20260716-1';` を追加。
- `.footer-meta` 右側 span を `取得元: … · {取得日時} · app ${APP_VERSION}` に拡張。
- 目的: Pages配信遅れ／SWワンリロード遅延の検知手段。「動いているコードの版」がフッターで見える。

---

## 変更しなかったこと（パッチ仕様どおり）

- タスクID生成ロジック・`parseMd()`・`collectAllTaskIds()`（進捗データ保全）
- `init()` の取得チェーン（fetch → localStorage → DEFAULT_MD）と source 記録
- `getNavBounds()` とナビのクランプ（105859c のまま）
- `DEFAULT_MD` と `public/schedule.md`（スケジュール変更なし）
- 各ビューの描画内容・レイアウト・ツールチップ挙動
- README は存在しないため追記対象なし

---

## 変更ファイル

| ファイル | 変更 |
|---------|------|
| `app.js` | `APP_VERSION` 定数 / `scrollTodayIntoView()` ヘルパー / `render(opts)` スクロール位置ポリシー / 各呼び出し元の mode 指定 / フッターに `app` 版スタンプ |
| `sw.js` | `CACHE` v2→v3 |
| `CLAUDE.md` | 運用ルール2行を追記（APP_VERSION 更新・CACHE バンプ） |
| `docs/logs/` | 本ログ・パッチ仕様 `study_gantt_patch_20260716.md` |

---

## 検証

- `node --check` で `app.js` / `sw.js` の構文OK。
- jsdom による実コード＋実 `public/schedule.md` のDOM実走行（21チェック全パス）:
  - フッターに `app 20260716-1` 表示
  - `toggleTask`（✅ON/OFF）: scrollTop=500 / scrollLeft=120 が完全保持
  - `toggleCollapse`: 同上保持
  - `nav`（◀▶）: scrollTop 保持・scrollLeft は 0 にリセット
  - `setView`: scrollTop 保持・scrollLeft は 0 にリセット
  - `today`: scrollTop 保持・今日線が横方向センタリング（`lineLeft + LABEL_W - clientWidth/2`）
  - ナビクランプ再確認（105859c が生きていること）: 月ビュー8月で ▶ disabled（9月到達不可）／週ビュー終点 8/23 - 8/29 で ▶ disabled

---

## 注意点・申し送り

- **受け入れ確認はデプロイ後、Safari で2回リロード**してから（SW切替のワンリロード遅延を消化）。フッター右下に `app 20260716-1` が出るまでは以降の確認は無効。
- 実機での受け入れ確認項目はパッチ仕様書の「受け入れ確認」1〜8を参照。**4・5（ナビ可動域の停止）が新デプロイ後も通らない場合**は Pages 配信ではなく端末側キャッシュが原因 → Safari の Webサイトデータから当サイトを削除（またはDevToolsでSWをUnregister）して再確認。
- **運用ルール（CLAUDE.md に追記済み）**: 以後 app.js を変更するコミットでは `APP_VERSION` を必ず更新。デプロイ（push）ごとに sw.js の `CACHE` をバンプ。
