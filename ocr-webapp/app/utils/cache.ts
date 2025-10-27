import CryptoJS from 'crypto-js';

export interface CacheEntry {
  hash: string;
  result: string;
  timestamp: number;
  task: string;
  prompt: string;
}

const CACHE_EXPIRY_DAYS = 30;
const CACHE_KEY = 'ocr-cache';

/**
 * Calculate SHA-256 hash of a file
 */
export async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.SHA256(wordArray).toString();
        resolve(hash);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Get all cache entries from localStorage
 */
export function getCache(): Map<string, CacheEntry> {
  if (typeof window === 'undefined') return new Map();
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return new Map();
    
    const data = JSON.parse(cached);
    const cacheMap = new Map<string, CacheEntry>(data.entries || []);
    
    // Clean expired entries
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    cacheMap.forEach((entry, key) => {
      const age = now - entry.timestamp;
      const ageInDays = age / (1000 * 60 * 60 * 24);
      
      if (ageInDays > CACHE_EXPIRY_DAYS) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => cacheMap.delete(key));
    
    // Save cleaned cache
    if (expiredKeys.length > 0) {
      setCache(cacheMap);
    }
    
    return cacheMap;
  } catch (error) {
    console.error('Error reading cache:', error);
    return new Map();
  }
}

/**
 * Save cache to localStorage
 */
export function setCache(cache: Map<string, CacheEntry>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = {
      entries: Array.from(cache.entries()),
      lastUpdated: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

/**
 * Get cached result for a file hash
 */
export function getCachedResult(hash: string): CacheEntry | null {
  const cache = getCache();
  return cache.get(hash) || null;
}

/**
 * Save result to cache
 */
export function saveToCache(hash: string, result: string, task: string, prompt: string): void {
  const cache = getCache();
  
  cache.set(hash, {
    hash,
    result,
    timestamp: Date.now(),
    task,
    prompt
  });
  
  setCache(cache);
}

/**
 * Check if a hash exists in cache
 */
export function isCached(hash: string): boolean {
  return getCache().has(hash);
}

/**
 * Clear expired entries from cache
 */
export function clearExpiredCache(): number {
  const cache = getCache();
  const beforeSize = cache.size;
  
  // Already cleaned in getCache, just save
  setCache(cache);
  
  return beforeSize - cache.size;
}
