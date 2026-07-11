/**
 * توابع خالص: محاسبه‌ی رنگ متن مناسب (سفید/تیره) روی پس‌زمینه‌ی تمِ کارت.
 * وابسته به DOM نیست — طبق قانون ۷ Constitution قابل تست است.
 */
import themes from '@/config/themes.json';

export type Theme = { id: string; kind: string; css: string; base: string };

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function getContrastColor(hexColor: string): string {
  try {
    const lum = relativeLuminance(hexToRgb(hexColor));
    return lum > 0.5 ? '#1F2430' : '#FFFFFF';
  } catch {
    return '#FFFFFF';
  }
}

export function getThemeById(id: string): Theme {
  return (themes as Theme[]).find((t) => t.id === id) || (themes as Theme[])[0];
}

export function resolveTheme(themeId: string) {
  const theme = getThemeById(themeId);
  return { background: theme.css, textColor: getContrastColor(theme.base), themeId: theme.id };
}

export { themes };
