'use server'

// Rate limiting configuration
const RATE_LIMITS = {
  ETHERSCAN: {
    MAX_REQUESTS: 5,
    TIME_WINDOW: 1000, // 1 second in ms
  },
  GOPLUS: {
    MAX_REQUESTS: 10,
    TIME_WINDOW: 1000,
  },
  MORALIS: {
    MAX_REQUESTS: 10,
    TIME_WINDOW: 1000,
  },
  CODESEER: {
    MAX_REQUESTS: 5,
    TIME_WINDOW: 60 * 1000, // 1 minute in ms
  },
  BATCH: {
    MAX_REQUESTS: 20,
    TIME_WINDOW: 60 * 1000,
  }
} as const

// Track request timestamps per user/service
const requestTracker = new Map<string, number[]>()

export type RateLimitType = keyof typeof RATE_LIMITS

export async function isRateLimited(key: string, type: RateLimitType): Promise<{ limited: boolean; waitTime?: number }> {
  const now = Date.now()
  const limit = RATE_LIMITS[type]
  
  // Get or initialize request history
  const requests = requestTracker.get(key) || []
  
  // Clean old requests outside the time window
  const validRequests = requests.filter(time => now - time < limit.TIME_WINDOW)
  
  // Check if rate limit exceeded
  if (validRequests.length >= limit.MAX_REQUESTS) {
    const oldestRequest = Math.min(...validRequests)
    const waitTime = Math.ceil((oldestRequest + limit.TIME_WINDOW - now) / 1000)
    return { limited: true, waitTime }
  }
  
  // Update request history
  validRequests.push(now)
  requestTracker.set(key, validRequests)
  return { limited: false }
} 