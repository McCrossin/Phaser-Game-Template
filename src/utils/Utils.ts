import { Vector2D } from '@/types/GameTypes';

// Vector utility functions
export class VectorUtils {
  static distance(a: Vector2D, b: Vector2D): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static normalize(vector: Vector2D): Vector2D {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: vector.x / length, y: vector.y / length };
  }

  static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  static subtract(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static multiply(vector: Vector2D, scalar: number): Vector2D {
    return { x: vector.x * scalar, y: vector.y * scalar };
  }
}

// Math utility functions
export class MathUtils {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  static randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Time utility functions
export class TimeUtils {
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  static parseTime(timeString: string): number {
    const parts = timeString.split(':');
    if (parts.length === 2 && parts[0] && parts[1]) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } else if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
    }
    return 0;
  }
}

// String utility functions
export class StringUtils {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  static snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  static truncate(str: string, maxLength: number, ellipsis = '...'): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
  }
}

// Validation utilities
export class ValidationUtils {
  static isValidPosition(pos: Vector2D, worldWidth: number, worldHeight: number): boolean {
    return pos.x >= 0 && pos.x <= worldWidth && pos.y >= 0 && pos.y <= worldHeight;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
}

// Performance utilities
export class PerformanceUtils {
  private static markers = new Map<string, number>();

  static startTimer(label: string): void {
    this.markers.set(label, performance.now());
  }

  static endTimer(label: string): number {
    const startTime = this.markers.get(label);
    if (!startTime) {
      console.warn(`Timer '${label}' not found`);
      return 0;
    }
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.markers.delete(label);
    return duration;
  }

  static measureFunction<T>(fn: () => T, label?: string): T {
    const timerLabel = label || 'anonymous_function';
    this.startTimer(timerLabel);
    const result = fn();
    const duration = this.endTimer(timerLabel);
    console.log(`${timerLabel} took ${duration.toFixed(2)}ms`);
    return result;
  }
}
