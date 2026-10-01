import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  categorySlug: string;
  categoryName: string;
  toolName?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  categorySlug,
  categoryName,
  toolName
}) => {
  const { navigate } = useApp();

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-[#71717A] dark:text-[#A1A1AA]">
        <li className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 hover:text-[#EC4899] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
          <button
            onClick={() => navigate(`/${categorySlug}/`)}
            className="ml-1 hover:text-[#EC4899] transition-colors font-medium"
          >
            {categoryName}
          </button>
        </li>
        {toolName && (
          <li className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
            <span className="ml-1 text-[#18181B] dark:text-[#F4F4F5] font-semibold truncate max-w-[200px] sm:max-w-none">
              {toolName}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};
