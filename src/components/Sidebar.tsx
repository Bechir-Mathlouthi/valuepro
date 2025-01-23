import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: typeof LucideIcon;
  label: string;
  href: string;
  onClick?: () => void;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
                href={item.href}
                onClick={(e) => {
                e.preventDefault();
                item.onClick?.();
                }}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-500" />
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;