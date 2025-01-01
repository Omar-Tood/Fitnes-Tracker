import { useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { format } from "date-fns";

interface WorkoutChartsProps {
  workouts: any[];
}

export function WorkoutCharts({ workouts }: WorkoutChartsProps) {
  const monthlyData = useMemo(() => {
    const data = new Map();
    
    workouts.forEach((workout) => {
      const month = format(new Date(workout.date), 'MMM yyyy');
      if (!data.has(month)) {
        data.set(month, { completed: 0, total: 0 });
      }
      const monthData = data.get(month);
      monthData.total += 1;
      if (workout.completed) {
        monthData.completed += 1;
      }
    });

    return Array.from(data.entries()).map(([month, stats]) => ({
      month,
      completed: stats.completed,
      total: stats.total,
      completionRate: Math.round((stats.completed / stats.total) * 100),
    }));
  }, [workouts]);

  const dailyData = useMemo(() => {
    const last7Days = workouts
      .filter(workout => {
        const workoutDate = new Date(workout.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return workoutDate >= sevenDaysAgo;
      })
      .map(workout => ({
        date: format(new Date(workout.date), 'MMM dd'),
        completed: workout.completed ? 1 : 0,
      }));

    return last7Days;
  }, [workouts]);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Monthly Progress</h3>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              completed: {
                label: "Completed Workouts",
                theme: {
                  light: "hsl(var(--primary))",
                  dark: "hsl(var(--primary))",
                },
              },
            }}
          >
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Bar
                dataKey="completionRate"
                name="Completion Rate"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Last 7 Days</h3>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              completed: {
                label: "Completed",
                theme: {
                  light: "hsl(var(--primary))",
                  dark: "hsl(var(--primary))",
                },
              },
            }}
          >
            <LineChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} ticks={[0, 1]} />
              <Line
                type="monotone"
                dataKey="completed"
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 4 }}
              />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}