import { describe, expect, test } from 'vitest';
import { darkenColor, formatColor, mapColors, parseColor } from './map-style-colors.mjs';

describe('parseColor', () => {
  test('reads rgb, rgba, hsl and hex', () => {
    expect(parseColor('rgb(255, 0, 0)')).toMatchObject({ h: 0, s: 1, l: 0.5, a: 1 });
    expect(parseColor('rgba(0,0,0,0.6)')).toMatchObject({ l: 0, a: 0.6 });
    expect(parseColor('hsl(220, 10%, 82%)')).toEqual({ h: 220, s: 0.1, l: 0.82, a: 1 });
    expect(parseColor('#fff')).toMatchObject({ l: 1, a: 1 });
  });

  test('ignores everything else', () => {
    expect(parseColor('forest')).toBeUndefined();
    expect(parseColor(12)).toBeUndefined();
  });
});

describe('formatColor', () => {
  test('round-trips through hsl', () => {
    expect(formatColor(parseColor('rgba(31, 42, 58, 0.5)'))).toBe('rgba(31, 42, 58, 0.5)');
  });
});

describe('darkenColor', () => {
  test('turns a white background dark and dark text light', () => {
    expect(darkenColor(parseColor('rgb(252,252,252)')).l).toBeLessThan(0.2);
    expect(darkenColor(parseColor('rgba(64, 64, 64, 1)')).l).toBeGreaterThan(0.6);
  });

  test('puts areas just above the ground and shaded slopes below it', () => {
    const ground = darkenColor(parseColor('rgb(252,252,252)'), 'surface').l;
    const forest = darkenColor(parseColor('rgb(186, 210, 172)'), 'surface').l;
    const slope = darkenColor(parseColor('rgb(200,210,213)'), 'relief').l;

    expect(forest).toBeGreaterThan(ground);
    expect(forest - ground).toBeLessThan(0.1);
    expect(slope).toBeLessThan(ground);
  });

  test('keeps the order of shades in shade mode', () => {
    const lit = darkenColor(parseColor('rgb(240,240,240)'), 'shade');
    const shadow = darkenColor(parseColor('rgb(200,210,213)'), 'shade');

    expect(lit.l).toBeGreaterThan(shadow.l);
    expect(lit.l).toBeLessThan(0.45);
  });

  test('keeps opacity', () => {
    expect(darkenColor(parseColor('rgba(242, 242, 242, 0.6)')).a).toBe(0.6);
  });
});

describe('mapColors', () => {
  test('replaces colours inside expressions and stops', () => {
    const paint = ['match', ['get', 'class'], 'forest', 'rgb(0,0,0)', { stops: [[6, 'rgb(0,0,0)']] }];
    const mapped = mapColors(paint, () => parseColor('#ffffff'));

    expect(mapped).toEqual([
      'match',
      ['get', 'class'],
      'forest',
      'rgba(255, 255, 255, 1)',
      { stops: [[6, 'rgba(255, 255, 255, 1)']] },
    ]);
  });
});
