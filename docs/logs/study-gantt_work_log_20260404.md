# Study Gantt 作業ログ 2026-04-04

## 作業概要

`study_gantt_patch_20260404.md` の内容に従い、アプリの微調整を実施。

---

## 修正1: 週表示の日付ズレ修正

**対象ファイル**: `app.js`

**原因**: `getWeekStart()` が時刻を正規化していなかった。`navDate = new Date()` は現在時刻（例: 14:04）を持つため、`dayDiff()` の `Math.round` で1日ズレが発生。

**変更箇所**: `app.js` `getWeekStart` 関数

```js
// Before
function getWeekStart(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); return r; }

// After
function getWeekStart(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); r.setHours(0,0,0,0); return r; }
```

---

## 修正2: ラベルタップ/長押しで全文ツールチップ表示

**対象ファイル**: `app.js`, `index.html`, `style.css`

### 仕様

| 行タイプ | 操作 | 動作 |
|---------|------|------|
| task | ラベルタップ | 全文ツールチップ表示 |
| week | ラベル長押し（500ms） | 全文ツールチップ表示 |
| section / milestone | — | なし |

- ツールチップ外タップで閉じる
- 長押し検知後は折りたたみを発火しない（`longPressTriggered` フラグで制御）

### app.js 変更内容

- モジュールレベル変数 `longPressTimer`, `longPressTriggered` を追加
- `showTooltip(text, x, y)` / `hideTooltip()` / `findLongPressTarget(el)` を追加
- `render()` 内でtask行の `.row-label` に `data-action="showTooltip"` + `data-tooltip-text` を付与
- `render()` 内でweek行の `.row-label` に `data-tooltip-text` を付与（長押し検知用）
- `attachEvents()` に以下を追加:
  - `showTooltip` アクション処理
  - クリック時に `hideTooltip()` を先頭で呼び出す
  - `longPressTriggered` が true のクリックは早期リターン（折りたたみ抑止）
  - `touchstart` / `touchend` / `touchmove` による長押し検知（iOS）
  - `mousedown` / `mouseup` による長押し検知（デスクトップ）

### index.html 変更内容

- `<div id="tooltip"></div>` を `#app` の外（body直下）に追加

### style.css 変更内容

- `.row-label` に `-webkit-touch-callout: none` を追加（iOS長押し時のコンテキストメニュー抑止）
- `#tooltip` スタイルを追加:
  - `position: fixed` / `z-index: 50`
  - 白背景、`border: 1px solid #E7E5E4`、`border-radius: 8px`
  - `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
  - `font-size: 12px` / `max-width: 280px` / `word-break: break-word`
  - `pointer-events: none`（クリックを透過させ #app の hideTooltip をトリガー可能に）

---

## コミット・プッシュ

| 項目 | 内容 |
|------|------|
| コミットハッシュ | `62c3ab0` |
| ブランチ | `main` |
| リモート | `https://github.com/sinacost-byte/study-gantt.git` |
| コミットメッセージ | `fix: 週表示日付ズレ修正 + ラベルツールチップ表示` |
