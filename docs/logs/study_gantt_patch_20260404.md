# Study Gantt 微調整パッチ（2026-04-04）

## 対象ファイル
`study_gantt.jsx`（GitHub: `sinacost-byte.github.io/study-gantt/`）

---

## 修正1: 週表示の日付ズレ修正

### 原因
`getWeekStart()`（L251）が時刻を正規化していない。  
`navDate = new Date()` は現在時刻（例: 14:04）を持つため、`dayDiff()` の `Math.round` で1日ずれる。  
月表示は `new Date(y, m, 1)` がデフォルト0時なので問題なし。

### 修正箇所
L251 の `getWeekStart` 関数:

```js
// Before
function getWeekStart(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); return r; }

// After
function getWeekStart(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); r.setHours(0,0,0,0); return r; }
```

これだけでOK。他の日付関数（`getMonthStart`, `getMonthEnd`）は `new Date(y, m, d)` 形式で既に0時なので修正不要。

---

## 修正2: ラベルタップ/長押しで全文ツールチップ表示

### 仕様

| 行タイプ | タップ | 長押し |
|---------|--------|--------|
| section | 折りたたみ（現状維持） | なし |
| week | 折りたたみ（現状維持） | 全文ツールチップ表示 |
| task | 全文ツールチップ表示 | なし |
| milestone | なし | なし |

### ツールチップの動作
- **表示トリガー**: task行のラベル部分タップ / week行のラベル部分長押し（500ms程度）
- **表示位置**: タップ/長押し位置の近く（画面外にはみ出さないよう調整）
- **閉じるトリガー**: ツールチップ外の任意の場所をタップ
- **スタイル**:
  - 背景: 白（`#fff`）
  - ボーダー: `1px solid #E7E5E4`
  - `border-radius: 8px`
  - `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
  - パディング: `8px 12px`
  - フォントサイズ: 12px
  - 最大幅: `280px`（ラベル欄を大きく超えない程度）
  - `word-break: break-word` で折り返し
  - `z-index: 50`（他の要素より手前）
- **アニメーション**: 不要（シンプル最優先）

### 実装方針

#### State追加
```js
const [tooltip, setTooltip] = useState(null);
// tooltip = { text: string, x: number, y: number } | null
```

#### 長押し用のref
```js
const longPressTimer = useRef(null);
```

#### task行のラベル部分
- `onClick` で `setTooltip({ text: row.label, x: e.clientX, y: e.clientY })`
- チェックボックス部分の `onClick` は `e.stopPropagation()` 済みなので影響なし

#### week行のラベル部分
- `onTouchStart` / `onMouseDown` で長押しタイマー開始（500ms）
- `onTouchEnd` / `onMouseUp` / `onTouchMove` でタイマークリア
- タイマー発火時に `setTooltip(...)` を呼ぶ
- 通常のタップ（500ms未満）は従来通り折りたたみ
- 長押し検知時は折りたたみを発火させない（フラグ管理）

#### ツールチップ外タップで閉じる
- ツールチップ表示中、最外層の `<div>` に `onClick={() => setTooltip(null)}` 
- ツールチップ自体は `e.stopPropagation()` で閉じない

#### ツールチップ位置の画面はみ出し防止
- `x` が画面右端に近い場合は左にオフセット
- `y` が画面下端に近い場合は上に表示
- `useEffect` で表示後にDOM位置をチェックして調整、または `right: 0` 的な安全策

### ツールチップのJSX（参考）
```jsx
{tooltip && (
  <div 
    onClick={(e) => e.stopPropagation()}
    style={{
      position: 'fixed',
      left: Math.min(tooltip.x, window.innerWidth - 292),
      top: tooltip.y + 8,
      maxWidth: 280,
      padding: '8px 12px',
      background: '#fff',
      border: '1px solid #E7E5E4',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontSize: 12,
      color: '#1C1917',
      wordBreak: 'break-word',
      zIndex: 50,
      lineHeight: 1.5,
    }}
  >
    {tooltip.text}
  </div>
)}
```

---

## 注意事項
- iPhoneでの長押し操作はコンテキストメニュー（テキスト選択等）が出る場合があるので、長押し対象要素に `user-select: none` と `-webkit-touch-callout: none` を設定すること
- 既存の折りたたみ動作を壊さないようにすること
