import { ContractionSummary as SummaryData } from '@/types/contraction';
import { Clock, Timer } from 'lucide-react';
import { formatDuration, intervalToDuration } from 'date-fns';

interface CompactStatsProps {
  summary: SummaryData;
}

export function CompactStats({ summary }: CompactStatsProps) {
  const formatDurationFromSeconds = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration, { format: ['minutes', 'seconds'] });
  };

  return (
    <div className="flex justify-center gap-8 mb-6">
      <div className="flex flex-col items-center gap-1 text-sm">
        <Timer className="w-5 h-5 text-primary" />
        <span className="text-muted-foreground">Avg Duration</span>
        <span className="font-semibold text-foreground">
          {formatDurationFromSeconds(summary.averageDuration)}
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-1 text-sm">
        <Clock className="w-5 h-5 text-primary" />
        <span className="text-muted-foreground">Avg Interval</span>
        <span className="font-semibold text-foreground">
          {summary.averageInterval > 0 ? formatDurationFromSeconds(summary.averageInterval) : 'N/A'}
        </span>
      </div>
    </div>
  );
}