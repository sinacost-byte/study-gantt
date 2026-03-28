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

// ===== APP STATE =====
const state = {
  schedule: null,
  viewMode: 'month',
  navDate: new Date(),
  collapsed: {},
  completed: {},
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

  // Progress counts
  const allTasks = rows.filter(r => r.type === 'task');
  const doneTasks = allTasks.filter(r => r.done);

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
    html += `<div class="row-label${isClickable?' clickable':''}" style="height:${h}px;padding-left:${indent}px"
      ${isClickable ? `data-action="toggleCollapse" data-key="${row.colKey || row.id}"` : ''}
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

  html += `</div></div>
  <div class="footer">
    <span>Self-Study with AI University</span>
    <span>${doneTasks.length}/${allTasks.length} 完了</span>
  </div>`;

  app.innerHTML = html;
  attachEvents();
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== EVENT DELEGATION =====
function attachEvents() {
  const app = document.getElementById('app');

  app.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    if (action === 'setView') {
      state.viewMode = target.dataset.view;
      render();
    } else if (action === 'nav') {
      const dir = parseInt(target.dataset.dir);
      const d = new Date(state.navDate);
      if (state.viewMode === 'week') state.navDate = addDays(d, dir * 7);
      else if (state.viewMode === 'month') { d.setMonth(d.getMonth() + dir); state.navDate = d; }
      render();
    } else if (action === 'today') {
      state.navDate = new Date();
      render();
    } else if (action === 'toggleCollapse') {
      const key = target.dataset.key;
      state.collapsed[key] = !state.collapsed[key];
      render();
    } else if (action === 'toggleTask') {
      e.stopPropagation();
      const taskId = target.dataset.taskId;
      if (state.completed[taskId]) delete state.completed[taskId];
      else state.completed[taskId] = true;
      saveCompleted(state.completed);
      render();
    } else if (action === 'openFile') {
      document.getElementById('file-input').click();
    }
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
  // Try to fetch schedule.md from same origin
  let md = null;
  try {
    const res = await fetch('public/schedule.md');
    if (res.ok) {
      md = await res.text();
      saveScheduleMd(md);
    }
  } catch(e) {}

  if (!md) {
    md = loadScheduleMd();
  }

  if (!md) {
    document.getElementById('app').innerHTML = '<div class="loading">schedule.md を読み込めませんでした。<br>📁md読込ボタンからファイルを選択してください。<br><br><button onclick="document.getElementById(\'file-input\').click()" style="padding:10px 20px;font-size:14px;cursor:pointer">📁 md読込</button></div>';
    return;
  }

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
