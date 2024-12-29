import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const workoutFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const Index = () => {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  const form = useForm({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      date: "",
      notes: "",
    },
  });

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('day', { ascending: true });
    
    if (error) {
      toast({
        title: "Error fetching workouts",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setWorkouts(data || []);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('workouts')
      .update({ completed })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating workout",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchWorkouts();
    toast({
      title: completed ? "Workout completed!" : "Workout uncompleted",
      description: `The workout has been marked as ${completed ? 'completed' : 'incomplete'}.`,
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting workout",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchWorkouts();
    toast({
      title: "Workout deleted",
      description: "The workout has been removed from your schedule.",
    });
  };

  const handleUpdate = async (id: string, data: { date: string; notes?: string }) => {
    const { error } = await supabase
      .from('workouts')
      .update(data)
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating workout",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchWorkouts();
    toast({
      title: "Workout updated",
      description: "Your changes have been saved.",
    });
  };

  const onSubmit = async (data: z.infer<typeof workoutFormSchema>) => {
    const newWorkout = {
      day: workouts.length + 1,
      date: data.date,
      completed: false,
      notes: data.notes,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    };

    const { error } = await supabase
      .from('workouts')
      .insert([newWorkout]);

    if (error) {
      toast({
        title: "Error adding workout",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchWorkouts();
    setIsAddingWorkout(false);
    form.reset();

    toast({
      title: "Workout added!",
      description: `Day ${newWorkout.day} has been added to your schedule.`,
    });
  };

  // Calculate progress based on completed workouts out of total workouts
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const progress = workouts.length > 0 ? (completedWorkouts / workouts.length) * 100 : 0;

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
          </div>
          
          <div className="space-y-4">
            <DailyQuote />
            <div className="text-sm text-muted-foreground">
              Recent Activity
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {workouts.map((workout) => (
                <WorkoutCard 
                  key={workout.id}
                  id={workout.id}
                  day={workout.day}
                  date={workout.date}
                  completed={workout.completed}
                  notes={workout.notes}
                  onToggleComplete={(completed) => handleToggleComplete(workout.id, completed)}
                  onDelete={() => handleDelete(workout.id)}
                  onUpdate={(data) => handleUpdate(workout.id, data)}
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