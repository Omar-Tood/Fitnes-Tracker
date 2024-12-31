import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface WorkoutHeaderProps {
  onAddWorkout: () => void;
}

export const WorkoutHeader = ({ onAddWorkout }: WorkoutHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">
        Fitness Tracker
      </h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
        <Button onClick={onAddWorkout}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Workout Day
        </Button>
      </div>
    </div>
  );
};