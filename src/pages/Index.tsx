import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ProgressRing";
import { WorkoutCard } from "@/components/WorkoutCard";
import { DailyQuote } from "@/components/DailyQuote";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const workoutFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const Index = () => {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState([
    { day: 1, date: "Jan 1, 2025", completed: true, notes: "Started strong! 30min cardio + weights" },
    { day: 2, date: "Jan 2, 2025", completed: true, notes: "Upper body focus" },
    { day: 3, date: "Jan 3, 2025", completed: true, notes: "Lower body day" },
    { day: 4, date: "Jan 4, 2025", completed: true, notes: "HIIT training" },
    { day: 5, date: "Jan 5, 2025", completed: false, notes: "Rest day" },
  ]);

  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  const form = useForm({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      date: "",
      notes: "",
    },
  });

  const handleToggleComplete = (day: number, completed: boolean) => {
    setWorkouts(workouts.map(workout => 
      workout.day === day 
        ? { ...workout, completed }
        : workout
    ));

    toast({
      title: completed ? "Workout completed!" : "Workout uncompleted",
      description: `Day ${day} has been marked as ${completed ? 'completed' : 'incomplete'}.`,
    });
  };

  // Calculate progress based on completed workouts out of total workouts
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const progress = (completedWorkouts / workouts.length) * 100;

  const handleLogWorkout = () => {
    const nextIncompleteWorkout = workouts.find(w => !w.completed);
    if (nextIncompleteWorkout) {
      setWorkouts(workouts.map(workout => 
        workout.day === nextIncompleteWorkout.day 
          ? { ...workout, completed: true, notes: workout.notes || "Workout completed!" }
          : workout
      ));

      toast({
        title: "Workout logged!",
        description: `Day ${nextIncompleteWorkout.day} completed! Keep up the great work! 💪`,
      });
    } else {
      toast({
        title: "All caught up!",
        description: "You've completed all available workouts.",
      });
    }
  };

  const onSubmit = (data: z.infer<typeof workoutFormSchema>) => {
    const newWorkout = {
      day: workouts.length + 1,
      date: data.date,
      completed: false,
      notes: data.notes,
    };

    setWorkouts([...workouts, newWorkout]);
    setIsAddingWorkout(false);
    form.reset();

    toast({
      title: "Workout added!",
      description: `Day ${newWorkout.day} has been added to your schedule.`,
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <main className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            Fitness Tracker
          </h1>
          <Dialog open={isAddingWorkout} onOpenChange={setIsAddingWorkout}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Workout Day
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Workout Day</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter workout notes..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Add Workout</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center space-y-4">
            <ProgressRing progress={progress} />
            <p className="text-lg text-muted-foreground">
              {completedWorkouts} of {workouts.length} days completed ({Math.round(progress)}%)
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
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {workouts.map((workout) => (
                <WorkoutCard 
                  key={workout.day} 
                  {...workout} 
                  onToggleComplete={(completed) => handleToggleComplete(workout.day, completed)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;