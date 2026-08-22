'use client';

import { useSyncExternalStore } from 'react';

export interface DeviceCapability {
  isMobile: boolean;
  isTablet: boolean;
  isLowPower: boolean;
  starCount: number;
  dpr: number;
}

const DEFAULT_SERVER_CAPABILITY: DeviceCapability = {
  isMobile: false,
  isTablet: false,
  isLowPower: false,
  starCount: 3500,
  dpr: 1.5,
};

let cachedCapability: DeviceCapability = DEFAULT_SERVER_CAPABILITY;
let lastWidth = 0;

function computeCapability(): DeviceCapability {
  if (typeof window === 'undefined') return DEFAULT_SERVER_CAPABILITY;

  const width = window.innerWidth;
  if (width === lastWidth && cachedCapability !== DEFAULT_SERVER_CAPABILITY) {
    return cachedCapability;
  }
  lastWidth = width;

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isLowPower = (navigator.hardwareConcurrency || 4) <= 4 || isMobile;

  cachedCapability = {
    isMobile,
    isTablet,
    isLowPower,
    starCount: isMobile ? 1200 : isTablet ? 2200 : 4000,
    dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
  };

  return cachedCapability;
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getSnapshot(): DeviceCapability {
  return computeCapability();
}

function getServerSnapshot(): DeviceCapability {
  return DEFAULT_SERVER_CAPABILITY;
}

export function useDeviceCapability(): DeviceCapability {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
