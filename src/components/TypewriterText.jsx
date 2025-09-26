import { useEffect, useRef, useState } from 'react';

export default function TypewriterText({
  text = '',
  typingSpeed = 24, // ms per character
  startDelay = 0,
  className = '',
  cursor = true,
  onComplete,
}) {
  const [output, setOutput] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setOutput('');
    setDone(false);
    indexRef.current = 0;

    const startTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        setOutput(prev => {
          if (indexRef.current >= text.length) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            if (!done) {
              setDone(true);
              onComplete?.();
            }
            return prev;
          }
          const nextIndex = indexRef.current + 1;
          indexRef.current = nextIndex;
          return text.slice(0, nextIndex);
        });
      }, Math.max(typingSpeed, 1));
    }, Math.max(startDelay, 0));

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, typingSpeed, startDelay]);

  return (
    <p className={className}>
      {output}
      {cursor && !done && <span className="inline-block w-[0.6ch] ml-[1px] animate-pulse">|</span>}
    </p>
  );
}
