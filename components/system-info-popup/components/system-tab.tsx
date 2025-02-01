import type { SystemMetrics } from '@/types/system';

interface SystemTabProps {
  metrics: SystemMetrics;
}

export function SystemTab({ metrics }: SystemTabProps) {
  return (
    <div className="space-y-3 text-green-300">
      {/* System Version */}
      <div className="p-2 bg-green-800/50 rounded flex justify-between items-center">
        <span className="text-sm font-medium">SmithOS v0.1.0</span>
        <span className="text-xs text-green-400">Build 2025.01</span>
      </div>

      {/* CPU Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-1.5">CPU Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="p-3 bg-green-800 rounded">
            <p className="text-sm font-medium">Current Load</p>
            <div className="mt-1">
              <div className="w-full bg-green-950 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.performance.cpu.current}%` }}
                ></div>
              </div>
              <p className="text-xl mt-1">{metrics.performance.cpu.current}%</p>
            </div>
          </div>
          <div className="p-3 bg-green-800 rounded">
            <p className="text-sm font-medium">Load Averages</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <p className="text-xs text-green-400">1m</p>
                <p>{metrics.performance.cpu.average.oneMin}</p>
              </div>
              <div>
                <p className="text-xs text-green-400">5m</p>
                <p>{metrics.performance.cpu.average.fiveMin}</p>
              </div>
              <div>
                <p className="text-xs text-green-400">15m</p>
                <p>{metrics.performance.cpu.average.fifteenMin}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Memory Performance</h3>
        <div className="p-3 bg-green-800 rounded">
          <div className="w-full bg-green-950 rounded-full h-2 mb-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.performance.memory.percentage}%` }}
            ></div>
          </div>
          <p className="text-xl">{metrics.performance.memory.percentage}% Used</p>
        </div>
      </div>

      {/* System Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-2">System Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-green-800 rounded">
            <p className="text-sm font-medium">Event Loop</p>
            <p className="text-xl">{metrics.performance.system.eventLoopLatency}%</p>
          </div>
          <div className="p-3 bg-green-800 rounded">
            <p className="text-sm font-medium">Heap Usage</p>
            <p className={`text-xl ${metrics.performance.system.heapUsage > 80 ? 'text-red-400' : ''}`}>
              {metrics.performance.system.heapUsage}%
            </p>
          </div>
          <div className="p-3 bg-green-800 rounded">
            <p className="text-sm font-medium">Handles</p>
            <p className="text-xl">{metrics.performance.system.activeHandles}</p>
          </div>
          <div className="p-3 bg-green-800 rounded">
            <p className="text-sm font-medium">Requests</p>
            <p className="text-xl">{metrics.performance.system.activeRequests}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 