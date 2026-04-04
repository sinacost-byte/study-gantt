# Study Gantt 作業ログ — 2026-03-28

## 概要

「Self-Study with AI University」の学習スケジュール管理アプリ（ガントチャートPWA）を新規実装した。

---

## 実施内容

### 1. アプリ実装（コミット: bf91399）

仕様書（`docs/spec_study_gantt_v2.md`）と承認済みプロトタイプ（`docs/prototype.jsx`）をもとに、バニラ HTML/CSS/JS でアプリを実装。

**作成ファイル:**

| ファイル | 内容 |
|---|---|
| `index.html` | アプリ本体HTML、PWAメタタグ |
| `style.css` | スタイル（プロトタイプのデザインを再現） |
| `app.js` | Markdownパース・描画・イベント処理のすべてのロジック |
| `manifest.json` | PWAマニフェスト |
| `sw.js` | Service Worker（オフライン対応） |
| `icons/icon-192.png` | PWAアイコン（192px） |
| `icons/icon-512.png` | PWAアイコン（512px） |

**実装した機能:**

- ガントチャート表示（週/月/全体の3段階切り替え）
- ◀▶ナビゲーション + 「今日」ボタン
- 科目 → 週 → タスクの3段階折りたたみ（初期状態：科目展開・週折りたたみ）
- タスク完了トグル（チェックボックス & バータップの両方）
- 週の全タスク完了で「完了」バッジ自動表示
- 今日の赤縦線表示
- マイルストーン（◆マーカー）表示
- `public/schedule.md` の自動fetch（失敗時はlocalStorageキャッシュへフォールバック）
- 📁md読込ボタン（確認ダイアログ付き、進捗データは保持）
- 進捗データをlocalStorageに保存（キー: `sg-completed`）
- PWA対応（Service Worker + manifest.json）

**科目カラー:** ORI=グレー / A=アンバー / B=ブルー / C=ティール / MS（マイルストーン）=赤

---

### 2. バグ修正（コミット: fa8e94a）

折りたたみ（科目名・WeekのSVGアイコンタップ）が動作しない問題を修正。

**原因1（主因）: iOS SafariでのSVG要素クリック問題**

- `>`アイコンをタップすると`e.target`がSVGの`polyline`要素になる
- iOS Safariの一部バージョンで、SVG子要素から`Element.closest('[data-action]')`がHTML親要素まで辿れないケースがある
- 修正: `parentElement`を使って自前でDOMを上向きに辿る`findActionTarget()`関数に変更

**原因2: イベントリスナーの重複登録**

- `render()`のたびに`addEventListener`が追加されていた
- 2回目以降のクリックでハンドラが複数回実行され、状態が二重にトグルされて元に戻っていた
- 修正: `attachEvents()`を`init()`で1回だけ呼ぶよう変更し、`render()`からは除去

---

## リポジトリ状態

```
main ブランチ
fa8e94a  fix: 折りたたみのクリックイベントが動かない問題を修正
bf91399  アプリ実装完了: ガントチャートPWA
b470ed6  初期セットアップ: 仕様書・プロトタイプ・スケジュールデータ
```

GitHub Pages へプッシュ済み。デプロイ設定（Settings → Pages → main / root）が完了していれば公開URL でアクセス可能。

---

## 残課題・メモ

- GitHub Pages のデプロイ設定が未確認（リポジトリ側の設定が必要）
- アイコン画像はプレースホルダー（アンバー円形）。後で差し替え可能
- Service Workerのキャッシュバージョン（`study-gantt-v1`）はファイル更新時に手動でインクリメントが必要
