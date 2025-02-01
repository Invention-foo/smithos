'use client'

import { useState } from 'react';
import roadmapData from '@/data/roadmap.json';

interface RoadmapFeature {
  text: string;
  completed: boolean;
}

interface RoadmapItem {
  version: string;
  title: string;
  status: 'Complete' | 'In Development' | 'Planned' | 'Future';
  date: string;
  features: RoadmapFeature[];
}

export function RoadmapTab() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(
    roadmapData.items as unknown as RoadmapItem[]
  );

  // If we want to fetch dynamically:
  // useEffect(() => {
  //   const fetchRoadmap = async () => {
  //     try {
  //       const response = await fetch('/api/roadmap');
  //       const data = await response.json();
  //       setRoadmapItems(data.items);
  //     } catch (error) {
  //       console.error('Failed to fetch roadmap:', error);
  //     }
  //   };
  //
  //   fetchRoadmap();
  // }, []);

  return (
    <div className="space-y-3 text-green-300">
      <h3 className="text-lg font-semibold mb-1.5">Development Roadmap</h3>
      <div className="space-y-2">
        {roadmapItems.map((item) => (
          <div key={item.version} className="p-2 bg-green-800 rounded">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold text-sm">{item.version}: {item.title}</h4>
                <p className="text-xs text-green-400">Release: {item.date}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                item.status === 'Complete' ? 'bg-green-600' :
                item.status === 'In Development' ? 'bg-green-700' :
                'bg-green-900'
              }`}>
                {item.status}
              </span>
            </div>
            <ul className="mt-2 space-y-0.5">
              {item.features.map((feature, index) => (
                <li key={index} className="flex items-center text-xs">
                  <span className={`mr-1.5 ${feature.completed ? 'text-green-400' : 'text-green-700'}`}>
                    {feature.completed ? '✓' : '○'}
                  </span>
                  <span className={feature.completed ? 'text-green-400' : ''}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 