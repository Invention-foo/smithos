export interface SystemMetrics {
  performance: {
    cpu: {
      current: number;
      average: {
        oneMin: number;
        fiveMin: number;
        fifteenMin: number;
      };
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    system: {
      eventLoopLatency: number;
      heapUsage: number;
      activeHandles: number;
      activeRequests: number;
    };
  };
} 