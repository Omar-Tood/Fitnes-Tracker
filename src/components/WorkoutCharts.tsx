import { useMemo } from "react";
import {
  ChartContainer,
} from "@/components/ui/chart";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

interface WorkoutChartsProps {
  workouts: any[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

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
      incomplete: stats.total - stats.completed,
    }));
  }, [workouts]);

  const overallStats = useMemo(() => {
    const completed = workouts.filter(w => w.completed).length;
    const total = workouts.length;
    
    return [
      { name: 'Completed', value: completed },
      { name: 'Incomplete', value: total - completed },
    ];
  }, [workouts]);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Monthly Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-muted-foreground">
                          Completed: {payload[0].value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Incomplete: {payload[1].value}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar 
                dataKey="completed" 
                name="Completed" 
                stackId="a" 
                fill="hsl(var(--primary))"
              />
              <Bar 
                dataKey="incomplete" 
                name="Incomplete" 
                stackId="a" 
                fill="hsl(var(--muted))"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Overall Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overallStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {overallStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-medium">{payload[0].name}</div>
                        <div className="text-sm text-muted-foreground">
                          Count: {payload[0].value}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}