# Study Gantt パッチ仕様書（2026-07-16）

## 対象リポジトリ
`sinacost-byte/study-gantt`（GitHub Pages: `sinacost-byte.github.io/study-gantt/`）
対象ファイル: `app.js` / `sw.js` / `CLAUDE.md` / `README`（あれば）

---

## 背景

### バグ: ✅トグルのたびに表示位置が先頭へ戻る

**症状**: iPhoneでC科目など下方のタスクに✅を入れると、そのたびに画面がチャート先頭（オリエンテーション付近・左端）へ戻る。折りたたみ操作でも同じ。

**構造**: `render()` が毎回 `app.innerHTML` を全書き換えする方式のため、スクロールコンテナ `#chart-scroll` がDOMごと破棄・再生成され、`scrollTop` / `scrollLeft` が 0 にリセットされる。何かがスクロールさせているのではなく、位置が保存されていない。起動時の「今日へスクロール」は `init()` 内の `setTimeout` 一回きりで、以後の `render()` には位置管理が存在しない。

### 同梱事項: ナビ可動域修正（105859c）が実機に届いていない

2026-07-16、実機Safari（フッター表示: 版〜2026-08-29 / 取得元: サーバー取得 17:23）で、▶タップにより週ビュー「8/30 - 9/5」・月ビュー「2026年9月」へ到達できた。105859c のクランプが生きていればこれは不可能（週は 8/23-8/29、月は 8月 で ▶ が disabled になる。実コード＋実 schedule.md の DOM 実走行で検証済み）。

リポジトリの main は 105859c（正しいコード）。疑いは **GitHub Pages が一つ前 d65bce8 の成果物を配信していること**（schedule.md は両コミットで同一のため、フッターの版表示は矛盾しない）。次点で端末側キャッシュ。

**→ 本パッチには可動域のコード修正は不要**。このパッチの push で新しい Pages ビルドが走り、105859c も同時に実機へ届く。受け入れ確認で可動域の停止を再検証する（下記 4・5）。

---

## 修正1: render() にスクロール位置ポリシーを導入

### 方針

`render(opts)` にモードを持たせる。**縦（scrollTop）はどのモードでも保持**。横（scrollLeft）だけ操作の性質で分ける。

```js
// mode: 'preserve'（既定） | 'reset-x' | 'center-today'
function render(opts = {}) {
  const mode = opts.scroll || 'preserve';
  const prev = document.getElementById('chart-scroll');
  const keep = prev ? { top: prev.scrollTop, left: prev.scrollLeft } : null;

  // …（既存のHTML構築 → app.innerHTML = html はそのまま）…

  const sc = document.getElementById('chart-scroll');
  if (sc && keep) {
    sc.scrollTop = keep.top;                          // 縦は常に保持（内容が縮めばブラウザがクランプ）
    if (mode === 'preserve') sc.scrollLeft = keep.left;
    // 'reset-x' は何もしない＝再生成直後の 0 のまま
  }
  if (mode === 'center-today') scrollTodayIntoView();
}
```

`init()` 内の「今日へスクロール」`setTimeout` ブロックをヘルパーへ抽出して共用する：

```js
function scrollTodayIntoView() {
  setTimeout(() => {
    const scroll = document.getElementById('chart-scroll');
    const todayLine = scroll ? scroll.querySelector('.today-line-body') : null;
    if (scroll && todayLine) {
      const lineLeft = parseFloat(todayLine.style.left);
      scroll.scrollLeft = Math.max(0, lineLeft + LABEL_W - scroll.clientWidth / 2);
    }
  }, 50);
}
```

（注: ヘルパーは横のセンタリングのみ。縦は render() 側の保持ロジックに任せる。`init()` 側の inline `setTimeout` は削除してヘルパー呼び出しに置き換え）

### 呼び出し側の指定

| 呼び出し元（data-action等） | mode | 理由 |
|---|---|---|
| `toggleTask`（✅） | `preserve`（引数なし） | 本件の修正核。✅した位置に留まる |
| `toggleCollapse` | `preserve`（引数なし） | 同上。高さ変化のはみ出しはブラウザのクランプに任せる |
| `nav`（◀▶） | `reset-x` | 期間が変わるので横は左端から。縦は保持（下方の科目を見ながら期間送りできる） |
| `setView`（週/月/全体） | `reset-x` | チャート幅が変わり旧 scrollLeft は無意味。縦は保持 |
| `today` | `center-today` | ボタンの目的そのもの |
| `init()` | `center-today` | 現行挙動の踏襲（inline 処理をヘルパー化） |
| md手動読込（file-input change） | `center-today` | 新スケジュール読込後の基準位置 |

---

## 修正2: sw.js の CACHE バンプ

`const CACHE = 'study-gantt-v2'` → `'study-gantt-v3'`。
（sw.js 冒頭コメントの運用ルール「デプロイ毎にバンプ」に従う。fetch戦略・ASSETS は変更しない）

---

## 修正3: フッターにコード版スタンプ（小規模・切り離し可）

**目的**: 今回の診断で「スケジュールの版はフッターで見えるが、動いているコードの版が見えない」ギャップが露呈した（Pages配信遅れ／SWワンリロード遅延の検知手段がない）。1行で塞ぐ。

- `app.js` 冒頭に定数を追加: `const APP_VERSION = '20260716-1';`
- `render()` のフッター構築部、`.footer-meta` 右側 span を拡張:
  `取得元: … · {取得日時} · app ${APP_VERSION}`
- **運用ルール**: 以後 app.js を変更するコミットでは APP_VERSION を必ず更新する（下記 CLAUDE.md 追記）。

---

## 変更しないこと

- タスクID生成ロジック・`parseMd()`・`collectAllTaskIds()`（進捗データ保全）
- `init()` の取得チェーン（fetch → localStorage → DEFAULT_MD）と source 記録
- **`getNavBounds()` とナビのクランプ（105859c のまま。今回コードには触らない）**
- `DEFAULT_MD` と `public/schedule.md`（今回スケジュール変更なし。両者の同期状態もそのまま）
- 各ビューの描画内容・レイアウト・ツールチップ挙動

---

## CLAUDE.md / README 更新

- CLAUDE.md に運用ルール2行を追記:
  - app.js を変更するコミットでは `APP_VERSION` を更新する
  - デプロイ（push）ごとに sw.js の `CACHE` をバンプする
- README（あれば）: スクロール位置ポリシー（preserve / reset-x / center-today と適用表）を1段落で追記

---

## 受け入れ確認

デプロイ後、Safari で **2回リロード**（SW切替のワンリロード遅延を消化）してから:

1. フッター右下に `app 20260716-1` が表示される（＝新コード到達の証明。これが出ない間は以降の確認は無効）
2. C科目付近まで縦スクロール → タスクに✅ → **画面位置がそのまま動かない**（トグル解除でも同様）
3. 週の折りたたみ/展開でも位置が保持される
4. 月ビュー: ▶で7月→8月へ進み、**8月で ▶ が薄くなり押せない。9月に到達できない**
5. 週ビュー: ▶連打の終点が **8/23 - 8/29**。そこで ▶ が薄くなる
6. 「今日」タップ → 今日線が横方向センタリングされる（縦位置は維持）
7. ◀▶で期間を送った際、縦スクロール位置（例: C科目を見ている状態）が維持され、横は左端から始まる
8. iPhone実機でも 2・4・5 を再確認

**4・5 が新デプロイ後も通らない場合**: Pages配信ではなく端末側キャッシュが原因。その端末で Safari の Webサイトデータから当サイトを削除（またはDevToolsでSWをUnregister）して再確認する。

---

*作成: Claude（診断・仕様） / 実装: カニちゃん（Claude Code） / 受け入れ: AK*
*関連: study_gantt_maintenance_20260705.md / study-gantt_work_log_20260706.md*
