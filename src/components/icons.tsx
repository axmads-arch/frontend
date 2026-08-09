// src/components/icons.tsx
// Ilova bo'ylab ishlatiladigan barcha SVG ikonkalar — bitta joyda.
// Avval Home.js va Cart.js ikkalasida bir xil ikonkalar nusxalangan edi (DRY tamoyiliga zid edi).

import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

export const IconChat: React.FC<IconProps> = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 4h16v12H8l-4 4V4z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconMoon: React.FC<IconProps> = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20 14.5A8.5 8.5 0 119.5 4 6.8 6.8 0 0020 14.5z" fill={color} />
  </svg>
);

export const IconSun: React.FC<IconProps> = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4.5" fill={color} />
    <g stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
    </g>
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M20 20l-4.3-4.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

interface IconHeartProps extends IconProps {
  filled?: boolean;
}
export const IconHeart: React.FC<IconHeartProps> = ({ size = 18, filled = false, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20s-7-4.35-9.5-8.8C.8 7.6 2.5 4 6.2 4 8.4 4 10 5.2 12 7.3 14 5.2 15.6 4 17.8 4c3.7 0 5.4 3.6 3.7 7.2C19 15.65 12 20 12 20z"
      fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinejoin="round"
    />
  </svg>
);

export const IconPlus: React.FC<IconProps> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const IconMinus: React.FC<IconProps> = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const IconRocket: React.FC<IconProps> = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2c3 1.5 5 4.8 5 9 0 2-.6 3.8-1.6 5.2L12 13.5l-3.4 2.7C7.6 14.8 7 13 7 11c0-4.2 2-7.5 5-9z" fill={color} />
    <circle cx="12" cy="9.5" r="1.6" fill="var(--green)" />
    <path d="M8.5 15l-2 4 3.3-1.7M15.5 15l2 4-3.3-1.7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconClock: React.FC<IconProps> = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M12 7v5l3.5 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

// Material Symbol komponenti — faqat shrift kerak bo'lgan kam-muhim ikonkalar uchun
// (masalan "search_off" kabi bo'sh natija holatlari, chunki bu joyda ikonka
// yuklanmasa ham funksionallikka ta'sir qilmaydi)
interface MsProps {
  icon: string;
  size?: number;
  fill?: 0 | 1;
  color?: string;
}
export const Ms: React.FC<MsProps> = ({ icon, size = 22, fill = 1, color = 'currentColor' }) => (
  <span
    style={{
      fontFamily: 'Material Symbols Rounded',
      fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      fontSize: size,
      lineHeight: 1,
      display: 'inline-block',
      userSelect: 'none',
      color,
    }}
  >
    {icon}
  </span>
);
