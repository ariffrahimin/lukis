import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const AdBanner = () => {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense not loaded (dev environment)
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 h-[90px] bg-toolbar-bg/95 backdrop-blur-xl border-t border-border flex items-center justify-center pointer-events-auto">
      <span className="absolute top-1 right-2 text-[9px] text-muted-foreground/40 uppercase tracking-widest select-none">
        Sponsored
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '90px' }}
        data-ad-client="ca-pub-1861200776544038"
        data-ad-slot="9303186351"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
