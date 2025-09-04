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

        <div className="flex justify-center">
          {!isTracking ? (
            <Button 
              onClick={onStart}
              variant="secondary"
              className="w-32 h-32 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <div className="flex flex-col items-center gap-2">
                <Play className="w-8 h-8" />
                <span className="text-xl">Start</span>
              </div>
            </Button>
          ) : (
            <Button 
              onClick={onStop}
              variant="destructive"
              className="w-32 h-32 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 animate-pulse shadow-red-500/50"
            >
              <div className="flex flex-col items-center gap-2">
                <Square className="w-8 h-8" />
                <span className="text-xl">Stop</span>
              </div>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}