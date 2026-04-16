'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBarFixed';
import { layoutStyles } from '@/components/design-system/DesignSystem';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Get page title based on current path
  const getPageTitle = () => {
    if (title) return title;
    
    const currentPath = pathname || '/';
    
    switch (currentPath) {
      case '/':
        return 'Dashboard';
      case '/boards':
        return 'All Boards';
      case '/active-boards':
        return 'Active Boards';
      case '/total-lists':
        return 'Total Lists';
      case '/total-cards':
        return 'Total Cards';
      default:
        if (currentPath.startsWith('/board/')) {
          return 'Board View';
        }
        return 'TaskFlow';
    }
  };

  return (
    <div className={layoutStyles.main}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className={layoutStyles.content}>
        <TopBar 
          title={getPageTitle()}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6" style={{ color: 'black' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
