import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface ARCameraBackgroundProps {
  isActive: boolean;
  onClose: () => void;
}

export const ARCameraBackground: React.FC<ARCameraBackgroundProps> = ({ isActive, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setHasPermission(false);
      setErrorMsg(null);
      return;
    }

    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
          setHasPermission(true);
          setErrorMsg(null);
        }
      } catch (err: unknown) {
        console.warn('Camera access error:', err);
        setErrorMsg('无法访问后置摄像头，请检查浏览器相机权限。');
        setHasPermission(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="w-full h-full object-cover opacity-80"
      />
      {errorMsg && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-neutral-900/90 text-amber-200 border border-amber-600/40 px-4 py-2 rounded-lg text-xs flex items-center gap-2 pointer-events-auto">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{errorMsg}</span>
          <button
            onClick={onClose}
            className="ml-2 text-neutral-400 hover:text-white px-1.5 py-0.5 rounded bg-neutral-800"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
};
