// Safe localStorage utility with fallbacks for sandboxed environments

interface StorageInterface {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

// In-memory fallback storage
class MemoryStorage implements StorageInterface {
  private storage: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

// Safe storage wrapper that falls back to memory storage
class SafeStorage implements StorageInterface {
  private storage: StorageInterface;
  private isLocalStorageAvailable: boolean = false;

  constructor() {
    try {
      // Test localStorage access
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      this.storage = window.localStorage;
      this.isLocalStorageAvailable = true;
    } catch (error) {
      console.warn('localStorage not available, falling back to memory storage:', error);
      this.storage = new MemoryStorage();
      this.isLocalStorageAvailable = false;
    }
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item ${key} from storage:`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set item ${key} in storage:`, error);
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item ${key} from storage:`, error);
    }
  }

  isAvailable(): boolean {
    return this.isLocalStorageAvailable;
  }
}

// Export singleton instance
export const safeStorage = new SafeStorage();

// Convenience functions
export const safeGetItem = (key: string): string | null => safeStorage.getItem(key);
export const safeSetItem = (key: string, value: string): void => safeStorage.setItem(key, value);
export const safeRemoveItem = (key: string): void => safeStorage.removeItem(key);