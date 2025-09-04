import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Play, Square } from 'lucide-react';

interface ContractionTimerProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
  startTime?: Date;
}

export function ContractionTimer({ isTracking, onStart, onStop, startTime }: ContractionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsed(elapsedSeconds);
      }, 1000);
    } else {
      setElapsed(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-timer bg-gradient-maternal border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-primary-foreground text-2xl font-semibold flex items-center justify-center gap-2">
          <Timer className="w-6 h-6" />
          Contraction Timer
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Track your contraction timing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-6xl font-mono font-bold text-primary-foreground mb-2">
            {formatTime(elapsed)}
          </div>
          {isTracking && (
            <p className="text-primary-foreground/80 text-sm">
              Contraction in progress...
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          {!isTracking ? (
            <Button 
              onClick={onStart}
              variant="secondary"
              size="lg"
              className="px-8 py-6 text-2xl font-semibold"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Contraction
            </Button>
          ) : (
            <Button 
              onClick={onStop}
              variant="destructive"
              size="lg"
              className="px-8 py-6 text-2xl font-semibold"
            >
              <Square className="w-6 h-6 mr-2" />
              Stop Contraction
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}