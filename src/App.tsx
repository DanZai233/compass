/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { LuopanCanvas } from './components/3d/LuopanCanvas';
import { CompassHUD } from './components/CompassHUD';
import { ARCameraBackground } from './components/ARCameraBackground';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { analyzeOrientation } from './data/luopanData';
import { CameraPreset, LightingPreset } from './types/compass';
import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  const {
    heading,
    pitch,
    roll,
    isSupported,
    permissionGranted,
    isActive,
    requestPermission,
    setManualHeading,
    calibrateOffset,
    toggleActive,
    offset,
  } = useDeviceOrientation();

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isARActive, setIsARActive] = useState<boolean>(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState<boolean>(true);

  // Compute classical Feng Shui analysis based on current heading
  const analysis = useMemo(() => {
    return analyzeOrientation(heading);
  }, [heading]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionBanner(false);
    }
    return granted;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0e0c0a] text-white">
      {/* Real-time AR Camera Pass-through (if activated) */}
      <ARCameraBackground
        isActive={isARActive}
        onClose={() => setIsARActive(false)}
      />

      {/* Main High-Fidelity 3D WebGL Luopan Scene */}
      <LuopanCanvas
        heading={heading}
        pitch={pitch}
        roll={roll}
        isGyroActive={isActive}
        cameraPreset={cameraPreset}
        lightingPreset={lightingPreset}
        isExploded={isExploded}
        onManualRotate={(delta) => setManualHeading((heading + delta + 360) % 360)}
      />

      {/* Ergonomic Non-Obstructive Compass HUD & Bottom Dock */}
      <CompassHUD
        analysis={analysis}
        heading={heading}
        pitch={pitch}
        roll={roll}
        isGyroActive={isActive}
        isGyroSupported={isSupported}
        permissionGranted={permissionGranted}
        onRequestPermission={handleRequestPermission}
        onToggleGyro={toggleActive}
        onManualHeadingChange={setManualHeading}
        cameraPreset={cameraPreset}
        onCameraPresetChange={setCameraPreset}
        lightingPreset={lightingPreset}
        onLightingPresetChange={setLightingPreset}
        isExploded={isExploded}
        onToggleExploded={setIsExploded}
        isARActive={isARActive}
        onToggleAR={() => setIsARActive((prev) => !prev)}
        offset={offset}
        onOffsetChange={calibrateOffset}
      />

      {/* iOS Safari First-Time Orientation Permission Notice */}
      {isSupported && !permissionGranted && showPermissionBanner && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-neutral-950/95 border border-amber-600/50 shadow-2xl rounded-2xl p-4 max-w-sm w-[90%] text-center z-50 pointer-events-auto backdrop-blur-md">
          <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-amber-300 mb-1">启用手机陀螺仪对齐</h3>
          <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
            点击授权开启设备方向传感器，罗盘将随手机转动实时精确对准天地二十四山与正南正北。
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleRequestPermission}
              className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all shadow-lg"
            >
              开启实时感应
            </button>
            <button
              onClick={() => setShowPermissionBanner(false)}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-2 rounded-xl text-xs transition-all"
            >
              手动拨盘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
