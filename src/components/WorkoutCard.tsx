import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface WorkoutCardProps {
  day: number;
  date: string;
  completed: boolean;
  notes?: string;
}

export function WorkoutCard({ day, date, completed, notes }: WorkoutCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      completed ? "border-accent" : "border-muted"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Day {day}</CardTitle>
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