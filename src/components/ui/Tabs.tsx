interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div role="tablist" className="flex gap-1 rounded-xl bg-surface p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-all duration-150 ${
              isActive
                ? 'bg-primary text-white shadow-card'
                : 'text-text-secondary hover:bg-white/[0.04] hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
