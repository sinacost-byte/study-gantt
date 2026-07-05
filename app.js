'use strict';

// ===== COLORS =====
const COLORS = {
  ORI: { main: '#78716C', light: '#E7E5E4', lighter: '#F5F5F4', text: '#44403C' },
  A:   { main: '#D97706', light: '#FDE68A', lighter: '#FEF3C7', text: '#92400E' },
  B:   { main: '#2563EB', light: '#93C5FD', lighter: '#DBEAFE', text: '#1E3A8A' },
  C:   { main: '#0D9488', light: '#5EEAD4', lighter: '#CCFBF1', text: '#134E4A' },
  MS:  { main: '#DC2626' },
};
const TODAY_COLOR = '#DC2626';
const LABEL_W = 180;
const ROW_H = { section: 40, week: 36, task: 32, 'milestone-header': 36, milestone: 32 };
const DAY_NAMES = ['日','月','火','水','木','金','土'];

// ===== EMBEDDED FALLBACK SCHEDULE (v6, keep in sync with public/schedule.md) =====
// Used only when the network fetch and the localStorage cache both fail.
const DEFAULT_MD = "# 1Q スケジュール\n\n## メタ情報\n- 開始日: 2026-03-28\n- 終了日: 2026-08-29\n- Quarter: 1Q\n- 週の開始曜日: 日曜日\n\n## 週間リズム（パターンC）\n\n### 基本構造：週末に講義、平日に演習\n\n| 曜日 | 確保時間 | 内容 |\n|------|----------|------|\n| 日曜 | 5〜10時間 | B科目の講義＋演習（Claudeと対話型） |\n| 月〜水 | 各1〜2時間 | B科目の演習続き・動画視聴・読書 |\n| 木〜金 | 各1〜2時間 | C科目の演習・復習・動画視聴・読書（土曜講義の予習含む） |\n| 土曜 | 5〜10時間 | C科目の講義＋演習 → A科目ディスカッション → バッファ |\n\n### 補足ルール\n- A科目の読書は移動時間（通勤往復1時間、出張時は数時間）に充てる\n- 平日は「新しい概念を学ぶ講義」をしない。週末講義の演習・復習・視聴・読書のみ\n- A科目はWeek8以降、1トピック2週間の深掘りモード。B/Cは1トピック1週ペース\n- 後半再設計（2026-06-23）：B/Cを6月末で閉じず7月後半まで延長。B＝定着アーク（Week 12-14：出力中心の再走＋統合レポート）、C＝深掘りアーク（Week 13-14：内Embedding-Transformer→外MCP）。A＝現行どおりWeek 12統合エッセイが2Qへの蝶番。三科目が7/18〜8/1で揃って閉じる\n- CのMCP（C Week 11＝7/4）はAのMCP分析より先に着地させる（依存はタイト）→ 7/04 達成済み\n- 再々設計（2026-07-05）：終了日を8/1→8/29へ延長（＋4週）。理由＝遅延でなく1単位あたりの深度増（定着アーク・Principle 10・パターン全体見直しはこの深度の産物）。C科目は深掘り→統合レポートの順に並び替え（レポート先行の設計理由「描く過程で深掘りの的を確定」は、的が6/23時点で確定済みのため消滅）。「三科目が揃って閉じる」は「B（8/8）→C（8/15）→A（8/29）の順に閉じ、A統合エッセイが最後＝2Qへの蝶番」に置き換え。新必着点＝C深掘り・外の着地（8/1）がA Week 12着手（8/9）より先。Aのパターン抽出③は全体見直しに拡大してWeek 10に合流。A Week 10・12は3週間枠。お盆週も通常運行\n- 詳細な設計意図はシラバス・覚書・seedを参照（本ファイルは痩せたタスク表＝アプリ原本）\n\n---\n\n## オリエンテーション（2026-03-28 〜 2026-04-04）\n- [ ] カリキュラム全体の確認・学習環境セットアップ\n- [ ] CS50x翻訳プレーヤーの動作確認\n- [ ] 学習管理アプリ（ガントチャート）の動作確認\n- [ ] 読書管理アプリ（Book Shelf）の動作確認\n- [ ] Python環境構築（ローカル or Google Colab）\n- [ ] 予習読書:『技術革新と不平等の1000年史（上）』読了\n- [ ] 予習読書:『ネット興亡記』読了\n- [ ] 週間リズム（パターンC）の策定\n\n---\n\n## A: 技術革命史\n\n### Week 1: 技術革命の全体地図（2026-04-05 〜 2026-04-11）\n- [ ] 読書:『第四次産業革命』シュワブ（薄い本。全体の地図として）\n- [ ] ディスカッション: 技術革命のリスト、「革命」の定義、技術決定論 vs 社会構成主義\n- [ ] ディスカッション: AI革命の歴史的位置づけ\n\n### Week 2: 活版印刷 — 知識の民主化（2026-04-12 〜 2026-04-18）\n- [ ] 読書:『グーテンベルクの銀河系』マクルーハン（集中読み。刺さるところを拾う）\n- [ ] ディスカッション: グーテンベルク、知識の独占の崩壊、宗教改革・科学革命への影響\n- [ ] ディスカッション:「じわじわ」の変化を深掘りする\n\n### Week 3: 蒸気機関と産業革命（2026-04-19 〜 2026-04-25）\n- [ ] 読書:『グーテンベルクの銀河系』続き（必要に応じて）\n- [ ] ディスカッション: 蒸気機関、工場制度、都市化、勝者と敗者\n- [ ] パターン抽出①: Week 1-3 のパターンをメモにまとめる\n\n### Week 4: 電気と第2次産業革命（2026-04-26 〜 2026-05-02）\n- [ ] 読書:『技術革新と不平等の1000年史（下）』開始\n- [ ] ディスカッション: 電気の普及、大量生産・大量消費、フォード式生産方式\n- [ ] ディスカッション: インフラ技術と「徐々に」の変化\n\n### Week 5: 通信革命 — 電信から電話へ（2026-05-03 〜 2026-05-09）\n- [ ] 読書:『技術革新と不平等の1000年史（下）』続き\n- [ ] ディスカッション: 電信、電話、ラジオ、テレビ。マスメディアの誕生\n- [ ] ディスカッション: 通信技術と「距離」の意味の変化\n\n### Week 6: コンピュータ革命（2026-05-10 〜 2026-05-16）\n- [ ] 動画: \"The Machine That Changed the World\"（PBS）視聴\n- [ ] ディスカッション: ENIAC → メインフレーム → パーソナルコンピュータ。「個人が持てる」瞬間\n- [ ] パターン抽出②: Week 4-6 のパターンをメモにまとめる\n\n### Week 7: インターネットの爆発（2026-05-17 〜 2026-05-23）\n- [ ] ディスカッション: ARPANET → WWW → ブラウザ一般化、ドットコムバブル\n- [ ] ディスカッション: B科目のネットワーク知識との接続\n- [ ] ディスカッション:『ネット興亡記』の内容を歴史のパターンに位置づける\n\n### Week 8: プラットフォームとソーシャルメディア（2026-05-24 〜 2026-06-06）\n- [ ] 読書:『プラットフォーム・レボリューション』パーカー\n- [ ] 記事: Ben Thompson \"Aggregation Theory\" を読む\n- [ ] ディスカッション: GAFA の台頭、ネットワーク効果、情報流通コストと権力構造\n\n### Week 9: スマートフォン — 「常時接続」の社会（2026-06-07 〜 2026-07-04）\n- [ ] 読書:『プラットフォーム・レボリューション』続き（必要に応じて）\n- [ ] ディスカッション: iPhone が変えたこと、アプリ経済、「既存の延長線上」仮説の検証\n- [ ] ディスカッション: 生成AIはなぜスマホと違うのか\n- [ ] パターン抽出③: Week 7-9 のパターンをメモにまとめる\n\n### Week 10: AI革命の歴史的位置づけ（2026-07-05 〜 2026-07-25）\n- [ ] 記事: Thoughtworks \"MCP's Impact on 2025\" を読む\n- [ ] ディスカッション: Week 1-9 のパターン整理、生成AIの位置づけ\n- [ ] 演習: パターン一覧表を作成し、AI革命への当てはめ分析\n\n### Week 11: AI革命の「じわじわ」を読む（2026-07-26 〜 2026-08-08）\n- [ ] 記事: \"Why the Model Context Protocol Won\" / \"A Year of MCP\" を読む\n- [ ] ディスカッション: 教育・労働・大学への影響、「時間だけが残る」仮説\n- [ ] 演習:「5年後に変わっていそうなこと」リスト作成\n\n### Week 12: 統合 — 自分の地図を描く（2026-08-09 〜 2026-08-29）\n- [ ] 技術革命史の年表を一枚にまとめる\n- [ ] 統合エッセイ初稿執筆（2,000〜3,000字。「虚構の受益者」仮説の提示。2Qで深化）\n- [ ] 振り返り: 1Qの学びを総括し、2Q「AI時代の社会構造論」への接続点を書き出す\n- [ ] 接続: Cの深掘り・外（MCP＝インフラ型GPTの実験台）の知見をエッセイの生燃料にする\n\n---\n\n## B: CS入門\n\n### Week 1: ハードウェアと二進数（2026-04-05 〜 2026-04-11）\n- [ ] 講義: CPU・メモリ・ストレージ、二進数・ビット・バイト\n- [ ] 演習: 二進数の手計算\n- [ ] 動画: CS50x Lecture 0 (Scratch) 視聴\n- [ ] 読書:『コンピュータはなぜ動くのか』第1章〜第3章 開始\n\n### Week 2: ソフトウェアとOS（2026-04-12 〜 2026-04-18）\n- [ ] 講義: ソースコード→機械語、OSの役割、インタプリタ vs コンパイラ\n- [ ] 演習: タスクマネージャーでプロセスとメモリを観察\n- [ ] 動画: CS50x Lecture 1 (C) 視聴\n- [ ] 読書:『コンピュータはなぜ動くのか』第1章〜第3章 完了\n\n### Week 3: Python基本構造（2026-04-19 〜 2026-04-25）\n- [ ] 講義: 変数、型、条件分岐、ループ\n- [ ] 演習: GAS の if/ループを Python で書き直す\n- [ ] 動画: MIT 6.100L Lecture 1-3 視聴\n- [ ] 読書:『コンピュータはなぜ動くのか』第4章〜第6章 開始\n\n### Week 4: 関数とデータ構造（2026-04-26 〜 2026-05-02）\n- [ ] 講義: 関数定義、スコープ、リスト・辞書・タプル・セット\n- [ ] 演習: GAS の配列・オブジェクトを Python のリスト・辞書に対応づける\n- [ ] 動画: MIT 6.100L Lecture 4-6 視聴\n\n### Week 5: アルゴリズムの考え方（2026-05-03 〜 2026-05-09）\n- [ ] 講義: 線形探索、二分探索、バブルソート、O記法の直感\n- [ ] 演習: Python で FizzBuzz、リスト操作、簡単なデータ集計\n- [ ] 動画: CS50x Lecture 3 (Algorithms) 視聴\n- [ ] 読書:『コンピュータはなぜ動くのか』第4章〜第6章 完了\n\n### Week 6: インターネットの基礎（2026-05-10 〜 2026-05-16）\n- [ ] 講義: IPアドレス、DNS、TCP/IP 4層モデル\n- [ ] 演習: ブラウザ開発者ツール（Network タブ）でHTTPリクエスト観察\n- [ ] 動画: CS50x Lecture 8 (HTML, CSS, JavaScript) 視聴\n- [ ] 読書:『ネットワークはなぜつながるのか』第1章〜第3章 開始\n\n### Week 7: HTTPとAPI（2026-05-17 〜 2026-05-23）\n- [ ] 講義: HTTP/HTTPS、REST API、JSON、プロトコルの概念\n- [ ] 演習: Python requests でAPIを叩く（天気予報API等）\n- [ ] 演習: curl コマンドの基本\n- [ ] 読書:『ネットワークはなぜつながるのか』第1章〜第3章 完了\n\n### Week 8: データベースの概念とSQL基礎（2026-05-24 〜 2026-05-30）\n- [ ] 講義: RDB の基本概念、テーブル・行・列・主キー\n- [ ] 演習: SELECT、WHERE、ORDER BY\n- [ ] 動画: CS50x Lecture 7 (SQL) 視聴\n- [ ] 読書:『スッキリわかるSQL入門』開始\n\n### Week 9: SQLの実践とデータ設計（2026-05-31 〜 2026-06-06）\n- [ ] 講義: INSERT/UPDATE/DELETE、JOIN、正規化、インデックス\n- [ ] 演習: SQLite で小さな DB を作る\n- [ ] 演習: スプレッドシートのデータを DB 化してみる\n- [ ] 読書:『スッキリわかるSQL入門』続き\n\n### Week 10: ウェブの構造（2026-06-07 〜 2026-06-13）\n- [ ] 講義: クライアント/サーバー、HTML/CSS/JS の役割分担、DOM\n- [ ] 演習: ブラウザ開発者ツールで DOM 操作を試す\n- [ ] 動画: CS50W Lecture 0-1 視聴\n- [ ] 読書:『プログラムはなぜ動くのか』開始\n\n### Week 11: フロントエンドとバックエンド（2026-06-14 〜 2026-07-11）\n- [ ] 講義: F/B の境界、サーバーサイド概要、認証の基本、PWA の仕組み分解\n- [ ] 演習: Python Flask で簡単な API サーバーを立てる\n- [ ] 演習: 自分の PWA のコードを読み直し、各部分の「なぜ」を説明する\n- [ ] 動画: CS50W Lecture 2 視聴\n\n### Week 12: 定着① ネットワーク再走＋認証メカニクス（2026-07-12 〜 2026-07-18）\n- [ ] ネットワーク再走（Week 6-7）：HTTPの上を運ばれるもの（ヘッダ/Cookie/トークン）をNetworkタブで実地観察\n- [x] 認証メカニクス：Cookie/セッション/トークン/OAuth を「トークンを毎回どう運ぶか」で串刺し（Week 11 再走 7/03-7/05 で消化済み）\n- [ ] 静的ホスト（原本＝push・読み中心）vs アプリサーバ＋DB（即時・頻繁変更）の線を自力で再走\n\n### Week 13: 定着② ハード/OS再走＋統合レポート最下階（2026-07-19 〜 2026-07-25）\n- [ ] ハード/OS再走（Week 1-2）：自分のMacで実地（アクティビティモニタ、RAM/SSD、CPUがJSを動かす）\n- [ ] 統合レポートの最下階（ハード→OS）を、観察を錨にして書く\n\n### Week 14: 定着③ 統合レポート完成（2026-07-26 〜 2026-08-08）\n- [ ] 全層（ハード→OS→プログラム→ネットワーク→DB→ブラウザ→DOM）を一本のリクエストで貫く\n- [ ] PWA分解（Book Shelf/Study Gantt）を全レイヤーで説明（SW/マニフェスト/キャッシュ）\n- [ ] 統合レポート完成＝B科目1Qの弧を閉じる\n\n---\n\n## C: AI/機械学習の基礎\n\n### Week 1: AIとは何か — 歴史と分類（2026-04-05 〜 2026-04-11）\n- [ ] 講義: AI の定義と歴史、ルールベース vs 機械学習、教師あり/なし/強化学習\n- [ ] 演習: 日常の「予測」を機械学習的に考える\n- [ ] 読書:『生成AI入門』Kniberg 開始\n\n### Week 2: 機械学習の基本的な考え方（2026-04-12 〜 2026-04-18）\n- [ ] 講義: データ→パターン→予測、過学習、訓練/テストデータ\n- [ ] 演習: 機械学習の分類マッピング図を自分で描く\n- [ ] 読書:『生成AI入門』Kniberg 続き\n\n### Week 3: ニューロンからネットワークへ（2026-04-19 〜 2026-04-25）\n- [ ] 講義: 人工ニューロン、層の概念、なぜ「深い」と複雑なパターンを学習できるか\n- [ ] 演習: ニューラルネットワークの各部分を自分の言葉で説明する\n- [ ] 動画: 3Blue1Brown \"But what is a neural network?\" 視聴\n\n### Week 4: 学習の仕組み — 「間違いから学ぶ」（2026-04-26 〜 2026-05-02）\n- [ ] 講義: 損失関数、勾配降下法、バックプロパゲーション\n- [ ] 演習: Google Colab で簡単なニューラルネットワークの動作を観察\n- [ ] 動画: 3Blue1Brown \"Gradient descent\" / \"Backpropagation\" 視聴\n- [ ] 動画: MIT 6.S191 Lecture 1 視聴\n\n### Week 5: 言語モデルの基本（2026-05-03 〜 2026-05-09）\n- [ ] 講義:「次の単語を予測する」仕組み、トークン、Embedding\n- [ ] 演習: Claude に「次の単語予測」を頼んで言語モデルの動作を体感\n- [ ] 読書:『仕組みからわかる大規模言語モデル』開始\n\n### Week 6: Transformer（2026-05-10 〜 2026-05-16）\n- [ ] 講義: Attention 機構、Self-Attention、Encoder-Decoder 構造\n- [ ] 演習: Transformer の Attention を図にして説明する\n- [ ] 動画: 3Blue1Brown \"Attention in transformers\" 視聴\n- [ ] 記事: Jay Alammar \"The Illustrated Transformer\" を読む\n\n### Week 7: LLM の訓練と能力（2026-05-17 〜 2026-05-23）\n- [ ] 講義: Pre-training、Instruction Tuning、RLHF、スケーリング則\n- [ ] 演習: Anthropic API で LLM と API レベルで対話してみる\n- [ ] 動画: MIT 6.S191 Lecture 2 視聴\n- [ ] 記事: Jay Alammar \"The Illustrated GPT-2\" を読む\n\n### Week 8: 生成AIの能力（2026-05-31 〜 2026-06-06）\n- [ ] 講義: Context Window、創発的能力、Zero-shot/Few-shot/CoT\n- [ ] 演習: 普段のプロンプト技法を技術的に再解釈する\n- [ ] 読書:『生成AI入門』Kniberg 後半\n\n### Week 9: 生成AIの限界と失敗モード（2026-06-07 〜 2026-06-13）\n- [ ] 講義: ハルシネーション、バイアス、知識カットオフ、アライメント\n- [ ] 演習: 意図的にハルシネーションを引き起こし分析する\n- [ ] 演習: temperature を変えて出力の違いを観察（API利用）\n- [ ] 記事: Anthropic Research（Claude の安全性）を読む\n\n### Week 10: RAGとコンテキストエンジニアリング（2026-06-21 〜 2026-06-27）\n- [ ] 講義: RAG、ベクトルDB、意味検索、コンテキスト設計\n- [ ] 演習: 簡単な RAG パイプラインの概念設計\n- [ ] 接続: Week 9で自力で出した「実在のものだけ返させる」＝RAGの直観の回収\n- [ ] 読書:『仕組みからわかる大規模言語モデル』RAG の章\n\n### Week 11: AIエージェントとツール連携・MCP（2026-06-28 〜 2026-07-04）\n- [ ] 講義: AIエージェント、Function Calling、MCP の技術的位置づけ\n- [ ] 演習: MCP の構造を図にまとめる\n- [ ] 記事: MCP 公式ドキュメント Architecture Overview を読む\n- [ ] A接続: この技術理解を A のMCP歴史分析の前提として渡す（7/04 着地済み）\n\n### Week 12: 深掘り・内 — Embedding-Transformer（2026-07-05 〜 2026-07-18）\n- [ ] gensim で Embedding 空間をもう一周（次元の呪いの蓄積）。gensim以外のEmbeddingも比較\n- [ ] 「印象≠実際に同じ」：自分の思考イメージと機構が、どこで韻を踏みどこで違うかの地図を描く\n- [ ] 地図(Embedding)→運動(Transformer)＝「思考」の像を自分の言葉でまとめる\n\n### Week 13: 深掘り・外 — MCP（2026-07-19 〜 2026-08-01）\n- [ ] 「MCPは本当に浸透したのか」を外のメーターに当てる（廃れた/情報環境の変化/現場では今も、を切り分け）\n- [ ] A科目インフラ型GPTの実験台として位置づけ、結論を A Week 12 の生燃料にする\n- [ ] 三科目の落ち合い点（繋ぎ目を握る者／繋ぎ目は難所／浸透の検証）を統合する\n\n### Week 14: 統合 — プロンプトの旅（2026-08-02 〜 2026-08-15）\n- [ ] プロンプト入力→トークン化→Embedding→Transformer→生成の全体を図解\n- [ ] 統合レポート執筆（図+文章:「Claudeに質問してから回答が返るまで」）\n- [ ] 深掘り・内／外の成果と矢印3（上流検証の族・半練り）を回収してレポートに畳み込む\n- [ ] B科目レポートとの統合を検討\n\n---\n\n## マイルストーン\n- 2026-04-04: オリエンテーション完了\n- 2026-04-25: A科目パターン抽出①（Week 1-3）\n- 2026-05-09: B科目 Python 基礎完了（Week 3-5）\n- 2026-05-16: A科目パターン抽出②（Week 4-6）\n- 2026-06-20: A科目パターン抽出③（Week 7-9）→ 全体見直しへ拡大、Week 10 に合流\n- 2026-07-04: C科目 MCP着地（A W11依存の必着点）\n- 2026-07-05: B科目 Week 11 完了（①②③分離・JWT・OAuth）\n- 2026-08-01: C科目 深掘り・外（MCP検証）着地（A W12依存の必着点）\n- 2026-08-08: B科目 定着アーク完了＝統合レポート＝Bの弧を閉じる\n- 2026-08-09: A科目 統合エッセイ着手\n- 2026-08-15: C科目 統合レポート完了＝Cの弧を閉じる\n- 2026-08-29: A科目 統合エッセイ初稿＝1Q完了＝2Qへの蝶番\n";

// ===== DATE UTILITIES =====
function pd(s) { return new Date(s + 'T00:00:00'); }
function dayDiff(a, b) { return Math.round((b - a) / 86400000); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmtD(d) { return `${d.getMonth()+1}/${d.getDate()}`; }
function fmtM(d) { return `${d.getFullYear()}年${d.getMonth()+1}月`; }
function getWeekStart(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); r.setHours(0,0,0,0); return r; }
function getMonthStart(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function getMonthEnd(d) { return new Date(d.getFullYear(), d.getMonth()+1, 0); }
function sameDay(a,b) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function fmtDT(d) { const p = n => String(n).padStart(2,'0'); return `${d.getMonth()+1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`; }

// Collect every task ID in the parsed schedule (ignores collapse state) — used for the footer count.
function collectAllTaskIds(schedule) {
  const ids = [];
  for (const sec of schedule.sections) {
    if (sec.tasks) sec.tasks.forEach(t => ids.push(t.id));
    if (sec.weeks) sec.weeks.forEach(w => w.tasks.forEach(t => ids.push(t.id)));
  }
  return ids;
}

// ===== MARKDOWN PARSER =====
function parseMd(md) {
  const lines = md.split('\n');
  const data = { meta: {}, sections: [], milestones: [] };
  let curSec = null, curWeek = null, taskIdx = 0, inMilestones = false, inMeta = false;

  for (const line of lines) {
    const t = line.trim();
    if (t === '## メタ情報') { inMeta = true; continue; }
    if (inMeta) {
      if (t.startsWith('- 開始日:')) { data.meta.startDate = t.split(':').slice(1).join(':').trim(); continue; }
      if (t.startsWith('- 終了日:')) { data.meta.endDate = t.split(':').slice(1).join(':').trim(); continue; }
      if (t.startsWith('- Quarter:')) { data.meta.quarter = t.split(':')[1].trim(); continue; }
      if (t.startsWith('##') || t.startsWith('---')) inMeta = false;
      else continue;
    }
    if (t === '---') continue;
    if (t === '## マイルストーン') { inMilestones = true; curSec = null; curWeek = null; continue; }
    if (inMilestones) {
      const m = t.match(/^- (\d{4}-\d{2}-\d{2}):\s*(.+)$/);
      if (m) data.milestones.push({ date: m[1], label: m[2] });
      if (t.startsWith('##')) inMilestones = false;
      else continue;
    }
    const secM = t.match(/^## (.+?)(?:（(\d{4}-\d{2}-\d{2})\s*〜\s*(\d{4}-\d{2}-\d{2})）)?$/);
    if (secM) {
      inMeta = false;
      const name = secM[1];
      let id;
      if (name.startsWith('オリエンテーション')) id = 'ORI';
      else if (name.startsWith('A:') || name === 'A') id = 'A';
      else if (name.startsWith('B:') || name === 'B') id = 'B';
      else if (name.startsWith('C:') || name === 'C') id = 'C';
      else continue;
      curSec = { id, name, startDate: secM[2]||null, endDate: secM[3]||null };
      if (id === 'ORI') curSec.tasks = [];
      else curSec.weeks = [];
      data.sections.push(curSec);
      curWeek = null; taskIdx = 0;
      continue;
    }
    const wkM = t.match(/^### (Week \d+): (.+?)（(\d{4}-\d{2}-\d{2})\s*〜\s*(\d{4}-\d{2}-\d{2})）$/);
    if (wkM && curSec && curSec.weeks) {
      const wId = wkM[1].replace(' ','');
      curWeek = { id: wId, title: `${wkM[1]}: ${wkM[2]}`, short: wkM[1], startDate: wkM[3], endDate: wkM[4], tasks: [] };
      curSec.weeks.push(curWeek);
      taskIdx = 0;
      continue;
    }
    const tkM = t.match(/^- \[([ x])\] (.+)$/);
    if (tkM && curSec) {
      taskIdx++;
      const task = { text: tkM[2], defaultDone: tkM[1]==='x' };
      if (curWeek) {
        task.id = `${data.meta.quarter}-${curSec.id}-${curWeek.id}-task${taskIdx}`;
        curWeek.tasks.push(task);
      } else if (curSec.tasks) {
        task.id = `${data.meta.quarter}-${curSec.id}-task${taskIdx}`;
        curSec.tasks.push(task);
      }
    }
  }
  // compute section date ranges from weeks
  for (const s of data.sections) {
    if (s.weeks && s.weeks.length) {
      s.startDate = s.weeks[0].startDate;
      s.endDate = s.weeks[s.weeks.length-1].endDate;
    }
  }
  return data;
}

// ===== STORAGE =====
const STORAGE_KEY = 'sg-completed';
function saveCompleted(obj) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch(e) {}
}
function loadCompleted() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {}; } catch(e) { return {}; }
}
const SCHEDULE_CACHE_KEY = 'sg-schedule-md';
function saveScheduleMd(md) {
  try { localStorage.setItem(SCHEDULE_CACHE_KEY, md); } catch(e) {}
}
function loadScheduleMd() {
  try { return localStorage.getItem(SCHEDULE_CACHE_KEY); } catch(e) { return null; }
}

// ===== SVG ICONS =====
function svgChevronRight(size, color) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
}
function svgChevronDown(size, color) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
}
function svgCheck(size, color) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
}
function svgDiamond(size, fill, stroke) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 12 12 22 2 12"/></svg>`;
}
function svgFolder(size, color) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
}
function svgCalendar(size, color) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
}

// ===== TOOLTIP =====
let longPressTimer = null;
let longPressTriggered = false;

function showTooltip(text, x, y) {
  const el = document.getElementById('tooltip');
  if (!el) return;
  el.textContent = text;
  const left = Math.min(x, window.innerWidth - 292);
  let top = y + 8;
  if (top + 100 > window.innerHeight) top = y - 60;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  el.style.display = 'block';
}

function hideTooltip() {
  const el = document.getElementById('tooltip');
  if (el) el.style.display = 'none';
}

// Walk up DOM to find a week row-label with tooltip text
function findLongPressTarget(el) {
  while (el) {
    if (el.getAttribute && el.getAttribute('data-row-type') === 'week' && el.getAttribute('data-tooltip-text')) return el;
    el = el.parentElement;
  }
  return null;
}

// ===== APP STATE =====
const state = {
  schedule: null,
  viewMode: 'month',
  navDate: new Date(),
  collapsed: {},
  completed: {},
  scheduleSource: null,   // 'fetch' | 'cache' | 'builtin' | 'manual'
  scheduleLoadedAt: null, // Date — 現在表示中スケジュールの取得日時
};

// ===== VIEW RANGE =====
function getViewRange() {
  const { viewMode, navDate, schedule } = state;
  if (viewMode === 'week') {
    const start = getWeekStart(navDate);
    return { start, end: addDays(start, 6), label: `${fmtD(start)} - ${fmtD(addDays(start, 6))}` };
  }
  if (viewMode === 'month') {
    const start = getMonthStart(navDate);
    const end = getMonthEnd(navDate);
    return { start, end, label: fmtM(navDate) };
  }
  // year/all
  const start = pd(schedule.meta.startDate);
  const end = pd(schedule.meta.endDate);
  return { start, end, label: `${schedule.meta.quarter} 全体` };
}

function getChartWidth(viewRange) {
  const totalDays = dayDiff(viewRange.start, viewRange.end) + 1;
  const minDayW = state.viewMode === 'week' ? 72 : state.viewMode === 'month' ? 24 : 8;
  return Math.max(totalDays * minDayW, 400);
}

// ===== ROW GENERATION =====
function buildRows() {
  const { schedule, collapsed, completed } = state;
  const result = [];

  for (const sec of schedule.sections) {
    const color = COLORS[sec.id] || COLORS.ORI;
    const secKey = sec.id;
    let secTasks = [];
    if (sec.tasks) secTasks = sec.tasks;
    if (sec.weeks) sec.weeks.forEach(w => secTasks.push(...w.tasks));
    const secDone = secTasks.length > 0 && secTasks.every(t => completed[t.id]);
    const isCollapsed = !!collapsed[secKey === 'ORI' ? 'ORI-tasks' : secKey];

    result.push({ type: 'section', id: secKey, colKey: secKey === 'ORI' ? 'ORI-tasks' : secKey, label: sec.name, color, startDate: sec.startDate, endDate: sec.endDate, collapsed: isCollapsed, done: secDone });

    if (!isCollapsed) {
      if (sec.tasks) {
        for (const task of sec.tasks) {
          result.push({ type: 'task', id: task.id, label: task.text, color, startDate: sec.startDate, endDate: sec.endDate, done: !!completed[task.id] });
        }
      }
      if (sec.weeks) {
        for (const week of sec.weeks) {
          const wKey = `${sec.id}-${week.id}`;
          const weekDone = week.tasks.length > 0 && week.tasks.every(t => completed[t.id]);
          const wCollapsed = !!collapsed[wKey];
          result.push({ type: 'week', id: wKey, label: week.title, short: week.short, color, startDate: week.startDate, endDate: week.endDate, collapsed: wCollapsed, done: weekDone });
          if (!wCollapsed) {
            for (const task of week.tasks) {
              result.push({ type: 'task', id: task.id, label: task.text, color, startDate: week.startDate, endDate: week.endDate, done: !!completed[task.id] });
            }
          }
        }
      }
    }
  }

  if (schedule.milestones.length) {
    result.push({ type: 'milestone-header', id: 'ms', label: '★ マイルストーン' });
    for (const ms of schedule.milestones) {
      result.push({ type: 'milestone', id: `ms-${ms.date}`, label: ms.label, date: ms.date });
    }
  }
  return result;
}

// ===== BAR CALCULATOR =====
function getBar(sDate, eDate, viewRange, chartW) {
  if (!sDate || !eDate || !viewRange) return null;
  const totalDays = dayDiff(viewRange.start, viewRange.end) + 1;
  const s = pd(sDate), e = pd(eDate);
  const startOff = Math.max(0, dayDiff(viewRange.start, s));
  const endOff = Math.min(totalDays, dayDiff(viewRange.start, e) + 1);
  if (endOff <= 0 || startOff >= totalDays) return null;
  const left = (startOff / totalDays) * chartW;
  const width = ((endOff - startOff) / totalDays) * chartW;
  return { left, width: Math.max(width, 2) };
}

function getTodayPos(viewRange, chartW) {
  if (!viewRange) return null;
  const totalDays = dayDiff(viewRange.start, viewRange.end) + 1;
  const today = new Date(); today.setHours(0,0,0,0);
  const off = dayDiff(viewRange.start, today);
  if (off < 0 || off > totalDays) return null;
  return (off / totalDays) * chartW;
}

// ===== RENDER =====
function render() {
  const app = document.getElementById('app');
  if (!state.schedule) {
    app.innerHTML = '<div class="loading">読み込み中...</div>';
    return;
  }

  const viewRange = getViewRange();
  const chartW = getChartWidth(viewRange);
  const totalDays = dayDiff(viewRange.start, viewRange.end) + 1;
  const rows = buildRows();
  const todayPos = getTodayPos(viewRange, chartW);
  const { schedule, viewMode } = state;

  // Time headers
  const timeHeaders = [];
  if (viewMode === 'week') {
    for (let d = new Date(viewRange.start); d <= viewRange.end; d = addDays(d, 1)) {
      timeHeaders.push({ date: new Date(d), label: `${fmtD(d)}(${DAY_NAMES[d.getDay()]})`, isToday: sameDay(d, new Date()) });
    }
  } else if (viewMode === 'month') {
    let d = getWeekStart(viewRange.start);
    while (d <= viewRange.end) {
      timeHeaders.push({ date: new Date(d), label: fmtD(d), isToday: false });
      d = addDays(d, 7);
    }
  } else {
    let d = new Date(viewRange.start.getFullYear(), viewRange.start.getMonth(), 1);
    while (d <= viewRange.end) {
      timeHeaders.push({ date: new Date(d), label: `${d.getMonth()+1}月`, isToday: false });
      d = new Date(d.getFullYear(), d.getMonth()+1, 1);
    }
  }

  // Progress counts — count ALL tasks in the parsed schedule, not just the
  // rows currently visible. buildRows() omits tasks under collapsed weeks/sections,
  // so counting rows gave 0/0 whenever everything was collapsed (the default state).
  const allTaskIds = collectAllTaskIds(schedule);
  const totalCount = allTaskIds.length;
  const doneCount = allTaskIds.filter(id => state.completed[id]).length;

  // Build HTML
  let html = `
  <div class="header">
    <div class="view-switcher">
      ${[['week','週'],['month','月'],['year','全体']].map(([k,l]) =>
        `<button class="view-btn${viewMode===k?' active':''}" data-action="setView" data-view="${k}">${l}</button>`
      ).join('')}
    </div>
    <div class="nav-group">
      <button class="nav-btn" data-action="nav" data-dir="-1" ${viewMode==='year'?'disabled':''}>${svgChevronRight(18,'#1C1917').replace('polyline points="9 18 15 12 9 6"','polyline points="15 18 9 12 15 6"')}</button>
      <span class="nav-label">${viewRange.label}</span>
      <button class="nav-btn" data-action="nav" data-dir="1" ${viewMode==='year'?'disabled':''}>${svgChevronRight(18,'#1C1917')}</button>
    </div>
    <button class="today-btn" data-action="today">${svgCalendar(14,'#57534E')}今日</button>
    <div class="header-spacer"></div>
    <button class="file-btn" data-action="openFile">${svgFolder(14,'#57534E')}md読込</button>
  </div>
  <div class="chart-scroll" id="chart-scroll">
    <div class="chart-grid" style="grid-template-columns:${LABEL_W}px ${chartW}px; min-width:${LABEL_W+chartW}px">
      <!-- header -->
      <div class="header-label-cell" style="position:sticky;top:0;height:32px">${schedule.meta.quarter || ''}</div>
      <div style="position:sticky;top:0;z-index:5;background:#fff;border-bottom:2px solid #D6D3D1;height:32px;overflow:hidden">
        ${timeHeaders.map(h => {
          const off = dayDiff(viewRange.start, h.date);
          const pos = (off / totalDays) * chartW;
          return `<div class="time-tick${h.isToday?' today-tick':''}" style="left:${pos}px">${h.label}</div>`;
        }).join('')}
        ${todayPos !== null ? `<div class="today-line today-line-header" style="left:${todayPos}px"></div>` : ''}
      </div>
  `;

  for (const row of rows) {
    const h = ROW_H[row.type] || 32;
    const bar = (row.startDate && row.endDate) ? getBar(row.startDate, row.endDate, viewRange, chartW) : null;
    const msBar = row.date ? getBar(row.date, row.date, viewRange, chartW) : null;

    // Indent
    const indent = row.type === 'task' ? 36 : row.type === 'week' ? 24 : row.type === 'milestone' ? 24 : 12;
    const isClickable = row.type === 'section' || row.type === 'week';
    const fontSize = row.type === 'section' ? 13 : row.type === 'week' ? 12 : 11;
    const fontWeight = row.type === 'section' ? 600 : row.type === 'week' ? 500 : 400;
    const textColor = row.type === 'milestone-header' ? COLORS.MS.main
      : row.type === 'milestone' ? '#57534E'
      : row.done ? '#A8A29E'
      : row.color ? row.color.text : '#1C1917';

    // Label cell
    const taskTooltipAttrs = row.type === 'task' ? `data-action="showTooltip" data-tooltip-text="${escapeHtml(row.label)}"` : '';
    const weekTooltipAttrs = row.type === 'week' ? `data-tooltip-text="${escapeHtml(row.label)}"` : '';
    html += `<div class="row-label${isClickable?' clickable':''}" style="height:${h}px;padding-left:${indent}px"
      ${isClickable ? `data-action="toggleCollapse" data-key="${row.colKey || row.id}"` : ''}
      ${taskTooltipAttrs}
      ${weekTooltipAttrs}
      data-row-type="${row.type}">`;

    if (row.type === 'section') {
      html += `<span class="icon">${row.collapsed ? svgChevronRight(14, row.color.main) : svgChevronDown(14, row.color.main)}</span>`;
    } else if (row.type === 'week') {
      html += `<span class="icon">${row.collapsed ? svgChevronRight(12, row.color.main) : svgChevronDown(12, row.color.main)}</span>`;
    } else if (row.type === 'task') {
      html += `<span class="task-checkbox${row.done?' checked':''}" style="border-color:${row.color.main};background:${row.done?row.color.main:'transparent'}" data-action="toggleTask" data-task-id="${row.id}">
        ${row.done ? svgCheck(12,'#fff') : ''}
      </span>`;
    } else if (row.type === 'milestone-header') {
      html += `<span style="color:${COLORS.MS.main};font-size:14px">★</span>`;
    } else if (row.type === 'milestone') {
      html += `<span class="icon">${svgDiamond(10, 'none', COLORS.MS.main)}</span>`;
    }

    html += `<span class="label-text${row.type==='task'&&row.done?' done':''}" style="font-size:${fontSize}px;font-weight:${fontWeight};color:${textColor}">${escapeHtml(row.label)}</span>`;

    if ((row.type === 'section' || row.type === 'week') && row.done) {
      html += `<span class="done-badge" style="background:${row.color.main}">完了</span>`;
    }

    html += `</div>`;

    // Bar cell
    const barTopMap = { section: 10, week: 11, task: 10 };
    const barHeightMap = { section: 20, week: 14, task: 12 };

    html += `<div class="bar-cell" style="height:${h}px">`;

    if (bar) {
      let barBg, barBorder;
      if (row.done) {
        barBg = row.color.lighter;
        barBorder = `1px solid ${row.color.light}`;
      } else if (row.type === 'section') {
        barBg = row.color.main;
        barBorder = 'none';
      } else if (row.type === 'week') {
        barBg = row.color.light;
        barBorder = 'none';
      } else {
        barBg = `${row.color.main}55`;
        barBorder = `1px solid ${row.color.main}40`;
      }
      const barTop = barTopMap[row.type] || 12;
      const barH = barHeightMap[row.type] || 12;
      const isTaskBar = row.type === 'task';
      html += `<div class="bar${isTaskBar?' clickable':''}"
        style="left:${bar.left}px;width:${bar.width}px;top:${barTop}px;height:${barH}px;background:${barBg};border:${barBorder};border-radius:${row.type==='section'?6:row.type==='week'?5:4}px"
        ${isTaskBar ? `data-action="toggleTask" data-task-id="${row.id}"` : ''}>
        ${row.type==='section'&&!row.done&&bar.width>80 ? `<span class="bar-label">${escapeHtml(row.label)}</span>` : ''}
        ${row.type==='task'&&row.done ? svgCheck(10, row.color.main) : ''}
      </div>`;
    }

    if (msBar) {
      html += `<div class="milestone-diamond" style="left:${msBar.left-6}px;top:8px;width:16px;height:16px">
        ${svgDiamond(12, COLORS.MS.main, COLORS.MS.main)}
      </div>`;
    }

    if (todayPos !== null) {
      html += `<div class="today-line today-line-body" style="left:${todayPos}px"></div>`;
    }

    html += `</div>`;
  }

  const SRC_LABELS = { fetch: 'サーバー取得', cache: 'キャッシュ(前回取得)', builtin: '内蔵フォールバック', manual: '手動読込' };
  const srcLabel = SRC_LABELS[state.scheduleSource] || '不明';
  const isBuiltin = state.scheduleSource === 'builtin';
  const loadedAt = state.scheduleLoadedAt ? fmtDT(state.scheduleLoadedAt) : '—';

  html += `</div></div>
  <div class="footer">
    <span>Self-Study with AI University</span>
    <span>${doneCount}/${totalCount} 完了</span>
  </div>
  <div class="footer-meta${isBuiltin ? ' warn' : ''}">
    <span>版: ${escapeHtml(schedule.meta.quarter || '')} 〜${escapeHtml(schedule.meta.endDate || '?')}</span>
    <span>${isBuiltin ? '⚠ ' : ''}取得元: ${srcLabel} · ${loadedAt}</span>
  </div>`;

  app.innerHTML = html;
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== EVENT DELEGATION =====
// Walk up the DOM safely (handles SVG child elements that may not support closest on iOS Safari)
function findActionTarget(el, root) {
  while (el && el !== root) {
    if (el.getAttribute && el.getAttribute('data-action')) return el;
    el = el.parentElement;
  }
  return null;
}

function attachEvents() {
  const app = document.getElementById('app');

  // Tooltip: close when clicking outside (inside #app)
  app.addEventListener('click', (e) => {
    if (longPressTriggered) {
      longPressTriggered = false;
      return;
    }
    hideTooltip();

    const target = findActionTarget(e.target, app);
    if (!target) return;
    const action = target.getAttribute('data-action');

    if (action === 'showTooltip') {
      const text = target.getAttribute('data-tooltip-text');
      if (text) showTooltip(text, e.clientX, e.clientY);
    } else if (action === 'setView') {
      state.viewMode = target.getAttribute('data-view');
      render();
    } else if (action === 'nav') {
      const dir = parseInt(target.getAttribute('data-dir'));
      const d = new Date(state.navDate);
      if (state.viewMode === 'week') state.navDate = addDays(d, dir * 7);
      else if (state.viewMode === 'month') { d.setMonth(d.getMonth() + dir); state.navDate = d; }
      render();
    } else if (action === 'today') {
      state.navDate = new Date();
      render();
    } else if (action === 'toggleCollapse') {
      const key = target.getAttribute('data-key');
      state.collapsed[key] = !state.collapsed[key];
      render();
    } else if (action === 'toggleTask') {
      e.stopPropagation();
      const taskId = target.getAttribute('data-task-id');
      if (state.completed[taskId]) delete state.completed[taskId];
      else state.completed[taskId] = true;
      saveCompleted(state.completed);
      render();
    } else if (action === 'openFile') {
      document.getElementById('file-input').click();
    }
  });

  // Long press for week row labels (touch)
  app.addEventListener('touchstart', (e) => {
    const lpTarget = findLongPressTarget(e.target);
    if (!lpTarget) return;
    const touch = e.touches[0];
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      const text = lpTarget.getAttribute('data-tooltip-text');
      if (text) showTooltip(text, touch.clientX, touch.clientY);
    }, 500);
  }, { passive: true });

  app.addEventListener('touchend', () => {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }, { passive: true });

  app.addEventListener('touchmove', () => {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }, { passive: true });

  // Long press for week row labels (mouse/desktop)
  app.addEventListener('mousedown', (e) => {
    const lpTarget = findLongPressTarget(e.target);
    if (!lpTarget) return;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      const text = lpTarget.getAttribute('data-tooltip-text');
      if (text) showTooltip(text, e.clientX, e.clientY);
    }, 500);
  });

  app.addEventListener('mouseup', () => {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  });
}

// ===== FILE UPLOAD =====
document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (confirm('スケジュールを更新しますか？\n（進捗データは保持されます）')) {
      const md = ev.target.result;
      state.schedule = parseMd(md);
      saveScheduleMd(md);
      state.scheduleSource = 'manual';
      state.scheduleLoadedAt = new Date();
      initCollapsed();
      render();
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

function initCollapsed() {
  const c = {};
  state.schedule.sections.forEach(s => {
    if (s.weeks) s.weeks.forEach(w => { c[`${s.id}-${w.id}`] = true; });
    if (s.id === 'ORI') c['ORI-tasks'] = false; // ORI tasks visible by default
  });
  state.collapsed = c;
}

// ===== INIT =====
async function init() {
  // Source of truth is public/schedule.md. Fetch it network-first with cache
  // busting so a pushed update always wins over any stale Service Worker / HTTP
  // cache. Fall back to the last successfully fetched copy (offline), then to the
  // embedded DEFAULT_MD. state.scheduleSource records which one we're showing so
  // the footer can surface it.
  let md = null;
  let source = null;
  try {
    const res = await fetch('public/schedule.md?_=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      md = await res.text();
      saveScheduleMd(md);
      source = 'fetch';
    }
  } catch(e) {}

  if (!md) {
    md = loadScheduleMd();
    if (md) source = 'cache';
  }

  if (!md) {
    md = DEFAULT_MD;
    source = 'builtin';
  }

  state.scheduleSource = source;
  state.scheduleLoadedAt = new Date();
  state.schedule = parseMd(md);
  state.completed = loadCompleted();

  // Apply defaultDone from md
  for (const sec of state.schedule.sections) {
    const tasks = [];
    if (sec.tasks) tasks.push(...sec.tasks);
    if (sec.weeks) sec.weeks.forEach(w => tasks.push(...w.tasks));
    for (const t of tasks) {
      if (t.defaultDone && !state.completed[t.id]) state.completed[t.id] = true;
    }
  }

  initCollapsed();

  // Set navDate to current month
  state.navDate = new Date();

  render();
  attachEvents();

  // Scroll today into view after render
  setTimeout(() => {
    const scroll = document.getElementById('chart-scroll');
    const todayLine = scroll ? scroll.querySelector('.today-line-body') : null;
    if (scroll && todayLine) {
      const lineLeft = parseFloat(todayLine.style.left);
      const scrollTo = lineLeft + LABEL_W - scroll.clientWidth / 2;
      scroll.scrollLeft = Math.max(0, scrollTo);
    }
  }, 50);
}

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

init();
