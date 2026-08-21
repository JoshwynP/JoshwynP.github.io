declare module './components/BlurText' {
  import type { FC } from 'react';

  type BlurTextProps = {
    text?: string;
    delay?: number;
    className?: string;
    animateBy?: string;
    direction?: string;
    threshold?: number;
    rootMargin?: string;
    animationFrom?: Record<string, unknown>;
    animationTo?: Record<string, unknown>[];
    easing?: (value: number) => number;
    onAnimationComplete?: () => void;
    stepDuration?: number;
  };

  const BlurText: FC<BlurTextProps>;
  export default BlurText;
}

declare module './components/LiquidEther' {
  import type { FC, CSSProperties } from 'react';

  type LiquidEtherProps = {
    mouseForce?: number;
    cursorSize?: number;
    isViscous?: boolean;
    viscous?: number;
    iterationsViscous?: number;
    iterationsPoisson?: number;
    dt?: number;
    BFECC?: boolean;
    resolution?: number;
    isBounce?: boolean;
    colors?: string[];
    style?: CSSProperties;
    className?: string;
    autoDemo?: boolean;
    autoSpeed?: number;
    autoIntensity?: number;
    takeoverDuration?: number;
    autoResumeDelay?: number;
    autoRampDuration?: number;
  };

  const LiquidEther: FC<LiquidEtherProps>;
  export default LiquidEther;
}

declare module './components/StaggeredMenu' {
  import type { FC } from 'react';

  export type MenuItem = {
    label: string;
    link: string;
    ariaLabel?: string;
  };

  type StaggeredMenuProps = {
    position?: string;
    colors?: string[];
    items?: MenuItem[];
    socialItems?: MenuItem[];
    displaySocials?: boolean;
    displayItemNumbering?: boolean;
    className?: string;
    logoUrl?: string;
    menuButtonColor?: string;
    openMenuButtonColor?: string;
    accentColor?: string;
    changeMenuColorOnOpen?: boolean;
    isFixed?: boolean;
    closeOnClickAway?: boolean;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
    onNavigate?: (item: MenuItem) => boolean | void;
    onLogoClick?: () => void;
  };

  export const StaggeredMenu: FC<StaggeredMenuProps>;
}
