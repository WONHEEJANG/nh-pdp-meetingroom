import React from 'react';
import { MessageCircle, Share2 } from 'lucide-react';

export const ShareButtons: React.FC = () => {
  return (
    <div className="flex justify-center gap-6 mb-8">
      <div className="text-center">
        <button className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2">
          <MessageCircle className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-sm text-gray-600">카카오톡</span>
      </div>
      <div className="text-center">
        <button className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2">
          <Share2 className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-sm text-gray-600">공유하기</span>
      </div>
    </div>
  );
};
