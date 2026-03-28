import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ChevronRight, ChevronDown, Check, FolderOpen, ChevronLeft, Diamond, CalendarDays } from "lucide-react";

// ===== EMBEDDED SCHEDULE =====
const DEFAULT_MD = `# 1Q スケジュール

## メタ情報
- 開始日: 2026-03-28
- 終了日: 2026-06-27
- Quarter: 1Q
- 週の開始曜日: 日曜日

## オリエンテーション（2026-03-28 〜 2026-04-04）
- [ ] カリキュラム全体の確認・学習環境セットアップ
- [ ] CS50x翻訳プレーヤーの動作確認
- [ ] 学習管理アプリ（ガントチャート）の動作確認
- [ ] Python環境構築（ローカル or Google Colab）
- [ ] 予習読書:『技術革新と不平等の1000年史（上）』読了
- [ ] 予習読書:『ネット興亡記』読了

## A: 技術革命史

### Week 1: 技術革命の全体地図（2026-04-05 〜 2026-04-11）
- [ ] 講義: 技術革命のリスト、「革命」の定義、技術決定論 vs 社会構成主義
- [ ] 読書:『第四次産業革命』シュワブ（薄い本。全体の地図として）
- [ ] ディスカッション: AI革命の歴史的位置づけ

### Week 2: 活版印刷 — 知識の民主化（2026-04-12 〜 2026-04-18）
- [ ] 講義: グーテンベルク、知識の独占の崩壊、宗教改革・科学革命への影響
- [ ] 読書:『グーテンベルクの銀河系』マクルーハン（集中読み）
- [ ] ディスカッション:「じわじわ」の変化を深掘りする

### Week 3: 蒸気機関と産業革命（2026-04-19 〜 2026-04-25）
- [ ] 講義: 蒸気機関、工場制度、都市化、勝者と敗者
- [ ] 読書:『グーテンベルクの銀河系』続き（必要に応じて）
- [ ] パターン抽出①: Week 1-3 のパターンをメモにまとめる

### Week 4: 電気と第2次産業革命（2026-04-26 〜 2026-05-02）
- [ ] 講義: 電気の普及、大量生産・大量消費、フォード式生産方式
- [ ] 読書:『技術革新と不平等の1000年史（下）』開始
- [ ] ディスカッション: インフラ技術と「徐々に」の変化

### Week 5: 通信革命 — 電信から電話へ（2026-05-03 〜 2026-05-09）
- [ ] 講義: 電信、電話、ラジオ、テレビ。マスメディアの誕生
- [ ] 読書:『技術革新と不平等の1000年史（下）』続き
- [ ] ディスカッション: 通信技術と「距離」の意味の変化

### Week 6: コンピュータ革命（2026-05-10 〜 2026-05-16）
- [ ] 講義: ENIAC→メインフレーム→PC。「個人が持てる」瞬間
- [ ] 動画: "The Machine That Changed the World" 視聴
- [ ] パターン抽出②: Week 4-6 のパターンをメモにまとめる

### Week 7: インターネットの爆発（2026-05-17 〜 2026-05-23）
- [ ] 講義: ARPANET→WWW→ブラウザ一般化、ドットコムバブル
- [ ] ディスカッション: B科目のネットワーク知識との接続
- [ ] ディスカッション:『ネット興亡記』を歴史のパターンに位置づける

### Week 8: プラットフォームとソーシャルメディア（2026-05-24 〜 2026-05-30）
- [ ] 講義: GAFAの台頭、ネットワーク効果、情報の「多対多」配信
- [ ] 読書:『プラットフォーム・レボリューション』パーカー
- [ ] 記事: Ben Thompson "Aggregation Theory" を読む
- [ ] ディスカッション: 情報流通コストと権力構造

### Week 9: スマートフォン — 常時接続の社会（2026-05-31 〜 2026-06-06）
- [ ] 講義: iPhoneが変えたこと、「既存の延長線上」仮説の検証
- [ ] 読書:『プラットフォーム・レボリューション』続き
- [ ] パターン抽出③: Week 7-9 のパターンをメモにまとめる
- [ ] ディスカッション: 生成AIはなぜスマホと違うのか

### Week 10: AI革命の歴史的位置づけ（2026-06-07 〜 2026-06-13）
- [ ] 講義: Week 1-9 のパターン整理、生成AIの位置づけ
- [ ] 記事: Thoughtworks "MCP's Impact on 2025" を読む
- [ ] 演習: パターン一覧表を作成しAI革命への当てはめ分析

### Week 11: AI革命の「じわじわ」を読む（2026-06-14 〜 2026-06-20）
- [ ] 講義: 教育・労働・大学への影響、「時間だけが残る」仮説
- [ ] 記事: "Why MCP Won" / "A Year of MCP" を読む
- [ ] 演習:「5年後に変わっていそうなこと」リスト作成

### Week 12: 統合 — 自分の地図を描く（2026-06-21 〜 2026-06-27）
- [ ] 技術革命史の年表を一枚にまとめる
- [ ] 統合エッセイ執筆（2,000〜3,000字）
- [ ] 振り返り: 1Qの学びを総括する

## B: CS入門

### Week 1: ハードウェアと二進数（2026-04-05 〜 2026-04-11）
- [ ] 講義: CPU・メモリ・ストレージ、二進数・ビット・バイト
- [ ] 動画: CS50x Lecture 0 (Scratch) 視聴
- [ ] 演習: 二進数の手計算
- [ ] 読書:『コンピュータはなぜ動くのか』第1-3章 開始

### Week 2: ソフトウェアとOS（2026-04-12 〜 2026-04-18）
- [ ] 講義: ソースコード→機械語、OSの役割
- [ ] 動画: CS50x Lecture 1 (C) 視聴
- [ ] 演習: タスクマネージャーでプロセスとメモリを観察
- [ ] 読書:『コンピュータはなぜ動くのか』第1-3章 完了

### Week 3: Python基本構造（2026-04-19 〜 2026-04-25）
- [ ] 講義: 変数、型、条件分岐、ループ
- [ ] 動画: MIT 6.100L Lecture 1-3 視聴
- [ ] 演習: GAS→Python書き直し
- [ ] 読書:『コンピュータはなぜ動くのか』第4-6章 開始

### Week 4: 関数とデータ構造（2026-04-26 〜 2026-05-02）
- [ ] 講義: 関数定義、スコープ、リスト・辞書・タプル・セット
- [ ] 動画: MIT 6.100L Lecture 4-6 視聴
- [ ] 演習: GASの配列→Pythonのリスト・辞書

### Week 5: アルゴリズムの考え方（2026-05-03 〜 2026-05-09）
- [ ] 講義: 線形探索、二分探索、バブルソート、O記法
- [ ] 動画: CS50x Lecture 3 (Algorithms) 視聴
- [ ] 演習: FizzBuzz、リスト操作、データ集計
- [ ] 読書:『コンピュータはなぜ動くのか』第4-6章 完了

### Week 6: インターネットの基礎（2026-05-10 〜 2026-05-16）
- [ ] 講義: IPアドレス、DNS、TCP/IP 4層モデル
- [ ] 動画: CS50x Lecture 8 (HTML, CSS, JS) 視聴
- [ ] 読書:『ネットワークはなぜつながるのか』第1-3章 開始
- [ ] 演習: 開発者ツールNetworkタブでHTTPリクエスト観察

### Week 7: HTTPとAPI（2026-05-17 〜 2026-05-23）
- [ ] 講義: HTTP/HTTPS、REST API、JSON、プロトコル
- [ ] 読書:『ネットワークはなぜつながるのか』第1-3章 完了
- [ ] 演習: Python requestsでAPI呼び出し
- [ ] 演習: curlコマンドの基本

### Week 8: データベースの概念とSQL基礎（2026-05-24 〜 2026-05-30）
- [ ] 講義: RDB基本概念、テーブル・行・列・主キー
- [ ] 動画: CS50x Lecture 7 (SQL) 視聴
- [ ] 読書:『スッキリわかるSQL入門』開始
- [ ] 演習: SELECT、WHERE、ORDER BY

### Week 9: SQLの実践とデータ設計（2026-05-31 〜 2026-06-06）
- [ ] 講義: INSERT/UPDATE/DELETE、JOIN、正規化
- [ ] 読書:『スッキリわかるSQL入門』続き
- [ ] 演習: SQLiteで小さなDB作成
- [ ] 演習: スプレッドシートのデータをDB化

### Week 10: ウェブの構造（2026-06-07 〜 2026-06-13）
- [ ] 講義: クライアント/サーバー、HTML/CSS/JSの役割分担、DOM
- [ ] 動画: CS50W Lecture 0-1 視聴
- [ ] 読書:『プログラムはなぜ動くのか』開始
- [ ] 演習: 開発者ツールでDOM操作

### Week 11: フロントエンドとバックエンド（2026-06-14 〜 2026-06-20）
- [ ] 講義: F/Bの境界、サーバーサイド概要、認証、PWA分解
- [ ] 動画: CS50W Lecture 2 視聴
- [ ] 演習: Python Flaskで簡単なAPIサーバー
- [ ] 演習: 自分のPWAのコードを読み直し説明

### Week 12: 統合 — 全部つなげる（2026-06-21 〜 2026-06-27）
- [ ] 全レイヤーを通して追いかける
- [ ] 統合レポート執筆（図+文章）
- [ ] 読書:『教養としてのCS講義』通読

## C: AI/機械学習の基礎

### Week 1: AIとは何か — 歴史と分類（2026-04-05 〜 2026-04-11）
- [ ] 講義: AI定義と歴史、ルールベースvs機械学習
- [ ] 読書:『生成AI入門』Kniberg 開始
- [ ] 演習: 日常の「予測」を機械学習的に考える

### Week 2: 機械学習の基本（2026-04-12 〜 2026-04-18）
- [ ] 講義: データ→パターン→予測、過学習、訓練/テストデータ
- [ ] 読書:『生成AI入門』Kniberg 続き
- [ ] 演習: 機械学習の分類マッピング図を描く

### Week 3: ニューロンからネットワークへ（2026-04-19 〜 2026-04-25）
- [ ] 講義: 人工ニューロン、層の概念
- [ ] 動画: 3Blue1Brown "But what is a neural network?" 視聴
- [ ] 演習: ニューラルネットの各部分を自分の言葉で説明

### Week 4: 学習の仕組み（2026-04-26 〜 2026-05-02）
- [ ] 講義: 損失関数、勾配降下法、バックプロパゲーション
- [ ] 動画: 3Blue1Brown "Gradient descent"/"Backprop" 視聴
- [ ] 動画: MIT 6.S191 Lecture 1 視聴
- [ ] 演習: Colabでニューラルネット動作観察

### Week 5: 言語モデルの基本（2026-05-03 〜 2026-05-09）
- [ ] 講義:「次の単語を予測する」仕組み、トークン、Embedding
- [ ] 読書:『仕組みからわかる大規模言語モデル』開始
- [ ] 演習: Claudeで言語モデル動作を体感

### Week 6: Transformer（2026-05-10 〜 2026-05-16）
- [ ] 講義: Attention機構、Self-Attention、Encoder-Decoder
- [ ] 動画: 3Blue1Brown "Attention in transformers" 視聴
- [ ] 記事: Jay Alammar "The Illustrated Transformer"
- [ ] 演習: Attentionを図にして説明

### Week 7: LLMの訓練と能力（2026-05-17 〜 2026-05-23）
- [ ] 講義: Pre-training、Instruction Tuning、RLHF
- [ ] 動画: MIT 6.S191 Lecture 2 視聴
- [ ] 記事: Jay Alammar "The Illustrated GPT-2"
- [ ] 演習: Anthropic APIでLLMと対話

### Week 8: 生成AIの能力（2026-05-24 〜 2026-05-30）
- [ ] 講義: Context Window、創発的能力、Zero-shot/Few-shot/CoT
- [ ] 読書:『生成AI入門』後半
- [ ] 演習: プロンプト技法を技術的に再解釈

### Week 9: 生成AIの限界（2026-05-31 〜 2026-06-06）
- [ ] 講義: ハルシネーション、バイアス、カットオフ、アライメント
- [ ] 記事: Anthropic Research
- [ ] 演習: ハルシネーションを意図的に引き起こし分析
- [ ] 演習: temperature変更で出力比較

### Week 10: RAGとコンテキストエンジニアリング（2026-06-07 〜 2026-06-13）
- [ ] 講義: RAG、ベクトルDB、意味検索
- [ ] 読書:『仕組みからわかるLLM』RAGの章
- [ ] 演習: RAGパイプラインの概念設計

### Week 11: AIエージェントとツール連携（2026-06-14 〜 2026-06-20）
- [ ] 講義: AIエージェント、Function Calling、MCP
- [ ] 記事: MCP公式 Architecture Overview
- [ ] 演習: MCPの構造を図にまとめる
- [ ] 演習:「業務にエージェントを入れるなら」を考える

### Week 12: 統合 — プロンプトの旅（2026-06-21 〜 2026-06-27）
- [ ] プロンプト→トークン化→Embedding→Transformer→生成を図解
- [ ] 統合レポート執筆
- [ ] B科目レポートとの統合を検討

## マイルストーン
- 2026-04-04: オリエンテーション完了
- 2026-04-25: A科目パターン抽出①（Week 1-3）
- 2026-05-09: B科目Python基礎完了（Week 3-5）
- 2026-05-16: A科目パターン抽出②（Week 4-6）
- 2026-06-06: A科目パターン抽出③（Week 7-9）
- 2026-06-27: 1Q統合レポート提出（A/B/C全科目）
`;

// ===== COLORS =====
const COLORS = {
  ORI: { main: '#78716C', light: '#E7E5E4', lighter: '#F5F5F4', text: '#44403C' },
  A: { main: '#D97706', light: '#FDE68A', lighter: '#FEF3C7', text: '#92400E' },
  B: { main: '#2563EB', light: '#93C5FD', lighter: '#DBEAFE', text: '#1E3A8A' },
  C: { main: '#0D9488', light: '#5EEAD4', lighter: '#CCFBF1', text: '#134E4A' },
  MS: { main: '#DC2626' },
  today: '#DC2626',
};
const DAY_NAMES = ['日','月','火','水','木','金','土'];
const LABEL_W = 180;

// ===== DATE UTILITIES =====
function pd(s) { return new Date(s + 'T00:00:00'); }
function dayDiff(a, b) { return Math.round((b - a) / 86400000); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmtD(d) { return `${d.getMonth()+1}/${d.getDate()}`; }
function fmtM(d) { return `${d.getFullYear()}年${d.getMonth()+1}月`; }
function getWeekStart(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); return r; }
function getMonthStart(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function getMonthEnd(d) { return new Date(d.getFullYear(), d.getMonth()+1, 0); }
function sameDay(a,b) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

// ===== MARKDOWN PARSER =====
function parseMd(md) {
  const lines = md.split('\n');
  const data = { meta: {}, sections: [], milestones: [] };
  let curSec = null, curWeek = null, taskIdx = 0, inMilestones = false;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('- 開始日:')) { data.meta.startDate = t.split(':').slice(1).join(':').trim(); continue; }
    if (t.startsWith('- 終了日:')) { data.meta.endDate = t.split(':').slice(1).join(':').trim(); continue; }
    if (t.startsWith('- Quarter:')) { data.meta.quarter = t.split(':')[1].trim(); continue; }
    if (t.startsWith('## メタ情報')) continue;
    if (t.startsWith('## マイルストーン')) { inMilestones = true; curSec = null; curWeek = null; continue; }
    if (inMilestones) {
      const m = t.match(/^- (\d{4}-\d{2}-\d{2}):\s*(.+)$/);
      if (m) data.milestones.push({ date: m[1], label: m[2] });
      continue;
    }
    const secM = t.match(/^## (.+?)(?:（(\d{4}-\d{2}-\d{2})\s*〜\s*(\d{4}-\d{2}-\d{2})）)?$/);
    if (secM) {
      const name = secM[1];
      let id;
      if (name.startsWith('オリエンテーション')) id = 'ORI';
      else if (name.startsWith('A:')) id = 'A';
      else if (name.startsWith('B:')) id = 'B';
      else if (name.startsWith('C:')) id = 'C';
      else continue;
      curSec = { id, name, startDate: secM[2]||null, endDate: secM[3]||null, weeks: id==='ORI'?undefined:[], tasks: id==='ORI'?[]:undefined };
      data.sections.push(curSec);
      curWeek = null; taskIdx = 0;
      continue;
    }
    const wkM = t.match(/^### (Week \d+): (.+?)（(\d{4}-\d{2}-\d{2})\s*〜\s*(\d{4}-\d{2}-\d{2})）$/);
    if (wkM && curSec && curSec.weeks) {
      curWeek = { id: wkM[1].replace(' ',''), title: `${wkM[1]}: ${wkM[2]}`, short: wkM[1], startDate: wkM[3], endDate: wkM[4], tasks: [] };
      curSec.weeks.push(curWeek);
      taskIdx = 0;
      continue;
    }
    const tkM = t.match(/^- \[([ x])\] (.+)$/);
    if (tkM) {
      taskIdx++;
      const task = { text: tkM[2], defaultDone: tkM[1]==='x' };
      if (curWeek) { task.id = `${data.meta.quarter}-${curSec.id}-${curWeek.id}-task${taskIdx}`; curWeek.tasks.push(task); }
      else if (curSec && curSec.tasks) { task.id = `${data.meta.quarter}-${curSec.id}-task${taskIdx}`; curSec.tasks.push(task); }
    }
  }
  for (const s of data.sections) {
    if (s.weeks && s.weeks.length) { s.startDate = s.weeks[0].startDate; s.endDate = s.weeks[s.weeks.length-1].endDate; }
  }
  return data;
}

// ===== STORAGE =====
async function saveData(key, val) {
  try { if (window.storage) await window.storage.set(key, JSON.stringify(val)); } catch(e) { /* silent */ }
}
async function loadData(key) {
  try { if (window.storage) { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } } catch(e) { /* silent */ }
  return null;
}

// ===== MAIN COMPONENT =====
export default function StudyGantt() {
  const [schedule, setSchedule] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [navDate, setNavDate] = useState(new Date());
  const [collapsed, setCollapsed] = useState({});
  const [completed, setCompleted] = useState({});
  const chartRef = useRef(null);
  const fileRef = useRef(null);

  // Init
  useEffect(() => {
    const data = parseMd(DEFAULT_MD);
    setSchedule(data);
    const initC = {};
    data.sections.forEach(s => {
      if (s.weeks) s.weeks.forEach(w => { initC[`${s.id}-${w.id}`] = true; });
      if (s.id === 'ORI') initC['ORI-tasks'] = true;
    });
    setCollapsed(initC);
    loadData('sg-completed').then(saved => { if (saved) setCompleted(saved); });
  }, []);

  // Save progress
  useEffect(() => { if (Object.keys(completed).length) saveData('sg-completed', completed); }, [completed]);

  // Toggle task completion
  const toggleTask = useCallback((taskId) => {
    setCompleted(prev => {
      const next = { ...prev };
      if (next[taskId]) delete next[taskId]; else next[taskId] = true;
      return next;
    });
  }, []);

  // Toggle collapse
  const toggleCollapse = useCallback((key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // File upload
  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (confirm('スケジュールを更新しますか？\n（進捗データは保持されます）')) {
        const data = parseMd(ev.target.result);
        setSchedule(data);
        const initC = {};
        data.sections.forEach(s => {
          if (s.weeks) s.weeks.forEach(w => { initC[`${s.id}-${w.id}`] = true; });
          if (s.id === 'ORI') initC['ORI-tasks'] = true;
        });
        setCollapsed(initC);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // View range calculation
  const viewRange = useMemo(() => {
    if (!schedule) return null;
    const meta = schedule.meta;
    if (viewMode === 'week') {
      const start = getWeekStart(navDate);
      return { start, end: addDays(start, 6), label: `${fmtD(start)} − ${fmtD(addDays(start, 6))}` };
    }
    if (viewMode === 'month') {
      const start = getMonthStart(navDate);
      const end = getMonthEnd(navDate);
      return { start, end, label: fmtM(navDate) };
    }
    // year
    const start = pd(meta.startDate);
    const end = pd(meta.endDate);
    return { start, end, label: `${meta.quarter} 全体` };
  }, [viewMode, navDate, schedule]);

  // Navigation
  const navigate = useCallback((dir) => {
    setNavDate(prev => {
      if (viewMode === 'week') return addDays(prev, dir * 7);
      if (viewMode === 'month') { const d = new Date(prev); d.setMonth(d.getMonth() + dir); return d; }
      return prev;
    });
  }, [viewMode]);

  // Generate rows
  const rows = useMemo(() => {
    if (!schedule) return [];
    const result = [];
    for (const sec of schedule.sections) {
      const color = COLORS[sec.id] || COLORS.ORI;
      const secKey = sec.id;
      // Determine section completion
      let allTasks = [], secTasks = [];
      if (sec.tasks) secTasks = sec.tasks;
      if (sec.weeks) sec.weeks.forEach(w => secTasks.push(...w.tasks));
      const secDone = secTasks.length > 0 && secTasks.every(t => completed[t.id]);
      
      result.push({ type: 'section', id: secKey, label: sec.name, color, startDate: sec.startDate, endDate: sec.endDate, collapsed: collapsed[secKey], done: secDone });

      if (!collapsed[secKey]) {
        if (sec.tasks) {
          // Orientation tasks
          if (!collapsed['ORI-tasks']) {
            for (const task of sec.tasks) {
              result.push({ type: 'task', id: task.id, label: task.text, color, startDate: sec.startDate, endDate: sec.endDate, done: !!completed[task.id] });
            }
          }
        }
        if (sec.weeks) {
          for (const week of sec.weeks) {
            const wKey = `${sec.id}-${week.id}`;
            const weekDone = week.tasks.length > 0 && week.tasks.every(t => completed[t.id]);
            result.push({ type: 'week', id: wKey, label: week.title, short: week.short, color, startDate: week.startDate, endDate: week.endDate, collapsed: collapsed[wKey], done: weekDone });
            if (!collapsed[wKey]) {
              for (const task of week.tasks) {
                result.push({ type: 'task', id: task.id, label: task.text, color, startDate: week.startDate, endDate: week.endDate, done: !!completed[task.id] });
              }
            }
          }
        }
      }
    }
    // Milestones
    if (schedule.milestones.length) {
      result.push({ type: 'milestone-header', id: 'ms', label: '★ マイルストーン' });
      for (const ms of schedule.milestones) {
        result.push({ type: 'milestone', id: `ms-${ms.date}`, label: ms.label, date: ms.date });
      }
    }
    return result;
  }, [schedule, collapsed, completed]);

  // Time axis headers
  const timeHeaders = useMemo(() => {
    if (!viewRange) return [];
    const { start, end } = viewRange;
    const headers = [];
    if (viewMode === 'week') {
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        headers.push({ date: new Date(d), label: `${fmtD(d)}(${DAY_NAMES[d.getDay()]})`, isToday: sameDay(d, new Date()) });
      }
    } else if (viewMode === 'month') {
      let d = getWeekStart(start);
      while (d <= end) {
        headers.push({ date: new Date(d), label: fmtD(d), isToday: false });
        d = addDays(d, 7);
      }
    } else {
      // year: month headers
      let d = new Date(start.getFullYear(), start.getMonth(), 1);
      while (d <= end) {
        headers.push({ date: new Date(d), label: `${d.getMonth()+1}月`, isToday: false });
        d = new Date(d.getFullYear(), d.getMonth()+1, 1);
      }
    }
    return headers;
  }, [viewRange, viewMode]);

  // Chart dimensions
  const totalDays = viewRange ? dayDiff(viewRange.start, viewRange.end) + 1 : 1;
  const minDayW = viewMode === 'week' ? 72 : viewMode === 'month' ? 24 : 8;
  const chartW = Math.max(totalDays * minDayW, 400);

  // Bar position calculator
  const getBar = useCallback((sDate, eDate) => {
    if (!viewRange || !sDate || !eDate) return null;
    const s = pd(sDate), e = pd(eDate);
    const startOff = Math.max(0, dayDiff(viewRange.start, s));
    const endOff = Math.min(totalDays, dayDiff(viewRange.start, e) + 1);
    if (endOff <= 0 || startOff >= totalDays) return null;
    const left = (startOff / totalDays) * chartW;
    const width = ((endOff - startOff) / totalDays) * chartW;
    return { left, width: Math.max(width, 2) };
  }, [viewRange, totalDays, chartW]);

  // Today line position
  const todayPos = useMemo(() => {
    if (!viewRange) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const off = dayDiff(viewRange.start, today);
    if (off < 0 || off > totalDays) return null;
    return (off / totalDays) * chartW;
  }, [viewRange, totalDays, chartW]);

  if (!schedule) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif' }}>読み込み中...</div>;

  const ROW_H = { section: 40, week: 36, task: 32, 'milestone-header': 36, milestone: 32 };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAF9', fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif', color: '#1C1917', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #E7E5E4', background: '#fff', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
        {/* View mode */}
        <div style={{ display: 'flex', background: '#F5F5F4', borderRadius: 8, overflow: 'hidden', border: '1px solid #E7E5E4' }}>
          {[['week','週'],['month','月'],['year','全体']].map(([k,l]) => (
            <button key={k} onClick={() => setViewMode(k)} style={{ padding: '6px 14px', fontSize: 13, fontWeight: viewMode===k?600:400, background: viewMode===k?'#fff':'transparent', border: 'none', cursor: 'pointer', color: viewMode===k?'#1C1917':'#78716C', boxShadow: viewMode===k?'0 1px 2px rgba(0,0,0,.08)':'none', borderRadius: viewMode===k?6:0 }}>{l}</button>
          ))}
        </div>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => navigate(-1)} disabled={viewMode==='year'} style={{ padding: 4, background: 'none', border: 'none', cursor: viewMode==='year'?'default':'pointer', opacity: viewMode==='year'?.3:1, borderRadius: 4 }}><ChevronLeft size={18} /></button>
          <span style={{ fontSize: 13, fontWeight: 500, minWidth: 100, textAlign: 'center' }}>{viewRange?.label}</span>
          <button onClick={() => navigate(1)} disabled={viewMode==='year'} style={{ padding: 4, background: 'none', border: 'none', cursor: viewMode==='year'?'default':'pointer', opacity: viewMode==='year'?.3:1, borderRadius: 4 }}><ChevronRight size={18} /></button>
        </div>
        {/* Today button */}
        <button onClick={() => setNavDate(new Date())} style={{ padding: '5px 10px', fontSize: 12, background: '#F5F5F4', border: '1px solid #E7E5E4', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#57534E' }}>
          <CalendarDays size={14} />今日
        </button>
        <div style={{ flex: 1 }} />
        {/* File upload */}
        <button onClick={() => fileRef.current?.click()} style={{ padding: '5px 10px', fontSize: 12, background: '#F5F5F4', border: '1px solid #E7E5E4', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#57534E' }}>
          <FolderOpen size={14} />md読込
        </button>
        <input ref={fileRef} type="file" accept=".md,.txt" onChange={handleFile} style={{ display: 'none' }} />
      </div>

      {/* Chart area */}
      <div ref={chartRef} style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `${LABEL_W}px ${chartW}px`, minWidth: LABEL_W + chartW }}>
          {/* Header row */}
          <div style={{ position: 'sticky', left: 0, top: 0, zIndex: 10, background: '#fff', borderBottom: '2px solid #D6D3D1', borderRight: '1px solid #E7E5E4', height: 32, display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: 11, color: '#78716C', fontWeight: 500 }}>
            {schedule.meta.quarter}
          </div>
          <div style={{ position: 'sticky', top: 0, zIndex: 5, background: '#fff', borderBottom: '2px solid #D6D3D1', height: 32, display: 'flex', alignItems: 'end' }}>
            {timeHeaders.map((h, i) => {
              const pos = viewRange ? (dayDiff(viewRange.start, h.date) / totalDays) * chartW : 0;
              return (
                <div key={i} style={{ position: 'absolute', left: pos, fontSize: 10, color: h.isToday ? COLORS.today : '#A8A29E', fontWeight: h.isToday ? 700 : 400, whiteSpace: 'nowrap', paddingBottom: 4, borderLeft: '1px solid #F5F5F4', paddingLeft: 4, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  {h.label}
                </div>
              );
            })}
            {/* Today line in header */}
            {todayPos !== null && <div style={{ position: 'absolute', left: todayPos, top: 0, bottom: 0, width: 2, background: COLORS.today, opacity: 0.6, zIndex: 2 }} />}
          </div>

          {/* Data rows */}
          {rows.map((row) => {
            const h = ROW_H[row.type] || 32;
            const bar = row.startDate && row.endDate ? getBar(row.startDate, row.endDate) : null;
            const msBar = row.date ? getBar(row.date, row.date) : null;

            return [
              // Label cell
              <div key={`l-${row.id}`} style={{ position: 'sticky', left: 0, zIndex: 4, background: '#fff', borderRight: '1px solid #E7E5E4', borderBottom: '1px solid #F5F5F4', height: h, display: 'flex', alignItems: 'center', gap: 4, paddingLeft: row.type==='task'?36:row.type==='week'?24:row.type==='milestone'?24:12, cursor: (row.type==='section'||row.type==='week')?'pointer':'default', userSelect: 'none' }}
                onClick={() => {
                  if (row.type === 'section') toggleCollapse(row.id === 'ORI' ? 'ORI-tasks' : row.id);
                  if (row.type === 'week') toggleCollapse(row.id);
                }}>
                {/* Fold icon */}
                {(row.type === 'section') && (
                  <span style={{ color: row.color?.main || '#78716C', flexShrink: 0 }}>
                    {row.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
                {row.type === 'week' && (
                  <span style={{ color: row.color?.main || '#78716C', flexShrink: 0 }}>
                    {row.collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </span>
                )}
                {/* Checkbox for tasks */}
                {row.type === 'task' && (
                  <span onClick={(e) => { e.stopPropagation(); toggleTask(row.id); }} style={{ width: 18, height: 18, borderRadius: 4, border: row.done ? 'none' : `2px solid ${row.color?.main || '#ccc'}`, background: row.done ? row.color?.main : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>
                    {row.done && <Check size={12} color="#fff" strokeWidth={3} />}
                  </span>
                )}
                {/* Milestone diamond */}
                {row.type === 'milestone-header' && <span style={{ color: COLORS.MS.main, fontSize: 14 }}>★</span>}
                {row.type === 'milestone' && <Diamond size={10} color={COLORS.MS.main} style={{ flexShrink: 0 }} />}
                {/* Label text */}
                <span style={{
                  fontSize: row.type==='section'?13:row.type==='week'?12:11,
                  fontWeight: row.type==='section'?600:row.type==='week'?500:400,
                  color: row.type==='milestone-header'?COLORS.MS.main : row.type==='milestone'?'#57534E' : row.done?'#A8A29E':row.color?.text||'#1C1917',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  textDecoration: row.type==='task'&&row.done?'line-through':'none',
                }}>
                  {row.label}
                </span>
                {/* Done badge for section/week */}
                {(row.type==='section'||row.type==='week') && row.done && (
                  <span style={{ background: row.color?.main, color: '#fff', fontSize: 9, padding: '1px 5px', borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>完了</span>
                )}
              </div>,

              // Bar cell
              <div key={`b-${row.id}`} style={{ position: 'relative', borderBottom: '1px solid #F5F5F4', height: h }}>
                {/* Bar */}
                {bar && (
                  <div
                    onClick={() => row.type === 'task' && toggleTask(row.id)}
                    style={{
                      position: 'absolute',
                      left: bar.left,
                      width: bar.width,
                      top: row.type==='section'?10:row.type==='week'?11:row.type==='task'?10:12,
                      height: row.type==='section'?20:row.type==='week'?14:12,
                      borderRadius: row.type==='section'?6:row.type==='week'?5:4,
                      background: row.done
                        ? row.color?.lighter
                        : row.type==='section'?row.color?.main
                        : row.type==='week'?row.color?.light
                        : `${row.color?.main}55`,
                      border: row.done ? `1px solid ${row.color?.light}` : row.type==='task'?`1px solid ${row.color?.main}40`:'none',
                      cursor: row.type==='task'?'pointer':'default',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', paddingLeft: 4,
                    }}>
                    {row.type==='section' && !row.done && <span style={{ fontSize: 10, color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bar.width > 80 ? row.label : ''}</span>}
                    {row.type==='task' && row.done && <Check size={10} color={row.color?.main} strokeWidth={3} />}
                  </div>
                )}
                {/* Milestone marker */}
                {msBar && (
                  <div style={{ position: 'absolute', left: msBar.left - 6, top: 8, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Diamond size={12} fill={COLORS.MS.main} color={COLORS.MS.main} />
                  </div>
                )}
                {/* Today line */}
                {todayPos !== null && <div style={{ position: 'absolute', left: todayPos, top: 0, bottom: 0, width: 2, background: COLORS.today, opacity: 0.3 }} />}
              </div>
            ];
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #E7E5E4', background: '#fff', padding: '6px 12px', fontSize: 10, color: '#A8A29E', flexShrink: 0, display: 'flex', justifyContent: 'space-between' }}>
        <span>Self-Study with AI University</span>
        <span>{(() => { const allTasks = rows.filter(r => r.type === 'task'); const done = allTasks.filter(r => r.done); return `${done.length}/${allTasks.length} 完了`; })()}</span>
      </div>
    </div>
  );
}
