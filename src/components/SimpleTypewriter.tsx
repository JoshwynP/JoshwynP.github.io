import { useEffect, useRef, useState } from 'react';

type SimpleTypewriterProps = {
  text?: string;
  typingSpeed?: number;
  startDelay?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
};

export default function SimpleTypewriter({
  text = '',
  typingSpeed = 24,
  startDelay = 0,
  className = '',
  cursor = true,
  onComplete,
}: SimpleTypewriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    const startTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (indexRef.current >= text.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setDone((wasDone) => {
            if (!wasDone) {
              onComplete?.();
            }
            return true;
          });
          return;
        }

        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
      }, Math.max(typingSpeed, 1));
    }, Math.max(startDelay, 0));

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, typingSpeed, startDelay, onComplete]);

  return (
    <p className={className}>
      {displayed}
      {cursor && !done && (
        <span className="inline-block w-[0.6ch] ml-[1px] animate-pulse">|</span>
      )}
    </p>
  );
}
