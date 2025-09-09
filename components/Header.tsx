import React from 'react';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  showRightIcons?: boolean;
  onBackClick?: () => void;
  onCloseClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showCloseButton = false,
  showRightIcons = true,
  onBackClick,
  onCloseClick,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white px-6 py-3 z-40">
      <div className="flex items-center justify-between">
        {showBackButton ? (
          <button onClick={onBackClick}>
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <div className="w-6 h-6" />
        )}
        
        <span className="text-lg font-semibold">{title}</span>
        
        {showRightIcons ? (
          <div className="flex items-center gap-2">
            {showCloseButton ? (
              <button onClick={onCloseClick}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            ) : (
              <>
                <Home className="w-6 h-6 text-gray-600" />
                <Menu className="w-6 h-6 text-gray-600" />
              </>
            )}
          </div>
        ) : (
          <div className="w-6 h-6" />
        )}
      </div>
    </div>
  );
};
