/**
 * API Service Layer
 * Centralized API calls with error handling and caching
 */

interface ApiOptions {
    cache?: boolean
    ttl?: number
}

class ApiService {
    private baseUrl: string
    private cache: ReturnType<typeof useApiCache> | null = null

    constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl
    }

    /**
     * Initialize cache (call this in component setup)
     */
    initCache() {
        if (!this.cache) {
            this.cache = useApiCache()
        }
    }

    /**
     * Generic GET request
     */
    async get<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { cache = false, ttl = 5 * 60 * 1000 } = options
        const url = `${this.baseUrl}${endpoint}`

        if (cache && this.cache) {
            return this.cache.fetchWithCache(
                url,
                () => this.fetchJson<T>(url),
                { ttl }
            )
        }

        return this.fetchJson<T>(url)
    }

    /**
     * Generic POST request
     */
    async post<T>(endpoint: string, data: any): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Generic PUT request
     */
    async put<T>(endpoint: string, data: any): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Generic DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`

        const response = await fetch(url, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Helper: Fetch JSON with error handling
     */
    private async fetchJson<T>(url: string): Promise<T> {
        try {
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            return response.json()
        } catch (error) {
            console.error('API Fetch Error:', error)
            throw error
        }
    }

    /**
     * Invalidate cache for specific endpoint
     */
    invalidateCache(endpoint: string) {
        if (this.cache) {
            this.cache.invalidate(`${this.baseUrl}${endpoint}`)
        }
    }

    /**
     * Invalidate cache by pattern
     */
    invalidateCachePattern(pattern: string) {
        if (this.cache) {
            this.cache.invalidatePattern(pattern)
        }
    }
}

// Singleton instance
let apiInstance: ApiService | null = null

/**
 * Composable to use API service
 */
export const useApi = () => {
    if (!apiInstance) {
        const config = useSystemConfig()
        apiInstance = new ApiService(config.public.apiBaseUrl)
    }

    // Initialize cache if not already done
    apiInstance.initCache()

    return apiInstance
}

/**
 * Geocoding API service
 */
export const useGeocodingApi = () => {
    const config = useSystemConfig()

    const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${config.public.opencageApiKey}&language=en&pretty=1`
            )

            const data = await response.json()

            if (data.total_results > 0) {
                return data.results[0].formatted
            }

            return ''
        } catch (error) {
            console.error('Geocoding Error:', error)
            return ''
        }
    }

    return {
        reverseGeocode
    }
}
