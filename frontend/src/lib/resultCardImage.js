import {
  CARD_W,
  CARD_H,
  PANEL_TOP,
  PANEL_HEIGHT,
  RESULT_THEME,
  TABLE_COLUMNS,
  gradeTone,
  buildRecord,
  sessionStamp
} from './resultCard';
import logoAsset from '../assets/images/crea8orz_logo.png';
import { jsPDF } from 'jspdf';

const SANS = '"Segoe UI", Arial, Helvetica, sans-serif';
const MONO = 'Consolas, "Courier New", monospace';
const MAT = 48;

const LAYOUT = {
  headerHeight: 150,
  titleTop: 150,
  titleHeight: 56,
  infoTop: 224,
  infoHeight: 64,
  tableTop: 300,
  tableHeadHeight: 44,
  rowHeight: 32,
  panelTop: PANEL_TOP,
  panelHeight: PANEL_HEIGHT,
  panelLeft: 44,
  panelWidth: 700,
  signLeft: 772,
  signWidth: 784,
  signDivider: 392
};

function setFont(ctx, size, weight = 400, family = SANS) {
  ctx.font = `${weight} ${size}px ${family}`;
}

function roundedPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function textWidth(ctx, text, size, weight = 400, family = SANS) {
  setFont(ctx, size, weight, family);
  return ctx.measureText(text).width;
}

function fitText(ctx, text, maxWidth, maxSize, minSize = 9, weight = 400, tracking = 0) {
  const extra = tracking * Math.max(0, [...String(text)].length - 1);
  let size = maxSize;
  while (size > minSize && textWidth(ctx, text, size, weight) + extra > maxWidth) {
    size -= 0.5;
  }
  return size;
}

function drawTracked(ctx, text, x, y, spacing, align = 'left') {
  const chars = [...String(text)];
  const total = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width + spacing, 0) - spacing;
  let cursor = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  chars.forEach((ch) => {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  });
}

function drawArcText(ctx, text, centerX, centerY, radius, size, color, centerAngle, spread, direction = 1) {
  setFont(ctx, size, 700);
  ctx.fillStyle = color;
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((sum, w) => sum + w, 0);
  const arcPerPx = spread / (total || 1);
  let angle = centerAngle - (direction * spread) / 2;
  chars.forEach((ch, i) => {
    const step = widths[i] * arcPerPx;
    angle += (direction * step) / 2;
    ctx.save();
    ctx.translate(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.rotate(angle + (direction > 0 ? Math.PI / 2 : -Math.PI / 2));
    ctx.fillText(ch, -widths[i] / 2, 0);
    ctx.restore();
    angle += (direction * step) / 2;
  });
}

function dashedRule(ctx, x1, y, x2, color) {
  ctx.save();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

function drawCrest(ctx, cx, cy, r, initials) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = RESULT_THEME.lime;
  ctx.stroke();

  ctx.lineWidth = 1.6;
  ctx.strokeStyle = RESULT_THEME.green;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.stroke();

  setFont(ctx, r * 0.66, 800);
  ctx.fillStyle = RESULT_THEME.green;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, cx, cy + 1);

  ctx.beginPath();
  ctx.moveTo(cx - r * 0.42, cy + r * 0.66);
  ctx.lineTo(cx + r * 0.42, cy + r * 0.66);
  ctx.lineWidth = 3;
  ctx.strokeStyle = RESULT_THEME.lime;
  ctx.stroke();

  ctx.restore();
}

const LOGO_CROP = { x: 110, y: 448, width: 802, height: 128 };
let logoImage = null;
let logoPromise = null;

export function ensureLogo() {
  if (logoImage) return Promise.resolve(logoImage);
  if (logoPromise) return logoPromise;

  logoPromise = new Promise((resolve) => {
    if (typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      logoImage = img;
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = logoAsset;
  });

  return logoPromise;
}

export function setLogoImage(img) {
  logoImage = img;
}

function drawLogo(ctx, x, y, w, h) {
  if (!logoImage) return false;

  const boxW = w;
  const boxH = h;
  const padding = 10;
  const innerW = boxW - padding * 2;
  const innerH = boxH - padding * 2;
  const cropRatio = LOGO_CROP.width / LOGO_CROP.height;
  const fit = Math.min(innerW / LOGO_CROP.width, innerH / LOGO_CROP.height);
  const drawW = LOGO_CROP.width * fit;
  const drawH = LOGO_CROP.height * fit;

  ctx.save();
  roundedPath(ctx, x, y, boxW, boxH, 10);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = RESULT_THEME.lime;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clip();

  ctx.drawImage(
    logoImage,
    LOGO_CROP.x,
    LOGO_CROP.y,
    LOGO_CROP.width,
    LOGO_CROP.height,
    x + (boxW - drawW) / 2,
    y + (boxH - drawH) / 2,
    drawW,
    drawH
  );

  ctx.restore();
  return cropRatio > 0;
}

function drawHeaderBrand(ctx, record, x, y, w, h) {
  if (drawLogo(ctx, x, y, w, h)) return;
  drawCrest(ctx, x + w / 2, y + h / 2, Math.min(w, h) / 2 - 4, record.school.crest);
}

function drawHeader(ctx, record) {
  const { green, lime, muted } = RESULT_THEME;
  const height = LAYOUT.headerHeight;

  ctx.save();
  ctx.fillStyle = green;
  ctx.fillRect(0, 0, CARD_W, height);

  const glow = ctx.createLinearGradient(0, 0, CARD_W, height);
  glow.addColorStop(0, 'rgba(168, 240, 68, 0.16)');
  glow.addColorStop(0.55, 'rgba(168, 240, 68, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_W, height);

  ctx.fillStyle = lime;
  ctx.fillRect(0, height - 6, CARD_W, 6);

  drawHeaderBrand(ctx, record, 44, 18, 316, 114);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#ffffff';
  const titleTracking = 1.2;
  const titleSize = fitText(ctx, record.school.name, 640, 34, 20, 800, titleTracking);
  setFont(ctx, titleSize, 800);
  drawTracked(ctx, record.school.name, 386, 66, titleTracking);

  setFont(ctx, 16, 600);
  ctx.fillStyle = lime;
  const mottoTracking = 0.6;
  const mottoSize = fitText(ctx, record.school.motto, 640, 16, 9, 600, mottoTracking);
  setFont(ctx, mottoSize, 600);
  drawTracked(ctx, record.school.motto, 386, 98, mottoTracking);

  setFont(ctx, 13, 600);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.textAlign = 'right';
  const lines = [
    `${record.school.campuses[0].label}: ${record.school.campuses[0].address}`,
    `${record.school.campuses[1].label}: ${record.school.campuses[1].address}`
  ];
  lines.forEach((line, i) => {
    const size = fitText(ctx, line, 620, 13, 9, 600);
    setFont(ctx, size, 600);
    ctx.fillText(line, CARD_W - 44, 44 + i * 21);
  });
  setFont(ctx, 13, 600);
  ctx.fillStyle = lime;
  const contactLine = `${record.school.contacts}   •   ${record.school.email}`;
  setFont(ctx, fitText(ctx, contactLine, 620, 13, 9, 600), 600);
  ctx.fillText(contactLine, CARD_W - 44, 44 + lines.length * 21 + 4);

  ctx.textAlign = 'left';
  ctx.restore();
}

function drawTitleBand(ctx) {
  const { green, lime } = RESULT_THEME;
  const y = LAYOUT.titleTop;

  ctx.save();
  ctx.fillStyle = lime;
  ctx.fillRect(0, y, CARD_W, LAYOUT.titleHeight);

  setFont(ctx, 27, 800);
  ctx.fillStyle = green;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawTracked(ctx, 'TERMLY ACADEMIC PERFORMANCE SUMMARY', CARD_W / 2, y + LAYOUT.titleHeight / 2 + 1, 3.4, 'center');

  ctx.fillStyle = green;
  ctx.fillRect(0, y, 14, LAYOUT.titleHeight);
  ctx.fillRect(CARD_W - 14, y, 14, LAYOUT.titleHeight);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

const INFO_FIELDS = [
  { key: 'studentName', label: 'Student Name', width: 400 },
  { key: 'studentClass', label: 'Class', width: 220 },
  { key: 'sex', label: 'Sex', width: 150 },
  { key: 'reportDateLabel', label: 'Date of Progress Report', width: 300 },
  { key: 'academicYear', label: 'Academic Year', width: 230 },
  { key: 'term', label: 'Term', width: 212 }
];

function drawInfoRow(ctx, record) {
  const { muted, ink, line } = RESULT_THEME;
  const y = LAYOUT.infoTop;
  let x = 44;

  INFO_FIELDS.forEach((field) => {
    setFont(ctx, 11.5, 700);
    ctx.fillStyle = muted;
    ctx.textAlign = 'left';
    ctx.fillText(field.label.toUpperCase(), x, y + 14);

    const value = String(record[field.key] || '').trim() || '—';
    setFont(ctx, fitText(ctx, value, field.width - 18, 21, 12, 700), 700);
    ctx.fillStyle = ink;
    ctx.fillText(value, x, y + 42);

    ctx.strokeStyle = line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y + 52);
    ctx.lineTo(x + field.width - 18, y + 52);
    ctx.stroke();

    x += field.width;
  });
}

function drawTable(ctx, record) {
  const { green, lime, line, rowAlt, ink, muted } = RESULT_THEME;
  const startX = 44;
  const top = LAYOUT.tableTop;
  const headH = LAYOUT.tableHeadHeight;
  const rowH = LAYOUT.rowHeight;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  let colX = startX;
  TABLE_COLUMNS.forEach((col) => {
    ctx.fillStyle = green;
    ctx.fillRect(colX, top, col.width, headH);
    ctx.textAlign = col.align === 'center' ? 'center' : 'left';
    const anchorX = col.align === 'center' ? colX + col.width / 2 : colX + 14;
    if (col.sub) {
      setFont(ctx, 14, 700);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(col.label, anchorX, top + 17);
      setFont(ctx, 12, 600);
      ctx.fillStyle = lime;
      ctx.fillText(col.sub, anchorX, top + 32);
    } else {
      setFont(ctx, 14, 800);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(col.label, anchorX, top + headH / 2);
    }
    colX += col.width;
  });

  record.rows.forEach((row, index) => {
    const rowY = top + headH + index * rowH;
    ctx.fillStyle = index % 2 === 0 ? '#ffffff' : rowAlt;
    ctx.fillRect(startX, rowY, CARD_W - 88, rowH);

    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, rowY + rowH);
    ctx.lineTo(CARD_W - 44, rowY + rowH);
    ctx.stroke();

    let x = startX;
    TABLE_COLUMNS.forEach((col) => {
      if (col.key === 'subject') {
        ctx.textAlign = 'left';
        setFont(ctx, 15.5, 600);
        ctx.fillStyle = ink;
        const size = fitText(ctx, row.subject, col.width - 26, 15.5, 10, 600);
        setFont(ctx, size, 600);
        ctx.fillText(row.subject, x + 14, rowY + rowH / 2);
      } else if (col.key === 'grade') {
        const tone = gradeTone(row.grade);
        const pillW = 58;
        const pillH = 23;
        const pillX = x + (col.width - pillW) / 2;
        const pillY = rowY + (rowH - pillH) / 2;
        roundedPath(ctx, pillX, pillY, pillW, pillH, 6);
        ctx.fillStyle = row.pending ? '#f1f5f3' : tone.fill;
        ctx.fill();
        setFont(ctx, 13, 800);
        ctx.fillStyle = row.pending ? '#9aa8a2' : tone.text;
        ctx.textAlign = 'center';
        ctx.fillText(row.pending ? '—' : row.grade, x + col.width / 2, rowY + rowH / 2 + 0.5);
      } else {
        ctx.textAlign = 'center';
        const emphasis = col.key === 'total';
        setFont(ctx, emphasis ? 16 : 15, emphasis ? 800 : 600);
        ctx.fillStyle = row.pending ? '#b6c2bc' : emphasis ? green : ink;
        ctx.fillText(row.pending ? '—' : String(row[col.key] ?? 0), x + col.width / 2, rowY + rowH / 2 + 0.5);
      }
      x += col.width;
    });
  });

  let gridX = startX;
  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  TABLE_COLUMNS.forEach((col) => {
    ctx.beginPath();
    ctx.moveTo(gridX + 0.5, top);
    ctx.lineTo(gridX + 0.5, top + headH + record.rows.length * rowH);
    ctx.stroke();
    gridX += col.width;
  });

  const tableBottom = top + headH + record.rows.length * rowH;
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.strokeRect(startX - 0.5, top - 0.5, CARD_W - 87, tableBottom - top + 1);

  setFont(ctx, 11, 600);
  ctx.fillStyle = green;
  ctx.textAlign = 'left';
  ctx.fillText(`Student ID: ${record.studentId || '—'}`, 44, tableBottom + 18);

  setFont(ctx, 11, 500);
  ctx.fillStyle = muted;
  ctx.textAlign = 'right';
  ctx.fillText('Grading: A1 75-100 • B2 70-74 • B3 65-69 • C4-C6 50-64 • D7-E8 40-49 • F9 0-39', CARD_W - 44, tableBottom + 18);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

function drawStatusPanel(ctx, record) {
  const { green, lime, line, panel, ink, muted } = RESULT_THEME;
  const x = LAYOUT.panelLeft;
  const y = LAYOUT.panelTop;
  const w = LAYOUT.panelWidth;
  const h = LAYOUT.panelHeight;

  ctx.save();
  roundedPath(ctx, x, y, w, h, 10);
  ctx.fillStyle = panel;
  ctx.fill();
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  ctx.clip();
  ctx.fillStyle = green;
  ctx.fillRect(x, y, w, 36);
  ctx.fillStyle = lime;
  ctx.fillRect(x, y + 34, w, 2);
  ctx.restore();

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  setFont(ctx, 15, 800);
  ctx.fillStyle = '#ffffff';
  drawTracked(ctx, 'TERMLY ACADEMIC STATUS', x + 18, y + 18, 1.4);

  setFont(ctx, 11, 600);
  ctx.fillStyle = lime;
  ctx.textAlign = 'right';
  ctx.fillText(
    `${record.committedSubjects} OF ${record.totalSubjects} SUBJECTS COMMITTED`,
    x + w - 18,
    y + 18
  );
  ctx.textAlign = 'left';

  const boxX = x + 24;
  const boxY = y + 60;
  const boxSize = 22;
  ctx.strokeStyle = record.honourRoll ? green : '#94a3b8';
  ctx.lineWidth = 2.4;
  ctx.strokeRect(boxX, boxY, boxSize, boxSize);
  if (record.honourRoll) {
    ctx.fillStyle = lime;
    ctx.fillRect(boxX + 2, boxY + 2, boxSize - 4, boxSize - 4);
    setFont(ctx, 17, 800);
    ctx.fillStyle = green;
    ctx.textAlign = 'center';
    ctx.fillText('✓', boxX + boxSize / 2, boxY + boxSize / 2 + 1);
    ctx.textAlign = 'left';
  }

  setFont(ctx, 16, 800);
  ctx.fillStyle = ink;
  ctx.fillText('HONOUR ROLL', boxX + boxSize + 14, boxY + boxSize / 2 - 5);
  setFont(ctx, 11.5, 500);
  ctx.fillStyle = muted;
  ctx.fillText('Awarded automatically at 75% and above', boxX + boxSize + 14, boxY + boxSize / 2 + 12);

  const rows = [
    { label: 'TERMLY AVERAGE', value: record.averageText },
    { label: 'CERTIFICATES (90% AND ABOVE)', value: `${record.certificates} subject${record.certificates === 1 ? '' : 's'}` }
  ];

  rows.forEach((entry, index) => {
    const rowY = y + 108 + index * 44;
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 24, rowY - 20);
    ctx.lineTo(x + w - 24, rowY - 20);
    ctx.stroke();

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    setFont(ctx, 12.5, 700);
    ctx.fillStyle = muted;
    ctx.fillText(entry.label, x + 24, rowY);

    ctx.textAlign = 'right';
    setFont(ctx, 25, 800);
    ctx.fillStyle = green;
    ctx.fillText(entry.value, x + w - 24, rowY + 2);
  });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

function drawSignoff(ctx, record) {
  const { green, line, ink, muted, stamp } = RESULT_THEME;
  const x = LAYOUT.signLeft;
  const y = LAYOUT.panelTop;
  const w = LAYOUT.signWidth;
  const h = LAYOUT.panelHeight;

  ctx.save();
  roundedPath(ctx, x, y, w, h, 10);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  ctx.clip();
  ctx.fillStyle = green;
  ctx.fillRect(x, y, w, 36);
  ctx.fillStyle = RESULT_THEME.lime;
  ctx.fillRect(x, y + 34, w, 2);
  ctx.restore();

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  setFont(ctx, 15, 800);
  ctx.fillStyle = '#ffffff';
  drawTracked(ctx, 'SIGNATURE & ENDORSEMENT', x + 18, y + 18, 1.4);

  const midX = x + LAYOUT.signDivider;
  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(midX, y + 50);
  ctx.lineTo(midX, y + h - 12);
  ctx.stroke();

  const columns = [
    { title: 'CLASS TEACHER', name: record.classTeacher, fallback: record.school.headTeacher },
    { title: 'PRINCIPAL', name: record.principal, fallback: record.school.principal }
  ];

  columns.forEach((col, index) => {
    const colX = x + 24 + index * LAYOUT.signDivider;
    const colW = LAYOUT.signDivider - 40;

    setFont(ctx, 12, 700);
    ctx.fillStyle = muted;
    ctx.fillText(col.title, colX, y + 62);

    const name = col.name || col.fallback;
    setFont(ctx, fitText(ctx, name, colW, 19, 12, 800), 800);
    ctx.fillStyle = ink;
    ctx.fillText(name, colX, y + 88);

    setFont(ctx, 11.5, 500);
    ctx.fillStyle = muted;
    ctx.fillText('Name in block letters', colX, y + 108);

    dashedRule(ctx, colX, y + 150, colX + colW, '#94a3b8');
    setFont(ctx, 11, 600);
    ctx.fillStyle = muted;
    ctx.fillText('Signature', colX, y + 166);
    ctx.textAlign = 'right';
    ctx.fillText('Date', colX + colW, y + 166);
    ctx.textAlign = 'left';
  });

  drawStamp(ctx, x + w - 26, y + h - 66, 76, stamp, sessionStamp(record.academicYear));

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

function drawStamp(ctx, cx, cy, r, color, sessionLabel) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.24);
  ctx.globalAlpha = 0.55;

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(185, 28, 28, 0.07)';
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.arc(0, 0, r - 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  drawArcText(ctx, 'CREA8ORZ ACADEMY', 0, 0, r - 22, 11, color, -Math.PI / 2, 2.2, 1);
  drawArcText(ctx, 'SECONDARY SCHOOL', 0, 0, r - 22, 11, color, Math.PI / 2, 2.2, -1);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  setFont(ctx, 22, 800);
  ctx.fillStyle = color;
  ctx.fillText('VERIFIED', 0, sessionLabel ? -14 : -8);

  setFont(ctx, fitText(ctx, 'OFFICIAL SCHOOL SEAL', r * 2 - 24, 10, 6, 700), 700);
  ctx.fillText('OFFICIAL SCHOOL SEAL', 0, sessionLabel ? 4 : 12);

  if (sessionLabel) {
    setFont(ctx, fitText(ctx, sessionLabel, r * 2 - 24, 10, 6, 600), 600);
    ctx.fillText(sessionLabel, 0, 20);
  }

  ctx.restore();
}

function drawCameraStamp(ctx, record) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  setFont(ctx, 20, 700, MONO);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = '#ff9a3c';
  ctx.fillText(record.cameraStamp, 66, CARD_H - 20);
  ctx.restore();
}

function drawFrameLabel(ctx, record, width, height, padX = MAT, padY = MAT) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  setFont(ctx, 15, 600, MONO);
  ctx.fillStyle = 'rgba(5, 47, 36, 0.65)';
  ctx.fillText(record.label, padX, height - 20);
  ctx.textAlign = 'right';
  setFont(ctx, 13, 500, MONO);
  ctx.fillText('Crea8orz Progress Report Engine', width - padX, height - 20);
  ctx.restore();
}

function drawMat(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#e6ece9');
  gradient.addColorStop(1, '#c3cfc9');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function renderResultCard(recordInput, options = {}) {
  const scale = options.scale || 1;
  const withFrame = options.frame !== false;
  const basePad = options.pad ?? (withFrame ? MAT : 0);
  const padX = Math.round((options.padX ?? basePad) * scale);
  const padY = Math.round((options.padY ?? basePad) * scale);
  const width = Math.round(CARD_W * scale + padX * 2);
  const height = Math.round(CARD_H * scale + padY * 2);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const record = buildRecord(recordInput);

  if (withFrame) {
    drawMat(ctx, width, height);
    ctx.save();
    ctx.shadowColor = 'rgba(0, 48, 36, 0.35)';
    ctx.shadowBlur = 40 * scale;
    ctx.shadowOffsetY = 14 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(padX, padY, CARD_W * scale, CARD_H * scale);
    ctx.restore();
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.save();
  ctx.translate(padX, padY);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.rect(0, 0, CARD_W, CARD_H);
  ctx.clip();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  drawHeader(ctx, record);
  drawTitleBand(ctx);
  drawInfoRow(ctx, record);
  drawTable(ctx, record);
  drawStatusPanel(ctx, record);
  drawSignoff(ctx, record);
  drawCameraStamp(ctx, record);
  ctx.restore();

  if (withFrame) {
    drawFrameLabel(ctx, record, width, height, padX, padY);
  }

  return { canvas, record };
}

export function resultCardDataUrl(recordInput, options = {}) {
  const { canvas } = renderResultCard(recordInput, options);
  return canvas.toDataURL('image/jpeg', options.quality || 0.94);
}

export async function downloadResultCardImage(recordInput, options = {}) {
  await ensureLogo();
  const { canvas, record } = renderResultCard(recordInput, options);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to encode result card image'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = record.label.replace(/\.pdf$/, '.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      resolve(record.label);
    }, 'image/jpeg', options.quality || 0.94);
  });
}

export async function downloadResultCardPdf(recordInput, options = {}) {
  const orientation = options.orientation || 'landscape';

  await ensureLogo();

  const pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4', compress: true });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = options.margin ?? 10;

  const padY = MAT;
  const padX = Math.max(padY, Math.round(((CARD_H + padY * 2) * (pageW / pageH) - CARD_W) / 2));

  const { canvas, record } = renderResultCard(recordInput, { ...options, padX, padY, frame: true });

  pdf.setProperties({
    title: `Termly Progress Report — ${record.studentName || 'Student'}`,
    subject: `${record.school?.name || 'Crea8orz Academy'} • ${record.term || ''} ${record.academicYear || ''}`.trim(),
    creator: record.school?.name || 'Crea8orz Academy'
  });

  const fit = Math.min((pageW - margin * 2) / canvas.width, (pageH - margin * 2) / canvas.height);
  const drawW = canvas.width * fit;
  const drawH = canvas.height * fit;

  pdf.addImage(
    canvas.toDataURL('image/jpeg', options.quality || 0.94),
    'JPEG',
    (pageW - drawW) / 2,
    (pageH - drawH) / 2,
    drawW,
    drawH,
    undefined,
    'FAST'
  );

  pdf.save(record.label);
  return record.label;
}
