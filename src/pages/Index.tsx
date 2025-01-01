import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthUI } from "@/components/AuthUI";
import { WorkoutCard } from "@/components/WorkoutCard";
import { DailyQuote } from "@/components/DailyQuote";
import { WorkoutHeader } from "@/components/WorkoutHeader";
import { WorkoutStats } from "@/components/WorkoutStats";
import { WorkoutCharts } from "@/components/WorkoutCharts";
import { checkMissedWorkouts } from "@/utils/workoutNotifications";

const workoutFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  scheduledTime: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

const Index = () => {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      date: "",
      notes: "",
      scheduledTime: "",
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Session error:", error);
        setAuthError(error.message);
        return;
      }
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWorkouts = async () => {
    if (!session?.user) return;

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
    // Check for missed workouts whenever workouts are fetched
    checkMissedWorkouts(data || []);
  };

  useEffect(() => {
    if (session?.user) {
      fetchWorkouts();
    }
  }, [session]);

  const handleToggleComplete = async (id: string, completed: boolean) => {
    if (!session?.user) return;

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
    if (!session?.user) return;

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
    if (!session?.user) return;

    const updateData = {
      date: data.date,
      notes: data.notes || null,
      scheduled_time: data.scheduledTime || null, // Changed this line to handle empty string
    };

    const { error } = await supabase
      .from('workouts')
      .update(updateData)
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
    if (!session?.user) return;

    const newWorkout = {
      day: workouts.length + 1,
      date: data.date,
      completed: false,
      notes: data.notes || null,
      scheduled_time: data.scheduledTime || null, // Changed this line to handle empty string
      user_id: session.user.id,
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

  const completedWorkouts = workouts.filter(w => w.completed).length;
  const progress = workouts.length > 0 ? (completedWorkouts / workouts.length) * 100 : 0;

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center text-red-500">
          <h2>Authentication Error</h2>
          <p>{authError}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <AuthUI />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <main className="max-w-4xl mx-auto space-y-6">
        <WorkoutHeader onAddWorkout={() => setIsAddingWorkout(true)} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <WorkoutStats 
            completedWorkouts={completedWorkouts}
            totalWorkouts={workouts.length}
            progress={progress}
          />
          
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
                  scheduledTime={workout.scheduled_time}
                  onToggleComplete={(completed) => handleToggleComplete(workout.id, completed)}
                  onDelete={() => handleDelete(workout.id)}
                  onUpdate={(data) => handleUpdate(workout.id, data)}
                />
              ))}
            </div>
          </div>
        </div>

        <WorkoutCharts workouts={workouts} />

        <Dialog open={isAddingWorkout} onOpenChange={setIsAddingWorkout}>
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
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time (optional)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
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
      </main>
    </div>
  );
};

export default Index;
