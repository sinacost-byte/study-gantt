# CLAUDE.md — Study Gantt アプリ

## プロジェクト概要

「Self-Study with AI University」の学習スケジュールを俯瞰・進捗管理するガントチャートPWA。

- **ユーザー**: AK 1人（個人学習用）
- **端末**: iPad / iPhone（Safari）がメイン。PCでも動くこと
- **ホスティング**: GitHub Pages

## 詳細仕様

`docs/spec_study_gantt_v2.md` に全仕様あり。必ず読んでから実装すること。

## プロトタイプ

`docs/prototype.jsx` に承認済みのReactプロトタイプあり。デザイン・操作感・色・レイアウトはこのプロトタイプを忠実に再現すること。

### プロトタイプで確認済みの仕様
- 表示切替: 週/月/全体の3段階
- ナビゲーション: ◀▶で期間移動、「今日」ボタン
- 折りたたみ: 科目⇒週⇒タスクの3段階
- タスク完了: チェックボックス or バータップでトグル
- 完了バッジ: 週の全タスク完了で自動表示
- 科目カラー: ORI=グレー / A=アンバー / B=ブルー / C=ティール / MS=赤
- フッター: 進捗カウント（完了/全タスク数）
- 白背景の明るいテーマ固定

## スケジュールデータ

`public/schedule.md` に1Qのスケジュールmdを配置。アプリの初期データ兼フォールバック。

## 技術要件

### 必須
- **PWA**: Service Worker、manifest.json。ホーム画面に追加できること
- **フレームワーク**: バニラHTML/CSS/JS を推奨。ライブラリは最小限に
  - プロトタイプはReactだが、PWA化ではバニラで書き直してOK（依存を減らすため）
  - ただしデザイン・操作感はプロトタイプと同一にすること
- **Markdownパース**: 軽量パーサーを使用 or 自前実装（フォーマットは固定なので自前で十分）
- **データ保存**: localStorage（進捗データ）
- **GitHub Pages対応**: docs/ フォルダ or ルートから配信

### md読み込み方式（2段階）
1. **メイン: GitHub自動fetch** — アプリ起動時に同リポジトリの `public/schedule.md` をfetchして読み込む
   - GitHub Pages の URL から相対パスで取得
   - fetch失敗時はlocalStorageにキャッシュした前回データを使う
2. **サブ: ファイル選択** — 画面上部の「📁md読込」ボタンから端末のファイルを選択して読み込み
   - 確認ダイアログ:「スケジュールを更新しますか？（進捗データは保持されます）」

### 進捗データの保持
- タスクIDは `{Quarter}-{科目}-{Week}-task{N}` 形式で自動生成
- md再読み込み時、同じ位置のタスクは同じIDが振られ、進捗が保持される
- localStorageのキー: `sg-completed`

## リポジトリ構成

```
study-gantt/
├── CLAUDE.md          ← このファイル
├── index.html         ← アプリ本体
├── style.css          ← スタイル
├── app.js             ← ロジック
├── manifest.json      ← PWA マニフェスト
├── sw.js              ← Service Worker
├── public/
│   └── schedule.md    ← スケジュールデータ（初期データ兼フォールバック）
└── docs/
    ├── spec_study_gantt_v2.md  ← 仕様書
    └── prototype.jsx           ← 承認済みプロトタイプ
```

## 実装手順

1. `docs/spec_study_gantt_v2.md` を読む
2. `docs/prototype.jsx` を読む
3. index.html + style.css + app.js でプロトタイプを再現
4. `public/schedule.md` のfetch → パース → 表示を実装
5. localStorage での進捗保存を実装
6. ファイル選択による md 読み込みを実装
7. PWA化（manifest.json、sw.js）
8. GitHub Pages で動作確認

## 注意事項

- デザインの変更は不可。プロトタイプが承認済み
- 機能の追加も不可。仕様書の「つけない機能」を確認すること
- iPad/iPhoneのSafariでの操作を最優先。タップ領域は44x44pt以上
- フォントは `-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif`
