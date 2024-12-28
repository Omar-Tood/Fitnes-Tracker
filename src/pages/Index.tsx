import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ProgressRing";
import { WorkoutCard } from "@/components/WorkoutCard";
import { DailyQuote } from "@/components/DailyQuote";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState([
    { day: 1, date: "Jan 1, 2025", completed: true, notes: "Started strong! 30min cardio + weights" },
    { day: 2, date: "Jan 2, 2025", completed: true, notes: "Upper body focus" },
    { day: 3, date: "Jan 3, 2025", completed: false },
  ]);

  const progress = (workouts.filter(w => w.completed).length / 100) * 100;

  const handleLogWorkout = () => {
    toast({
      title: "Workout logged!",
      description: "Keep up the great work! 💪",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <main className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          100 Days of Fitness
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center space-y-4">
            <ProgressRing progress={progress} />
            <p className="text-lg text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
            <Button onClick={handleLogWorkout} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Log Today's Workout
            </Button>
          </div>
          
          <div className="space-y-4">
            <DailyQuote />
            <div className="text-sm text-muted-foreground">
              Recent Activity
            </div>
            <div className="space-y-3">
              {workouts.map((workout) => (
                <WorkoutCard key={workout.day} {...workout} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;