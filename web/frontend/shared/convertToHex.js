export function hbsaToHex(hbsa) {
  const { hue, brightness, saturation, alpha } = hbsa;

  const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const toHex = (value) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const h = hue / 360;
  const s = saturation / 100;
  const v = brightness / 100;

  let r, g, b;
  if (s === 0) {
    r = g = b = v;
  } else {
    const q = v < 0.5 ? v * (1 + s) : v + s - v * s;
    const p = 2 * v - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  const blendedR = Math.round((1 - alpha) * 255 + alpha * r * 255);
  const blendedG = Math.round((1 - alpha) * 255 + alpha * g * 255);
  const blendedB = Math.round((1 - alpha) * 255 + alpha * b * 255);

  const red = toHex(blendedR);
  const green = toHex(blendedG);
  const blue = toHex(blendedB);

  return `#${red}${green}${blue}`;
}