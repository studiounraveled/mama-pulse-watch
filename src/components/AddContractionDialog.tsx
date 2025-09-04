import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddContractionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (startTime: Date, endTime: Date | null) => void;
}

export function AddContractionDialog({ open, onClose, onAdd }: AddContractionDialogProps) {
  const { toast } = useToast();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [includeEndTime, setIncludeEndTime] = useState(true);

  const handleSave = () => {
    if (!startTime) {
      toast({
        title: "Invalid Input",
        description: "Please enter a start time.",
        variant: "destructive",
      });
      return;
    }

    const startDate = new Date(startTime);
    let endDate: Date | null = null;

    if (includeEndTime) {
      if (!endTime) {
        toast({
          title: "Invalid Input", 
          description: "Please enter an end time or uncheck 'Include end time'.",
          variant: "destructive",
        });
        return;
      }
      endDate = new Date(endTime);
      
      if (endDate <= startDate) {
        toast({
          title: "Invalid Time Range",
          description: "End time must be after start time.",
          variant: "destructive",
        });
        return;
      }
    }

    onAdd(startDate, endDate);
    handleClose();
    toast({
      title: "Contraction Added",
      description: "Manual contraction has been added to your history.",
    });
  };

  const handleClose = () => {
    setStartTime('');
    setEndTime('');
    setIncludeEndTime(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manual Contraction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeEndTime"
              checked={includeEndTime}
              onChange={(e) => setIncludeEndTime(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="includeEndTime">Include end time</Label>
          </div>

          {includeEndTime && (
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add Contraction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}