# Study Gantt 作業ログ 2026-07-05

## 作業概要

`study_gantt_maintenance_20260705.md` の依頼に従い、アプリ本体のメンテナンスを実施。
「v6が反映されない／表示スパンで内容が食い違う／フッターが 0/0」の3症状を、根本原因を特定して修正した。

---

## 根本原因

| # | 症状 | 原因 |
|---|------|------|
| 1 | v6が反映されない・スパンで内容が食い違う | 直近コミット `e633b1b` で `public/schedule.md` を `public/1Q_schedule_v6.md` に **リネーム**していた。アプリは `public/schedule.md` を fetch するため 404 になり、localStorage キャッシュ／SWキャッシュの**古い版**へ無言でフォールバックしていた（依頼書 仮説1＝的中）。 |
| 2 | 更新が届かない | `sw.js` の `CACHE` が `v1` から一度も上がらず、`app.js`/`style.css` が **cache-first で恒久固定**。コード更新がPWAに届かない構造だった（依頼書 仮説2）。 |
| 3 | フッターが 0/0 完了 | `render()` の完了カウントが **表示中の行だけ** を数えていた。週は初期状態で全折りたたみのため、可視タスク=0 → 0/0（データ喪失ではない）。 |
| 4 | フォールバックが不可視 | `DEFAULT_MD`（仕様書記載の内蔵初期データ）が **未実装**。fetch失敗が画面に出ず混乱を助長。 |

---

## 修正内容

### 1. fetch対象とpush先の一致（受け入れ条件1）
- `public/1Q_schedule_v6.md` → `public/schedule.md` に `git mv`。
- 以後、版番号はファイル名でなく md 内メタ情報（終了日）で識別する運用に統一。fetchパスは常に固定。

### 2. 取得の堅牢化（受け入れ条件1）
- **`app.js` `init()`**: `fetch('public/schedule.md?_=' + Date.now(), {cache:'no-store'})` でキャッシュバスティング＋network-first。
- 取得チェーン: `fetch` → localStorage キャッシュ → 内蔵 `DEFAULT_MD`。各段で `state.scheduleSource` を記録。
- **`sw.js`**: `CACHE` を `study-gantt-v2` に更新（activate時に旧キャッシュ破棄）。`schedule.md` に加え `app.js`/`style.css`/`index.html`/`/` を **network-first** に変更（`isNetworkFirst()`）。アイコン等はcache-firstのまま。

### 3. 内蔵フォールバック（受け入れ条件4・7）
- **`app.js`**: `DEFAULT_MD` 定数を追加し **v6 の内容を埋め込み**（`public/schedule.md` と同一）。
- fetch＋キャッシュ双方失敗時のみ使用。使用時は `scheduleSource='builtin'`。

### 4. 表示中スケジュールの識別情報（受け入れ条件3）
- フッター下に `.footer-meta` 行を追加。`版: 1Q 〜2026-08-29 / 取得元: サーバー取得 · M/D HH:MM` を常時表示。
- 取得元ラベル: `サーバー取得` / `キャッシュ(前回取得)` / `内蔵フォールバック` / `手動読込`。
- 内蔵フォールバック時は `.footer-meta.warn`（黄背景＋⚠）で明示。

### 5. 完了カウント修正（受け入れ条件5）
- `collectAllTaskIds(schedule)` を追加し、**折りたたみ状態に依存せず** パース結果の全タスクを数えるよう `render()` を変更。v6は総計 **146タスク**。

### 6. 進捗データの保持（受け入れ条件6）
- タスクID（位置ベース `{Q}-{科目}-{Week}-task{N}`）の生成ロジックは**一切変更なし**。
- v6でC科目 Week 12-14 の内容を並び替えたが、いずれも未着手＝進捗データなし。完了済み週（A W1-8, B W1-10, C W1-11）のID安定を確認（例 `1Q-C-Week1-task1` 不変）。既存チェックは消えない。

### 7. 3表示の一致（受け入れ条件2）
- 週/月/全体は元々同一の `state.schedule`（単一パース結果）から描画されており、食い違いはデータ源（古いキャッシュ）が原因。上記1・2で解消。ビュー側のコード変更は不要。

---

## 変更ファイル

| ファイル | 変更 |
|---------|------|
| `public/schedule.md` | `1Q_schedule_v6.md` からリネーム（内容=v6、変更なし） |
| `app.js` | `DEFAULT_MD`追加 / `init()`取得チェーン＋source記録 / `collectAllTaskIds()` / フッター完了カウント修正＋版表示 / ファイル読込時のsource記録 / `fmtDT()` |
| `sw.js` | `CACHE` v1→v2 / コア資産をnetwork-first化（`isNetworkFirst()`） |
| `style.css` | `.footer-meta` / `.footer-meta.warn` を追加 |

---

## 検証

- `node --check` で `app.js` / `sw.js` の構文OK。
- 実 `parseMd(DEFAULT_MD)` 実行: メタ終了日 `2026-08-29`、総タスク **146**、ID重複なし、C W12=深掘り・内 / W13=深掘り・外 / W14=統合（v6順）を確認。
- `render()` 出力にフッター `1/146 完了`（`[x]`のB W12認証タスク1件が初期完了）＋版表示ブロックが生成されることを確認。

## 注意点

- **SWのワンリロード遅延**: 新SW（v2）はデプロイ後の初回アクセスで install→activate され、実際に新コードが効くのは**次のリロードから**（Service Worker仕様上の既知挙動）。iPhoneのPWAは一度リロードすれば以降は最新が届く。
- **`DEFAULT_MD` と `public/schedule.md` の同期**: 今後スケジュールを更新する際は両方を更新すること（内蔵はあくまで最終フォールバック）。
- 版の識別はファイル名でなく md メタ情報の終了日で行う運用に変更した。

---

## 追加対応（2026-07-06）: ナビゲーション可動域

### 調査結果（依頼書追記への回答）
- `◀▶` ハンドラ（`app.js` 旧 502-505行）は **navDate を何とも比較していなかった**。
  クランプ・保存値・today/meta との比較・化石定数はコード上に一切なし。
- `app.js` の **全リビジョンを grep** しても、navDate のmin/max・`07-11`/`07-26` 等の
  日付リテラル・clamp/limit/bound の類は歴史上一度も存在しなかった → **仮説A（化石定数）・
  仮説B（today クランプ）はいずれもコードレベルで否定**。localStorageにも範囲系キーなし（AK確認済み）。
- 実 `render()` で v6 を描画すると、月Aug=25本・週8/16=6本など **7月以降のバーは正常描画**。
  → 観察された「7月で頭打ち」は**古いスケジュールがキャッシュ表示されていた症状**であり、
  ナビゲーションロジックのバグではない（SWバージョニング修正で次回リロード時に解消）。

### 実装（期待動作の反映）
- 依頼の「可動域を state.schedule.meta から毎回算出」を機能として実装。
- `getNavBounds()` を追加：現在の `viewMode` と `meta.startDate〜endDate` から、
  週ビュー=週頭、月ビュー=月頭の可動域 min/max を毎回算出。
- `render()`：`◀▶` を `getNavBounds()` 基準で `disabled` 制御（全体ビューは従来どおり両方無効）。
- navハンドラ：新 navDate を meta 範囲へクランプ（空の月へ流出しない）。
- 化石定数は存在しないため「撤去」対象なし。可動域は常に読込中スケジュールに追随する。

### 追加変更ファイル
| ファイル | 変更 |
|---------|------|
| `app.js` | `getNavBounds()` 追加 / `render()` の`◀▶`をmeta基準でdisabled制御 / navハンドラでnavDateをmeta範囲にクランプ |

### 追加検証
- `node --check` OK。月: ▶はAugで無効・◀はMarで無効・中間は両有効、Augは7月から到達可。
  週: 最終週8/23で▶無効、先頭週3/22で◀無効。
