'use server'

import os from 'os';
import { performance } from 'perf_hooks';

export async function getSystemMetrics() {
  try {
    const cpuInfo = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Get CPU load average for different time periods
    const [oneMin, fiveMin, fifteenMin] = os.loadavg();
    
    // Calculate CPU usage percentage
    const cpuUsage = Math.min(Math.round((oneMin / cpuInfo.length) * 100), 100);

    // Get system performance metrics
    const performanceMetrics = {
      eventLoopLatency: Math.round(performance.eventLoopUtilization().utilization * 100),
      heapUsage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
      gcFrequency: global.gc ? "Available" : "Not Available", // Only works with --expose-gc flag
    };

    return {
      performance: {
        cpu: {
          current: cpuUsage,
          average: {
            oneMin: Math.round(oneMin * 100) / 100,
            fiveMin: Math.round(fiveMin * 100) / 100,
            fifteenMin: Math.round(fifteenMin * 100) / 100
          }
        },
        memory: {
          used: usedMem,
          total: totalMem,
          percentage: Math.round((usedMem / totalMem) * 100)
        },
        system: {
          eventLoopLatency: performanceMetrics.eventLoopLatency,
          heapUsage: performanceMetrics.heapUsage,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activeHandles: (process as any)._getActiveHandles().length,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activeRequests: (process as any)._getActiveRequests().length,
        }
      }
    };
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw new Error('Failed to fetch performance metrics');
  }
}