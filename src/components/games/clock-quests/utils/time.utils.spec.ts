import { describe, expect, it } from '@jest/globals';

import { readableTime } from './time.utils.js';

describe('clock.utils', () => {
  describe('readableTime', () => {
    it('returns full hours', () => {
      expect(readableTime(new Date(0, 0, 0, 1, 0, 0))).toBe('ein Uhr');
      expect(readableTime(new Date(0, 0, 0, 6, 0, 0))).toBe('sechs Uhr');
      expect(readableTime(new Date(0, 0, 0, 12, 0, 0))).toBe('zwölf Uhr');
      expect(readableTime(new Date(0, 0, 0, 15, 0, 0))).toBe('drei Uhr');
    });

    it('returns half hours', () => {
      expect(readableTime(new Date(0, 0, 0, 6, 30, 0))).toBe('halb sieben');
      expect(readableTime(new Date(0, 0, 0, 12, 30, 0))).toBe('halb eins');
      expect(readableTime(new Date(0, 0, 0, 15, 30, 0))).toBe('halb vier');
    });

    it('returns quarterly hours', () => {
      expect(readableTime(new Date(0, 0, 0, 6, 15, 0))).toBe('viertel sieben');
      expect(readableTime(new Date(0, 0, 0, 12, 15, 0))).toBe('viertel eins');
      expect(readableTime(new Date(0, 0, 0, 15, 15, 0))).toBe('viertel vier');
    });

    it('returns quarter to full hours', () => {
      expect(readableTime(new Date(0, 0, 0, 6, 45, 0))).toBe('dreiviertel sieben');
      expect(readableTime(new Date(0, 0, 0, 12, 45, 0))).toBe('dreiviertel eins');
      expect(readableTime(new Date(0, 0, 0, 15, 45, 0))).toBe('dreiviertel vier');
    });

    it('returns minutes after full hours', () => {
      expect(readableTime(new Date(0, 0, 0, 6, 5, 0))).toBe('fünf nach sechs');
      expect(readableTime(new Date(0, 0, 0, 12, 10, 0))).toBe('zehn nach zwölf');
      expect(readableTime(new Date(0, 0, 0, 15, 3, 0))).toBe('drei nach drei');
    });

    it('returns minutes before full hours', () => {
      expect(readableTime(new Date(0, 0, 0, 6, 55, 0))).toBe('fünf vor sieben');
      expect(readableTime(new Date(0, 0, 0, 11, 50, 0))).toBe('zehn vor zwölf');
      expect(readableTime(new Date(0, 0, 0, 14, 57, 0))).toBe('drei vor drei');
    });

    it('returns minutes before half hours', () => {
      expect(readableTime(new Date(0, 0, 0, 6, 25, 0))).toBe('fünf vor halb sieben');
      expect(readableTime(new Date(0, 0, 0, 12, 20, 0))).toBe('zehn vor halb eins');
      expect(readableTime(new Date(0, 0, 0, 15, 27, 0))).toBe('drei vor halb vier');
    });

    it('returns minutes after half hours', () => {
      expect(readableTime(new Date(0, 0, 0, 6, 35, 0))).toBe('fünf nach halb sieben');
      expect(readableTime(new Date(0, 0, 0, 12, 40, 0))).toBe('zehn nach halb eins');
      expect(readableTime(new Date(0, 0, 0, 15, 33, 0))).toBe('drei nach halb vier');
    });
  });
});
