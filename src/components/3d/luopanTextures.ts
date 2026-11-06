import * as THREE from 'three';
import { MOUNTAINS_24, TRIGRAMS_8, LUNAR_MANSIONS_28, HEXAGRAMS_NAMES } from '../../data/luopanData';

/**
 * Procedurally generates the ultra-high-resolution texture for the inner brass Luopan dial.
 * Canvas size: 2048 x 2048 (or 4096 on desktop) for maximum sharpness at grazing angles.
 */
export function createDialTexture(isHighDpi = true): THREE.CanvasTexture {
  const size = isHighDpi ? 2048 : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const center = size / 2;
  const maxRadius = size * 0.485;

  // 1. Base metallic brass background with concentric grain
  const bgGrad = ctx.createRadialGradient(center, center, 0, center, center, maxRadius);
  bgGrad.addColorStop(0, '#f9e29d'); // bright polished brass
  bgGrad.addColorStop(0.3, '#eed082');
  bgGrad.addColorStop(0.7, '#d3ab5a');
  bgGrad.addColorStop(0.95, '#b88939'); // aged antique bronze patina
  bgGrad.addColorStop(1, '#6e4917');

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Micro-rings for authentic lathe turned metal effect
  ctx.save();
  for (let r = 80; r < maxRadius; r += 2) {
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.strokeStyle = (r % 6 === 0) ? 'rgba(90, 50, 10, 0.08)' : 'rgba(255, 245, 200, 0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  // Draw concentric borders
  const drawCircle = (radius: number, color = '#3d2508', width = 2) => {
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width * (size / 1024);
    ctx.stroke();
  };

  // Helper to rotate context and draw text on radial rings
  const drawRadialItem = (
    text: string,
    degree: number,
    radius: number,
    font: string,
    color = '#2a1a08',
    align: CanvasTextAlign = 'center'
  ) => {
    ctx.save();
    ctx.translate(center, center);
    // In our 3D space: 0° is North (top / -Y in canvas). Canvas 0 rad is +X.
    // So angle = (degree - 90) * Math.PI / 180
    const rad = (degree - 90) * (Math.PI / 180);
    ctx.rotate(rad);
    ctx.translate(radius, 0);
    ctx.rotate(Math.PI / 2); // Make text tangent to circle
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  // -------------------------------------------------------------------------
  // RING 1: Outer 360° Degrees scale (r: maxRadius - 10 to maxRadius)
  // -------------------------------------------------------------------------
  const rDegrees = maxRadius - 20 * (size / 1024);
  drawCircle(maxRadius, '#331a04', 3);
  drawCircle(rDegrees, '#552e0a', 1.5);

  ctx.save();
  for (let deg = 0; deg < 360; deg++) {
    const isMajor10 = deg % 10 === 0;
    const isMajor5 = deg % 5 === 0;
    const tickLen = (isMajor10 ? 16 : isMajor5 ? 10 : 5) * (size / 1024);

    const rad = (deg - 90) * (Math.PI / 180);
    const x1 = center + (maxRadius - tickLen) * Math.cos(rad);
    const y1 = center + (maxRadius - tickLen) * Math.sin(rad);
    const x2 = center + maxRadius * Math.cos(rad);
    const y2 = center + maxRadius * Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isMajor10 ? '#8a1c14' : isMajor5 ? '#3b1f06' : 'rgba(70, 35, 10, 0.6)';
    ctx.lineWidth = isMajor10 ? 2 : 1;
    ctx.stroke();

    // Degree numbers every 10°
    if (isMajor10) {
      drawRadialItem(
        deg.toString(),
        deg,
        maxRadius - 28 * (size / 1024),
        `bold ${Math.round(11 * (size / 1024))}px "Cinzel", "Times New Roman", serif`,
        deg === 0 || deg === 180 ? '#b31b1b' : '#3d2508'
      );
    }
  }
  ctx.restore();

  // -------------------------------------------------------------------------
  // RING 2: 28 Lunar Mansions (二十八星宿) (r: rDegrees - 40 to rDegrees - 8)
  // -------------------------------------------------------------------------
  const rMansion = rDegrees - 42 * (size / 1024);
  drawCircle(rMansion, '#552e0a', 1.5);

  let currentDeg = 0;
  LUNAR_MANSIONS_28.forEach((m) => {
    const mansionMid = currentDeg + m.spanDegrees / 2;
    const textColor = m.beast === '朱雀' ? '#a51810' : m.beast === '玄武' ? '#1c2833' : m.beast === '青龙' ? '#145a32' : '#6e2c00';
    drawRadialItem(
      m.name,
      mansionMid,
      rDegrees - 22 * (size / 1024),
      `bold ${Math.round(12 * (size / 1024))}px "STKaiti", "KaiTi", "Songti SC", serif`,
      textColor
    );

    // Mansion dividing line
    const rad = (currentDeg - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(center + rMansion * Math.cos(rad), center + rMansion * Math.sin(rad));
    ctx.lineTo(center + rDegrees * Math.cos(rad), center + rDegrees * Math.sin(rad));
    ctx.strokeStyle = 'rgba(100, 50, 15, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    currentDeg += m.spanDegrees;
  });

  // -------------------------------------------------------------------------
  // RING 3: 64 Hexagrams (六十四卦) (r: rMansion - 55)
  // -------------------------------------------------------------------------
  const rHex = rMansion - 52 * (size / 1024);
  drawCircle(rHex, '#552e0a', 1.5);

  const hexSpan = 360 / 64;
  for (let i = 0; i < 64; i++) {
    const deg = i * hexSpan + hexSpan / 2;
    const name = HEXAGRAMS_NAMES[i % HEXAGRAMS_NAMES.length];
    const isAuspicious = i % 3 === 0;

    drawRadialItem(
      name.slice(0, 2),
      deg,
      rMansion - 24 * (size / 1024),
      `${Math.round(8.5 * (size / 1024))}px "STKaiti", "KaiTi", "Songti SC", serif`,
      isAuspicious ? '#901810' : '#452b0d'
    );

    // Dividing lines
    const lineDeg = i * hexSpan;
    const rad = (lineDeg - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(center + rHex * Math.cos(rad), center + rHex * Math.sin(rad));
    ctx.lineTo(center + rMansion * Math.cos(rad), center + rMansion * Math.sin(rad));
    ctx.strokeStyle = 'rgba(110, 60, 20, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // -------------------------------------------------------------------------
  // RING 4: 120 Fenjin (百二十分金 - 甲子/丙子等)
  // -------------------------------------------------------------------------
  const rFenjin = rHex - 40 * (size / 1024);
  drawCircle(rFenjin, '#552e0a', 1.5);

  const fenjinLabels = ['甲子', '丙子', '戊子', '庚子', '壬子', '乙丑', '丁丑', '己丑', '辛丑', '癸丑'];
  for (let i = 0; i < 60; i++) {
    const deg = i * 6 + 3;
    const label = fenjinLabels[i % fenjinLabels.length];
    const isRed = i % 5 === 1 || i % 5 === 3; // 丙/庚分金为正旺珠宝线
    drawRadialItem(
      label[0],
      deg,
      rHex - 18 * (size / 1024),
      `${Math.round(8 * (size / 1024))}px "STKaiti", "KaiTi", serif`,
      isRed ? '#b31b1b' : '#573715'
    );
  }

  // -------------------------------------------------------------------------
  // RING 5: 24 Mountains (地盘正针二十四山) - HERO RING
  // 壬子癸 丑艮寅 甲卯乙 辰巽巳 丙午丁 未坤申 庚酉辛 戌乾亥
  // -------------------------------------------------------------------------
  const rMountainsInner = rFenjin - 68 * (size / 1024);
  drawCircle(rMountainsInner, '#4a2505', 2.5);

  // Fill mountain sectors with subtle auspicious vermilion vs aged brass backgrounds
  MOUNTAINS_24.forEach((m) => {
    const startRad = (m.degreeStart - 90) * (Math.PI / 180);
    const endRad = (m.degreeEnd - 90) * (Math.PI / 180);

    // Red mountain backgrounds for Yang mountains in traditional San Yuan
    if (m.yinYang === '阳') {
      ctx.beginPath();
      ctx.arc(center, center, rFenjin - 1, startRad, endRad);
      ctx.arc(center, center, rMountainsInner + 1, endRad, startRad, true);
      ctx.closePath();
      ctx.fillStyle = 'rgba(185, 40, 25, 0.18)';
      ctx.fill();
    }

    // Mountain divider radial line
    ctx.beginPath();
    ctx.moveTo(center + rMountainsInner * Math.cos(startRad), center + rMountainsInner * Math.sin(startRad));
    ctx.lineTo(center + rFenjin * Math.cos(startRad), center + rFenjin * Math.sin(startRad));
    ctx.strokeStyle = '#4a2505';
    ctx.lineWidth = 1.6 * (size / 1024);
    ctx.stroke();

    // Mountain Calligraphy Character
    const isCardinal = ['子', '午', '卯', '酉'].includes(m.name);
    const charColor = isCardinal ? '#ab1510' : m.yinYang === '阳' ? '#78150c' : '#2d1c0b';
    drawRadialItem(
      m.name,
      m.centerDegree,
      rFenjin - 34 * (size / 1024),
      `bold ${Math.round((isCardinal ? 24 : 20) * (size / 1024))}px "STKaiti", "KaiTi", "Songti SC", "SimSun", serif`,
      charColor
    );
  });

  // -------------------------------------------------------------------------
  // RING 6: Later Heaven Bagua (后天八卦 & 洛书数)
  // -------------------------------------------------------------------------
  const rBaguaInner = rMountainsInner - 54 * (size / 1024);
  drawCircle(rBaguaInner, '#552e0a', 2);

  TRIGRAMS_8.forEach((t) => {
    const startRad = (t.degreeStart - 90) * (Math.PI / 180);
    // Trigram divider
    ctx.beginPath();
    ctx.moveTo(center + rBaguaInner * Math.cos(startRad), center + rBaguaInner * Math.sin(startRad));
    ctx.lineTo(center + rMountainsInner * Math.cos(startRad), center + rMountainsInner * Math.sin(startRad));
    ctx.strokeStyle = '#6e390c';
    ctx.lineWidth = 1.8 * (size / 1024);
    ctx.stroke();

    const midDeg = (t.degreeStart + (t.degreeStart > t.degreeEnd ? t.degreeEnd + 360 : t.degreeEnd)) / 2;
    drawRadialItem(
      `${t.name}${t.loShuNumber}`,
      midDeg,
      rMountainsInner - 27 * (size / 1024),
      `bold ${Math.round(18 * (size / 1024))}px "STKaiti", "KaiTi", serif`,
      '#432308'
    );
  });

  // -------------------------------------------------------------------------
  // RING 7: Earlier Heaven Bagua Trigram Symbols (先天八卦爻象: ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷)
  // -------------------------------------------------------------------------
  const rTrigramInner = rBaguaInner - 45 * (size / 1024);
  drawCircle(rTrigramInner, '#3a1b04', 2.5);

  // Earlier Heaven trigrams: 南乾☰ 北坤☷ 东离☲ 西坎☵ 东北震☳ 西南巽☴ 东南兑☱ 西北艮☶
  const earlierTrigrams = [
    { symbol: '☷', name: '坤', deg: 0 },
    { symbol: '☳', name: '震', deg: 45 },
    { symbol: '☲', name: '离', deg: 90 },
    { symbol: '☱', name: '兑', deg: 135 },
    { symbol: '☰', name: '乾', deg: 180 },
    { symbol: '☴', name: '巽', deg: 225 },
    { symbol: '☵', name: '坎', deg: 270 },
    { symbol: '☶', name: '艮', deg: 315 },
  ];

  earlierTrigrams.forEach((et) => {
    drawRadialItem(
      et.symbol,
      et.deg,
      rBaguaInner - 22 * (size / 1024),
      `bold ${Math.round(26 * (size / 1024))}px serif`,
      et.name === '乾' || et.name === '坤' ? '#b31b1b' : '#3d2508'
    );
  });

  // -------------------------------------------------------------------------
  // RING 8: Heavenly Pool Outer Ring & Decorative Cloud Inlay (天池金边)
  // -------------------------------------------------------------------------
  drawCircle(rTrigramInner, '#b07f2b', 4);
  drawCircle(rTrigramInner - 10 * (size / 1024), '#5e370a', 2);

  // Delicate decorative dots around Heavenly Pool rim
  const poolDots = 72;
  for (let i = 0; i < poolDots; i++) {
    const dotDeg = (i * (360 / poolDots) - 90) * (Math.PI / 180);
    const dotR = rTrigramInner - 5 * (size / 1024);
    ctx.beginPath();
    ctx.arc(center + dotR * Math.cos(dotDeg), center + dotR * Math.sin(dotDeg), 2.5 * (size / 1024), 0, Math.PI * 2);
    ctx.fillStyle = '#f5d57f';
    ctx.fill();
    ctx.strokeStyle = '#5a340b';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Creates the Heavenly Pool bottom texture (海底双红线与十字坐标).
 * In authentic Chinese compasses, the bottom of the pool has a red sub-needle line (子午线)
 * with two red dots at the North (子) position for the needle tail to rest between.
 */
export function createHeavenlyPoolTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const center = size / 2;
  const r = size * 0.48;

  // Golden brass concave dish gradient
  const grad = ctx.createRadialGradient(center, center, 0, center, center, r);
  grad.addColorStop(0, '#f9eaae');
  grad.addColorStop(0.4, '#e7c770');
  grad.addColorStop(0.8, '#ba8b30');
  grad.addColorStop(1, '#66410e');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, r, 0, Math.PI * 2);
  ctx.fill();

  // Subtle concentric rings
  for (let rad = 20; rad < r; rad += 15) {
    ctx.beginPath();
    ctx.arc(center, center, rad, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 230, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Cross lines: East-West (faint) and North-South (red alignment line)
  // East-West line
  ctx.beginPath();
  ctx.moveTo(center - r * 0.85, center);
  ctx.lineTo(center + r * 0.85, center);
  ctx.strokeStyle = 'rgba(90, 50, 15, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // North-South RED needle alignment line (海底红线)
  ctx.beginPath();
  ctx.moveTo(center, center - r * 0.88); // North
  ctx.lineTo(center, center + r * 0.88); // South
  ctx.strokeStyle = '#c91910';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Two red alignment dots at the North position (海底双红线/双红点 - 指南针静止时沉底对齐)
  const northY = center - r * 0.65;
  ctx.beginPath();
  ctx.arc(center - 14, northY, 4, 0, Math.PI * 2);
  ctx.arc(center + 14, northY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#d6180c';
  ctx.fill();

  // "子" and "午" markings at top and bottom of pool
  ctx.font = 'bold 22px "STKaiti", "KaiTi", serif';
  ctx.fillStyle = '#b0180e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('子', center, center - r * 0.78);
  ctx.fillText('午', center, center + r * 0.78);

  ctx.font = 'bold 16px "STKaiti", "KaiTi", serif';
  ctx.fillStyle = 'rgba(70, 35, 10, 0.7)';
  ctx.fillText('卯', center + r * 0.78, center);
  ctx.fillText('酉', center - r * 0.78, center);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates rich aged rosewood / mahogany procedural texture for the square outer plate.
 */
export function createWoodTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep red mahogany base
  ctx.fillStyle = '#3a1309';
  ctx.fillRect(0, 0, size, size);

  // Procedural wood grain lines
  for (let y = 0; y < size; y += 2) {
    const wave = Math.sin(y * 0.04) * 8 + Math.cos(y * 0.015) * 12;
    const alpha = 0.04 + Math.random() * 0.08;
    const tone = Math.random() > 0.5 ? 'rgba(92, 32, 16, ' : 'rgba(28, 8, 4, ';
    ctx.fillStyle = `${tone}${alpha})`;
    ctx.fillRect(0, y + wave, size, 2 + Math.random() * 3);
  }

  // Soft vignette
  const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.75);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Inlaid brass corner filigree (traditional Chinese cloud / ruyi corner pattern)
  const drawCornerInlay = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#c89d45';
    ctx.lineWidth = 3;

    // Corner L-border
    ctx.beginPath();
    ctx.moveTo(15, 60);
    ctx.lineTo(15, 15);
    ctx.lineTo(60, 15);
    ctx.stroke();

    // Ruyi knot curve
    ctx.beginPath();
    ctx.arc(35, 35, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Corner rivet dot
    ctx.beginPath();
    ctx.arc(22, 22, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f3ca65';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  const margin = 20;
  drawCornerInlay(margin, margin, 0);
  drawCornerInlay(size - margin, margin, Math.PI / 2);
  drawCornerInlay(size - margin, size - margin, Math.PI);
  drawCornerInlay(margin, size - margin, (Math.PI * 3) / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
