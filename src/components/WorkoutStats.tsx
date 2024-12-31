import { ProgressRing } from "@/components/ProgressRing";

interface WorkoutStatsProps {
  completedWorkouts: number;
  totalWorkouts: number;
  progress: number;
}

export const WorkoutStats = ({ completedWorkouts, totalWorkouts, progress }: WorkoutStatsProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <ProgressRing progress={progress} />
      <p className="text-lg text-muted-foreground">
        {completedWorkouts} of {totalWorkouts} days completed ({Math.round(progress)}%)
      </p>
    </div>
  );
};