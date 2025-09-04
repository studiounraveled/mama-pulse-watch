import { useState, useEffect } from 'react';
import { Contraction } from '@/types/contraction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface EditContractionDialogProps {
  contraction: Contraction | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: { startTime: Date; endTime: Date | null }) => void;
}

export function EditContractionDialog({ 
  contraction, 
  open, 
  onClose, 
  onSave 
}: EditContractionDialogProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Update local state when contraction changes
  useEffect(() => {
    if (contraction) {
      setStartTime(format(new Date(contraction.startTime), "yyyy-MM-dd'T'HH:mm:ss"));
      setEndTime(contraction.endTime ? format(new Date(contraction.endTime), "yyyy-MM-dd'T'HH:mm:ss") : '');
    }
  }, [contraction]);

  const handleSave = () => {
    if (!contraction || !startTime) return;

    const newStartTime = new Date(startTime);
    const newEndTime = endTime ? new Date(endTime) : null;

    // Validation
    if (newEndTime && newEndTime <= newStartTime) {
      toast({
        title: "Invalid Times",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    onSave(contraction.id, {
      startTime: newStartTime,
      endTime: newEndTime,
    });

    toast({
      title: "Contraction Updated",
      description: "The contraction times have been updated successfully.",
    });

    onClose();
  };

  if (!contraction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Contraction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}