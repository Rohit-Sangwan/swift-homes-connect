
import React from 'react';
import { cn } from '@/lib/utils';
import AppHeader from './AppHeader';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showHeader?: boolean;
  transparent?: boolean;
  className?: string;
  headerClassName?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  showBack = false,
  showHeader = true,
  transparent = false,
  className,
  headerClassName,
}) => {
  return (
    <div className={cn(
      "min-h-[100dvh] flex flex-col pb-16", // pb-16 for bottom nav
      className
    )}>
      {showHeader && (
        <AppHeader 
          title={title} 
          showBack={showBack} 
          transparent={transparent}
          className={headerClassName}
        />
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
