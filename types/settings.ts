export interface SettingsMenuProps {
  onClose: () => void;
}

export interface SettingsTabProps {
  icon: React.ReactNode;
  label: string;
  id: string;
  activeTab: string;
  setActiveTab: (id: string) => void;
} 