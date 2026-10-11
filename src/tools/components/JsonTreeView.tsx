import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Search,
  X,
  Maximize2,
  Minimize2,
  FileCode,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface JsonTreeViewProps {
  data: any;
  searchTerm?: string;
}

interface TreeNodeProps {
  keyName: string | number | null;
  value: any;
  path: string;
  depth: number;
  searchTerm: string;
  isExpandedGlobal: boolean | null;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  keyName,
  value,
  path,
  depth,
  searchTerm,
  isExpandedGlobal
}) => {
  const { showToast } = useApp();
  const [copiedField, setCopiedField] = useState<'value' | 'path' | null>(null);

  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  // Initial expansion state: auto-expand top 2 levels
  const [isExpanded, setIsExpanded] = useState<boolean>(depth < 2);

  // Sync with global Expand All / Collapse All buttons
  React.useEffect(() => {
    if (isExpandedGlobal !== null && isExpandable) {
      setIsExpanded(isExpandedGlobal);
    }
  }, [isExpandedGlobal, isExpandable]);

  const copyToClipboard = (text: string, type: 'value' | 'path') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    showToast(type === 'path' ? `Path "${text}" copied!` : 'Value copied!', 'success');
    setTimeout(() => setCopiedField(null), 1800);
  };

  const matchesSearch = useMemo(() => {
    if (!searchTerm) return false;
    const term = searchTerm.toLowerCase();
    const keyMatch = keyName !== null && String(keyName).toLowerCase().includes(term);
    const valMatch =
      !isExpandable &&
      (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') &&
      String(value).toLowerCase().includes(term);
    return keyMatch || valMatch;
  }, [searchTerm, keyName, value, isExpandable]);

  const renderValueBadge = () => {
    if (value === null) {
      return <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] italic">null</span>;
    }
    if (typeof value === 'boolean') {
      return (
        <span className="font-mono text-xs font-semibold text-[#D97706] dark:text-[#FBBF24]">
          {String(value)}
        </span>
      );
    }
    if (typeof value === 'number') {
      return (
        <span className="font-mono text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
          {value}
        </span>
      );
    }
    if (typeof value === 'string') {
      return (
        <span className="font-mono text-xs text-[#059669] dark:text-[#34D399] break-all">
          &quot;{value}&quot;
        </span>
      );
    }
    return null;
  };

  return (
    <div className="font-mono text-xs leading-relaxed select-text">
      <div
        className={`group flex items-start sm:items-center justify-between gap-2 py-1 px-2 rounded-lg transition-colors ${
          matchesSearch
            ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border border-[#EC4899]/40'
            : 'hover:bg-[#F4F4F5] dark:hover:bg-[#202026]'
        }`}
        style={{ paddingLeft: `${Math.max(8, depth * 18)}px` }}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap">
          {/* Caret for expandable nodes */}
          {isExpandable ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 rounded hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] text-[#71717A] dark:text-[#A1A1AA] focus:outline-none shrink-0"
              aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#EC4899]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 inline-block shrink-0" />
          )}

          {/* Key name or Array index */}
          {keyName !== null && (
            <span className="shrink-0">
              {typeof keyName === 'number' ? (
                <span className="text-[#EC4899] font-bold">[{keyName}]</span>
              ) : (
                <span className="text-[#18181B] dark:text-[#F4F4F5] font-bold">
                  &quot;{keyName}&quot;
                </span>
              )}
              <span className="text-[#71717A] dark:text-[#A1A1AA] mx-1">:</span>
            </span>
          )}

          {/* Expandable summary or Primitive value */}
          {isExpandable ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#EC4899] transition-colors"
            >
              <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">
                {isArray ? '[' : '{'}
              </span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-[#E4E4E7]/60 dark:bg-[#27272A]/70 text-[#52525B] dark:text-[#D4D4D8]">
                {isArray
                  ? `${value.length} ${value.length === 1 ? 'item' : 'items'}`
                  : `${Object.keys(value).length} keys`}
              </span>
              {!isExpanded && (
                <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  {isArray ? '...]' : '...}'}
                </span>
              )}
            </button>
          ) : (
            renderValueBadge()
          )}
        </div>

        {/* Action icons on hover */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
          <button
            onClick={() => copyToClipboard(path, 'path')}
            title={`Copy JSON Path: ${path}`}
            className="p-1 rounded hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] text-[#71717A] hover:text-[#EC4899]"
          >
            {copiedField === 'path' ? (
              <Check className="w-3 h-3 text-[#16A34A]" />
            ) : (
              <Tag className="w-3 h-3" />
            )}
          </button>
          {!isExpandable && (
            <button
              onClick={() => copyToClipboard(String(value), 'value')}
              title="Copy value"
              className="p-1 rounded hover:bg-[#E4E4E7] dark:hover:bg-[#27272A] text-[#71717A] hover:text-[#EC4899]"
            >
              {copiedField === 'value' ? (
                <Check className="w-3 h-3 text-[#16A34A]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Children for expandable nodes */}
      {isExpandable && isExpanded && (
        <div className="border-l border-[#E4E4E7] dark:border-[#27272A] ml-2 pl-1 space-y-0.5">
          {isArray
            ? value.map((item: any, idx: number) => (
                <TreeNode
                  key={idx}
                  keyName={idx}
                  value={item}
                  path={`${path}[${idx}]`}
                  depth={depth + 1}
                  searchTerm={searchTerm}
                  isExpandedGlobal={isExpandedGlobal}
                />
              ))
            : Object.keys(value).map((childKey) => (
                <TreeNode
                  key={childKey}
                  keyName={childKey}
                  value={value[childKey]}
                  path={path === '$' ? `$.${childKey}` : `${path}.${childKey}`}
                  depth={depth + 1}
                  searchTerm={searchTerm}
                  isExpandedGlobal={isExpandedGlobal}
                />
              ))}
          <div
            className="text-[#71717A] dark:text-[#A1A1AA] font-bold py-0.5"
            style={{ paddingLeft: `${Math.max(8, (depth + 1) * 18)}px` }}
          >
            {isArray ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  );
};

export const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, searchTerm: externalSearch = '' }) => {
  const [internalSearch, setInternalSearch] = useState<string>('');
  const [isExpandedGlobal, setIsExpandedGlobal] = useState<boolean | null>(null);

  const activeSearch = externalSearch || internalSearch;

  return (
    <div className="space-y-3">
      {/* Tree View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Filter keys or values..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] text-xs text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
            />
            {internalSearch && (
              <button
                onClick={() => setInternalSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#71717A] hover:text-[#EC4899]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpandedGlobal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Expand All</span>
          </button>
          <button
            onClick={() => setIsExpandedGlobal(false)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Tree Visualization Container */}
      <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7]/60 dark:bg-[#121215] max-h-[520px] overflow-auto">
        <TreeNode
          keyName={null}
          value={data}
          path="$"
          depth={0}
          searchTerm={activeSearch}
          isExpandedGlobal={isExpandedGlobal}
        />
      </div>

      {/* Legend & Help bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#71717A] dark:text-[#A1A1AA] pt-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#059669]" /> String
          </span>
          <span className="flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Number
          </span>
          <span className="flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Boolean
          </span>
          <span className="flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#71717A]" /> Null
          </span>
        </div>
        <span>Hover any node to copy JSON Path or Value</span>
      </div>
    </div>
  );
};
