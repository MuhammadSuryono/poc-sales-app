interface CacheOptions {
    ttl?: number // Time to live in milliseconds
    key: string
}

interface CacheEntry<T> {
    data: T
    timestamp: number
}

export const useCache = () => {
    const cache = new Map<string, CacheEntry<any>>()

    const set = <T>(key: string, data: T, ttl: number = 5 * 60 * 1000) => {
        cache.set(key, {
            data,
            timestamp: Date.now() + ttl
        })
    }

    const get = <T>(key: string): T | null => {
        const entry = cache.get(key)

        if (!entry) return null

        // Check if expired
        if (Date.now() > entry.timestamp) {
            cache.delete(key)
            return null
        }

        return entry.data as T
    }

    const has = (key: string): boolean => {
        const entry = cache.get(key)
        if (!entry) return false

        if (Date.now() > entry.timestamp) {
            cache.delete(key)
            return false
        }

        return true
    }

    const remove = (key: string) => {
        cache.delete(key)
    }

    const clear = () => {
        cache.clear()
    }

    const invalidatePattern = (pattern: string) => {
        const regex = new RegExp(pattern)
        for (const key of cache.keys()) {
            if (regex.test(key)) {
                cache.delete(key)
            }
        }
    }

    return {
        set,
        get,
        has,
        remove,
        clear,
        invalidatePattern
    }
}

// API caching composable
export const useApiCache = () => {
    const cache = useCache()
    const { isOnline } = useOffline()

    const fetchWithCache = async <T>(
        key: string,
        fetcher: () => Promise<T>,
        options: { ttl?: number; forceRefresh?: boolean } = {}
    ): Promise<T> => {
        const { ttl = 5 * 60 * 1000, forceRefresh = false } = options

        // Check cache first if online and not forcing refresh
        if (!forceRefresh && cache.has(key)) {
            const cached = cache.get<T>(key)
            if (cached !== null) {
                return cached
            }
        }

        // If offline, return cached data even if expired
        if (!isOnline.value) {
            const cached = cache.get<T>(key)
            if (cached !== null) {
                return cached
            }
            throw new Error('No cached data available while offline')
        }

        // Fetch fresh data
        try {
            const data = await fetcher()
            cache.set(key, data, ttl)
            return data
        } catch (error) {
            // If fetch fails, try to return stale cache
            const cached = cache.get<T>(key)
            if (cached !== null) {
                console.warn('Using stale cache due to fetch error')
                return cached
            }
            throw error
        }
    }

    return {
        fetchWithCache,
        invalidate: cache.remove,
        invalidatePattern: cache.invalidatePattern,
        clear: cache.clear
    }
}
