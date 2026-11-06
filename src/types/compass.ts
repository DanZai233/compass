/**
 * Feng Shui Luopan Type Definitions
 */

export type ElementType = '金' | '木' | '水' | '火' | '土';
export type YinYang = '阴' | '阳';

export interface Mountain24 {
  name: string;
  pinyin: string;
  degreeStart: number;
  degreeEnd: number;
  centerDegree: number;
  element: ElementType;
  yinYang: YinYang;
  gua: string; // 八卦对应
  directionName: string; // e.g. 正北、东北偏北
}

export interface Trigram8 {
  name: string;
  symbol: string;
  nature: string;
  element: ElementType;
  direction: string;
  degreeStart: number;
  degreeEnd: number;
  loShuNumber: number;
  family: string;
}

export interface Hexagram64 {
  name: string;
  upper: string;
  lower: string;
  degree: number;
  auspicious: boolean;
}

export interface LunarMansion28 {
  name: string;
  animal: string;
  beast: '青龙' | '朱雀' | '白虎' | '玄武';
  element: ElementType;
  spanDegrees: number;
}

export interface OrientationData {
  heading: number; // 0 - 360 (compass degree)
  pitch: number; // front/back tilt (beta: -180 to 180)
  roll: number; // left/right tilt (gamma: -90 to 90)
  accuracy?: number;
  isSupported: boolean;
  permissionGranted: boolean;
  isActive: boolean;
}

export interface LuopanAnalysis {
  facingDegree: number;
  sittingDegree: number;
  facingMountain: Mountain24;
  sittingMountain: Mountain24;
  deviationFromCenter: number; // 偏离正针度数 (-7.5 to +7.5)
  alignmentType: '正针珠宝线' | '兼向理气线' | '空亡劫煞线' | '出卦大空亡';
  alignmentDescription: string;
  facingTrigram: Trigram8;
  sittingTrigram: Trigram8;
  houseType: string; // e.g. "坎宅 (坐北朝南)"
  baZhaiAuspicious: {
    name: string; // e.g. "生气 (贪狼木)"
    level: '大吉' | '次吉' | '中吉' | '小吉' | '大凶' | '次凶' | '中凶' | '小凶';
    direction: string;
    description: string;
  }[];
}

export type CompassMode = 'comprehensive' | 'sanyuan' | 'sanhe';
export type CameraPreset = 'top' | 'perspective' | 'pool' | 'exploded';
export type LightingPreset = 'studio' | 'temple' | 'candle';
