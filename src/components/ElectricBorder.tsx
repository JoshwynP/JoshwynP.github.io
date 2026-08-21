import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import './ElectricBorder.css';

type ElectricBorderProps = {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function ElectricBorder({
  children,
  color = '#5227FF',
  speed = 1,
  chaos = 1,
  thickness = 2,
  className,
  style,
}: ElectricBorderProps) {
  const filterId = `turbulent-displace-${useId().replace(/[:]/g, '')}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<HTMLDivElement>(null);

  const update = () => {
    const svg = svgRef.current;
    const root = rootRef.current;
    if (!svg || !root) return;

    if (strokeRef.current) {
      strokeRef.current.style.filter = `url(#${filterId})`;
    }

    const width = Math.max(1, Math.round(root.clientWidth || root.getBoundingClientRect().width));
    const height = Math.max(1, Math.round(root.clientHeight || root.getBoundingClientRect().height));

    const dyAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dy"]'));
    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute('values', `${height}; 0`);
      dyAnims[1].setAttribute('values', `0; -${height}`);
    }

    const dxAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dx"]'));
    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute('values', `${width}; 0`);
      dxAnims[1].setAttribute('values', `0; -${width}`);
    }

    const duration = Math.max(0.001, 6 / (speed || 1));
    [...dyAnims, ...dxAnims].forEach((anim) => anim.setAttribute('dur', `${duration}s`));

    const displacement = svg.querySelector('feDisplacementMap');
    displacement?.setAttribute('scale', String(30 * (chaos || 1)));

    const filter = svg.querySelector(`#${CSS.escape(filterId)}`);
    if (filter) {
      filter.setAttribute('x', '-200%');
      filter.setAttribute('y', '-200%');
      filter.setAttribute('width', '500%');
      filter.setAttribute('height', '500%');
    }

    requestAnimationFrame(() => {
      [...dyAnims, ...dxAnims].forEach((anim) => {
        if (typeof (anim as SVGAnimateElement).beginElement === 'function') {
          try {
            (anim as SVGAnimateElement).beginElement();
          } catch {
            console.warn('ElectricBorder: beginElement failed');
          }
        }
      });
    });
  };

  useEffect(() => {
    update();
  }, [speed, chaos]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver(() => update());
    observer.observe(rootRef.current);
    update();
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`electric-border ${className ?? ''}`}
      style={{ '--electric-border-color': color, '--eb-border-width': `${thickness}px`, ...style } as React.CSSProperties}
    >
      <svg ref={svgRef} className="eb-svg" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise3" seed="2" />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise4" seed="2" />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>
      <div className="eb-layers">
        <div ref={strokeRef} className="eb-stroke" />
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
}
