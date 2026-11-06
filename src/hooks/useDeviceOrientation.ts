import { useState, useEffect, useRef, useCallback } from 'react';
import { OrientationData } from '../types/compass';
import { normalizeAngle } from '../data/luopanData';
import { luopanAudio } from '../services/soundEffects';

interface UseDeviceOrientationReturn extends OrientationData {
  requestPermission: () => Promise<boolean>;
  setManualHeading: (heading: number) => void;
  calibrateOffset: (offset: number) => void;
  toggleActive: (active?: boolean) => void;
  offset: number;
}

export function useDeviceOrientation(): UseDeviceOrientationReturn {
  const [heading, setHeading] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [roll, setRoll] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);

  // Filtered values for jitter reduction
  const smoothedHeading = useRef<number>(0);
  const lastTickHeading = useRef<number>(0);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);

      // Check if permission is needed (iOS 13+)
      const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof DeviceOrientation.requestPermission !== 'function') {
        // Android or non-iOS browsers grant permission by default
        setPermissionGranted(true);
      }
    }
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (!isActive) return;

    let compassHeading: number | null = null;
    const evt = event as DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };

    // iOS provides direct compass heading (0 = True North)
    if (typeof evt.webkitCompassHeading === 'number' && !isNaN(evt.webkitCompassHeading)) {
      compassHeading = evt.webkitCompassHeading;
      if (typeof evt.webkitCompassAccuracy === 'number') {
        setAccuracy(evt.webkitCompassAccuracy);
      }
    } else if (event.alpha !== null && !isNaN(event.alpha)) {
      // Standard W3C orientation: alpha is rotation around Z axis
      // In standard browsers, compass heading is 360 - alpha
      compassHeading = (360 - event.alpha) % 360;
    }

    // Screen orientation offset (portrait vs landscape)
    let screenAngle = 0;
    if (typeof window !== 'undefined') {
      if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
        screenAngle = window.screen.orientation.angle;
      } else if (typeof window.orientation === 'number') {
        screenAngle = window.orientation;
      }
    }

    if (compassHeading !== null) {
      let finalHeading = normalizeAngle(compassHeading + screenAngle + offset);

      // Low pass filter to remove high-frequency hand jitter
      let diff = finalHeading - smoothedHeading.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      // Exponential damping
      smoothedHeading.current = normalizeAngle(smoothedHeading.current + diff * 0.25);
      setHeading(smoothedHeading.current);

      // Trigger audio tick every ~15 degrees (approx 1 mountain)
      if (Math.abs(smoothedHeading.current - lastTickHeading.current) >= 15) {
        luopanAudio.playTick(1.0);
        lastTickHeading.current = smoothedHeading.current;
      }
    }

    if (event.beta !== null) {
      setPitch(event.beta);
    }
    if (event.gamma !== null) {
      setRoll(event.gamma);
    }
  }, [isActive, offset]);

  // Request permission (iOS requirement)
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          return true;
        } else {
          setPermissionGranted(false);
          return false;
        }
      } catch (err) {
        console.warn('Orientation permission error:', err);
        return false;
      }
    } else {
      setPermissionGranted(true);
      return true;
    }
  }, []);

  // Listen to orientation events
  useEffect(() => {
    if (!permissionGranted || !isActive) return;

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [permissionGranted, isActive, handleOrientation]);

  const setManualHeading = useCallback((newHeading: number) => {
    const norm = normalizeAngle(newHeading);
    smoothedHeading.current = norm;
    setHeading(norm);

    if (Math.abs(norm - lastTickHeading.current) >= 15) {
      luopanAudio.playTick(1.0);
      lastTickHeading.current = norm;
    }
  }, []);

  const calibrateOffset = useCallback((newOffset: number) => {
    setOffset(normalizeAngle(newOffset));
  }, []);

  const toggleActive = useCallback((active?: boolean) => {
    setIsActive(prev => {
      const next = active !== undefined ? active : !prev;
      luopanAudio.playLockSound(!next);
      return next;
    });
  }, []);

  return {
    heading,
    pitch,
    roll,
    accuracy,
    isSupported,
    permissionGranted,
    isActive,
    requestPermission,
    setManualHeading,
    calibrateOffset,
    toggleActive,
    offset,
  };
}
