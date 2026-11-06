import { Mountain24, Trigram8, LunarMansion28, LuopanAnalysis } from '../types/compass';

export const MOUNTAINS_24: Mountain24[] = [
  { name: '子', pinyin: 'Zǐ', centerDegree: 0, degreeStart: 352.5, degreeEnd: 7.5, element: '水', yinYang: '阳', gua: '坎', directionName: '正北方' },
  { name: '癸', pinyin: 'Guǐ', centerDegree: 15, degreeStart: 7.5, degreeEnd: 22.5, element: '水', yinYang: '阴', gua: '坎', directionName: '北偏东' },
  { name: '丑', pinyin: 'Chǒu', centerDegree: 30, degreeStart: 22.5, degreeEnd: 37.5, element: '土', yinYang: '阴', gua: '艮', directionName: '东北偏北' },
  { name: '艮', pinyin: 'Gèn', centerDegree: 45, degreeStart: 37.5, degreeEnd: 52.5, element: '土', yinYang: '阳', gua: '艮', directionName: '东北方' },
  { name: '寅', pinyin: 'Yín', centerDegree: 60, degreeStart: 52.5, degreeEnd: 67.5, element: '木', yinYang: '阳', gua: '艮', directionName: '东北偏东' },
  { name: '甲', pinyin: 'Jiǎ', centerDegree: 75, degreeStart: 67.5, degreeEnd: 82.5, element: '木', yinYang: '阳', gua: '震', directionName: '东偏北' },
  { name: '卯', pinyin: 'Mǎo', centerDegree: 90, degreeStart: 82.5, degreeEnd: 97.5, element: '木', yinYang: '阴', gua: '震', directionName: '正东方' },
  { name: '乙', pinyin: 'Yǐ', centerDegree: 105, degreeStart: 97.5, degreeEnd: 112.5, element: '木', yinYang: '阴', gua: '震', directionName: '东偏南' },
  { name: '辰', pinyin: 'Chén', centerDegree: 120, degreeStart: 112.5, degreeEnd: 127.5, element: '土', yinYang: '阳', gua: '巽', directionName: '东南偏东' },
  { name: '巽', pinyin: 'Xùn', centerDegree: 135, degreeStart: 127.5, degreeEnd: 142.5, element: '木', yinYang: '阴', gua: '巽', directionName: '东南方' },
  { name: '巳', pinyin: 'Sì', centerDegree: 150, degreeStart: 142.5, degreeEnd: 157.5, element: '火', yinYang: '阴', gua: '巽', directionName: '东南偏南' },
  { name: '丙', pinyin: 'Bǐng', centerDegree: 165, degreeStart: 157.5, degreeEnd: 172.5, element: '火', yinYang: '阳', gua: '离', directionName: '南偏东' },
  { name: '午', pinyin: 'Wǔ', centerDegree: 180, degreeStart: 172.5, degreeEnd: 187.5, element: '火', yinYang: '阴', gua: '离', directionName: '正南方' },
  { name: '丁', pinyin: 'Dīng', centerDegree: 195, degreeStart: 187.5, degreeEnd: 202.5, element: '火', yinYang: '阴', gua: '离', directionName: '南偏西' },
  { name: '未', pinyin: 'Wèi', centerDegree: 210, degreeStart: 202.5, degreeEnd: 217.5, element: '土', yinYang: '阴', gua: '坤', directionName: '西南偏南' },
  { name: '坤', pinyin: 'Kūn', centerDegree: 225, degreeStart: 217.5, degreeEnd: 232.5, element: '土', yinYang: '阳', gua: '坤', directionName: '西南方' },
  { name: '申', pinyin: 'Shēn', centerDegree: 240, degreeStart: 232.5, degreeEnd: 247.5, element: '金', yinYang: '阳', gua: '坤', directionName: '西南偏西' },
  { name: '庚', pinyin: 'Gēng', centerDegree: 255, degreeStart: 247.5, degreeEnd: 262.5, element: '金', yinYang: '阳', gua: '兑', directionName: '西偏南' },
  { name: '酉', pinyin: 'Yǒu', centerDegree: 270, degreeStart: 262.5, degreeEnd: 277.5, element: '金', yinYang: '阴', gua: '兑', directionName: '正西方' },
  { name: '辛', pinyin: 'Xīn', centerDegree: 285, degreeStart: 277.5, degreeEnd: 292.5, element: '金', yinYang: '阴', gua: '兑', directionName: '西偏北' },
  { name: '戌', pinyin: 'Xū', centerDegree: 300, degreeStart: 292.5, degreeEnd: 307.5, element: '土', yinYang: '阳', gua: '乾', directionName: '西北偏西' },
  { name: '乾', pinyin: 'Qián', centerDegree: 315, degreeStart: 307.5, degreeEnd: 322.5, element: '金', yinYang: '阳', gua: '乾', directionName: '西北方' },
  { name: '亥', pinyin: 'Hài', centerDegree: 330, degreeStart: 322.5, degreeEnd: 337.5, element: '水', yinYang: '阴', gua: '乾', directionName: '西北偏北' },
  { name: '壬', pinyin: 'Rén', centerDegree: 345, degreeStart: 337.5, degreeEnd: 352.5, element: '水', yinYang: '阳', gua: '坎', directionName: '北偏西' },
];

export const TRIGRAMS_8: Trigram8[] = [
  { name: '坎', symbol: '☵', nature: '水', element: '水', direction: '正北', degreeStart: 337.5, degreeEnd: 22.5, loShuNumber: 1, family: '中男' },
  { name: '艮', symbol: '☶', nature: '山', element: '土', direction: '东北', degreeStart: 22.5, degreeEnd: 67.5, loShuNumber: 8, family: '少男' },
  { name: '震', symbol: '☳', nature: '雷', element: '木', direction: '正东', degreeStart: 67.5, degreeEnd: 112.5, loShuNumber: 3, family: '长男' },
  { name: '巽', symbol: '☴', nature: '风', element: '木', direction: '东南', degreeStart: 112.5, degreeEnd: 157.5, loShuNumber: 4, family: '长女' },
  { name: '离', symbol: '☲', nature: '火', element: '火', direction: '正南', degreeStart: 157.5, degreeEnd: 202.5, loShuNumber: 9, family: '中女' },
  { name: '坤', symbol: '☷', nature: '地', element: '土', direction: '西南', degreeStart: 202.5, degreeEnd: 247.5, loShuNumber: 2, family: '老母' },
  { name: '兑', symbol: '☱', nature: '泽', element: '金', direction: '正西', degreeStart: 247.5, degreeEnd: 292.5, loShuNumber: 7, family: '少女' },
  { name: '乾', symbol: '☰', nature: '天', element: '金', direction: '西北', degreeStart: 292.5, degreeEnd: 337.5, loShuNumber: 6, family: '老父' },
];

export const LUNAR_MANSIONS_28: LunarMansion28[] = [
  // 东宫苍龙
  { name: '角', animal: '木蛟', beast: '青龙', element: '木', spanDegrees: 12 },
  { name: '亢', animal: '金龙', beast: '青龙', element: '金', spanDegrees: 9 },
  { name: '氐', animal: '土貉', beast: '青龙', element: '土', spanDegrees: 16 },
  { name: '房', animal: '日兔', beast: '青龙', element: '火', spanDegrees: 5 },
  { name: '心', animal: '月狐', beast: '青龙', element: '火', spanDegrees: 8 },
  { name: '尾', animal: '火虎', beast: '青龙', element: '火', spanDegrees: 18 },
  { name: '箕', animal: '水豹', beast: '青龙', element: '水', spanDegrees: 10 },
  // 北宫玄武
  { name: '斗', animal: '木獬', beast: '玄武', element: '木', spanDegrees: 24 },
  { name: '牛', animal: '金牛', beast: '玄武', element: '金', spanDegrees: 7 },
  { name: '女', animal: '土蝠', beast: '玄武', element: '土', spanDegrees: 11 },
  { name: '虚', animal: '日鼠', beast: '玄武', element: '火', spanDegrees: 10 },
  { name: '危', animal: '月燕', beast: '玄武', element: '火', spanDegrees: 16 },
  { name: '室', animal: '火猪', beast: '玄武', element: '火', spanDegrees: 18 },
  { name: '壁', animal: '水貐', beast: '玄武', element: '水', spanDegrees: 9 },
  // 西宫白虎
  { name: '奎', animal: '木狼', beast: '白虎', element: '木', spanDegrees: 18 },
  { name: '娄', animal: '金狗', beast: '白虎', element: '金', spanDegrees: 12 },
  { name: '胃', animal: '土雉', beast: '白虎', element: '土', spanDegrees: 15 },
  { name: '昴', animal: '日鸡', beast: '白虎', element: '火', spanDegrees: 11 },
  { name: '毕', animal: '月乌', beast: '白虎', element: '火', spanDegrees: 16 },
  { name: '觜', animal: '火猴', beast: '白虎', element: '火', spanDegrees: 2 },
  { name: '参', animal: '水猿', beast: '白虎', element: '水', spanDegrees: 10 },
  // 南宫朱雀
  { name: '井', animal: '木犴', beast: '朱雀', element: '木', spanDegrees: 31 },
  { name: '鬼', animal: '金羊', beast: '朱雀', element: '金', spanDegrees: 3 },
  { name: '柳', animal: '土獐', beast: '朱雀', element: '土', spanDegrees: 14 },
  { name: '星', animal: '日马', beast: '朱雀', element: '火', spanDegrees: 7 },
  { name: '张', animal: '月鹿', beast: '朱雀', element: '火', spanDegrees: 18 },
  { name: '翼', animal: '火蛇', beast: '朱雀', element: '火', spanDegrees: 19 },
  { name: '轸', animal: '水蚓', beast: '朱雀', element: '水', spanDegrees: 18 },
];

export const HEXAGRAMS_NAMES = [
  '乾为天', '坤为地', '水雷屯', '山水蒙', '水天需', '天水讼', '地水师', '水地比',
  '风天小畜', '天泽履', '地天泰', '天地否', '天火同人', '火天大有', '地山谦', '雷地豫',
  '泽雷随', '山风蛊', '地泽临', '风地观', '火雷噬嗑', '山火贲', '山地剥', '地雷复',
  '天雷无妄', '山天大畜', '山雷颐', '泽风大过', '坎为水', '离为火', '泽山咸', '雷风恒',
  '天山遁', '雷天大壮', '火地晋', '地火明夷', '风火家人', '火泽睽', '水山蹇', '雷水解',
  '山泽损', '风雷益', '泽天夬', '天风姤', '泽地萃', '地风升', '泽水困', '水风井',
  '泽火革', '火风鼎', '震为雷', '艮为山', '风山渐', '归妹', '雷火丰', '火山旅',
  '巽为风', '兑为泽', '风水涣', '水泽节', '中孚', '小过', '水火既济', '火水未济'
];

/**
 * Normalize an angle into [0, 360)
 */
export function normalizeAngle(angle: number): number {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

/**
 * Given a heading (facing degree in [0, 360)), find the corresponding 24 mountain
 */
export function getMountainByDegree(degree: number): Mountain24 {
  const norm = normalizeAngle(degree);
  for (const m of MOUNTAINS_24) {
    if (m.degreeStart > m.degreeEnd) {
      // Handles 0° boundary for 子 (352.5° to 7.5°)
      if (norm >= m.degreeStart || norm < m.degreeEnd) return m;
    } else {
      if (norm >= m.degreeStart && norm < m.degreeEnd) return m;
    }
  }
  return MOUNTAINS_24[0];
}

/**
 * Given a heading, find the Trigram
 */
export function getTrigramByDegree(degree: number): Trigram8 {
  const norm = normalizeAngle(degree);
  for (const t of TRIGRAMS_8) {
    if (t.degreeStart > t.degreeEnd) {
      if (norm >= t.degreeStart || norm < t.degreeEnd) return t;
    } else {
      if (norm >= t.degreeStart && norm < t.degreeEnd) return t;
    }
  }
  return TRIGRAMS_8[0];
}

/**
 * Calculate complete Feng Shui analysis for current orientation
 */
export function analyzeOrientation(facingDegree: number): LuopanAnalysis {
  const facing = normalizeAngle(facingDegree);
  const sitting = normalizeAngle(facing + 180);

  const facingMountain = getMountainByDegree(facing);
  const sittingMountain = getMountainByDegree(sitting);
  const facingTrigram = getTrigramByDegree(facing);
  const sittingTrigram = getTrigramByDegree(sitting);

  // Calculate deviation from mountain center
  let diff = facing - facingMountain.centerDegree;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  const absDiff = Math.abs(diff);

  // San Yuan / San He precision line definitions:
  // Mountain span is 15°.
  // Center ±3.0°: 正针珠宝线 (Pure, highly auspicious)
  // 3.0° ~ 6.0°: 兼向理气线 (Acceptable with replacement star / Ti Gua)
  // 6.0° ~ 7.0°: 空亡线 / 差错线 (Inauspicious boundary)
  // > 7.0°: 出卦大空亡 (Cross-palace empty boundary, heavily inauspicious)
  let alignmentType: LuopanAnalysis['alignmentType'] = '正针珠宝线';
  let alignmentDescription = '立向纯正，气脉专一，得天地正向之吉气，主富贵绵长。';

  if (absDiff <= 3.0) {
    alignmentType = '正针珠宝线';
    alignmentDescription = '立向端正纯正，气场纯粹，主丁财两旺、平安吉昌。';
  } else if (absDiff <= 5.5) {
    alignmentType = '兼向理气线';
    alignmentDescription = '向兼三度内，气杂而带偏，宜以替卦诀法安门立极以化生克。';
  } else if (absDiff <= 6.8) {
    alignmentType = '空亡劫煞线';
    alignmentDescription = '阴阳差错交界，气场游移不稳，易招小人口舌与心神恍惚。';
  } else {
    alignmentType = '出卦大空亡';
    alignmentDescription = '正值两山卦气交界大空亡，气绝涣散，切勿立门作灶。';
  }

  // Ba Zhai (Eight Mansions) mapping according to sitting trigram (坐山八宅)
  const baZhaiMap: Record<string, { house: string; stars: { name: string; level: '大吉' | '次吉' | '中吉' | '小吉' | '大凶' | '次凶' | '中凶' | '小凶'; direction: string; description: string }[] }> = {
    坎: {
      house: '坎宅 (坐北朝南 · 水宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '东南方 (巽宫)', description: '精力充沛，事业腾飞，催官发富第一吉星' },
        { name: '延年 (武曲金)', level: '次吉', direction: '正南方 (离宫)', description: '身体康泰，夫妻和睦，增进人际贵人缘' },
        { name: '天医 (巨门土)', level: '中吉', direction: '正东方 (震宫)', description: '祛病延寿，心态祥和，利健康与学业' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '正北方 (坎宫)', description: '本位基石，平稳安泰，适合静修与安眠' },
        { name: '绝命 (破军金)', level: '大凶', direction: '西南方 (坤宫)', description: '灾厄多咎，官非口舌，严禁安门开灶' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '东北方 (艮宫)', description: '火燥不宁，贼盗破耗，心神不宁' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '西北方 (乾宫)', description: '桃花酒色，官讼暗箭，不利名誉' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '正西方 (兑宫)', description: '小人纠缠，虚耗财帛，易生是非' },
      ],
    },
    离: {
      house: '离宅 (坐南朝北 · 火宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '正东方 (震宫)', description: '财源广进，子孙贤达，欣欣向荣' },
        { name: '延年 (武曲金)', level: '次吉', direction: '正北方 (坎宫)', description: '福寿双全，家道昌隆，婚姻美满' },
        { name: '天医 (巨门土)', level: '中吉', direction: '东南方 (巽宫)', description: '体魄安康，贵人扶助，消灾解难' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '正南方 (离宫)', description: '家宅安宁，平顺无虞，厚积薄发' },
        { name: '绝命 (破军金)', level: '大凶', direction: '西北方 (乾宫)', description: '金火相克，主损伤破财' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '正西方 (兑宫)', description: '意外虚惊，不利财运' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '西南方 (坤宫)', description: '口舌纷扰，精神困倦' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '东北方 (艮宫)', description: '小病缠身，破耗琐碎' },
      ],
    },
    震: {
      house: '震宅 (坐东朝西 · 木宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '正南方 (离宫)', description: '宏图大展，财禄丰厚，官运亨通' },
        { name: '延年 (武曲金)', level: '次吉', direction: '东南方 (巽宫)', description: '福禄长寿，诸事平顺' },
        { name: '天医 (巨门土)', level: '中吉', direction: '正北方 (坎宫)', description: '身体安泰，心旷神怡' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '正东方 (震宫)', description: '根基稳固，修养身心' },
        { name: '绝命 (破军金)', level: '大凶', direction: '正西方 (兑宫)', description: '正克本体，凶险破败之位' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '西北方 (乾宫)', description: '财源受损，心绪焦躁' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '东北方 (艮宫)', description: '波折起伏，是非暗算' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '西南方 (坤宫)', description: '劳碌奔波，进益微薄' },
      ],
    },
    兑: {
      house: '兑宅 (坐西朝东 · 金宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '西北方 (乾宫)', description: '乾兑相生，威权兼备，富足荣昌' },
        { name: '延年 (武曲金)', level: '次吉', direction: '东北方 (艮宫)', description: '家宅安泰，金玉满堂' },
        { name: '天医 (巨门土)', level: '中吉', direction: '西南方 (坤宫)', description: '土生金旺，益寿延年' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '正西方 (兑宫)', description: '喜气洋洋，静谧温和' },
        { name: '绝命 (破军金)', level: '大凶', direction: '正东方 (震宫)', description: '金木相战，损丁败财' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '正南方 (离宫)', description: '火克金宅，横生波折' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '东南方 (巽宫)', description: '风雨漂泊，破耗难安' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '正北方 (坎宫)', description: '虚耗资财，纠缠难解' },
      ],
    },
    乾: {
      house: '乾宅 (坐西北朝东南 · 金宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '正西方 (兑宫)', description: '金水相涵，才思敏捷，大发横财' },
        { name: '延年 (武曲金)', level: '次吉', direction: '西南方 (坤宫)', description: '父母健旺，门楣光大' },
        { name: '天医 (巨门土)', level: '中吉', direction: '东北方 (艮宫)', description: '安康无虞，学业有成' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '西北方 (乾宫)', description: '首领尊位，威仪自持' },
        { name: '绝命 (破军金)', level: '大凶', direction: '正南方 (离宫)', description: '离火灼金，损目受制' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '正东方 (震宫)', description: '暗疾滋生，盗耗破财' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '正北方 (坎宫)', description: '心思浮躁，难守家业' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '东南方 (巽宫)', description: '小人口舌，阻碍重重' },
      ],
    },
    坤: {
      house: '坤宅 (坐西南朝东北 · 土宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '东北方 (艮宫)', description: '厚德载物，地天交泰，福泽深厚' },
        { name: '延年 (武曲金)', level: '次吉', direction: '西北方 (乾宫)', description: '地天相泰，阴阳调和，夫妻偕老' },
        { name: '天医 (巨门土)', level: '中吉', direction: '正西方 (兑宫)', description: '生机勃勃，益寿延年' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '西南方 (坤宫)', description: '含弘光大，宽厚平安' },
        { name: '绝命 (破军金)', level: '大凶', direction: '正北方 (坎宫)', description: '水土相冲，病痛缠身' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '东南方 (巽宫)', description: '虚耗无常，是非丛生' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '正南方 (离宫)', description: '耗损气血，六亲疏离' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '正东方 (震宫)', description: '木克土困，官符破耗' },
      ],
    },
    艮: {
      house: '艮宅 (坐东北朝西南 · 土宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '西南方 (坤宫)', description: '山地交泰，财丰丁旺，基业常青' },
        { name: '延年 (武曲金)', level: '次吉', direction: '正西方 (兑宫)', description: '吉庆祥和，声名远扬' },
        { name: '天医 (巨门土)', level: '中吉', direction: '西北方 (乾宫)', description: '贵人提携，身心舒畅' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '东北方 (艮宫)', description: '安如泰山，笃实敦厚' },
        { name: '绝命 (破军金)', level: '大凶', direction: '东南方 (巽宫)', description: '木土克伐，凶灾破产' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '正北方 (坎宫)', description: '坎艮相冲，阴寒冷退' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '正东宫 (震宫)', description: '兄弟不睦，浮沉不常' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '正南方 (离宫)', description: '虚花难实，积蓄耗散' },
      ],
    },
    巽: {
      house: '巽宅 (坐东南朝西北 · 木宅)',
      stars: [
        { name: '生气 (贪狼木)', level: '大吉', direction: '正北方 (坎宫)', description: '水生木发，聪明博学，功名显达' },
        { name: '延年 (武曲金)', level: '次吉', direction: '正东方 (震宫)', description: '雷风相薄，情深义重，家肥屋润' },
        { name: '天医 (巨门土)', level: '中吉', direction: '正南方 (离宫)', description: '木火通明，文章焕彩，福寿增荣' },
        { name: '伏位 (辅弼木)', level: '小吉', direction: '东南方 (巽宫)', description: '和顺清平，从容不迫' },
        { name: '绝命 (破军金)', level: '大凶', direction: '东北方 (艮宫)', description: '风山相隔，损幼失财' },
        { name: '五鬼 (廉贞火)', level: '次凶', direction: '西南方 (坤宫)', description: '风刮地裂，母子多尤' },
        { name: '六煞 (文曲水)', level: '中凶', direction: '正西方 (兑宫)', description: '金木肃杀，官非不断' },
        { name: '祸害 (禄存土)', level: '小凶', direction: '西北方 (乾宫)', description: '乾金伐木，损伤筋骨' },
      ],
    },
  };

  const houseData = baZhaiMap[sittingTrigram.name] || baZhaiMap['坎'];

  return {
    facingDegree: facing,
    sittingDegree: sitting,
    facingMountain,
    sittingMountain,
    deviationFromCenter: diff,
    alignmentType,
    alignmentDescription,
    facingTrigram,
    sittingTrigram,
    houseType: houseData.house,
    baZhaiAuspicious: houseData.stars,
  };
}
