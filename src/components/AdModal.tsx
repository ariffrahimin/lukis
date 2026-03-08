import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface AdModalProps {
  open: boolean;
  onClose: () => void;
  onDismiss: () => void;
  format: 'png' | 'json' | 'gif' | null;
}

const COUNTDOWN_SECONDS = 5;

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const AdModal = ({ open, onClose, onDismiss, format }: AdModalProps) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const adRef = useRef<HTMLModElement>(null);
  const adPushed = useRef(false);

  // Reset countdown when modal opens
  useEffect(() => {
    if (open) {
      setCountdown(COUNTDOWN_SECONDS);
      adPushed.current = false;
    }
  }, [open]);

  // Countdown timer
  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [open, countdown]);

  // Push ad unit when modal opens
  useEffect(() => {
    if (!open || adPushed.current) return;
    adPushed.current = true;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense not loaded (dev environment)
    }
  }, [open]);

  const canDownload = countdown <= 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onDismiss(); }}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Your export is ready</DialogTitle>
          <DialogDescription>
            Please wait while we prepare your {format?.toUpperCase()} file.
          </DialogDescription>
        </DialogHeader>

        {/* Google AdSense unit */}
        <div className="w-full min-h-[100px] flex items-center justify-center bg-muted/30 rounded-md overflow-hidden">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '100px' }}
            data-ad-client="ca-pub-1861200776544038"
            data-ad-slot="9303186351"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            disabled={!canDownload}
            className="w-full"
          >
            {canDownload
              ? `Download ${format?.toUpperCase()}`
              : `Please wait… (${countdown}s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
