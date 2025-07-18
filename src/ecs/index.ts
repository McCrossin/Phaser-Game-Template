/**
 * ECS (Entity-Component-System) architecture exports
 * Main entry point for the ECS system
 */

export { Entity } from './Entity';
export { Component } from './Component';
export type { IComponent } from './Component';
export { System } from './System';
export { EntityManager } from './EntityManager';
export { World } from './World';

// Re-export for convenience
export type ComponentType<T = any> = new (...args: any[]) => T;
