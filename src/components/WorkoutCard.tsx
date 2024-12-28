import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  day: number;
  date: string;
  completed: boolean;
  notes?: string;
  onToggleComplete: (completed: boolean) => void;
}

export function WorkoutCard({ day, date, completed, notes, onToggleComplete }: WorkoutCardProps) {
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
            id={`workout-${day}`}
          />
          <CardTitle className="text-sm font-medium">Day {day}</CardTitle>
        </div>
        {completed && (
          <CheckCircle2 className="h-4 w-4 text-accent" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{date}</div>
        {notes && <p className="mt-2 text-sm">{notes}</p>}
      </CardContent>
    </Card>
  );
}