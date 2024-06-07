import { IStorageSuite } from '@portkey/types';

export class AsyncLocalStorage implements IStorageSuite {
  async getItem(key: string) {
    if (typeof localStorage !== 'undefined') {
      const value = localStorage.getItem(key);
      if (!value) return;
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }
  }
  async setItem(key: string, value: string) {
    if (typeof localStorage !== 'undefined') return localStorage.setItem(key, value);
  }
  async removeItem(key: string) {
    if (typeof localStorage !== 'undefined') return localStorage.removeItem(key);
  }
}

export const asyncLocalStorage = new AsyncLocalStorage();
