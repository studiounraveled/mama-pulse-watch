import { Contraction } from '@/types/contraction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Clock } from 'lucide-react';
import { format, formatDuration, intervalToDuration } from 'date-fns';

interface ContractionTableProps {
  contractions: Contraction[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function ContractionTable({ contractions, onDelete, onClearAll }: ContractionTableProps) {
  const formatTime = (date: Date) => format(date, 'HH:mm:ss');
  
  const formatDurationFromSeconds = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration, { format: ['minutes', 'seconds'] });
  };

  if (contractions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Contraction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No contractions recorded yet. Start tracking your first contraction above!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Contraction History ({contractions.length})
        </CardTitle>
        <Button 
          onClick={onClearAll} 
          variant="outline" 
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          Clear All
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractions.map((contraction) => (
                <TableRow key={contraction.id}>
                  <TableCell className="font-mono">
                    {formatTime(new Date(contraction.startTime))}
                  </TableCell>
                  <TableCell className="font-mono">
                    {contraction.endTime ? formatTime(new Date(contraction.endTime)) : 'N/A'}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {contraction.duration ? formatDurationFromSeconds(contraction.duration) : 'In progress'}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onDelete(contraction.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}