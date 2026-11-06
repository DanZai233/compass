import React, { useState } from 'react';
import {
  Compass,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Camera,
  Layers,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  Sun,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { LuopanAnalysis, CameraPreset, LightingPreset } from '../types/compass';
import { luopanAudio } from '../services/soundEffects';
import { MOUNTAINS_24 } from '../data/luopanData';

interface CompassHUDProps {
  analysis: LuopanAnalysis;
  heading: number;
  pitch: number;
  roll: number;
  isGyroActive: boolean;
  isGyroSupported: boolean;
  permissionGranted: boolean;
  onRequestPermission: () => Promise<boolean>;
  onToggleGyro: (active?: boolean) => void;
  onManualHeadingChange: (deg: number) => void;
  cameraPreset: CameraPreset;
  onCameraPresetChange: (preset: CameraPreset) => void;
  lightingPreset: LightingPreset;
  onLightingPresetChange: (preset: LightingPreset) => void;
  isExploded: boolean;
  onToggleExploded: (exploded: boolean) => void;
  isARActive: boolean;
  onToggleAR: () => void;
  offset: number;
  onOffsetChange: (offset: number) => void;
}

export const CompassHUD: React.FC<CompassHUDProps> = ({
  analysis,
  heading,
  pitch,
  roll,
  isGyroActive,
  isGyroSupported,
  permissionGranted,
  onRequestPermission,
  onToggleGyro,
  onManualHeadingChange,
  cameraPreset,
  onCameraPresetChange,
  lightingPreset,
  onLightingPresetChange,
  isExploded,
  onToggleExploded,
  isARActive,
  onToggleAR,
  offset,
  onOffsetChange,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'view' | 'calibrate'>('analysis');
  const [isMuted, setIsMuted] = useState(false);

  // Tilt magnitude for spirit level
  const tiltError = Math.sqrt(pitch * pitch + roll * roll);
  const isLevel = tiltError < 1.8;

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    luopanAudio.setMuted(next);
  };

  const handleStepDegree = (delta: number) => {
    onManualHeadingChange((heading + delta + 360) % 360);
  };

  const getAlignmentBadgeClass = () => {
    switch (analysis.alignmentType) {
      case '正针珠宝线':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case '兼向理气线':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case '空亡劫煞线':
      case '出卦大空亡':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-5 select-none font-sans overflow-hidden">
      {/* =========================================================================
          TOP SPEC BADGE & QUICK CONTROLS (Zero Viewport Occlusion)
          ========================================================================= */}
      <div className="w-full flex items-start justify-between gap-2 pointer-events-auto">
        {/* Left / Center Top Spec Badge */}
        <div className="bg-neutral-950/85 backdrop-blur-md border border-amber-700/40 rounded-2xl p-3 md:px-4 md:py-3 shadow-2xl shadow-black/80 flex flex-col gap-1.5 max-w-[calc(100%-110px)] md:max-w-md">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-200 tracking-tight font-mono">
              {heading.toFixed(1)}°
            </span>
            <span className="text-base md:text-lg font-bold text-amber-400">
              {analysis.facingMountain.name}山{analysis.sittingMountain.name}向
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full border bg-neutral-900/80 text-amber-200 border-amber-600/30">
              {analysis.facingMountain.directionName}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getAlignmentBadgeClass()}`}>
              {analysis.alignmentType}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
            <span className="text-amber-100 font-medium">
              {analysis.houseType}
            </span>
            <span className="text-neutral-500">|</span>
            <span>
              坐卦: {analysis.sittingTrigram.name} ({analysis.sittingTrigram.nature}) · 向卦: {analysis.facingTrigram.name} ({analysis.facingTrigram.nature})
            </span>
            <span className="text-neutral-500">|</span>
            {/* Level status */}
            <span className={`flex items-center gap-1 font-mono ${isLevel ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${isLevel ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              水准: {tiltError.toFixed(1)}° {isLevel ? '(已调平)' : '(略倾斜)'}
            </span>
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Gyroscope toggle / permission */}
          {isGyroSupported ? (
            !permissionGranted ? (
              <button
                onClick={() => onRequestPermission()}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                title="开启陀螺仪"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">启用感应</span>
              </button>
            ) : (
              <button
                onClick={() => onToggleGyro()}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                  isGyroActive
                    ? 'bg-amber-500/20 border-amber-500/70 text-amber-300'
                    : 'bg-neutral-900/80 border-neutral-700 text-neutral-400'
                }`}
                title={isGyroActive ? '陀螺仪实时跟随中 (点击锁盘)' : '已锁盘 (点击开启实时感应)'}
              >
                {isGyroActive ? <Compass className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4" />}
              </button>
            )
          ) : (
            <div className="bg-neutral-900/80 border border-neutral-800 text-neutral-400 text-xs px-2.5 py-2 rounded-xl">
              触控拨盘
            </div>
          )}

          {/* AR Camera toggle */}
          <button
            onClick={onToggleAR}
            className={`p-2.5 rounded-xl border text-xs flex items-center justify-center transition-all shadow-lg active:scale-95 ${
              isARActive
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-neutral-900/80 border-neutral-700 text-neutral-400'
            }`}
            title="AR实景穿透测向"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:text-white text-xs flex items-center justify-center transition-all shadow-lg active:scale-95"
            title={isMuted ? '开启音效' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          COLLAPSIBLE BOTTOM DOCK (Unified, Zero Occlusion)
          ========================================================================= */}
      <div className="w-full max-w-2xl mx-auto pointer-events-auto flex flex-col items-center gap-1.5 transition-all duration-300 ease-out">
        {/* Collapse Toggle Handle */}
        <button
          onClick={() => setIsDockCollapsed((prev) => !prev)}
          className="bg-neutral-950/85 hover:bg-neutral-900 border border-amber-600/40 text-amber-300 text-xs font-medium px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>展开立极盘</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>收起面板</span>
            </>
          )}
        </button>

        {/* Main Dock Container */}
        <div
          className={`w-full bg-neutral-950/92 backdrop-blur-xl border border-amber-600/35 rounded-3xl p-3 md:p-4 shadow-2xl shadow-black/90 transition-all duration-300 overflow-hidden flex flex-col ${
            isDockCollapsed ? 'h-0 p-0 border-0 opacity-0 pointer-events-none' : 'max-h-[58vh] opacity-100'
          }`}
        >
          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-amber-700/20 pb-2.5 mb-3 gap-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'analysis'
                    ? 'bg-amber-600 text-neutral-950 shadow-md shadow-amber-600/20'
                    : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>立极详析</span>
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'view'
                    ? 'bg-amber-600 text-neutral-950 shadow-md shadow-amber-600/20'
                    : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D把玩</span>
              </button>
              <button
                onClick={() => setActiveTab('calibrate')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'calibrate'
                    ? 'bg-amber-600 text-neutral-950 shadow-md shadow-amber-600/20'
                    : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>拨盘校准</span>
              </button>
            </div>

            {/* Quick bell test / lock button */}
            <button
              onClick={() => luopanAudio.playAuspiciousBell()}
              className="text-amber-400/80 hover:text-amber-300 text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-900"
              title="鸣磐吉音"
            >
              <span>鸣磐</span>
            </button>
          </div>

          {/* TAB CONTENT SCROLL AREA */}
          <div className="overflow-y-auto pr-1 text-neutral-300 space-y-3.5 custom-scrollbar text-xs">
            {/* TAB 1: 立极详析 */}
            {activeTab === 'analysis' && (
              <div className="space-y-3">
                {/* Mountain and Facing Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-2.5 flex flex-col gap-1">
                    <span className="text-[11px] text-neutral-400">朝向 (向山)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-amber-300">{analysis.facingMountain.name}山</span>
                      <span className="font-mono text-neutral-400">{analysis.facingDegree.toFixed(1)}°</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      五行: <span className="text-amber-200">{analysis.facingMountain.element}</span> ·
                      阴阳: <span className="text-amber-200">{analysis.facingMountain.yinYang}</span>
                    </span>
                  </div>

                  <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-2.5 flex flex-col gap-1">
                    <span className="text-[11px] text-neutral-400">坐山 (座山)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-amber-300">{analysis.sittingMountain.name}山</span>
                      <span className="font-mono text-neutral-400">{analysis.sittingDegree.toFixed(1)}°</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      五行: <span className="text-amber-200">{analysis.sittingMountain.element}</span> ·
                      阴阳: <span className="text-amber-200">{analysis.sittingMountain.yinYang}</span>
                    </span>
                  </div>
                </div>

                {/* Classical Judgement Text */}
                <div className="bg-amber-950/20 border border-amber-600/30 rounded-2xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      理气分金判词
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getAlignmentBadgeClass()}`}>
                      偏正针 {Math.abs(analysis.deviationFromCenter).toFixed(1)}°
                    </span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-xs">
                    {analysis.alignmentDescription}
                  </p>
                </div>

                {/* Ba Zhai 8 Mansions Palace Grid */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      八宅吉凶方位布局 ({analysis.houseType})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {analysis.baZhaiAuspicious.map((star, idx) => {
                      const isGood = star.level.includes('吉');
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border flex flex-col gap-0.5 ${
                            isGood
                              ? 'bg-emerald-950/20 border-emerald-600/30 text-emerald-200'
                              : 'bg-rose-950/20 border-rose-600/30 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{star.name.slice(0, 2)}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded ${
                                isGood ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {star.level}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400">{star.direction}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 3D 视角与把玩 */}
            {activeTab === 'view' && (
              <div className="space-y-3">
                {/* Camera presets */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-400 font-medium">罗盘视角预设</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'top', label: '正俯对齐', icon: Compass },
                      { id: 'perspective', label: '3D 把玩', icon: Maximize2 },
                      { id: 'pool', label: '天池特写', icon: Eye },
                      { id: 'exploded', label: '结构拆解', icon: Layers },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onCameraPresetChange(item.id as CameraPreset);
                          if (item.id === 'exploded') {
                            onToggleExploded(true);
                          } else if (isExploded) {
                            onToggleExploded(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          cameraPreset === item.id
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lighting ambience */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-neutral-400 font-medium">展台光影氛围</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'studio', label: '明堂展厅', icon: Sun },
                      { id: 'temple', label: '古刹道光', icon: Sparkles },
                      { id: 'candle', label: '沉香烛火', icon: Flame },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => onLightingPresetChange(l.id as LightingPreset)}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                          lightingPreset === l.id
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <l.icon className="w-3.5 h-3.5" />
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exploded View Toggle */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-200">分层解构模式 (Exploded View)</span>
                    <span className="text-[11px] text-neutral-400">
                      三维立交展示外盘、内盘、天池、红宝石顶针、天心十道与凸面透镜
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleExploded(!isExploded)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isExploded
                        ? 'bg-amber-500 text-neutral-950 border-amber-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                    }`}
                  >
                    {isExploded ? '已拆解' : '拆解罗盘'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: 拨盘校准 */}
            {activeTab === 'calibrate' && (
              <div className="space-y-3">
                {/* Manual Fine Tuning Buttons */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 font-medium">手动微调刻度</span>
                    <button
                      onClick={() => onManualHeadingChange(0)}
                      className="text-amber-400 hover:text-amber-300 text-[11px] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      复位归北 (0°)
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5">
                    {[-5, -1, -0.1, +0.1, +1, +5].map((delta) => (
                      <button
                        key={delta}
                        onClick={() => handleStepDegree(delta)}
                        className="py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-amber-600/40 text-neutral-200 font-mono text-xs active:scale-95 transition-all"
                      >
                        {delta > 0 ? `+${delta}` : delta}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick 24 Mountains Selector */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-neutral-400 font-medium">快速对准二十四山</span>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-1">
                    {MOUNTAINS_24.map((m) => (
                      <button
                        key={m.name}
                        onClick={() => onManualHeadingChange(m.centerDegree)}
                        className={`py-1.5 rounded-lg border text-xs font-serif transition-all ${
                          analysis.facingMountain.name === m.name
                            ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        {m.name}山
                      </button>
                    ))}
                  </div>
                </div>

                {/* Magnetic Declination Offset Slider */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-300">磁偏角补偿校正</span>
                    <span className="font-mono text-amber-300">{offset > 0 ? `+${offset}°` : `${offset}°`}</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    step="0.5"
                    value={offset}
                    onChange={(e) => onOffsetChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                    <span>西偏 -15°</span>
                    <span>正北 0°</span>
                    <span>东偏 +15°</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
