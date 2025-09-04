import { ContractionSummary as SummaryData } from '@/types/contraction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Timer, TrendingUp } from 'lucide-react';
import { formatDuration, intervalToDuration } from 'date-fns';

interface ContractionSummaryProps {
  summary: SummaryData;
}

export function ContractionSummary({ summary }: ContractionSummaryProps) {
  const formatDurationFromSeconds = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration, { format: ['minutes', 'seconds'] });
  };

  const cards = [
    {
      title: 'Total Contractions',
      value: summary.totalContractions.toString(),
      icon: Activity,
      description: 'Recorded today'
    },
    {
      title: 'Average Duration',
      value: formatDurationFromSeconds(summary.averageDuration),
      icon: Timer,
      description: 'Per contraction'
    },
    {
      title: 'Average Interval',
      value: summary.averageInterval > 0 ? formatDurationFromSeconds(summary.averageInterval) : 'N/A',
      icon: Clock,
      description: 'Between contractions'
    },
    {
      title: 'Progress',
      value: summary.totalContractions > 0 ? 'Active' : 'Ready',
      icon: TrendingUp,
      description: summary.totalContractions > 0 ? 'Tracking in progress' : 'Start tracking'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}