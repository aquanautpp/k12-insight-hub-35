import React, { RefObject } from 'react';
import { Progress } from '@/components/ui/progress';
import { useReadingProgress } from '@/hooks/useReadingProgress';

interface TopReadingProgressProps {
  targetRef?: RefObject<HTMLElement>;
}

const TopReadingProgress: React.FC<TopReadingProgressProps> = ({ targetRef }) => {
  const value = useReadingProgress(targetRef);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <Progress value={value} className="h-1 rounded-none" />
    </div>
  );
};

export default TopReadingProgress;
