import type { SettingsTabProps } from '@/types/settings';

export function SettingsTab({ icon, label, id, activeTab, setActiveTab }: SettingsTabProps) {
  return (
    <li 
      className={`flex items-center p-2 cursor-pointer ${activeTab === id ? 'bg-green-700' : 'hover:bg-green-800'}`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </li>
  );
} 