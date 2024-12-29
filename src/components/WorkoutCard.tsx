import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  id: string;
  day: number;
  date: string;
  completed: boolean;
  notes?: string;
  onToggleComplete: (completed: boolean) => void;
  onDelete: () => void;
  onUpdate: (data: { date: string; notes?: string }) => void;
}

export function WorkoutCard({ 
  id, 
  day, 
  date, 
  completed, 
  notes, 
  onToggleComplete,
  onDelete,
  onUpdate 
}: WorkoutCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(date);
  const [editNotes, setEditNotes] = useState(notes || "");

  const handleSave = () => {
    onUpdate({ date: editDate, notes: editNotes });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="border-accent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Edit Day {day}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />
          <Input
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Add notes..."
          />
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">Save</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      completed ? "border-accent" : "border-muted"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={completed}
            onCheckedChange={onToggleComplete}
            id={`workout-${id}`}
          />
          <CardTitle className="text-sm font-medium">Day {day}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {completed && (
            <CheckCircle2 className="h-4 w-4 text-accent" />
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{date}</div>
        {notes && <p className="mt-2 text-sm">{notes}</p>}
      </CardContent>
    </Card>
  );
}