import { toast } from "@/hooks/use-toast";
import { isToday, isBefore, parseISO } from "date-fns";

export const checkMissedWorkouts = (workouts: any[]) => {
  const today = new Date();
  const missedWorkouts = workouts.filter(workout => {
    const workoutDate = parseISO(workout.date);
    return !workout.completed && isBefore(workoutDate, today) && !isToday(workoutDate);
  });

  if (missedWorkouts.length > 0) {
    toast({
      title: "Missed Workouts!",
      description: `You have ${missedWorkouts.length} incomplete workout${missedWorkouts.length > 1 ? 's' : ''} from previous days. Stay consistent with your fitness goals!`,
      variant: "destructive",
      duration: 5000,
    });
  }
};