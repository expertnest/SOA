"use client";

import { useEffect, useState } from "react";

export default function useIsMobile() {
  const [hideSidebars, setHideSidebars] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const ua = (navigator.userAgent || navigator.vendor || (window as any).opera).toLowerCase();

      const isPhone = /android|iphone|ipod|windows phone/i.test(ua);
      const isIPad = /ipad/i.test(ua);
      const isModernIPad = ua.includes("macintosh") && "ontouchend" in document;

      const isTablet = isIPad || isModernIPad;

      // Default: hide for phones
      if (isPhone) {
        setHideSidebars(true);
        return;
      }

      // For tablets
      if (isTablet) {
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const isLarge = window.innerWidth >= 1024; // treat iPad Pro as "large"
        
        if (isLarge && isLandscape) {
          // iPad Pro in landscape → show sidebars
          setHideSidebars(false);
        } else {
          // Otherwise (portrait or smaller tablets) → hide
          setHideSidebars(true);
        }
        return;
      }

      // Desktop: always show sidebars
      setHideSidebars(false);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  return hideSidebars;
}
