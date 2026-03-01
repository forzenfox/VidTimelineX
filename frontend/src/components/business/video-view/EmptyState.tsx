import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  onClearFilter?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilter, className }) => {
  return (
    <div
      data-testid="empty-state-container"
      className={`flex flex-col items-center justify-center py-12 px-4 ${className || ""}`}
    >
      <Search data-testid="search-icon" className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        未找到相关视频
      </h2>
      <p className="text-sm text-gray-500 mb-6">试试调整筛选条件或换个关键词</p>
      <Button onClick={onClearFilter} className="rounded-lg">
        清除筛选
      </Button>
    </div>
  );
};

export default EmptyState;
