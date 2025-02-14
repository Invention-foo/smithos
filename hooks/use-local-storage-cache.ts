const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheData<T> {
  data: T;
  timestamp: number;
}

export function useLocalStorageCache<T>() {
  const getFromCache = (key: string): T | null => {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, timestamp }: CacheData<T> = JSON.parse(cachedData);
      const now = new Date().getTime();

      if (now - timestamp < ONE_HOUR) {
        return data;
      }
    }
    return null;
  };

  const setToCache = (key: string, data: T) => {
    const cacheData: CacheData<T> = {
      data,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  };

  const removeFromCache = (key: string) => {
    localStorage.removeItem(key);
  };

  return { getFromCache, setToCache, removeFromCache };
} 