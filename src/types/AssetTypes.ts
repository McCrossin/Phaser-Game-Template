/**
 * Type definitions for asset manifest system
 * This file provides types for the asset loading system
 */

export interface AssetEntry {
    path: string;
    hash: string;
    size: number;
    type: 'image' | 'audio' | 'atlas' | 'data';
    category: 'essential' | 'level' | 'optional';
    dependencies?: string[];
    metadata?: Record<string, unknown>;
}

export interface AssetManifest {
    version: string;
    timestamp: number;
    entries: Record<string, AssetEntry>;
    categories: {
        essential: string[];
        level: Record<string, string[]>;
        optional: string[];
    };
    formats?: {
        image: string[];
        audio: string[];
    };
    totalSize: number;
}
